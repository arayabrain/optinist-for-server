import concurrent.futures
import datetime
import logging
import logging.config
import os
import threading
import traceback
from contextlib import contextmanager

import psutil
from lauda import stopwatch, stopwatchcm
from zc import lockfile

from studio.app.common.core.logger import LoggingConfigHelper
from studio.app.common.core.users.crud_organizations import get_organization
from studio.app.common.db.database import session_scope
from studio.app.dir_path import DIRPATH
from studio.app.expdb_dir_path import EXPDB_DIRPATH
from studio.app.optinist.core.expdb.batch_const import (
    LOCKFILE_NAME,
    ProcessCommand,
    SupportedRoiMethod,
)
from studio.app.optinist.core.expdb.batch_unit import ExpDbBatch
from studio.app.optinist.core.expdb.crud_cells import bulk_insert_cells
from studio.app.optinist.core.expdb.crud_configs import summarize_experiment_metadata
from studio.app.optinist.core.expdb.crud_expdb import (
    create_experiment,
    get_experiment,
    update_experiment,
)
from studio.app.optinist.core.expdb.expdb_data import ProcessResult
from studio.app.optinist.core.expdb.expdb_validator import ExpDbEnviromentValidator
from studio.app.optinist.core.expdb.proc_file_data import (
    ProcFile,
    ProcFilePath,
    ProcFileUtils,
)
from studio.app.optinist.core.expdb.proc_file_reader import ProcFileReader
from studio.app.optinist.core.expdb.proc_file_writer import ProcFileWriter
from studio.app.optinist.schemas.expdb.experiment import (
    ExpDbExperimentCreate,
    ExpDbExperimentUpdate,
)


class BatchProgressMonitor:
    """
    Monitor the progress of parallel processing and periodically log the status
    """

    # Maximum number of remaining data to display in logs
    MAX_DISPLAY_REMAINING_COUNT = 10

    def __init__(
        self,
        logger_: logging.Logger,
        futures: list,
        target_proc_files: list[ProcFilePath],
        completed_futures: set,
        interval: int = 60,
    ):
        """
        Args:
            logger: Logger for output
            futures: List of all futures
            target_proc_files: List of target proc files (in same order as futures)
            completed_futures: Set of completed futures (held as reference)
            interval: Log output interval (seconds)
        """
        self.logger = logger_
        self.futures = futures
        self.target_proc_files = target_proc_files
        self.completed_futures = completed_futures
        self.total_count = len(target_proc_files)
        self.interval = interval
        self._timer = None

        # Create internal mapping
        self._future_to_proc_file = {
            future: proc_file for future, proc_file in zip(futures, target_proc_files)
        }

    def start(self):
        """Start progress monitoring"""
        self._schedule_next_log()

    def stop(self):
        """Stop progress monitoring"""
        if self._timer:
            self._timer.cancel()
            self._timer = None

    def _schedule_next_log(self):
        """Schedule next log output"""

        def log_and_reschedule():
            # Log only if not all completed
            if len(self.completed_futures) < self.total_count:
                self._log_progress()

                # Schedule next timer
                self._schedule_next_log()

        self._timer = threading.Timer(self.interval, log_and_reschedule)
        self._timer.daemon = True
        self._timer.start()

    def _log_progress(self):
        """Log progress status"""
        # Get remaining proc files
        remaining_proc_files = [
            self._future_to_proc_file[f]
            for f in self.futures
            if f not in self.completed_futures
        ]

        completed_count = len(self.completed_futures)
        remaining_count = len(remaining_proc_files)

        # Output progress log (remaining data IDs list)
        if remaining_count > 0:
            display_exp_ids = [
                pf.exp_id
                for pf in remaining_proc_files[: self.MAX_DISPLAY_REMAINING_COUNT]
            ]
            suffix = (
                f" (showing {self.MAX_DISPLAY_REMAINING_COUNT} of {remaining_count})"
                if remaining_count > self.MAX_DISPLAY_REMAINING_COUNT
                else ""
            )
            self.logger.info(
                (
                    "Processing progress: [completed: %d/%d] - "
                    "Remaining data%s: [count: %d]%s"
                ),
                completed_count,
                self.total_count,
                suffix,
                remaining_count,
                display_exp_ids,
            )

        # Get system load info
        system_load = self._get_system_load_info()

        # Output system load log
        self.logger.info(
            "System load: %s",
            system_load,
        )

    @staticmethod
    def _get_system_load_info() -> str:
        """
        Get server load status

        Returns:
            System load information string
        """
        try:
            # CPU usage (average of all cores)
            cpu_percent = psutil.cpu_percent(interval=0.1)

            # Memory usage
            memory = psutil.virtual_memory()
            memory_used_gb = memory.used / (1024**3)
            memory_total_gb = memory.total / (1024**3)
            memory_percent = memory.percent

            # Load average (1min, 5min, 15min)
            load_avg = psutil.getloadavg()

            return (
                f"CPU: {cpu_percent:.1f}%, "
                f"Memory: {memory_used_gb:.1f}/{memory_total_gb:.1f}GB "
                f"({memory_percent:.1f}%), "
                f"LoadAvg: {load_avg[0]:.2f}/{load_avg[1]:.2f}/{load_avg[2]:.2f}"
            )
        except Exception as e:
            return f"Failed to get system load info: {e}"


