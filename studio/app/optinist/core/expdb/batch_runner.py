import concurrent.futures
import datetime
import functools
import glob
import logging
import logging.config
import os
import pathlib
import time
import traceback
from enum import Enum

import yaml
from lauda import stopwatch
from zc import lockfile

from studio.app.common.core.users.crud_organizations import get_organization
from studio.app.common.db.database import session_scope
from studio.app.dir_path import DIRPATH
from studio.app.expdb_dir_path import EXPDB_DIRPATH
from studio.app.optinist.core.expdb.batch_unit import ExpDbBatch
from studio.app.optinist.core.expdb.crud_cells import bulk_insert_cells
from studio.app.optinist.core.expdb.crud_configs import summarize_experiment_metadata
from studio.app.optinist.core.expdb.crud_expdb import (
    create_experiment,
    get_experiment,
    update_experiment,
)
from studio.app.optinist.schemas.expdb.experiment import (
    ExpDbExperimentCreate,
    ExpDbExperimentUpdate,
)

LOCKFILE_NAME = "process.lock"
FLAG_FILE_EXT = ".proc"


class ProcessCommand(Enum):
    REGIST = "regist"
    REGIST_METADATA = "regist_metadata"
    DELETE = "delete"


class ProcessResult:
    def __init__(self):
        self.success_ids_ = []
        self.failure_ids_ = []

    @property
    def success_ids(self):
        return self.success_ids_

    @property
    def failure_ids(self):
        return self.failure_ids_

    @property
    def total_ids(self):
        return self.success_ids_ + self.failure_ids_

    def has_error(self) -> bool:
        return len(self.failure_ids_) > 0


def init_process_logger(config_path, logger_name, process_id=None):
    """
    各プロセスで独自のロガーを初期化する関数

    Args:
        config_path: ロギング設定ファイルのパス
        logger_name: 使用するロガーの名前
        process_id: プロセスID（Noneの場合は現在のプロセスIDを使用）

    Returns:
        初期化されたロガーインスタンス
    """
    if process_id is None:
        process_id = os.getpid()

    # 設定ファイルの読み込み
    logging_config = yaml.safe_load(open(config_path, encoding="utf-8").read())

    # プロセス固有のログファイル名に変更（競合を避けるため）
    if "handlers" in logging_config and "rotating_file" in logging_config["handlers"]:
        original_filename = logging_config["handlers"]["rotating_file"].get("filename")
        if original_filename:
            # ファイル名にプロセスIDを追加
            basename, ext = os.path.splitext(original_filename)
            new_filename = f"{basename}_pid{process_id}{ext}"
            logging_config["handlers"]["rotating_file"]["filename"] = new_filename

    # ログディレクトリの確認と作成
    log_file = (
        logging_config.get("handlers", {}).get("rotating_file", {}).get("filename")
    )
    log_dir = os.path.dirname(log_file) if log_file else None
    if log_dir and (not os.path.isdir(log_dir)):
        os.makedirs(log_dir, exist_ok=True)

    # ロギング設定の適用
    logging_config_copy = (
        logging_config.copy()
    )  # 変更を他のプロセスに影響させないようコピー
    logging.config.dictConfig(logging_config_copy)

    # ロガー取得
    return logging.getLogger(logger_name)


class Stopwatch:
    def __init__(self):
        self.start_time = None
        self.elapsed_time = 0.0

    def start(self):
        self.start_time = time.time()

    def stop(self):
        if self.start_time is not None:
            self.elapsed_time = time.time() - self.start_time
        return self.elapsed_time


def pickable_stopwatch(callback=None):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            logger = kwargs.get("logger")
            watch = Stopwatch()
            watch.start()
            try:
                return func(*args, **kwargs)
            finally:
                watch.stop()
                if callback:
                    callback(watch, func, logger)

        # モジュールレベルとして設定することで pickle 可能にする
        wrapper.__module__ = __name__
        return wrapper

    return decorator


def stopwatch_callback(watch, function="(N/A)", logger=None):
    if hasattr(function, "__func__"):
        func_name = function.__func__.__name__
    else:
        func_name = getattr(function, "__name__", "(N/A)")

    if logger:
        logger.info(
            "processing done. [%s()][elapsed_time: %.6f sec]",
            func_name,
            watch.elapsed_time,
        )


