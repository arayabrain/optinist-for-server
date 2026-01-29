from enum import Enum

LOCKFILE_NAME = "process.lock"
PROC_FILE_EXT = ".proc"
PROC_FILE_DONE_EXT = ".proc.done"
PROC_FILE_ERROR_EXT = ".proc.error"


class ProcessCommand(Enum):
    REGIST = "regist"
    REGIST_METADATA = "regist_metadata"
    DELETE = "delete"


class SupportedRoiMethod(Enum):
    UNSUPPORTED = "unsupported"
    CAIMAN = "caiman"
    SUITE2P = "suite2p"

    @classmethod
    def get_roi_method_from_node(cls, node_name: str) -> "SupportedRoiMethod":
        NODE_ROI_METHOD_MAP = {
            "caiman_cnmf_preprocessing": cls.CAIMAN,
            "suite2p_preprocessing": cls.SUITE2P,
        }
        return NODE_ROI_METHOD_MAP.get(node_name)

    @classmethod
    def get_node_name_from_roi_method(cls, roi_method: str) -> str:
        """Get preprocessing node name from ROI method string."""
        ROI_METHOD_NODE_MAP = {
            cls.CAIMAN.value: "caiman_cnmf_preprocessing",
            cls.SUITE2P.value: "suite2p_preprocessing",
        }
        return ROI_METHOD_NODE_MAP.get(roi_method, "caiman_cnmf_preprocessing")
