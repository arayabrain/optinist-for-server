from dataclasses import dataclass


@dataclass
class FILETYPE:
    IMAGE: str = "image"
    CSV: str = "csv"
    HDF5: str = "hdf5"
    BEHAVIOR: str = "behavior"
    MATLAB: str = "matlab"
    MICROSCOPE: str = "microscope"
    EXPDB: str = "expdb"


ACCEPT_TIFF_EXT = [".tif", ".tiff", ".TIF", ".TIFF"]
ACCEPT_CSV_EXT = [".csv"]
ACCEPT_HDF5_EXT = [".hdf5", ".nwb", ".HDF5", ".NWB"]
ACCEPT_MATLAB_EXT = [".mat"]
ACCEPT_MICROSCOPE_EXT = [".nd2", ".oir", ".isxd", ".thor.zip", ".xml"]

NOT_DISPLAY_ARGS_LIST = ["params", "output_dir", "nwbfile", "export_plot", "kwargs"]

DATE_FORMAT = "%Y-%m-%d %H:%M:%S"

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