class ExpDbBatchRunner:
    LOGGER_NAME = "batch_runner_logger"
    LOGGING_CONFIG_FILE = f"{DIRPATH.CONFIG_DIR}/logging.expdb_batch.yaml"

    PROGRESS_MONITORING_INTERVAL = 60  # sec

    def __init__(
        self,
        organization_id: int,
        parallel_workers: int = 1,
    ):
        self.start_time = datetime.datetime.now()
        self.__init_logger()
        self.org_id = organization_id
        self.parallel_workers = parallel_workers
        self.available_roi_methods = (
            ExpDbEnviromentValidator.check_available_roi_methods()
        )

    def __init_logger(self):
        # Load and configure logging config (using unified utility method)
        logging_config = LoggingConfigHelper.load_and_configure_logging_config(
            config_file=__class__.LOGGING_CONFIG_FILE,
            base_dir=DIRPATH.DATA_DIR,
            apply_concurrent=True,
        )

        logging.config.dictConfig(logging_config)

        self.logger_ = logging.getLogger(__class__.LOGGER_NAME)

    def __stopwatch_callback(watch, function=None):
        logging.getLogger(__class__.LOGGER_NAME).info(
            "Processing done. [%s()][elapsed_time: %.6f sec]",
            (function.__name__ if function is not None else "(N/A)"),
            watch.elapsed_time,
        )

    @stopwatch(callback=__stopwatch_callback)
    def process(self):
        self.logger_.info("Processing start.")

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
                            "Processing finish. [status: warning]"
                            "[success: %d][failure: %d][failure_ids: %s]"
                        ),
                        len(processResult.success_ids),
                        len(processResult.failure_ids),
                        processResult.failure_ids,
                    )
                else:
                    self.logger_.info(
                        "Processing finish. [status: success][total: %d]",
                        len(processResult.total_ids),
                    )
            else:
                self.logger_.info("Processing finish. [status: error (suspended)]")

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

        # 処理対象datasets検索
        self.logger_.info(
            "Search proc files [path: %s][roi_methods:%s]",
            EXPDB_DIRPATH.EXPDB_DIR,
            self.available_roi_methods,
        )
        target_proc_files = ProcFileReader.find_proc_files(
            filter_roi_methods=self.available_roi_methods
        )
        target_exp_ids = [proc.exp_id for proc in target_proc_files]

        # 処理対象datasetsが存在しない場合は、ここで処理終了（return）
        if len(target_proc_files) == 0:
            self.logger_.info("No datasets found.")
            return processResult

        # 最大並列処理Process数を規定
        max_workers = min(len(target_proc_files), self.parallel_workers)
        self.logger_.info(
            "Start processing datasets. [total: %d][max_workers: %d][roi_methods:%s]"
            "[IDs: %s]",
            len(target_proc_files),
            max_workers,
            self.available_roi_methods,
            target_exp_ids,
        )

        # datasets処理開始（並列処理）
        with concurrent.futures.ProcessPoolExecutor(
            max_workers=max_workers
        ) as executor:
            # 各datasetsの処理を並列実行し結果を取得
            futures = [
                executor.submit(
                    ExpDbBatchConcurrentProcess.process_single_dataset_entrypoint,
                    proc_file_path=proc_file_path,
                    org_id=self.org_id,
                    start_time=self.start_time,
                    logger_name=__class__.LOGGER_NAME,
                )
                for proc_file_path in target_proc_files
            ]

            # Track completion and start monitoring
            completed_futures = set()
            progress_monitor = BatchProgressMonitor(
                logger_=self.logger_,
                futures=futures,
                target_proc_files=target_proc_files,
                completed_futures=completed_futures,
                interval=__class__.PROGRESS_MONITORING_INTERVAL,
            )
            progress_monitor.start()

            try:
                # Wait for each task to complete
                process_results = []
                for future in concurrent.futures.as_completed(futures):
                    completed_futures.add(future)
                    process_results.append(future.result())
            finally:
                progress_monitor.stop()

            self.logger_.info(
                "All processing completed. [total: %d][IDs: %s]",
                len(target_proc_files),
                target_exp_ids,
            )

        # datasets処理結果の集計
        for result in process_results:
            if result["success"]:
                processResult.success_ids.append(result["exp_id"])
            else:
                processResult.failure_ids.append(result["exp_id"])

        # datasets処理完了後の後処理:
        with session_scope() as db:
            # Summarize experiment metadata.
            summarize_experiment_metadata(db)

        return processResult


