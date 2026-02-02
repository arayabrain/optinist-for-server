"""
ROI Utilities

Generic ROI processing functions that work with both CaImAn and Suite2p.
These functions only use numpy, scipy, and scikit-image
"""

import numpy as np


def get_roi(A, roi_thr, thr_method, swap_dim, dims):
    """
    Extract ROI masks from sparse matrix representation.

    This is a generic function that works with sparse matrices from any source
    (CaImAn, Suite2p, etc.). It extracts ROI contours based on energy thresholds.

    Args:
        A: Sparse matrix (scipy.sparse) of shape (d, nr) where:
           - d = number of pixels (Ly * Lx)
           - nr = number of ROIs
        roi_thr: Threshold for ROI contour detection (0-1)
        thr_method: Thresholding ('nrg' for energy-based, other for max-based)
        swap_dim: Whether to use C-order (True) or F-order (False) for reshaping
        dims: Tuple of image dimensions (Ly, Lx)

    Returns:
        List of 2D arrays, one per ROI, with ROI masks
    """
    from scipy.ndimage import binary_fill_holes
    from skimage.measure import find_contours

    d, nr = np.shape(A)

    # for each patches
    ims = []
    coordinates = []
    for i in range(nr):
        pars = dict()
        # we compute the cumulative sum of the energy of the Ath component
        # that has been ordered from least to highest
        patch_data = A.data[A.indptr[i] : A.indptr[i + 1]]
        idx = np.argsort(patch_data)[::-1]

        if thr_method == "nrg":
            cumEn = np.cumsum(patch_data[idx] ** 2)
            if len(cumEn) == 0:
                pars = dict(
                    coordinates=np.array([]),
                    CoM=np.array([np.NaN, np.NaN]),
                    neuron_id=i + 1,
                )
                coordinates.append(pars)
                continue
            else:
                # we work with normalized values
                cumEn /= cumEn[-1]
                Bvec = np.ones(d)
                # we put it in a similar matrix
                Bvec[A.indices[A.indptr[i] : A.indptr[i + 1]][idx]] = cumEn
        else:
            Bvec = np.zeros(d)
            Bvec[A.indices[A.indptr[i] : A.indptr[i + 1]]] = (
                patch_data / patch_data.max()
            )

        if swap_dim:
            Bmat = np.reshape(Bvec, dims, order="C")
        else:
            Bmat = np.reshape(Bvec, dims, order="F")

        r_mask = np.zeros_like(Bmat, dtype="bool")
        contour = find_contours(Bmat, roi_thr)
        for c in contour:
            r_mask[np.round(c[:, 0]).astype("int"), np.round(c[:, 1]).astype("int")] = 1

        # Fill in the hole created by the contour boundary
        r_mask = binary_fill_holes(r_mask)
        ims.append(r_mask + (i * r_mask))

    return ims
