from enum import Enum

LOCKFILE_NAME = "process.lock"
FLAG_FILE_EXT = ".proc"


class ProcessCommand(Enum):
    REGIST = "regist"
    REGIST_METADATA = "regist_metadata"
    DELETE = "delete"
