from dataclasses import dataclass
from enum import Enum


@dataclass
class FILETYPE:
    IMAGE: str = "image"
    CSV: str = "csv"
    HDF5: str = "hdf5"
    BEHAVIOR: str = "behavior"
    MATLAB: str = "matlab"
    MICROSCOPE: str = "microscope"
    EXPDB: str = "expdb"


class ACCEPT_FILE_EXT(Enum):
    TIFF_EXT = [".tif", ".tiff", ".TIF", ".TIFF"]
    CSV_EXT = [".csv"]
    HDF5_EXT = [".hdf5", ".nwb", ".HDF5", ".NWB"]
    MATLAB_EXT = [".mat"]
    MICROSCOPE_EXT = [".nd2", ".oir", ".isxd", ".thor.zip", ".xml"]
    EXPDB = []  # Note: EXPDB does not have a file ext.

    ALL_EXT = TIFF_EXT + CSV_EXT + HDF5_EXT + MATLAB_EXT + MICROSCOPE_EXT


NOT_DISPLAY_ARGS_LIST = ["params", "output_dir", "nwbfile", "export_plot", "kwargs"]

DATE_FORMAT = "%Y-%m-%d %H:%M:%S"

MAX_IMAGE_DATA_PART_SIZE = 1_000_000_000  # 1GB

THUMBNAIL_HEIGHT = 128
TC_SUFFIX = "timecourse"
TC_FIELDNAME = "timecourse"
TS_SUFFIX = "trialstructure"
TS_FIELDNAME = "trialstructure"
CELLMASK_SUFFIX = "cellmask"
CELLMASK_FIELDNAME = "cellmask"
FOV_SUFFIX = "FOV"
FOV_CONTRAST = 0.4
EXP_METADATA_SUFFIX = "metadata"
