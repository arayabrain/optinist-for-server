import os

from studio.app.dir_path import DIRPATH


def test_dir_path():
    assert os.path.exists(DIRPATH.DATA_DIR)
    assert os.path.exists(DIRPATH.STUDIO_DIR)
