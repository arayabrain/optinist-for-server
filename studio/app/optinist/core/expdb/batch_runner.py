import datetime
import glob
import logging
import os
import pathlib
import traceback
from enum import Enum

import yaml
from lauda import stopwatch
from sqlmodel import Session
from zc import lockfile

from studio.app.common.db.database import engine
from studio.app.dir_path import DIRPATH
from studio.app.optinist.core.expdb.batch_unit import ExpDbBatch
from studio.app.optinist.core.expdb.crud_cells import bulk_insert_cells
from studio.app.optinist.core.expdb.crud_expdb import create_experiment
from studio.app.optinist.schemas.expdb.experiment import ExpDbExperimentCreate

LOCKFILE_NAME = "process.lock"
FLAG_FILE_EXT = ".proc"


class ProcessCommand(Enum):
    REGIST = "regist"
    DELETE = "delete"


class ExpDbBatchRunner:
    def __init__(self, organization_id: int):
        self.start_time = datetime.datetime.now()

        # init logger.
        self.logger_ = logging.getLogger()
        self.logger_.setLevel(logging.DEBUG)
        stream_hander = logging.StreamHandler()
        formatter = logging.Formatter(
            "%(asctime)s : %(levelname)s - %(filename)s:%(lineno)d %(funcName)s() - %(message)s"  # noqa: E501
        )
        stream_hander.setFormatter(formatter)
        self.logger_.addHandler(stream_hander)

        # TODO: add organization id validation.
        self.org_id = organization_id

    def __stopwatch_callback(watch, function):
        logging.getLogger().info(
            "processing done. [%s()][elapsed_time: %.6f sec]",
            function.__name__,
            watch.elapsed_time,
        )

    @stopwatch(callback=__stopwatch_callback)
    def process(self):
        self.logger_.info("process start.")

        try:
            # 前処理
            self.__process_preprocess()

            # メイン処理（データ管理・解析処理処理）
            self.__process_datasets()

            # 後処理
            self.__process_postprocess()

        except lockfile.LockError:
            None  # do nothing.

        except Exception as e:
            self.logger_.error("%s: %s\n%s", type(e), e, traceback.format_exc())

        self.logger_.info("process finish.")

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
    def __process_datasets(self):
        """
        メイン処理（データ管理・解析処理処理）
        """

        target_flag_files = self.__search_target_datasets()

        # 処理対象datasetsが存在しない場合は、ここで処理終了（return）
        if len(target_flag_files) == 0:
            self.logger_.info("No datasets found.")
            return

        # フラグファイルを走査
        for flag_file in target_flag_files:
            self.logger_.info("process dataset: %s", flag_file)

            error: Exception = None

            # フラグファイル read
            with open(flag_file) as cfile:
                config = yaml.safe_load(cfile)

            # 対象データフォルダ存在チェック
            # データが存在しない場合はエラー扱いとし、次のデータ処理へスキップ

            # コマンド判定
            try:
                command = config.get("command") if config is not None else None

                if command == ProcessCommand.REGIST.value:
                    self.__process_dataset_registration(flag_file)
                elif command == ProcessCommand.DELETE.value:
                    self.__process_dataset_deletion(flag_file)
                else:
                    self.logger_.warning("invalid command: %s", command)
                    continue
            except Exception as e:
                self.logger_.error("%s: %s\n%s", type(e), e, traceback.format_exc())
                error = e
            finally:
                self.__process_dataset_postprocess(flag_file, command, error)

    @stopwatch(callback=__stopwatch_callback)
    def __search_target_datasets(self) -> list:
        """
        処理対象datasets検索
        """
        self.logger_.info(DIRPATH.EXPDB_DIR)
        # フラグファイル検索
        target_flag_files = glob.glob(DIRPATH.EXPDB_DIR + "/*/*" + FLAG_FILE_EXT)

        return target_flag_files

    @stopwatch(callback=__stopwatch_callback)
    def __process_dataset_registration(self, flag_file: str) -> bool:
        """
        Dataset登録処理
        """

        self.logger_.info("process dataset registration: %s", flag_file)
        exp_id = os.path.basename(flag_file).split(".", 1)[0]
        expdb_batch = ExpDbBatch(exp_id, self.org_id)

        with Session(engine) as db:
            expdb_batch.cleanup_exp_record(db)

            expdb_batch.generate_statdata()
            expdb_batch.generate_plots()
            ncells = expdb_batch.generate_pixelmaps()

            exp = create_experiment(
                db,
                ExpDbExperimentCreate(
                    experiment_id=exp_id, organization_id=self.org_id
                ),
            )

            bulk_insert_cells(db, exp.id, ncells)

        return True

    @stopwatch(callback=__stopwatch_callback)
    def __process_dataset_deletion(self, flag_file: str) -> bool:
        """
        Dataset削除処理
        """

        self.logger_.info("process dataset registration: %s", flag_file)
        exp_id = os.path.basename(flag_file).split(".", 1)[0]
        expdb_batch = ExpDbBatch(exp_id, self.org_id)

        with Session(engine) as db:
            expdb_batch.cleanup_exp_record(db)

        return True

    def __process_dataset_postprocess(
        self, flag_file: str, command: str, error: Exception = None
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
                "start_time": self.start_time,
                "complete_time": datetime.datetime.now(),
                "result": "success",
                "log": "completed successfully.",
            }
        else:
            result_log = {
                "command": command,
                "start_time": self.start_time,
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
