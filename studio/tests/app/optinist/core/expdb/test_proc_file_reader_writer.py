import os

from studio.app.optinist.core.expdb.batch_const import ProcessCommand
from studio.app.optinist.core.expdb.proc_file_data import ProcFile, ProcFileUtils
from studio.app.optinist.core.expdb.proc_file_reader import ProcFileReader
from studio.app.optinist.core.expdb.proc_file_writer import ProcFileWriter

exp_id = "DMY0001_ori001"


def test_proc_file_reader_writer():
    proc_file_path = ProcFileUtils.get_proc_file_path(exp_id)

    try:
        # ----------------------------------------
        # Writer test
        # ----------------------------------------

        proc_file = ProcFile(command=ProcessCommand.REGIST.value)
        ProcFileWriter.write(exp_id, proc_file)
        assert os.path.exists(proc_file_path)

        # ----------------------------------------
        # Reader test
        # ----------------------------------------

        proc_file = ProcFileReader.read(exp_id)
        assert proc_file

        proc_file_paths = ProcFileReader.find_proc_files()
        assert proc_file_paths

    finally:
        if os.path.exists(proc_file_path):
            os.remove(proc_file_path)
