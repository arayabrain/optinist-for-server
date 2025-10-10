"""
Suite2p preprocessing for ExpDB workflow.

Performs Suite2p ROI detection and generates ExpDB-compatible output files
for integration with the analyze_stats pipeline.
"""

import os

import numpy as np

from studio.app.common.core.logger import AppLogger
from studio.app.common.core.utils.filepath_creater import join_filepath
from studio.app.common.dataclass import ImageData
from studio.app.const import TS_SUFFIX
from studio.app.expdb_dir_path import EXPDB_DIRPATH
from studio.app.optinist.core.nwb.nwb import NWBDATASET
from studio.app.optinist.dataclass import (
    EditRoiData,
    ExpDbData,
    FluoData,
    IscellData,
    RoiData,
)
from studio.app.optinist.wrappers.optinist.utils import recursive_flatten_params
from studio.app.optinist.wrappers.suite2p.utils import convert_suite2p_to_expdb_mats

logger = AppLogger.get_logger()


def suite2p_preprocessing(
    images: ImageData, output_dir: str, params: dict = None, **kwargs
) -> dict(fluorescence=FluoData, iscell=IscellData, processed_data=ExpDbData):
    """
    Perform Suite2p cell detection and create ExpDB-compatible output files.

    Runs Suite2p ROI detection on preprocessed images, extracts fluorescence traces
    with neuropil correction, and generates .mat files for downstream analysis.

    Args:
        images: ImageData from preprocessing node containing image stack (T, Y, X)
        output_dir: Directory for output files
        params: Configuration parameters including:
            - tau: Timescale of calcium indicator (default: 1.0)
            - threshold_scaling: Detection threshold multiplier (default: 1.0)
            - max_overlap: Maximum allowed ROI overlap (default: 0.75)
            - neucoeff: Neuropil contamination coefficient (default: 0.7)
            - normalize_by_energy: Apply energy normalization (default: True)
            - roi_thr: ROI pixel energy threshold (default: 0.9)
            - create_Yr: Create Yr.mat file (default: True)
            - create_C_or: Create C_or.mat file (default: False)
        **kwargs: Additional arguments including nwbfile metadata

    Returns:
        Dictionary with:
            - processed_data: Paths to timecourse and trial structure .mat files
            - fluorescence: Fluorescence traces (n_cells, T)
            - iscell: Binary cell classification (n_cells,)
            - all_roi: Combined ROI image
            - cell_roi: Accepted cells ROI image
            - non_cell_roi: Rejected components ROI image
            - images: Correlation image
            - mean_image: Temporal mean image
            - max_proj: Maximum projection image
            - edit_roi_data: Data for manual ROI editing
            - nwbfile: NWB metadata

    Raises:
        FileNotFoundError: If trial structure file doesn't exist
        ValueError: If no ROIs detected
    """
    from suite2p import ROI, classification, default_ops, detection, extraction

    function_id = "suite2p_preprocessing"
    logger.info(f"start {function_id}")

    # Flatten params
    flattened_params = {}
    if params is not None:
        recursive_flatten_params(params, flattened_params)
    params = flattened_params

    # Extract Suite2p-specific params
    neucoeff = params.pop("neucoeff", 0.7)
    normalize_by_energy = params.pop("normalize_by_energy", True)
    create_Yr = params.pop("create_Yr", True)
    create_C_or = params.pop("create_C_or", False)
    validate_outputs = params.pop("validate_outputs", True)
    roi_thr = params.pop("roi_thr", 0.9)

    # Get file path and extract experiment ID
    file_path = images.path
    if isinstance(file_path, list):
        file_path = file_path[0]

    exp_id = "_".join(os.path.basename(file_path).split("_")[:2])
    subject_id = exp_id.split("_")[0]

    logger.info(f"Processing experiment: {exp_id}")

    # Load image data
    image_stack = images.data
    T, Ly, Lx = image_stack.shape
    logger.info(
        f"Image stack shape: " f"T={T}, Ly={Ly}, Lx={Lx}, dtype={image_stack.dtype}"
    )

    # Get NWB metadata
    nwbfile = kwargs.get("nwbfile", {})
    fs = nwbfile.get("imaging_plane", {}).get("imaging_rate", 30)
    logger.info(f"Frame rate: {fs} Hz")

    # Verify trial structure file exists
    ts_filename = f"{exp_id}_{TS_SUFFIX}.mat"
    trialstructure_path = join_filepath(
        [EXPDB_DIRPATH.EXPDB_DIR, subject_id, exp_id, ts_filename]
    )

    if not os.path.exists(trialstructure_path):
        raise FileNotFoundError(
            f"Required trial structure file not found: {trialstructure_path}\n"
            f"This file must be created before running cell detection."
        )

    logger.info(f"Trial structure file found: {trialstructure_path}")

    # Setup Suite2p ops - merge defaults with our parameters
    # Use dict merge to preserve all default_ops values
    ops = {
        **default_ops(),
        "Ly": Ly,
        "Lx": Lx,
        "nframes": T,
        "fs": fs,
        **params,
    }

    # Set required parameters for detection that are normally set during registration
    # yrange and xrange define the ROI region to analyze (default to full frame)
    ops["yrange"] = [0, Ly]
    ops["xrange"] = [0, Lx]

    # Convert image stack to format Suite2p expects
    # Suite2p expects (Ly, Lx, T) for detection
    # Optimize: Convert to int16 first, then transpose to avoid double memory usage
    import tempfile

    with tempfile.NamedTemporaryFile(suffix=".bin", delete=False) as tmp_file:
        tmp_bin_path = tmp_file.name
        # Write directly in chunks to avoid holding full transposed array in memory
        image_stack_int16 = image_stack.astype(np.int16)
        image_stack_suite2p = np.transpose(image_stack_int16, (1, 2, 0))
        image_stack_suite2p.tofile(tmp_file)
        # Free memory immediately
        del image_stack_int16

    ops["reg_file"] = tmp_bin_path

    # Initialize default empty outputs
    empty_roi = np.full((Ly, Lx), np.nan)
    im = np.zeros((0, Ly, Lx))
    F = np.zeros((0, T))
    Fneu = np.zeros((0, T))
    iscell = np.array([], dtype=int)
    stat = []

    try:
        # Get classifier path
        ops_classfile = ops.get("classifier_path")
        builtin_classfile = classification.builtin_classfile
        user_classfile = classification.user_classfile

        if ops_classfile:
            logger.info(f"Using classifier: {str(ops_classfile)}")
            classfile = ops_classfile
        elif ops.get("use_builtin_classifier", True) or not user_classfile.is_file():
            logger.info(f"Using builtin classifier: {str(builtin_classfile)}")
            classfile = builtin_classfile
        else:
            logger.info(f"Using user classifier: {str(user_classfile)}")
            classfile = user_classfile

        # Step 1: ROI Detection
        logger.info("Running Suite2p ROI detection...")
        ops, stat = detection.detect(ops=ops, classfile=classfile)
        logger.info(f"Detected {len(stat)} ROIs")

        if len(stat) > 0:
            # Step 2: ROI Extraction (fluorescence traces)
            logger.info("Extracting fluorescence traces...")
            ops, stat, F, Fneu, _, _ = extraction.create_masks_and_extract(ops, stat)
            stat = stat.tolist()
            logger.info(f"Extracted traces shape: F={F.shape}, Fneu={Fneu.shape}")

            # Step 3: ROI Classification
            logger.info("Classifying ROIs...")
            iscell_probs = classification.classify(stat=stat, classfile=classfile)
            iscell = iscell_probs[:, 0].astype(int)  # Binary cell/non-cell
            logger.info(
                f"Classified {np.sum(iscell)} cells, "
                f"{len(iscell) - np.sum(iscell)} non-cells"
            )

            # Step 4: Create visualization ROIs with energy thresholding
            arrays = []
            for i, s in enumerate(stat):
                # Apply energy threshold to ROI pixels (like CaImAn's get_roi)
                lam = np.array(s["lam"])
                idx = np.argsort(lam)[::-1]  # Sort by weight, highest first
                cumEn = np.cumsum(lam[idx] ** 2)
                cumEn /= cumEn[-1]  # Normalize to [0, 1]

                # Keep pixels up to roi_thr cumulative energy
                keep_idx = idx[cumEn <= roi_thr]

                if len(keep_idx) > 0:
                    # Create thresholded ROI
                    thresholded_ypix = np.array(s["ypix"])[keep_idx]
                    thresholded_xpix = np.array(s["xpix"])[keep_idx]
                    thresholded_lam = lam[keep_idx]

                    array = ROI(
                        ypix=thresholded_ypix,
                        xpix=thresholded_xpix,
                        lam=thresholded_lam,
                        med=s["med"],
                        do_crop=False,
                    ).to_array(Ly=Ly, Lx=Lx)
                    array = array.astype(np.float32)
                    array *= i + 1
                    arrays.append(array)
                else:
                    # Empty ROI if threshold filters everything
                    arrays.append(np.zeros((Ly, Lx), dtype=np.float32))

            im = np.stack(arrays)
            im[im == 0] = np.nan
            im -= 1

        else:
            logger.warning("No ROIs detected in the data")

    finally:
        # Clean up temporary binary file
        if os.path.exists(tmp_bin_path):
            os.remove(tmp_bin_path)

    # Separate cells and non-cells for visualization
    idx_good = np.where(iscell == 1)[0].tolist()
    idx_bad = np.where(iscell == 0)[0].tolist()

    n_rois = len(idx_good)
    n_noncell_rois = len(idx_bad)

    logger.info(f"Accepted cells: {n_rois}, Rejected: {n_noncell_rois}")

    # Create cell and non-cell ROI images
    if n_rois > 0:
        cell_ims = im[idx_good].copy()
        cell_roi = np.nanmax(cell_ims, axis=0)
    else:
        cell_ims = np.zeros((0, Ly, Lx), dtype=np.float32)
        cell_roi = empty_roi.copy()

    if n_noncell_rois > 0:
        # Create output array directly to avoid intermediate copy
        non_cell_roi = np.full((Ly, Lx), np.nan, dtype=np.float32)
        # Create modified non-cell images for later processing if needed
        non_cell_ims = im[idx_bad].copy()  # Need copy here for renumbering

        # Renumber non-cells starting after cells
        for idx, i in enumerate(range(n_rois, n_rois + n_noncell_rois)):
            non_cell_ims[idx] = np.where(~np.isnan(non_cell_ims[idx]), i, np.nan)
        non_cell_roi = np.nanmax(non_cell_ims, axis=0)
    else:
        non_cell_ims = np.zeros((0, Ly, Lx), dtype=np.float32)
        non_cell_roi = empty_roi.copy()

    # Recreate im array with properly separated and renumbered cells and non-cells
    # This matches CaImAn's approach: im = np.vstack([cell_ims, non_cell_ims])
    im = np.vstack([cell_ims, non_cell_ims])

    # Step 5: Convert Suite2p outputs to ExpDB .mat files
    # Creates timecourse.mat and cellmask.mat for analyze_stats pipeline
    # The normalization applied here is equivalent to CaImAn's AY calculation:
    # - CaImAn: AY = (A_normalized^T) @ Yr, where A_normalized = A / sqrt(sum(A^2))
    # - Suite2p: timecourse = F_corrected / sqrt(sum(lam^2))
    # Both produce (T, n_cells) fluorescence traces normalized by ROI energy
    logger.info("Converting Suite2p outputs to ExpDB format...")

    if len(stat) > 0:
        # Create optional Yr.mat
        if create_Yr:
            import scipy.io

            # Reshape image stack to Yr format: (pixels, T)
            Yr = image_stack.astype(np.float32).reshape(T, Ly * Lx, order="F").T
            scipy.io.savemat(
                join_filepath([output_dir, f"{exp_id}_Yr.mat"]),
                {"Yr": Yr},
            )
            del Yr  # Free memory immediately
            logger.info("Created Yr.mat")

        conversion_params = {
            "neucoeff": neucoeff,
            "normalize_by_energy": normalize_by_energy,
            "create_C_or": create_C_or,
            "validate_outputs": validate_outputs,
        }

        mat_paths = convert_suite2p_to_expdb_mats(
            F=F,
            Fneu=Fneu,
            stat=stat,
            Ly=Ly,
            Lx=Lx,
            output_dir=output_dir,
            exp_id=exp_id,
            params=conversion_params,
            validate=validate_outputs,
        )

        timecourse_path = mat_paths["timecourse"]
        cellmask_path = mat_paths["cellmask"]

        logger.info(f"Created timecourse: {timecourse_path}")
        logger.info(f"Created cellmask: {cellmask_path}")

    else:
        # No ROIs detected - create empty files
        logger.warning("No ROIs detected - skipping .mat file creation")
        raise ValueError("Suite2p detected no ROIs. Cannot proceed with analysis.")

    # Step 6: Compute summary images & Create NWB metadata
    mean_img = np.mean(image_stack, axis=0)
    max_proj = np.max(image_stack, axis=0)
    Vcorr = ops.get("Vcorr")  # correlation image
    Vcorr[np.isnan(Vcorr)] = 0  # Handle NaN values before uint8 conversion

    nwbfile_out = {}

    # Add ROI metadata
    # Note: Creating full image_mask for 2791 ROIs creates ~2.9GB of data
    # Only store sparse representation (pixel indices) to save memory
    roi_list = []
    for i, s in enumerate(stat):
        #     roi_mask = ROI(
        #     ypix=s["ypix"],
        #     xpix=s["xpix"],
        #     lam=s["lam"],
        #     med=s["med"],
        #     do_crop=False,
        # ).to_array(Ly=Ly, Lx=Lx)
        kargs = {
            # Store sparse pixel representation instead of full mask
            "pixel_mask": np.array([s["ypix"], s["xpix"], s["lam"]]).T,
            # "image_mask": roi_mask,
            "accepted": bool(iscell[i]),
            "rejected": not bool(iscell[i]),
        }
        roi_list.append(kargs)

    nwbfile_out[NWBDATASET.ROI] = {function_id: {"roi_list": roi_list}}
    nwbfile_out[NWBDATASET.POSTPROCESS] = {
        function_id: {
            # Don't store full im array to save memory (in development)
            # "all_roi_img": im,
            "mean_img": mean_img,
            "max_proj": max_proj,
        }
    }

    # Add iscell column
    nwbfile_out[NWBDATASET.COLUMN] = {
        function_id: {
            "name": "iscell",
            "description": "two columns - iscell & probcell",
            "data": iscell,
        }
    }

    # Add fluorescence data
    nwbfile_out[NWBDATASET.FLUORESCENCE] = {
        function_id: {
            "Fluorescence": {
                "table_name": "ROIs",
                "region": list(range(len(stat))),
                "name": "Fluorescence",
                "data": F.T,  # Transpose to (T, n_cells)
                "unit": "lumens",
            }
        }
    }

    # Step 7: Prepare output dictionary
    info = {
        "processed_data": ExpDbData([timecourse_path, trialstructure_path]),
        "mean_image": ImageData(
            np.array(mean_img, dtype=np.uint16),
            output_dir=output_dir,
            file_name="mean_image",
        ),
        "Vcorr": ImageData(
            Vcorr,
            output_dir=output_dir,
            file_name="Vcorr",
        ),
        "max_proj": ImageData(
            np.array(max_proj, dtype=np.uint16),
            output_dir=output_dir,
            file_name="max_proj",
        ),
        "fluorescence": FluoData(F, file_name="fluorescence"),
        "iscell": IscellData(iscell, file_name="iscell"),
        "all_roi": RoiData(
            np.nanmax(im, axis=0) if len(im) > 0 else empty_roi,
            output_dir=output_dir,
            file_name="all_roi",
        ),
        "cell_roi": RoiData(cell_roi, output_dir=output_dir, file_name="cell_roi"),
        "non_cell_roi": RoiData(
            non_cell_roi, output_dir=output_dir, file_name="non_cell_roi"
        ),
        "edit_roi_data": EditRoiData(images=image_stack, im=im),
        "nwbfile": nwbfile_out,
    }

    logger.info("Suite2p preprocessing completed successfully")
    logger.info(f"Detected {n_rois} cells, {n_noncell_rois} non-cells")

    return info
