import numpy as np

from studio.app.common.dataclass.image import ImageData
from studio.app.optinist.dataclass.fluo import FluoData
from studio.app.optinist.dataclass.iscell import IscellData
from studio.app.optinist.dataclass.roi import RoiData


def roi_fluo_from_hdf5(
    cell_img: ImageData,
    fluo: FluoData,
    output_dir: str,
    iscell: IscellData = None,
    params: dict = None,
    **kwargs
) -> dict(iscell=IscellData, fluorescence=FluoData):
    if iscell is not None:
        iscell_data = iscell.data
        return {
            "iscell": IscellData(iscell_data, file_name="iscell"),
            "all_roi": RoiData(
                np.nanmax(cell_img.data, axis=0),
                output_dir=output_dir,
                file_name="roi",
            ),
            "non_cell_roi": RoiData(
                np.nanmax(cell_img.data[iscell_data == 0], axis=0),
                output_dir=output_dir,
                file_name="noncell_roi",
            ),
            "cell_roi": RoiData(
                np.nanmax(cell_img.data[iscell_data != 0], axis=0),
                output_dir=output_dir,
                file_name="cell_roi",
            ),
            "fluorescence": FluoData(np.transpose(fluo.data), file_name="fluorescence"),
        }
    else:
        return {
            "all_roi": RoiData(
                np.nanmax(cell_img.data, axis=0),
                output_dir=output_dir,
                file_name="roi",
            ),
            "fluorescence": FluoData(np.transpose(fluo.data), file_name="fluorescence"),
        }
