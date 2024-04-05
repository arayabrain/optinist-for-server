import gc
import os
import shutil

import numpy as np
import scipy

from studio.app.common.core.utils.filepath_creater import join_filepath
from studio.app.common.dataclass import ImageData
from studio.app.const import TC_SUFFIX, TS_SUFFIX
from studio.app.dir_path import DIRPATH
from studio.app.optinist.core.nwb.nwb import NWBDATASET
from studio.app.optinist.dataclass import EditRoiData, FluoData, IscellData, RoiData
from studio.app.optinist.dataclass.expdb import ExpDbData


def get_roi(A, roi_thr, thr_method, swap_dim, dims):
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
        indx = np.argsort(patch_data)[::-1]

        if thr_method == "nrg":
            cumEn = np.cumsum(patch_data[indx] ** 2)
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
                Bvec[A.indices[A.indptr[i] : A.indptr[i + 1]][indx]] = cumEn
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


def util_recursive_flatten_params(params, result_params: dict, nest_counter=0):
    """
    Recursively flatten node parameters (operation for CaImAn CNMFParams)
    """
    # avoid infinite loops
    assert nest_counter <= 2, f"Nest depth overflow. [{nest_counter}]"
    nest_counter += 1

    for key, nested_param in params.items():
        if type(nested_param) is dict:
            util_recursive_flatten_params(nested_param, result_params, nest_counter)
        else:
            result_params[key] = nested_param


def mm_fun(A: np.ndarray, Y: np.ndarray) -> np.ndarray:
    """
    This code is a port of the CaImAn-MATLAB function (mm_fun.m).
    However, the porting is limited to the functions
    assumed to be used in this application.
    """

    # multiply A*Y or A'*Y or Y*A or Y*C' depending on the dimension for loaded
    # or memory mapped Y.

    (d1a, d2a) = A.shape[0:2]

    d1y = np.prod(Y.shape[0:-1])
    d2y = Y.shape[-1]

    if d1a == d1y:  # A'*Y
        AY = A.T @ Y
    elif d1a == d2y:
        AY = Y @ A
    elif d2a == d1y:
        AY = A @ Y
    elif d2a == d2y:  # Y*C'
        AY = Y.T @ A
    else:
        assert False, "matrix dimensions do not match"

    return AY


def calculate_AY(
    A_or: scipy.sparse.csc_matrix, C_or: np.ndarray, Yr: np.ndarray, stack_shape: list
) -> np.ndarray:
    A_or_full = A_or.toarray()
    A_or_full = np.reshape(
        A_or_full, (stack_shape[0], stack_shape[1], A_or_full.shape[1])
    )
    nA = np.asarray(np.sqrt(A_or.power(2).sum(axis=0))).ravel()
    K2 = C_or.shape[0]

    # normalize spatial components to unit energy
    nA_D = scipy.sparse.spdiags(nA, [0], K2, K2)
    A_or2 = A_or.dot(np.linalg.inv(nA_D.toarray()))

    # spdiags(nA,0,K,K)*C;
    # C_or2 = C_or * nA[:, np.newaxis]
    AY = mm_fun(A_or2, Yr)
    AY = AY.T

    return AY