class ExpDbBatchRunner:
    LOGGER_NAME = None  # Note: use root logger (empty name)

    def __init__(self, organization_id: int, parallel_workers: int = 1):
        self.start_time = datetime.datetime.now()
        self.__init_logger()
        self.org_id = organization_id
        self.parallel_workers = parallel_workers

    def __init_logger(self):
        self.logging_config_file = DIRPATH.CONFIG_DIR + "/logging.expdb_batch.yaml"
        logging_config = yaml.safe_load(
            open(self.logging_config_file, encoding="utf-8").read()
        )

        # ログ出力先フォルダ生成（初回のみの処理）
        # ※ logging.config.dictConfig() の前に実施必要
        log_file = (
            logging_config.get("handlers", {}).get("rotating_file", {}).get("filename")
        )
        log_dir = os.path.dirname(log_file) if log_file else None
        if log_dir and (not os.path.isdir(log_dir)):
            os.mkdir(log_dir)

        logging.config.dictConfig(logging_config)

        self.logger_ = logging.getLogger(__class__.LOGGER_NAME)

    def __stopwatch_callback(watch, function=None):
        logging.getLogger(__class__.LOGGER_NAME).info(
            "processing done. [%s()][elapsed_time: %.6f sec]",
            (function.__name__ if function is not None else "(N/A)"),
            watch.elapsed_time,
        )

    @stopwatch(callback=__stopwatch_callback)
    def process(self):
        self.logger_.info("process start.")

        processResult = ProcessResult()
        error: Exception = None

        try:
            # 前処理
            self.__process_preprocess()

            # メイン処理（データ管理・解析処理処理）
            processResult = self.__process_datasets()

            # 後処理
            self.__process_postprocess()

        except lockfile.LockError:
            None  # do nothing.

        except Exception as e:
            self.logger_.error("%s: %s\n%s", type(e), e, traceback.format_exc())
            error = e

        finally:
            # 処理終了ログ出力
            if error is None:
                if processResult.has_error():
                    self.logger_.warning(
                        (
                            "process finish. [status: warning]"
                            "[success: %d][failure: %d][failure_ids: %s]"
                        ),
                        len(processResult.success_ids),
                        len(processResult.failure_ids),
                        processResult.failure_ids,
                    )
                else:
                    self.logger_.info(
                        "process finish. [status: success][total: %d]",
                        len(processResult.total_ids),
                    )
            else:
                self.logger_.info("process finish. [status: error (suspended)]")

    def __process_preprocess(self):
        """
        前処理
        """

        # ----------------------------------------
        # 2重起動防止処理（lockfile チェック）
        #
        # - ライブラリ(zc.lockfile)を利用
        # - ライブラリにより、以下の処理が担われる
        #   - lockfileの存在チェックと生成処理
        #     - lockfileの存在チェック時は、実際にプロセス(pid)が存在するかも判定される
        #   - lockfileの後処理
        #     - lockfileは残るが、プロセス(pid)の存在判定との組み合わせにより、ロックの残存は回避される
        # ----------------------------------------

        # lockfile チェック
        try:
            self.lock = lockfile.LockFile(LOCKFILE_NAME)
            # validate organization_id
            with session_scope() as db:
                get_organization(db, self.org_id)
        except lockfile.LockError as e:
            self.logger_.error("already running. - %s", e)
            raise e

    def __process_postprocess(self):
        """
        後処理
        """

        # Note: ロックファイル解除は、ライブラリ(zc.lockfile)により自動処理される
        self.lock.close()

    @stopwatch(callback=__stopwatch_callback)
    def __process_datasets(self) -> ProcessResult:
        """
        メイン処理（データ管理・解析処理処理）
        """

        processResult = ProcessResult()

        target_flag_files = self.__search_target_datasets()

        # 処理対象datasetsが存在しない場合は、ここで処理終了（return）
        if len(target_flag_files) == 0:
            self.logger_.info("No datasets found.")
            return processResult

        # 処理対象datasets検索：フラグファイルを走査
        max_workers = min(
            len(target_flag_files), self.parallel_workers
        )  # 最大並列処理数(プロセス数)を制御
        self.logger_.info(
            "Start processing datasets. [total: %d][max_workers: %d]",
            len(target_flag_files),
            max_workers,
        )
        with concurrent.futures.ProcessPoolExecutor(
            max_workers=max_workers
        ) as executor:
            # 各データセットの処理を並列実行し結果を取得
            futures = [
                executor.submit(
                    ExpDbBatchConcurrentProcess.process_single_dataset,
                    flag_file=flag_file,
                    org_id=self.org_id,
                    start_time=self.start_time,
                    config_path=self.logging_config_file,
                    logger_name=__class__.LOGGER_NAME,
                )
                for flag_file in target_flag_files
            ]

            results = []
            for future in concurrent.futures.as_completed(futures):
                results.append(future.result())

        # 処理結果の集計
        for result in results:
            if result["success"]:
                processResult.success_ids.append(result["exp_id"])
            else:
                processResult.failure_ids.append(result["exp_id"])

        # datasets処理完了後の後処理:
        with session_scope() as db:
            # Summarize experiment metadata.
            summarize_experiment_metadata(db)

        return processResult

    @stopwatch(callback=__stopwatch_callback)
    def __search_target_datasets(self) -> list:
        """
        処理対象datasets検索
        """
        self.logger_.info("path: %s", EXPDB_DIRPATH.EXPDB_DIR)

        # フラグファイル検索
        target_flag_files = sorted(
            glob.glob(EXPDB_DIRPATH.EXPDB_DIR + "/*/*" + FLAG_FILE_EXT)
        )

        return target_flag_files


