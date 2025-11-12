from enum import Enum

LOCKFILE_NAME = "process.lock"
PROC_FILE_EXT = ".proc"


class ProcessCommand(Enum):
    REGIST = "regist"
    REGIST_METADATA = "regist_metadata"
    DELETE = "delete"


class SupportedRoiMethod(Enum):
    CAIMAN = "caiman"
    SUITE2P = "suite2p"

    @classmethod
    def get_roi_method_from_node(cls, node_name: str) -> "SupportedRoiMethod":
        NODE_ROI_METHOD_MAP = {
            "caiman_cnmf_preprocessing": cls.CAIMAN,
            "suite2p_preprocessing": cls.SUITE2P,
        }
        return NODE_ROI_METHOD_MAP.get(node_name)
