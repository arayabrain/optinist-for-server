import glob

from studio.app.common.core.utils.config_handler import ConfigReader
from studio.app.optinist.core.expdb.proc_file_data import ProcFile, ProcFileUtils


class ProcFileReader:
    """
    Reader class of "proc file"
      (command file that controls the execution of expdb_batch batch)
    """

    @classmethod
    def read(cls, exp_id: str) -> ProcFile:
        return cls.read_from_path(ProcFileUtils.get_proc_file_path(exp_id))

    @classmethod
    def read_from_path(cls, filepath: str) -> ProcFile:
        config = ConfigReader.read(filepath)
        assert config, f"Invalid config yaml file: [{filepath}] [{config}]"
        return ProcFileUtils.create_proc_file(config)

    @classmethod
    def find_proc_files(cls):
        target_proc_files = sorted(glob.glob(ProcFileUtils.get_proc_file_wild_path()))
        return target_proc_files