def dataset_process_stopwatch_callback(watch, function=None):
    logging.getLogger(ExpDbBatchConcurrentProcess.LOGGER_NAME).info(
        "Processing done. [%s()][elapsed_time: %.6f sec]",
        (function.__name__ if function is not None else "(N/A)"),
        watch.elapsed_time,
    )


@contextmanager
def concurrent_db_session_scope():
    """
    Database session getter for muitl-processing (force cache off)
    """
    with session_scope(use_cache=False) as session:
        yield session


class ExpDbBatchConcurrentProcess:
    LOGGER_NAME = "batch_process_logger"
    LOGGING_CONFIG_FILE = f"{DIRPATH.CONFIG_DIR}/logging.expdb_batch.yaml"

    @classmethod
    def __init_process_logger(cls, exp_id: str):
        """
        各プロセスで独自のロガーを初期化する関数

        Args:
            exp_id: dataset ID（ログファイルの識別に利用）

        Returns:
            初期化されたロガーインスタンス
        """

        # Define filename modifier to add exp_id to log filename
        def add_exp_id_to_filename(filename: str) -> str:
            basepath, ext = os.path.splitext(filename)
            return f"{basepath}.{exp_id}{ext}"

        # Load and configure logging config (using unified utility method)
        # Note: apply_concurrent=False because each process has unique log file
        logging_config = LoggingConfigHelper.load_and_configure_logging_config(
            config_file=cls.LOGGING_CONFIG_FILE,
            base_dir=DIRPATH.DATA_DIR,
            apply_concurrent=False,
            filename_modifier=add_exp_id_to_filename,
        )

        # ロギング設定の適用
        # *Copy the changes to avoid affecting other processes
        logging.config.dictConfig(logging_config.copy())

        return logging.getLogger(cls.LOGGER_NAME)

    @classmethod
    def process_single_dataset_entrypoint(
        cls,
        proc_file_path: ProcFilePath,
        org_id: int,
        start_time: datetime.datetime,
        logger_name: str,
    ) -> dict:
        """
        ATTENTION: This method does not use decorator (stopwatch)
            because it is an entrypoint of ProcessPoolExecutor.
        """
        return cls.process_single_dataset(
            proc_file_path, org_id, start_time, logger_name
        )

    @classmethod
    @stopwatch(callback=dataset_process_stopwatch_callback)
    def process_single_dataset(
        cls,
        proc_file_path: ProcFilePath,
        org_id: int,
        start_time: datetime.datetime,
        logger_name: str,
    ) -> dict:
        exp_id = ProcFileUtils.parse_exp_id_from_path(proc_file_path.path)
        logger = cls.__init_process_logger(exp_id)
        logger.info(
            f"Process {os.getpid()} starting to "
            f"process exp_id: {exp_id}, proc_file_path: {proc_file_path.path}"
        )

        error = None
        command = None
        result = {"success": False, "exp_id": exp_id}

        try:
            # コマンド判定
            command = proc_file_path.proc_data.command

            if command == ProcessCommand.REGIST.value:
                cls.process_dataset_registration(
                    exp_id=exp_id,
                    org_id=org_id,
                    roi_method=SupportedRoiMethod(proc_file_path.proc_data.roi_method),
                    logger=logger,
                )
            elif command == ProcessCommand.REGIST_METADATA.value:
                cls.process_dataset_metadata_registration(
                    exp_id=exp_id,
                    org_id=org_id,
                    roi_method=SupportedRoiMethod(proc_file_path.proc_data.roi_method),
                    logger=logger,
                )
            elif command == ProcessCommand.DELETE.value:
                cls.process_dataset_deletion(
                    exp_id=exp_id,
                    org_id=org_id,
                    roi_method=SupportedRoiMethod(proc_file_path.proc_data.roi_method),
                    logger=logger,
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
            cls.process_dataset_postprocess(proc_file_path, command, start_time, error)

            if error:
                logger.error("finish process dataset: [exp_id: %s]", exp_id)
            else:
                logger.info("finish process dataset: [exp_id: %s]", exp_id)

        return result

    @classmethod
    @stopwatch(callback=dataset_process_stopwatch_callback)
    def process_dataset_registration(
        cls, exp_id: str, org_id: int, roi_method: SupportedRoiMethod, logger: logging
    ) -> bool:
        """
        Dataset登録処理
        """

        logger.info("process dataset registration: %s", exp_id)

        expdb_batch = ExpDbBatch(exp_id, org_id, roi_method)

        # CleanUp database records & output data
        with concurrent_db_session_scope() as db:
            expdb_batch.cleanup_exp_record(db)  # cleanup db record
            expdb_batch.cleanup_exp_output_data()  # cleanup output data

        # Analysis process
        with stopwatchcm(dataset_process_stopwatch_callback):
            logger.info("Run Analysis process")

            if expdb_batch.raw_path.microscope_file is None:
                # If no microscope data, use existing processed mat files
                logger.warning(
                    "No microscope data found. Will use existing processed data."
                )
            else:
                stack = expdb_batch.preprocess()
                expdb_batch.generate_orimaps(stack)
                expdb_batch.cell_detection(stack)
                del stack

            stat_data = expdb_batch.generate_statdata()

        # Imaging process
        with stopwatchcm(dataset_process_stopwatch_callback):
            logger.info("Run Imaging process")

            expdb_batch.generate_cellmasks()
            expdb_batch.generate_pixelmaps()
            expdb_batch.generate_plots(stat_data=stat_data)
            expdb_batch.generate_plots_spatial(stat_data=stat_data)

        # Metadata registration process
        with stopwatchcm(dataset_process_stopwatch_callback):
            logger.info("Run Metadata registration process")

            (attributes, view_attributes) = expdb_batch.load_exp_metadata()

            # Save NWB
            expdb_batch.save_nwb(attributes["metadata"]["metadata"])

            # Database record registration
            with concurrent_db_session_scope() as db:
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
    @stopwatch(callback=dataset_process_stopwatch_callback)
    def process_dataset_metadata_registration(
        cls, exp_id: str, org_id: int, roi_method: SupportedRoiMethod, logger: logging
    ) -> bool:
        """
        Metadata 登録処理
        """

        logger.info("process dataset metadata registration: %s", exp_id)

        expdb_batch = ExpDbBatch(exp_id, org_id, roi_method)

        with concurrent_db_session_scope() as db:
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
    @stopwatch(callback=dataset_process_stopwatch_callback)
    def process_dataset_deletion(
        cls, exp_id: str, org_id: int, roi_method: SupportedRoiMethod, logger: logging
    ) -> bool:
        """
        Dataset削除処理
        """

        logger.info("process dataset registration: %s", exp_id)

        expdb_batch = ExpDbBatch(exp_id, org_id, roi_method)

        # CleanUp database records & output data
        with concurrent_db_session_scope() as db:
            expdb_batch.cleanup_exp_record(db)  # cleanup db record
            expdb_batch.cleanup_exp_output_data()  # cleanup output data

        return True

    @classmethod
    def process_dataset_postprocess(
        cls,
        proc_file_path: ProcFilePath,
        command: str,
        start_time: datetime.datetime,
        error: Exception = None,
    ) -> bool:
        """
        Dataset後処理
        """

        # ----------------------------------------
        # 後処理
        # - proc file 処理（ログ出力、リネーム）
        # ----------------------------------------

        # Read existing proc file to preserve roi_method
        existing_roi_method = None
        try:
            existing_roi_method = proc_file_path.proc_data.roi_method
        except Exception:
            # If we can't read the file, roi_method will be None
            pass

        # Determine success status
        is_success = not error

        # Create ProcFile with result
        if is_success:
            result_proc = ProcFile(
                command=command,
                roi_method=existing_roi_method,
                start_time=start_time,
                complete_time=datetime.datetime.now(),
                result="success",
                log="completed successfully.",
            )
        else:
            result_proc = ProcFile(
                command=command,
                roi_method=existing_roi_method,
                start_time=start_time,
                complete_time=datetime.datetime.now(),
                result="error",
                log="{}: {}".format(type(error), str(error)),
            )

        # Write and rename/backup proc file
        ProcFileWriter.write_and_backup_proc_file(
            proc_file_path.path, result_proc, is_success
        )
