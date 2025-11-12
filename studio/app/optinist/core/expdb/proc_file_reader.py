import glob
import os

from studio.app.common.core.utils.config_handler import ConfigReader
from studio.app.common.core.utils.filepath_creater import join_filepath
from studio.app.expdb_dir_path import EXPDB_DIRPATH
from studio.app.optinist.core.expdb.batch_const import PROC_FILE_EXT
from studio.app.optinist.core.expdb.expdb_data import ExpDbPathIds
from studio.app.optinist.core.expdb.proc_file_data import ProcFile


class ProcFileReader:
    """
    Reader class of "proc file"
      (command file that controls the execution of expdb_batch batch)
    """

    @classmethod
    def read(cls, exp_id: str) -> ProcFile:
        return cls.read_from_path(cls.get_proc_file_path(exp_id))

    @classmethod
    def read_from_path(cls, filepath: str) -> ProcFile:
        config = ConfigReader.read(filepath)
        assert config, f"Invalid config yaml file: [{filepath}] [{config}]"
        return cls._create_proc_file(config)

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

    @classmethod
    def _create_proc_file(cls, config: dict) -> ProcFile:
        return ProcFile(
            command=config.get("command"),
            roi_method=config.get("roi_method"),
        )

    @classmethod
    def find_proc_files(cls):
        target_proc_files = sorted(glob.glob(cls.get_proc_file_wild_path()))
        return target_proc_files

    @classmethod
    def parse_exp_id_from_path(cls, file_path: str) -> str:
        return os.path.basename(file_path).split(".", 1)[0]