def caiman_cnmf(
    images: ImageData, output_dir: str, params: dict = None, **kwargs
) -> dict(fluorescence=FluoData, iscell=IscellData, processed_data=ExpDbData):
    # TODO: Return expdb dataclass
    import scipy
    from caiman import local_correlations, stop_server
    from caiman.cluster import setup_cluster
    from caiman.mmapping import prepare_shape
    from caiman.paths import memmap_frames_filename
    from caiman.source_extraction.cnmf import cnmf
    from caiman.source_extraction.cnmf.params import CNMFParams

    function_id = output_dir.split("/")[-1]
    print("start caiman_cnmf:", function_id)

    # NOTE: evaluate_components requires cnn_model files in caiman_data directory.
    caiman_data_dir = os.path.join(os.path.expanduser("~"), "caiman_data")
    if not os.path.exists(caiman_data_dir):
        shutil.copytree(
            f"{DIRPATH.APP_DIR}/optinist/wrappers/caiman/caiman_data", caiman_data_dir
        )

    # flatten cmnf params segments.
    reshaped_params = {}
    util_recursive_flatten_params(params, reshaped_params)

    Ain = reshaped_params.pop("Ain", None)
    do_refit = reshaped_params.pop("do_refit", None)
    roi_thr = reshaped_params.pop("roi_thr", None)

    file_path = images.path
    if isinstance(file_path, list):
        file_path = file_path[0]

    image_path = images.path[0] if isinstance(images.path, list) else images.path
    exp_id = "_".join(os.path.basename(image_path).split("_")[:2])
    images = images.data

    # np.arrayをmmapへ変換
    order = "C"
    dims = images.shape[1:]
    T = images.shape[0]
    shape_mov = (np.prod(dims), T)

    dir_path = join_filepath(file_path.split("/")[:-1])
    basename = file_path.split("/")[-1]
    fname_tot = memmap_frames_filename(basename, dims, T, order)

    mmap_images = np.memmap(
        join_filepath([dir_path, fname_tot]),
        mode="w+",
        dtype=np.float32,
        shape=prepare_shape(shape_mov),
        order=order,
    )

    mmap_images = np.reshape(mmap_images.T, [T] + list(dims), order="F")
    mmap_images[:] = images[:]

    del images
    gc.collect()

    nwbfile = kwargs.get("nwbfile", {})
    fr = nwbfile.get("imaging_plane", {}).get("imaging_rate", 30)
    # Get physical size (µm/pixel)
    pixels = nwbfile.get("device", {}).get("metadata", {}).get("Pixels", {})
    physical_size_x = pixels.get("PhysicalSizeX")
    physical_size_y = pixels.get("PhysicalSizeY")
    if physical_size_x is not None and physical_size_y is not None:
        EXPECTED_CELL_SIZE = 12.5 / 2  # Half size of neuron in µm
        gSig = [
            # cast to int because non-integer gSig would cause error.
            # https://github.com/flatironinstitute/CaImAn/issues/1072
            int(EXPECTED_CELL_SIZE / physical_size)
            for physical_size in [physical_size_y, physical_size_x]  # raw x col
        ]
        # FIXME: DEBUG用のため削除(SigKillでprintが出力されないため)
        with open(f"{output_dir}/gSig.txt", "w") as f:
            f.write(str(gSig))
        reshaped_params["gSig"] = gSig

    if reshaped_params is None:
        ops = CNMFParams()
    else:
        ops = CNMFParams(params_dict={**reshaped_params, "fr": fr})

    if "dview" in locals():
        stop_server(dview=dview)  # noqa: F821

    c, dview, n_processes = setup_cluster(
        backend="local", n_processes=None, single_thread=True
    )

    cnm = cnmf.CNMF(n_processes=n_processes, dview=dview, Ain=Ain, params=ops)
    cnm = cnm.fit(mmap_images)

    if do_refit:
        cnm = cnm.refit(mmap_images, dview=dview)

    cnm.estimates.evaluate_components(mmap_images, cnm.params, dview=dview)

    stop_server(dview=dview)

    Yr = mmap_images.reshape(dims[0] * dims[1], T, order="F")
    scipy.io.savemat(join_filepath([output_dir, "Yr.mat"]), {"Yr": Yr})
    AY = calculate_AY(cnm.estimates.A, cnm.estimates.C, Yr, dims)
    scipy.io.savemat(
        join_filepath([output_dir, "cellmask.mat"]), {"cellmask": cnm.estimates.A}
    )
    timecourse_path = join_filepath([output_dir, f"{exp_id}_{TC_SUFFIX}.mat"])
    trialstructure_path = join_filepath(
        [
            DIRPATH.EXPDB_DIR,
            exp_id.split("_")[0],
            exp_id,
            f"{exp_id}_{TS_SUFFIX}.mat",
        ]
    )
    scipy.io.savemat(timecourse_path, {"timecourse": AY})
    scipy.io.savemat(join_filepath([output_dir, "C_or.mat"]), {"C_or": cnm.estimates.C})

    # contours plot
    Cn = local_correlations(mmap_images.transpose(1, 2, 0))
    Cn[np.isnan(Cn)] = 0

    thr_method = "nrg"
    swap_dim = False

    idx_good = cnm.estimates.idx_components
    idx_bad = cnm.estimates.idx_components_bad
    if not isinstance(idx_good, list):
        idx_good = idx_good.tolist()
    if not isinstance(idx_bad, list):
        idx_bad = idx_bad.tolist()

    iscell = np.concatenate([np.ones(len(idx_good)), np.zeros(len(idx_bad))])

    cell_ims = get_roi(
        cnm.estimates.A[:, idx_good], roi_thr, thr_method, swap_dim, dims
    )
    cell_ims = np.stack(cell_ims).astype(float)
    cell_ims[cell_ims == 0] = np.nan
    cell_ims -= 1
    n_rois = len(cell_ims)

    if len(idx_bad) > 0:
        non_cell_ims = get_roi(
            cnm.estimates.A[:, idx_bad], roi_thr, thr_method, swap_dim, dims
        )
        non_cell_ims = np.stack(non_cell_ims).astype(float)
        for i, j in enumerate(range(n_rois, n_rois + len(non_cell_ims))):
            non_cell_ims[i, :] = np.where(non_cell_ims[i, :] != 0, j, 0)
        non_cell_roi = np.nanmax(non_cell_ims, axis=0).astype(float)
    else:
        non_cell_ims = np.zeros((0, *dims))
        non_cell_roi = np.zeros(dims)
        non_cell_roi[non_cell_roi == 0] = np.nan
    non_cell_ims[non_cell_ims == 0] = np.nan

    n_noncell_rois = len(non_cell_ims)

    im = np.vstack([cell_ims, non_cell_ims])

    # NWBの追加
    nwbfile = {}
    # NWBにROIを追加
    roi_list = []
    n_cells = cnm.estimates.A.shape[-1]
    for i in range(n_cells):
        kargs = {}
        kargs["image_mask"] = cnm.estimates.A.T[i].T.toarray().reshape(dims)
        if hasattr(cnm.estimates, "accepted_list"):
            kargs["accepted"] = i in cnm.estimates.accepted_list
        if hasattr(cnm.estimates, "rejected_list"):
            kargs["rejected"] = i in cnm.estimates.rejected_list
        roi_list.append(kargs)

    nwbfile[NWBDATASET.ROI] = {function_id: roi_list}
    nwbfile[NWBDATASET.POSTPROCESS] = {function_id: {"all_roi_img": im}}

    # iscellを追加
    nwbfile[NWBDATASET.COLUMN] = {
        function_id: {
            "name": "iscell",
            "description": "two columns - iscell & probcell",
            "data": iscell,
        }
    }

    # Fluorescence
    fluorescence = cnm.estimates.C

    nwbfile[NWBDATASET.FLUORESCENCE] = {
        function_id: {
            "Fluorescence": {
                "table_name": "ROIs",
                "region": list(range(n_rois + n_noncell_rois)),
                "name": "Fluorescence",
                "data": fluorescence.T,
                "unit": "lumens",
            }
        }
    }

    info = {
        "processed_data": ExpDbData([timecourse_path, trialstructure_path]),
        "images": ImageData(
            np.array(Cn * 255, dtype=np.uint8),
            output_dir=output_dir,
            file_name="images",
        ),
        "fluorescence": FluoData(fluorescence, file_name="fluorescence"),
        "iscell": IscellData(iscell, file_name="iscell"),
        "all_roi": RoiData(
            np.nanmax(im, axis=0), output_dir=output_dir, file_name="all_roi"
        ),
        "cell_roi": RoiData(
            np.nanmax(im[iscell != 0], axis=0),
            output_dir=output_dir,
            file_name="cell_roi",
        ),
        "non_cell_roi": RoiData(
            non_cell_roi, output_dir=output_dir, file_name="non_cell_roi"
        ),
        "edit_roi_data": EditRoiData(mmap_images, im),
        "nwbfile": nwbfile,
    }

    return info
