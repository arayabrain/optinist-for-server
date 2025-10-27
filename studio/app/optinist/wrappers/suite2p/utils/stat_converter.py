"""
Suite2p to ExpDB data format conversion utilities.

Provides mathematical transformations to convert Suite2p outputs into
ExpDB-compatible formats, maintaining equivalence with CaImAn's AY calculation.
"""

import warnings
from typing import Optional

import numpy as np
import scipy.sparse

from studio.app.optinist.wrappers.optinist.utils import (
    save_cellmask_mat,
    save_timecourse_mat,
)


def stat_to_cellmask(
    stat: list,
    Ly: int,
    Lx: int,
) -> scipy.sparse.csc_matrix:
    """
    Convert Suite2p stat to CaImAn-style sparse cellmask matrix.

    Converts pixel lists (ypix, xpix, lam) to sparse matrix where
    each column represents one cell's spatial footprint.

    Args:
        stat: List of Suite2p ROI statistics, each containing:
            - 'ypix': Y coordinates of pixels in ROI
            - 'xpix': X coordinates of pixels in ROI
            - 'lam': Weight/lambda value for each pixel
        Ly: Image height (pixels)
        Lx: Image width (pixels)

    Returns:
        scipy.sparse.csc_matrix of shape (pixels, n_cells)
            - pixels = Ly x Lx (flattened image)
            - Each column is one cell's spatial footprint

    """
    n_cells = len(stat)
    n_pixels = Ly * Lx

    # Build sparse matrix using COOrdinate format
    data = []
    row_ind = []
    col_ind = []

    for cell_idx, s in enumerate(stat):
        ypix = np.array(s["ypix"])
        xpix = np.array(s["xpix"])
        lam = np.array(s["lam"])

        linear_indices = xpix * Ly + ypix

        data.extend(lam)
        row_ind.extend(linear_indices)
        col_ind.extend([cell_idx] * len(lam))

    # Create COOrdinate matrix and convert to CSC (column-sparse)
    cellmask = scipy.sparse.coo_matrix(
        (data, (row_ind, col_ind)), shape=(n_pixels, n_cells)
    )

    return cellmask.tocsc()


def create_normalized_timecourse(
    F: np.ndarray,
    Fneu: np.ndarray,
    stat: list,
    neucoeff: float = 0.7,
    normalize: bool = True,
) -> np.ndarray:
    """
    Create AY-equivalent normalized timecourse from Suite2p outputs.

    Applies neuropil correction (with mean addition) and energy
    normalization to match CaImAn's AY calculation.

    Args:
        F: Fluorescence traces (n_cells, T)
        Fneu: Neuropil traces (n_cells, T)
        stat: Suite2p ROI statistics (for lam weights)
        neucoeff: Neuropil correction coefficient (default: 0.7)
        normalize: Whether to normalize by ROI energy (default: True)

    Returns:
        Normalized timecourse, shape (T, n_cells) in ExpDB format

    Algorithm:
        1. Neuropil correction:
           F_corrected = (F - neucoeff * Fneu) + mean(Fneu, axis=1)
           Note: Mean addition prevents negative values

        2. Energy normalization (if enabled):
           roi_energy = sqrt(sum(lam^2)) for each ROI
           timecourse = F_corrected / roi_energy

        3. Transpose to ExpDB format:
           (n_cells, T) → (T, n_cells)

    Mathematical Equivalence:
        With normalize=True, output approximates CaImAn's:
            AY = (A_normalized^T) @ Yr
        where A_normalized = A / ||A||_2
    """
    # Validate inputs
    if F.shape != Fneu.shape:
        raise ValueError(
            f"F and Fneu must have same shape, got {F.shape} and {Fneu.shape}"
        )

    n_cells, T = F.shape

    if len(stat) != n_cells:
        raise ValueError(
            f"Number of ROIs in stat ({len(stat)}) doesn't match F ({n_cells})"
        )

    # Step 1: Neuropil correction (with mean addition)
    # This prevents negative values and preserves baseline fluorescence
    Fneu_mean = np.mean(Fneu, axis=1, keepdims=True)
    F_corrected = (F - neucoeff * Fneu) + Fneu_mean

    # Step 2: Energy normalization (optional)
    if normalize:
        # Calculate ROI energy (L2 norm of pixel weights)
        roi_energy = np.array([np.sqrt(np.sum(s["lam"] ** 2)) for s in stat])

        # Avoid division by zero
        roi_energy[roi_energy == 0] = 1.0

        # Normalize each trace by its ROI energy
        timecourse = F_corrected / roi_energy[:, np.newaxis]
    else:
        timecourse = F_corrected

    # Step 3: Transpose to ExpDB format (T, n_cells)
    timecourse = timecourse.T

    return timecourse


