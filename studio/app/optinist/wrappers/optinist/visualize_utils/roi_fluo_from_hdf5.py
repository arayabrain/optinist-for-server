import numpy as np

from studio.app.common.core.logger import AppLogger
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
    **kwargs,
) -> dict():
    """
    Processes ROI and fluorescence data, aligning them, and adds enriched metadata.

    Parameters:
        cell_img (ImageData): Cell image data containing ROI information.
        fluo (FluoData): Fluorescence data.
        output_dir (str): Directory to save the output data.
        iscell (IscellData): Binary data indicating cell regions (optional).
        params (dict): Optional parameters for additional processing.
        **kwargs: Additional keyword arguments.

    Returns:
        dict: A dictionary containing processed ROI and fluorescence data.
    """
    logger = AppLogger.get_logger()
    logger.info("Starting ROI and fluorescence data processing")

    # Initialize outputs and mappings
    iscell_data = iscell.data if iscell else None
    aligned_fluo = fluo.data
    roi_to_fluo_map = {}

    # Process ROI and fluorescence mapping
    if iscell_data is not None:
        iscell_data = iscell_data.reshape(
            cell_img.data.shape[1], cell_img.data.shape[2]
        )
        for roi_idx in range(cell_img.data.shape[0]):
            overlap = np.sum(
                cell_img.data[roi_idx]
                * iscell_data[: cell_img.data.shape[1], : cell_img.data.shape[2]],
                axis=(0, 1),
            )
            fluo_idx = np.argmax(overlap)
            roi_to_fluo_map[roi_idx] = fluo_idx

        # Align fluorescence data using mapping
        aligned_fluo = np.zeros_like(fluo.data)
        for roi_idx, fluo_idx in roi_to_fluo_map.items():
            aligned_fluo[roi_idx] = fluo.data[fluo_idx]

    # Generate ROI masks and associated data
    roi_masks = []
    for i in range(cell_img.data.shape[0]):
        mask = {
            "roi_idx": i,
            "mask": cell_img.data[i],
        }
        roi_masks.append(mask)

    # Enrich output with metadata and processed data
    output = {
        "iscell": IscellData(iscell_data, file_name="iscell") if iscell else None,
        "all_roi": RoiData(
            np.nanmax(cell_img.data, axis=0),
            output_dir=output_dir,
            file_name="all_roi",
        ),
        "non_cell_roi": RoiData(
            (
                np.nanmax(cell_img.data[iscell_data == 0], axis=0)
                if iscell_data is not None
                else None
            ),
            output_dir=output_dir,
            file_name="noncell_roi",
        ),
        "cell_roi": RoiData(
            (
                np.nanmax(cell_img.data[iscell_data != 0], axis=0)
                if iscell_data is not None
                else None
            ),
            output_dir=output_dir,
            file_name="cell_roi",
        ),
        "fluorescence": FluoData(
            np.transpose(aligned_fluo),
            file_name="fluorescence",
        ),
        "roi_masks": roi_masks,
        "metadata": {
            "roi_to_fluo_map": roi_to_fluo_map,
            "params": params,
        },
    }

    logger.info("Completed ROI and fluorescence data processing")
    return output
