"""
Suite2p preprocessing for ExpDB workflow.

Performs Suite2p ROI detection and generates ExpDB-compatible output files
for integration with the analyze_stats pipeline.
"""

from studio.app.common.dataclass import ImageData
from studio.app.optinist.dataclass import (  # EditRoiData,
    ExpDbData,
    FluoData,
    IscellData,
)


def suite2p_preprocessing(
    images: ImageData, output_dir: str, params: dict = None, **kwargs
) -> dict(fluorescence=FluoData, iscell=IscellData, processed_data=ExpDbData):

    # TODO: Mock version
    info = {}

    return info
