import os
from dataclasses import dataclass

from dotenv import load_dotenv

from studio.app.dir_path import DIRPATH


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

load_dotenv(f"{DIRPATH.CONFIG_DIR}/.env")
TC_SUFFIX = os.environ.get("TC_SUFFIX")
assert TC_SUFFIX is not None, "TC_SUFFIX is not set in .env file"
TC_FIELDNAME = os.environ.get("TC_FIELDNAME")
assert TC_FIELDNAME is not None, "TC_FIELDNAME is not set in .env file"
TS_SUFFIX = os.environ.get("TS_SUFFIX")
assert TS_SUFFIX is not None, "TS_SUFFIX is not set in .env file"
TS_FIELDNAME = os.environ.get("TS_FIELDNAME")
assert TS_FIELDNAME is not None, "TS_FIELDNAME is not set in .env file"
STATDATA_PREFIX = os.environ.get("STATDATA_PREFIX")
assert STATDATA_PREFIX is not None, "STATDATA_PREFIX is not set in .env file"
CELLMASK_SUFFIX = os.environ.get("CELLMASK_SUFFIX")
assert CELLMASK_SUFFIX is not None, "CELLMASK_SUFFIX is not set in .env file"
CELLMASK_FIELDNAME = os.environ.get("CELLMASK_FIELDNAME")
assert CELLMASK_FIELDNAME is not None, "CELLMASK_FIELDNAME is not set in .env file"
FOV_SUFFIX = os.environ.get("FOV_SUFFIX")
assert FOV_SUFFIX is not None, "FOV_SUFFIX is not set in .env file"
FOV_CONTRAST = float(os.environ.get("FOV_CONTRAST"))
assert FOV_CONTRAST is not None, "FOV_CONTRAST is not set in .env file"
