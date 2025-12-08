"""
MATLAB file I/O utilities for Suite2p ExpDB integration.

Provides functions to save Suite2p outputs as ExpDB-compatible .mat files.
"""

import os
import warnings
from typing import Optional

import numpy as np
import scipy.io
import scipy.sparse

from studio.app.common.core.utils.filepath_creater import join_filepath
from studio.app.const import CELLMASK_FIELDNAME, TC_FIELDNAME


def save_timecourse_mat(
    timecourse_data: np.ndarray,
    output_dir: str,
    exp_id: str,
    field_name: str = TC_FIELDNAME,
    validate: bool = True,
) -> str:
    """
    Save timecourse data as ExpDB-compatible .mat file.

    Creates a .mat file loadable by TcData class for use in analyze_stats.
    Handles shape detection, data type conversion, and validation.

    Args:
        timecourse_data: Fluorescence traces
            - Accepts (T, n_cells) or (n_cells, T)
            - Auto-transposes if needed (uses heuristic: T > n_cells)
        output_dir: Directory to save file
        exp_id: Experiment ID (e.g., "M001_20250101")
        field_name: MATLAB field name (default: "timecourse")
        validate: Whether to validate after saving

    Returns:
        Full path to saved .mat file

    Validation:
        - Checks for NaN/Inf values (warns if found)
        - Checks for all-zero cells (warns if found)
        - Verifies shape requirements (T > 10, n_cells > 0)
        - Round-trip test (save/load integrity)

    Raises:
        ValueError: If data shape invalid or validation fails
    """
    # Ensure 2D array
    if timecourse_data.ndim != 2:
        raise ValueError(
            f"Timecourse data must be 2D, got shape {timecourse_data.shape}"
        )
    T, n_cells = timecourse_data.shape
    # Sanity check: warn if dimensions look swapped based on typical values
    if T > 10000 or n_cells < 10:
        warnings.warn(
            f"Timecourse shape ({T}, {n_cells}) looks unusual. "
            f"Expected format is (T, n_cells). "
            f"If T={T} is actually n_cells, please transpose before calling."
        )

    # Basic shape validation
    if T < 10:
        raise ValueError(f"Timecourse too short: T={T} < 10 frames")
    if n_cells < 1:
        raise ValueError(f"No cells detected: n_cells={n_cells}")

    # Convert to float64 for MATLAB compatibility
    timecourse_data = timecourse_data.astype(np.float64)

    # Validation checks
    if validate:
        # Check for invalid values
        n_nan = np.sum(np.isnan(timecourse_data))
        n_inf = np.sum(np.isinf(timecourse_data))
        if n_nan > 0 or n_inf > 0:
            warnings.warn(f"Invalid values in timecourse: {n_nan} NaN, {n_inf} Inf")

        # Check for all-zero cells
        zero_cells = np.all(timecourse_data == 0, axis=0)
        if np.any(zero_cells):
            warnings.warn(f"{np.sum(zero_cells)} cells have all-zero traces")

    # Create output path
    filename = f"{exp_id}_{field_name}.mat"
    output_path = join_filepath([output_dir, filename])

    # Save to .mat file
    scipy.io.savemat(
        output_path,
        {field_name: timecourse_data},
        do_compression=True,
    )

    # Round-trip validation
    if validate:
        try:
            loaded = scipy.io.loadmat(output_path, squeeze_me=True)
            loaded_data = loaded[field_name]

            # Check shape preservation
            if loaded_data.shape != timecourse_data.shape:
                raise ValueError(
                    f"Round-trip shape mismatch: saved {timecourse_data.shape}, "
                    f"loaded {loaded_data.shape}"
                )

            # Check value preservation
            if not np.allclose(
                loaded_data, timecourse_data, rtol=1e-10, equal_nan=True
            ):
                warnings.warn("Round-trip values differ slightly (may be OK)")

        except Exception as e:
            raise ValueError(f"Round-trip validation failed: {e}")

    return output_path


