import datetime
import os
from dataclasses import dataclass, fields
from enum import IntEnum
from typing import Optional

from studio.app.common.core.utils.filepath_creater import join_filepath
from studio.app.expdb_dir_path import EXPDB_DIRPATH
from studio.app.optinist.core.expdb.batch_const import (
    PROC_FILE_DONE_EXT,
    PROC_FILE_ERROR_EXT,
    PROC_FILE_EXT,
)
from studio.app.optinist.core.expdb.expdb_data import ExpDbPathIds


class ProcFileType(IntEnum):
    RESERVE = 1
    DONE = 2  # Same as SUCCESS
    ERROR = 3


@dataclass
class ProcFile:
    command: str
    roi_method: Optional[str] = None
    start_time: Optional[datetime.datetime] = None
    complete_time: Optional[datetime.datetime] = None
    result: Optional[str] = None
    log: Optional[str] = None


@dataclass
class ProcFilePath:
    exp_id: str
    path: str
    proc_data: ProcFile


class ProcFileUtils:
    @classmethod
    def parse_exp_id_from_path(cls, file_path: str) -> str:
        return os.path.basename(file_path).split(".", 1)[0]

    @classmethod
    def create_proc_file_data(cls, config: dict) -> ProcFile:
        filtered_config = {
            f.name: config[f.name] for f in fields(ProcFile) if f.name in config
        }
        return ProcFile(**filtered_config)

    @classmethod
    def get_proc_file_path(
        cls, exp_id: str, type: ProcFileType = ProcFileType.RESERVE
    ) -> str:
        exp_ids = ExpDbPathIds(exp_id=exp_id)
        proc_file_basename = cls.get_proc_file_basename(exp_id, type)
        path = join_filepath(
            [EXPDB_DIRPATH.EXPDB_DIR, exp_ids.subject_id, proc_file_basename]
        )
        return path

    @classmethod
    def is_proc_file_exists(
        cls, exp_id: str, type: ProcFileType = ProcFileType.RESERVE
    ) -> bool:
        path = cls.get_proc_file_path(exp_id, type)
        return os.path.exists(path)

    @classmethod
    def get_proc_file_basename(cls, exp_id: str, type: ProcFileType) -> str:
        if type == ProcFileType.RESERVE:
            return f"{exp_id}{PROC_FILE_EXT}"
        elif type == ProcFileType.DONE:
            return f"{exp_id}{PROC_FILE_DONE_EXT}"
        elif type == ProcFileType.ERROR:
            return f"{exp_id}{PROC_FILE_ERROR_EXT}"
        else:
            assert False, f"Invalid type: {type}"

    @classmethod
    def get_proc_file_suffix(cls, type: ProcFileType) -> str:
        return cls.get_proc_file_basename("", type)

    @classmethod
    def get_proc_file_wild_path(cls, type: ProcFileType = ProcFileType.RESERVE) -> str:
        proc_file_suffix = cls.get_proc_file_suffix(type)
        path = f"{EXPDB_DIRPATH.EXPDB_DIR}/*/*{proc_file_suffix}"
        return path
