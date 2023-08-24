from dataclasses import dataclass


@dataclass
class FILETYPE:
    IMAGE: str = "image"
    CSV: str = "csv"
    HDF5: str = "hdf5"
    BEHAVIOR: str = "behavior"
    MATLAB: str = "matlab"
    TC: str = "tc"
    TS: str = "ts"
    EXPDB: str = "expdb"


ACCEPT_TIFF_EXT = [".tif", ".tiff", ".TIF", ".TIFF"]
ACCEPT_CSV_EXT = [".csv"]
ACCEPT_HDF5_EXT = [".hdf5", ".nwb", ".HDF5", ".NWB"]
ACCEPT_MATLAB_EXT = [".mat"]

NOT_DISPLAY_ARGS_LIST = ["params", "output_dir", "nwbfile", "export_plot"]

DATE_FORMAT = "%Y-%m-%d %H:%M:%S"
TC_SUFFIX = "timecourse"
TC_FIELDNAME = "timecourse"
TS_SUFFIX = "trialstructure"
TS_FIELDNAME = "trialstructure"
STATDATA_PREFIX = "oristats"
CELLMASK_SUFFIX = "cellmask"
CELLMASK_FIELDNAME = "cellmask"
FOV_SUFFIX = "fov"
FOV_CONTRAST = 0.4
