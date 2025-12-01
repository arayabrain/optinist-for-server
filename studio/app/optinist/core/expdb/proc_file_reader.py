import datetime
import glob
from dataclasses import asdict
from typing import Dict, List

from studio.app.common.core.utils.config_handler import ConfigReader
from studio.app.optinist.core.expdb.batch_const import SupportedRoiMethod
from studio.app.optinist.core.expdb.proc_file_data import (
    ProcFile,
    ProcFilePath,
    ProcFileType,
    ProcFileUtils,
)


class ProcFileReader:
    """
    Reader class of "proc file"
      (command file that controls the execution of expdb_batch batch)
    """

    @classmethod
    def read(cls, exp_id: str, type: ProcFileType = ProcFileType.RESERVE) -> ProcFile:
        return cls.read_from_path(ProcFileUtils.get_proc_file_path(exp_id, type))

    @classmethod
    def read_from_path(cls, filepath: str) -> ProcFile:
        config = ConfigReader.read(filepath)
        assert config, f"Invalid config yaml file: [{filepath}] [{config}]"
        return ProcFileUtils.create_proc_file_data(config)

    @classmethod
    def find_proc_files_simple(cls, type: ProcFileType = ProcFileType.RESERVE) -> List:
        found_proc_files = sorted(
            glob.glob(ProcFileUtils.get_proc_file_wild_path(type))
        )
        return found_proc_files

    @classmethod
    def find_proc_files(
        cls, type: ProcFileType = ProcFileType.RESERVE
    ) -> List[ProcFilePath]:
        found_proc_files = cls.find_proc_files_simple(type)
        result_proc_files = []

        for proc_file_path in found_proc_files:
            proc_data = ProcFileReader.read_from_path(proc_file_path)
            if proc_data.roi_method is None:
                proc_data.roi_method = SupportedRoiMethod.CAIMAN.value

            result_proc_files.append(
                ProcFilePath(path=proc_file_path, proc_data=proc_data)
            )

        return result_proc_files

    @classmethod
    def read_last_processing_log(
        cls,
        exp_id: str,
    ) -> Dict[str, Dict]:
        PROC_FILE_TYPES = {
            "last_success": ProcFileType.DONE,
            "last_error": ProcFileType.ERROR,
        }
        processing_log = {}

        for proc_label, proc_type in PROC_FILE_TYPES.items():
            log_exists = ProcFileUtils.is_proc_file_exists(exp_id, proc_type)
            if log_exists:
                proc_data = ProcFileReader.read(exp_id, proc_type)
                # Apply datetime->str conversion assuming json conversion
                proc_data_formated = {
                    k: v.isoformat() if isinstance(v, datetime.datetime) else v
                    for k, v in asdict(proc_data).items()
                }
                processing_log[proc_label] = proc_data_formated
            else:
                processing_log[proc_label] = None

        return processing_log