class ExpDbBatchConcurrentProcess:
    @staticmethod
    def __get_exp_id_from_flag_file(flag_file: str) -> str:
        return os.path.basename(flag_file).split(".", 1)[0]

    @classmethod
    @pickable_stopwatch(callback=stopwatch_callback)
    def process_single_dataset(
        cls,
        flag_file: str,
        org_id: int,
        start_time: datetime.datetime,
        config_path: str,
        logger_name: str,
    ) -> dict:
        exp_id = cls.__get_exp_id_from_flag_file(flag_file)
        logger = init_process_logger(config_path, logger_name)
        logger.info(
            f"Process {os.getpid()} starting to \
                process exp_id: {exp_id}, flag_file: {flag_file}"
        )

        error = None
        command = None
        result = {"success": False, "exp_id": exp_id}

        try:
            # フラグファイル read
            with open(flag_file) as cfile:
                config = yaml.safe_load(cfile)

            # コマンド判定
            command = config.get("command") if config is not None else None

            if command == ProcessCommand.REGIST.value:
                cls.process_dataset_registration(
                    exp_id=exp_id, org_id=org_id, logger=logger
                )
            elif command == ProcessCommand.REGIST_METADATA.value:
                cls.process_dataset_metadata_registration(
                    exp_id=exp_id, org_id=org_id, logger=logger
                )
            elif command == ProcessCommand.DELETE.value:
                cls.process_dataset_deletion(
                    exp_id=exp_id, org_id=org_id, logger=logger
                )
            else:
                raise ValueError(
                    f"invalid command: [exp_id: {exp_id}][command: {command}]"
                )

            result["success"] = True

        except Exception as e:
            logger.error("%s: %s\n%s", type(e), e, traceback.format_exc())
            error = e
            result["error"] = e

        finally:
            cls.process_dataset_postprocess(flag_file, start_time, command, error)

            if error:
                logger.error("finish process dataset: [exp_id: %s]", exp_id)
            else:
                logger.info("finish process dataset: [exp_id: %s]", exp_id)

        return result

    @classmethod
    @pickable_stopwatch(callback=stopwatch_callback)
    def process_dataset_registration(
        cls, exp_id: str, org_id: int, logger: logging
    ) -> bool:
        """
        Dataset登録処理
        """

        logger.info("process dataset registration: %s", exp_id)
        expdb_batch = ExpDbBatch(exp_id, org_id)

        with session_scope() as db:
            expdb_batch.cleanup_exp_record(db)
            db.commit()

        # Analyze & Plotting
        if expdb_batch.raw_path.microscope_file is None:
            # 顕微鏡データがない場合、以下の処理をスキップ
            pass
            logger.warn("No microscope data found. Skip preprocessing.")
        else:
            stack = expdb_batch.preprocess()
            expdb_batch.generate_orimaps(stack)
            cnmf_info = expdb_batch.cell_detection_cnmf(stack)
            del stack

        stat_data = expdb_batch.generate_statdata()
        expdb_batch.generate_cellmasks()
        expdb_batch.generate_pixelmaps()
        expdb_batch.generate_plots(stat_data=stat_data)
        expdb_batch.generate_plots_using_cnmf_info(
            stat_data=stat_data, cnmf_info=cnmf_info
        )

        # Read metadata
        (attributes, view_attributes) = expdb_batch.load_exp_metadata()

        expdb_batch.save_nwb(attributes["metadata"]["metadata"])

        with session_scope() as db:
            try:
                exp = create_experiment(
                    db,
                    ExpDbExperimentCreate(
                        experiment_id=exp_id,
                        organization_id=org_id,
                        attributes=attributes,
                        view_attributes=view_attributes,
                    ),
                )

                bulk_insert_cells(db, exp.id, stat_data)
            except Exception as e:
                logger.error(f"Error during create_experiment: {e}")
                db.rollback()  # 明示的にrollback
                raise

        return True

    @classmethod
    @pickable_stopwatch(callback=stopwatch_callback)
    def process_dataset_metadata_registration(
        cls, exp_id: str, org_id: int, logger: logging
    ) -> bool:
        """
        Metadata 登録処理
        """

        logger.info("process dataset metadata registration: %s", exp_id)
        expdb_batch = ExpDbBatch(exp_id, org_id)

        with session_scope() as db:
            try:
                expdb_experiment = get_experiment(db, exp_id, org_id)
            except AssertionError:
                log = (
                    "No experiment found. skip metadata registration."
                    f" [org_id: {org_id}][exp_id: {exp_id}]"
                )
                logger.warning(log)
                raise FileNotFoundError(log)

            # Read metadata
            (attributes, view_attributes) = expdb_batch.load_exp_metadata()

            update_experiment(
                db,
                expdb_experiment.id,
                ExpDbExperimentUpdate(
                    attributes=attributes,
                    view_attributes=view_attributes,
                ),
            )

        return True

    @classmethod
    @pickable_stopwatch(callback=stopwatch_callback)
    def process_dataset_deletion(
        cls, exp_id: str, org_id: int, logger: logging
    ) -> bool:
        """
        Dataset削除処理
        """

        logger.info("process dataset registration: %s", exp_id)
        expdb_batch = ExpDbBatch(exp_id, org_id)

        with session_scope() as db:
            expdb_batch.cleanup_exp_record(db)

        return True

    @classmethod
    def process_dataset_postprocess(
        cls,
        flag_file: str,
        start_time: datetime.datetime,
        command: str,
        error: Exception = None,
    ) -> bool:
        """
        Dataset後処理
        """

        # ----------------------------------------
        # 後処理
        # - フラグファイル処理（ログ出力、リネーム）
        # ----------------------------------------

        # フラグファイル書き込みデータ作成
        if not error:
            result_log = {
                "command": command,
                "start_time": start_time,
                "complete_time": datetime.datetime.now(),
                "result": "success",
                "log": "completed successfully.",
            }
        else:
            result_log = {
                "command": command,
                "start_time": start_time,
                "complete_time": datetime.datetime.now(),
                "result": "error",
                "log": "{}: {}".format(type(error), str(error)),
            }

        # フラグファイル内容アップデート
        with open(flag_file, "w") as yf:
            yaml.dump(result_log, yf)

        # フラグファイル名作成
        if not error:
            renamed_flag_file = flag_file + ".done"
        else:
            renamed_flag_file = flag_file + ".error"

        # 過去のフラグファイルが存在する場合はリネーム
        if os.path.isfile(renamed_flag_file):
            ps = pathlib.Path(renamed_flag_file).stat()
            st_mtime = datetime.datetime.fromtimestamp(ps.st_mtime).strftime(
                "%Y%m%d%H%M%S"
            )
            os.rename(renamed_flag_file, renamed_flag_file + "." + st_mtime)

        # フラグファイルリネーム
        os.rename(flag_file, renamed_flag_file)
