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


@dataclass
class ProcFileExt(ProcFile):
    exp_id: Optional[str] = None
    file_path: Optional[str] = None

    def __post_init__(self):
        if self.exp_id:
            exp_ids = ExpDbPathIds(exp_id=self.exp_id)
            self.file_path = join_filepath(
                [
                    EXPDB_DIRPATH.EXPDB_DIR,
                    exp_ids.subject_id,
                    f"{self.exp_id}{PROC_FILE_EXT}",
                ]
            )
