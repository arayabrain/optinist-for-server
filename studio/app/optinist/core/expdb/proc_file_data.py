import datetime
import os
from dataclasses import dataclass
from typing import Optional

from studio.app.common.core.utils.filepath_creater import join_filepath
from studio.app.expdb_dir_path import EXPDB_DIRPATH
from studio.app.optinist.core.expdb.batch_const import PROC_FILE_EXT
from studio.app.optinist.core.expdb.expdb_data import ExpDbPathIds


@dataclass
class ProcFile:
    command: str
    roi_method: Optional[str] = None
    start_time: Optional[datetime.datetime] = None
    complete_time: Optional[datetime.datetime] = None
    result: Optional[str] = None
    log: Optional[str] = None


class ProcFileUtils:
    @classmethod
    def parse_exp_id_from_path(cls, file_path: str) -> str:
        return os.path.basename(file_path).split(".", 1)[0]

    @classmethod
    def create_proc_file(cls, config: dict) -> ProcFile:
        return ProcFile(
            command=config.get("command"),
            roi_method=config.get("roi_method"),
        )

    @classmethod
    def get_proc_file_path(cls, exp_id: str) -> str:
        exp_ids = ExpDbPathIds(exp_id=exp_id)
        path = join_filepath(
            [EXPDB_DIRPATH.EXPDB_DIR, exp_ids.subject_id, f"{exp_id}{PROC_FILE_EXT}"]
        )
        return path

    @classmethod
    def get_proc_file_wild_path(cls) -> str:
        path = f"{EXPDB_DIRPATH.EXPDB_DIR}/*/*{PROC_FILE_EXT}"
        return path
