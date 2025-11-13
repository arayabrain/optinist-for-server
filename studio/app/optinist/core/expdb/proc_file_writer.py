import datetime
import os
import pathlib
from dataclasses import asdict

from studio.app.common.core.utils.config_handler import ConfigWriter
from studio.app.optinist.core.expdb.proc_file_data import ProcFile, ProcFileUtils


class ProcFileWriter:
    """
    Writer class of "proc file"
      (command file that controls the execution of expdb_batch batch)
    """

    @classmethod
    def write(cls, exp_id: str, proc_file: ProcFile):
        cls.write_to_path(ProcFileUtils.get_proc_file_path(exp_id), proc_file)

    @classmethod
    def write_to_path(cls, filepath: str, proc_file: ProcFile):
        ConfigWriter.write(
            dirname=os.path.dirname(filepath),
            filename=os.path.basename(filepath),
            config=asdict(proc_file),
        )

    @classmethod
    def backup_proc_file(cls, src_proc_path: str, is_success: bool):
        # Create backup file path
        if is_success:
            renamed_proc_path = src_proc_path + ".done"
        else:
            renamed_proc_path = src_proc_path + ".error"

        # Rename the old proc file if it exists
        if os.path.isfile(renamed_proc_path):
            ps = pathlib.Path(renamed_proc_path).stat()
            st_mtime = datetime.datetime.fromtimestamp(ps.st_mtime).strftime(
                "%Y%m%d%H%M%S"
            )
            os.rename(renamed_proc_path, renamed_proc_path + "." + st_mtime)

        # Apply rename
        os.rename(src_proc_path, renamed_proc_path)

    @classmethod
    def write_and_backup_proc_file(
        cls, filepath: str, proc_file: ProcFile, is_success: bool
    ):
        """
        Execute `write_to_path` and `backup_proc_file` together.
        """
        cls.write_to_path(filepath, proc_file)
        cls.backup_proc_file(filepath, is_success)