def convert_suite2p_to_expdb_mats(
    F: np.ndarray,
    Fneu: np.ndarray,
    stat: list,
    Ly: int,
    Lx: int,
    output_dir: str,
    exp_id: str,
    params: Optional[dict] = None,
    validate: bool = True,
) -> dict:
    """
    Convert Suite2p outputs to all required ExpDB .mat files.

    Main conversion pipeline that coordinates all transformations
    and file generation.

    Args:
        F: Fluorescence traces (n_cells, T)
        Fneu: Neuropil traces (n_cells, T)
        stat: List of ROI statistics
        Ly: Image height (pixels)
        Lx: Image width (pixels)
        output_dir: Output directory
        exp_id: Experiment ID
        params: Parameters (optional), containing:
            - neucoeff: Neuropil correction coefficient (default: 0.7)
            - normalize_by_energy: Apply energy normalization (default: True)
            - create_C_or: Create C_or.mat file (default: False)
            - validate_outputs: Validate created files (default: True)
        validate: Whether to validate outputs

    Returns:
        Dictionary of created file paths:
            {
                'timecourse': path,
                'cellmask': path,
                'C_or': path [optional]
            }

    Processing Steps:
        1. Extract parameters
        2. Apply neuropil correction
        3. Normalize by ROI energy (if enabled)
        4. Create sparse cellmask from stat
        5. Save all .mat files
        6. Validate outputs (if enabled)
    """
    # Default parameters
    if params is None:
        params = {}

    neucoeff = params.get("neucoeff", 0.7)
    normalize_by_energy = params.get("normalize_by_energy", True)
    create_C_or = params.get("create_C_or", False)
    validate_outputs = params.get("validate_outputs", True) and validate

    output_paths = {}

    # Step 1: Create normalized timecourse
    timecourse = create_normalized_timecourse(
        F=F,
        Fneu=Fneu,
        stat=stat,
        neucoeff=neucoeff,
        normalize=normalize_by_energy,
    )

    # Step 2: Create sparse cellmask
    cellmask = stat_to_cellmask(stat, Ly, Lx)

    # Step 3: Save timecourse.mat
    timecourse_path = save_timecourse_mat(
        timecourse_data=timecourse,
        output_dir=output_dir,
        exp_id=exp_id,
        validate=validate_outputs,
    )
    output_paths["timecourse"] = timecourse_path

    # Step 4: Save cellmask.mat
    cellmask_path = save_cellmask_mat(
        cellmask_data=cellmask,
        output_dir=output_dir,
        exp_id=exp_id,
        validate=validate_outputs,
    )
    output_paths["cellmask"] = cellmask_path

    # Step 5: Save optional C_or.mat (archive of neuropil-corrected traces)
    if create_C_or:
        # C_or is the neuropil-corrected but not energy-normalized traces
        # Keep in (n_cells, T) format for consistency with CaImAn
        Fneu_mean = np.mean(Fneu, axis=1, keepdims=True)
        C_or_data = (F - neucoeff * Fneu) + Fneu_mean

        # Save C_or.mat directly
        import scipy.io

        from studio.app.common.core.utils.filepath_creater import join_filepath

        c_or_path = join_filepath([output_dir, f"{exp_id}_C_or.mat"])
        scipy.io.savemat(c_or_path, {"C_or": C_or_data})
        output_paths["C_or"] = c_or_path

    # Cross-validation
    if validate_outputs:
        # Check consistency
        n_cells_tc = timecourse.shape[1]
        n_cells_cm = cellmask.shape[1]
        n_cells_stat = len(stat)

        if not (n_cells_tc == n_cells_cm == n_cells_stat):
            warnings.warn(
                f"Cell count mismatch: timecourse={n_cells_tc}, "
                f"cellmask={n_cells_cm}, stat={n_cells_stat}"
            )

    return output_paths
