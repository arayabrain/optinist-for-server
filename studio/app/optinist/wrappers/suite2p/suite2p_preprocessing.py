"""
Suite2p preprocessing for ExpDB workflow.

Performs Suite2p ROI detection and generates ExpDB-compatible output files
for integration with the analyze_stats pipeline.
"""

import os

import numpy as np

from studio.app.common.core.logger import AppLogger
from studio.app.common.core.utils.filepath_creater import (
    create_directory,
    join_filepath,
)
from studio.app.common.dataclass import ImageData
from studio.app.const import TS_SUFFIX
from studio.app.optinist.core.expdb.expdb_data import ExpDbPathIdsUtil
from studio.app.optinist.core.nwb.nwb import NWBDATASET
from studio.app.optinist.dataclass import (  # EditRoiData,
    ExpDbData,
    FluoData,
    IscellData,
    RoiData,
)
from studio.app.optinist.wrappers.optinist.utils import (
    recursive_flatten_params,
    save_auxiliary_mats,
    save_cellmask_mat,
    save_timecourse_mat,
)
from studio.app.optinist.wrappers.suite2p.utils import (
    create_normalized_timecourse,
    stat_to_cellmask,
)

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
            Cell Detection:
            - tau: Timescale of calcium indicator (default: 1.25)
            - threshold_scaling: Detection threshold multiplier (default: 1.0)
            - max_overlap: Maximum allowed ROI overlap (default: 0.75)
            - spatial_hp_detect: Spatial high-pass filter window (default: 25)
            - connected: Use connected components for ROI detection (default: True)

            ROI Extraction:
            - neuropil_extract: Extract neuropil traces (default: True)
            - inner_neuropil_radius: Pixels between ROI and neuropil (default: 2)
            - min_neuropil_pixels: Minimum neuropil pixels (default: 350)
            - neucoeff: Neuropil contamination coefficient (default: 0.7)

            ExpDB-Specific:
            - normalize_by_energy: Apply energy normalization (default: True)

            Visualization:
            - roi_thr_bool: Apply energy thresholding to ROI pixels (default: False)
            - roi_thr: ROI pixel energy threshold when roi_thr_bool=True (default: 0.9)

            Output Control:
            - create_Yr: Create Yr.mat file (default: True)
            - create_C_or: Create C_or.mat file (default: False)
            - validate_outputs: Validate .mat files after creation (default: True)
            - require_trialstructure: Require trial structure file (default: False)
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
    normalize_by_energy = params.pop("normalize_by_energy", False)
    create_Yr = params.pop("create_Yr", False)
    create_C_or = params.pop("create_C_or", False)
    validate_outputs = params.pop("validate_outputs", True)
    roi_thr_bool = params.pop("roi_thr_bool", False)
    roi_thr = params.pop("roi_thr", 0.9)
    require_trialstructure = params.pop("require_trialstructure", False)

    # Get file path and extract experiment ID
    file_path = images.path
    if isinstance(file_path, list):
        file_path = file_path[0]

    exp_ids = ExpDbPathIdsUtil.parse_ids_from_workflow_output_path(file_path)
    exp_id = exp_ids.exp_id

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

    # Verify trial structure file exists (optional for testing)
    ts_filename = f"{exp_id}_{TS_SUFFIX}.mat"
    trialstructure_path = ExpDbPathIdsUtil.create_expdb_file_path(
        exp_id,
        ts_filename,
    )

    if not os.path.exists(trialstructure_path):
        if require_trialstructure:
            raise FileNotFoundError(
                f"Required trial structure file not found: {trialstructure_path}\n"
                f"This file must be created before running cell detection."
            )
        else:
            logger.warning(f"Trial structure file not found: {trialstructure_path}")
            logger.warning("Continuing without trial structure (testing mode)")
            trialstructure_path = None
    else:
        logger.info(f"Trial structure file found: {trialstructure_path}")

    # Setup Suite2p ops - use io.tiff_to_binary for proper preprocessing
    # First, save the image stack as a temporary TIFF file
    import tempfile

    import tifffile
    from suite2p import io

    # Create temporary directory for Suite2p processing
    temp_dir = tempfile.mkdtemp(prefix="suite2p_preprocessing_")
    temp_tiff_path = join_filepath([temp_dir, f"{exp_id}_temp.tiff"])

    # Normalize float data to int16 range (match suite2p_file_convert)
    if image_stack.dtype == np.float32 or image_stack.dtype == np.float64:
        logger.info(
            f"Normalizing float data to int16 range: "
            f"min={image_stack.min()}, max={image_stack.max()}"
        )
        image_stack_normalized = (image_stack - image_stack.min()) / (
            image_stack.max() - image_stack.min()
        )
        image_stack_int16 = (image_stack_normalized * np.iinfo(np.int16).max).astype(
            np.int16
        )
        del image_stack_normalized
    else:
        image_stack_int16 = image_stack.astype(np.int16)

    # Write temporary TIFF file
    logger.info(f"Writing temporary TIFF: {temp_tiff_path}")
    tifffile.imwrite(temp_tiff_path, image_stack_int16)
    del image_stack_int16

    # Setup ops for io.tiff_to_binary
    db = {
        "data_path": [temp_dir],
        "tiff_list": [os.path.basename(temp_tiff_path)],
        "save_path0": output_dir,
        "save_folder": "suite2p",
    }

    # Merge all ops together
    # Note: params should come before fs to allow NWB metadata to override
    ops = {
        **default_ops(),
        **params,
        "fs": fs,  # NWB metadata overrides params
        **db,
    }

    # Create suite2p output directory
    suite2p_dir = join_filepath([ops["save_path0"], ops["save_folder"]])
    create_directory(suite2p_dir)

    # Use Suite2p's tiff_to_binary for proper preprocessing
    # This computes meanImg, max_proj, Vcorr, and creates binary file
    logger.info("Running Suite2p tiff_to_binary preprocessing...")
    logger.info(
        f"Pre-detection ops: fs={ops.get('fs')}, tau={ops.get('tau')}, "
        f"high_pass={ops.get('high_pass')}, "
        f"spatial_hp_detect={ops.get('spatial_hp_detect')}"
    )
    ops = io.tiff_to_binary(ops.copy())
    logger.info("Suite2p preprocessing complete")
    logger.info(f"Binary file created at: {ops.get('reg_file')}")

    # Clean up temporary TIFF
    os.remove(temp_tiff_path)
    os.rmdir(temp_dir)

    # Extract dimensions from ops
    Ly = ops["Ly"]
    Lx = ops["Lx"]
    T = ops["nframes"]

    # Initialize default empty outputs
    empty_roi = np.full((Ly, Lx), np.nan)
    # im = np.zeros((0, Ly, Lx))
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
        logger.info(
            f"Detection input: Ly={ops['Ly']}, Lx={ops['Lx']}, nframes={ops['nframes']}"
        )
        logger.info(
            f"Binary file: {ops.get('reg_file')}, "
            f"exists={os.path.exists(ops.get('reg_file', ''))}"
        )
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

            # Filter to only accepted cells for timecourse.mat
            # This prevents analyze_stats from receiving all ROIs
            cell_mask = iscell == 1
            F_cells = F[cell_mask, :]
            Fneu_cells = Fneu[cell_mask, :]
            stat_cells = [s for i, s in enumerate(stat) if cell_mask[i]]
            logger.info(
                f"Filtered to {len(stat_cells)} accepted cells "
                f"for timecourse.mat (from {len(stat)} total ROIs)"
            )

            # Step 4: Create visualization ROIs
            arrays = []
            for i, s in enumerate(stat):
                if roi_thr_bool:
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
                else:
                    # Use all pixels (match suite2p_roi behavior)
                    array = ROI(
                        ypix=s["ypix"],
                        xpix=s["xpix"],
                        lam=s["lam"],
                        med=s["med"],
                        do_crop=False,
                    ).to_array(Ly=Ly, Lx=Lx)
                    array *= i + 1
                    arrays.append(array)

            im = np.stack(arrays)
            im[im == 0] = np.nan
            im -= 1

        else:
            logger.warning("No ROIs detected in the data")

    finally:
        # Clean up Suite2p binary file if needed
        reg_file = ops.get("reg_file")
        if reg_file and os.path.exists(reg_file):
            try:
                os.remove(reg_file)
                logger.info(f"Cleaned up temporary binary file: {reg_file}")
            except Exception as e:
                logger.warning(f"Could not remove binary file {reg_file}: {e}")

    # Create cell and non-cell ROI images (match suite2p_roi.py behavior)
    n_rois = np.sum(iscell == 1)
    n_noncell_rois = np.sum(iscell == 0)

    logger.info(f"Accepted cells: {n_rois}, Rejected: {n_noncell_rois}")

    cell_roi = (
        np.nanmax(im[iscell != 0], axis=0)
        if len(im) > 0 and np.any(iscell != 0)
        else empty_roi
    )
    non_cell_roi = (
        np.nanmax(im[iscell == 0], axis=0)
        if len(im) > 0 and np.any(iscell == 0)
        else empty_roi
    )

    # Step 5: Convert Suite2p outputs to ExpDB .mat files
    # Creates timecourse.mat and cellmask.mat for analyze_stats pipeline
    # The normalization applied here is equivalent to CaImAn's AY calculation:
    # - CaImAn: AY = (A_normalized^T) @ Yr, where A_normalized = A / sqrt(sum(A^2))
    # - Suite2p: timecourse = F_corrected / sqrt(sum(lam^2))
    # Both produce (T, n_cells) fluorescence traces normalized by ROI energy
    logger.info("Converting Suite2p outputs to ExpDB format...")

    if len(stat) > 0:
        # Create normalized timecourse (Suite2p-specific transformation)
        timecourse = create_normalized_timecourse(
            F=F_cells,
            Fneu=Fneu_cells,
            stat=stat_cells,
            neucoeff=neucoeff,
            normalize=normalize_by_energy,
        )

        # Create sparse cellmask (Suite2p-specific transformation)
        cellmask = stat_to_cellmask(stat_cells, Ly, Lx)

        # Save timecourse.mat with validation
        timecourse_path = save_timecourse_mat(
            timecourse_data=timecourse,
            output_dir=output_dir,
            exp_id=exp_id,
            field_name="timecourse",
            validate=validate_outputs,
        )
        logger.info(f"Created timecourse: {timecourse_path}")

        # Save cellmask.mat with validation
        cellmask_path = save_cellmask_mat(
            cellmask_data=cellmask,
            output_dir=output_dir,
            exp_id=exp_id,
            field_name="cellmask",
            validate=validate_outputs,
        )
        logger.info(f"Created cellmask: {cellmask_path}")

        # Prepare auxiliary data (Yr and C_or)
        Yr = None
        C_or = None

        if create_Yr:
            # Create Yr.mat - reshape image stack to (pixels, T)
            logger.info("Creating Yr array...")
            n_pixels = Ly * Lx
            Yr = image_stack.astype(np.float32).reshape(T, n_pixels, order="F").T

        if create_C_or:
            # C_or is the neuropil-corrected but not energy-normalized traces
            # Keep in (n_cells, T) format for consistency with CaImAn
            Fneu_mean = np.mean(Fneu_cells, axis=1, keepdims=True)
            C_or = (F_cells - neucoeff * Fneu_cells) + Fneu_mean

        # Save auxiliary .mat files (Yr.mat and C_or.mat) with validation
        if Yr is not None or C_or is not None:
            save_auxiliary_mats(
                output_dir=output_dir,
                exp_id=exp_id,
                Yr=Yr,
                C_or=C_or,
                validate=validate_outputs,
            )
            if Yr is not None:
                logger.info("Created Yr.mat")
            if C_or is not None:
                logger.info("Created C_or.mat")

    else:
        # No ROIs detected - create empty files
        logger.warning("No ROIs detected - skipping .mat file creation")
        raise ValueError("Suite2p detected no ROIs. Cannot proceed with analysis.")

    # Step 6: Get summary images from ops (computed by io.tiff_to_binary)
    # These are computed from the motion-corrected images during tiff_to_binary
    mean_img = ops.get("meanImg")
    max_proj = ops.get("max_proj")
    Vcorr = ops.get("Vcorr")  # correlation image
    if Vcorr is not None:
        Vcorr[np.isnan(Vcorr)] = 0  # Handle NaN values before uint8 conversion

    nwbfile_out = {}

    # Add ROI metadata (match caiman_preprocessing)
    roi_list = []
    for i, s in enumerate(stat):
        roi_mask = ROI(
            ypix=s["ypix"],
            xpix=s["xpix"],
            lam=s["lam"],
            med=s["med"],
            do_crop=False,
        ).to_array(Ly=Ly, Lx=Lx)
        kargs = {
            "image_mask": roi_mask,
            "accepted": bool(iscell[i] == 1),
            "rejected": bool(iscell[i] == 0),
        }
        roi_list.append(kargs)

    nwbfile_out[NWBDATASET.ROI] = {function_id: {"roi_list": roi_list}}
    nwbfile_out[NWBDATASET.POSTPROCESS] = {
        function_id: {
            "all_roi_img": im,
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
                "region": list(range(len(F))),
                "name": "Fluorescence",
                "data": F.T,  # Transpose to (T, n_rois)
                "unit": "lumens",
            }
        }
    }

    # Step 7: Prepare output dictionary
    # Include trial structure if it exists
    processed_data_paths = [timecourse_path]
    if trialstructure_path is not None:
        processed_data_paths.append(trialstructure_path)

    info = {
        "processed_data": ExpDbData(processed_data_paths),
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
        # "edit_roi_data": EditRoiData(images=image_stack, im=im),
        "nwbfile": nwbfile_out,
    }

    logger.info("Suite2p preprocessing completed successfully")
    logger.info(f"Detected {n_rois} cells, {n_noncell_rois} non-cells")

    return info