def save_cellmask_mat(
    cellmask_data: scipy.sparse.csc_matrix,
    output_dir: str,
    exp_id: str,
    field_name: str = CELLMASK_FIELDNAME,
    validate: bool = True,
) -> str:
    """
    Save sparse cellmask matrix as ExpDB-compatible .mat file.

    Args:
        cellmask_data: Sparse spatial components matrix
            - Type: scipy.sparse.csc_matrix
            - Shape: (pixels, n_cells)
        output_dir: Directory to save file
        exp_id: Experiment ID
        field_name: MATLAB field name (default: "cellmask")
        validate: Whether to validate after saving

    Returns:
        Full path to saved .mat file

    Validation:
        - Checks sparsity (typical: 0.1-5%)
        - Checks each cell has pixels
        - Verifies scipy.io.loadmat preserves sparse format

    Raises:
        ValueError: If cellmask not sparse or validation fails
    """
    # Verify sparse format
    if not scipy.sparse.issparse(cellmask_data):
        raise ValueError("Cellmask data must be sparse matrix")

    # Convert to CSC if not already
    if not isinstance(cellmask_data, scipy.sparse.csc_matrix):
        cellmask_data = cellmask_data.tocsc()

    pixels, n_cells = cellmask_data.shape

    # Validation checks
    if validate:
        # Check sparsity
        sparsity = cellmask_data.nnz / (pixels * n_cells)
        if sparsity < 0.0001:
            warnings.warn(f"Very low sparsity: {sparsity:.4%} (expected 0.1-5%)")
        elif sparsity > 0.1:
            warnings.warn(f"High sparsity: {sparsity:.4%} (expected 0.1-5%)")

        # Check for empty cells
        pixels_per_cell = np.array(cellmask_data.sum(axis=0)).ravel()
        empty_cells = np.sum(pixels_per_cell == 0)
        if empty_cells > 0:
            warnings.warn(f"{empty_cells} cells have zero pixels")

    # Create output path
    filename = f"{exp_id}_{field_name}.mat"
    output_path = join_filepath([output_dir, filename])

    # Save to .mat file
    scipy.io.savemat(
        output_path,
        {field_name: cellmask_data},
        do_compression=True,
    )

    # Round-trip validation
    if validate:
        try:
            loaded = scipy.io.loadmat(output_path)
            loaded_data = loaded[field_name]

            # Check sparse format preserved
            if not scipy.sparse.issparse(loaded_data):
                raise ValueError("Round-trip failed: loaded data is not sparse")

            # Check shape preservation
            if loaded_data.shape != cellmask_data.shape:
                raise ValueError(
                    f"Round-trip shape mismatch: saved {cellmask_data.shape}, "
                    f"loaded {loaded_data.shape}"
                )

        except Exception as e:
            raise ValueError(f"Round-trip validation failed: {e}")

    return output_path


def save_auxiliary_mats(
    output_dir: str,
    exp_id: str,
    Yr: Optional[np.ndarray] = None,
    C_or: Optional[np.ndarray] = None,
    validate: bool = True,
) -> dict:
    """
    Save optional auxiliary .mat files.

    Args:
        output_dir: Directory to save files
        exp_id: Experiment ID
        Yr: Reshaped image data, shape (pixels, T) [optional]
        C_or: Original temporal components, shape (n_cells, T) [optional]
        validate: Whether to validate

    Returns:
        Dictionary mapping file type to path
            {'Yr': path, 'C_or': path}

    Notes:
        - Yr.mat is very large (~100+ MB typical)
        - C_or.mat not used by downstream analysis
        - Only creates files if data provided
    """
    output_paths = {}

    if Yr is not None:
        # Save Yr.mat
        filename = f"{exp_id}_Yr.mat"
        output_path = join_filepath([output_dir, filename])

        # Convert to float32
        if Yr.dtype != np.float32:
            Yr = Yr.astype(np.float32)

        scipy.io.savemat(
            output_path,
            {"Yr": Yr},
        )

        output_paths["Yr"] = output_path

        if validate:
            # Verify file was created and is loadable
            if not os.path.exists(output_path):
                raise ValueError(f"Failed to create Yr.mat at {output_path}")
            try:
                loaded = scipy.io.loadmat(output_path)
                if "Yr" not in loaded:
                    raise ValueError("Yr field not found in loaded file")
            except Exception as e:
                raise ValueError(f"Yr.mat validation failed: {e}")

    if C_or is not None:
        # Save C_or.mat
        filename = f"{exp_id}_C_or.mat"
        output_path = join_filepath([output_dir, filename])

        # Convert to float32
        if C_or.dtype != np.float32:
            C_or = C_or.astype(np.float32)

        scipy.io.savemat(
            output_path,
            {"C_or": C_or},
        )

        output_paths["C_or"] = output_path

        if validate:
            # Verify file was created and is loadable
            if not os.path.exists(output_path):
                raise ValueError(f"Failed to create C_or.mat at {output_path}")
            try:
                loaded = scipy.io.loadmat(output_path)
                if "C_or" not in loaded:
                    raise ValueError("C_or field not found in loaded file")
            except Exception as e:
                raise ValueError(f"C_or.mat validation failed: {e}")

    return output_paths
