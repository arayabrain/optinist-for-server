from dataclasses import dataclass


@dataclass
class NWBDATASET:
    POSTPROCESS: str = "POSTPROCESS"
    TIMESERIES: str = "TIMESERIES"
    MOTION_CORRECTION: str = "MOCTION_CORRECTION"
    ROI: str = "ROI"
    COLUMN: str = "COLUMN"
    FLUORESCENCE: str = "FLUORESCENCE"
    BEHAVIOR: str = "BEHAVIOR"
    IMAGE_SERIES: str = "image_series"
    ORISTATS: str = "ORISTATS"
    LAB_METADATA: str = "LAB_METADATA"
