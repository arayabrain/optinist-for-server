from dataclasses import dataclass

import numpy as np
import tifffile

from studio.app.common.core.utils.filepath_creater import join_filepath
from studio.app.common.dataclass.image import ImageData
from studio.app.optinist.dataclass.expdb import ExpDbData
from studio.app.optinist.wrappers.expdb.stack_average import stack_average


@dataclass
class MapParams:
    th: np.array = None
    mag: np.array = None
    ave_change: np.array = None
    max_change: np.array = None
    tune: np.array = None


def sort_stim(
    stack: np.ndarray,
    stim_log_input: list,
    nframes_per_stim,
    nstim_per_run: int,
    Nrep: int,
) -> None:
    """
    Based on Ohki Lab's MATLAB code sortStim.m.
    Sorting of stacks by stimulus order.
    Used to analyze experiments in which the order of application
    of visual stimuli was randomized (TS.fragRandomize = 1).

    Note:
    - For memory efficiency, the image stack of input args (ndarray)
    is updated directly (mutable).
        (The size of the stack is expected to be several GB.)
    """

    dim = stack.shape
    ndim = stack.ndim

    # TODO: test for 2D pattern
    if ndim == 2:
        stack_sorted = stack.reshape(
            dim[0], nframes_per_stim, nstim_per_run, Nrep, order="F"
        )

        stim_log = np.array(stim_log_input)
        stim_log = stim_log.reshape(nstim_per_run, Nrep, order="F")
        stim_sort_inds = np.argsort(stim_log, axis=0)

        for n in range(Nrep):
            stack_sorted[:, :, :, n] = stack_sorted[:, :, stim_sort_inds[:, n], n]

        stack_result = stack_sorted.reshape(
            dim[0], (nframes_per_stim * nstim_per_run * Nrep), order="F"
        )

    # elseif ndim == 3:
    if ndim == 3:
        stack_sorted = stack.reshape(
            dim[0], dim[1], nframes_per_stim, nstim_per_run, Nrep, order="F"
        )

        stim_log = np.array(stim_log_input)
        stim_log = stim_log.reshape(nstim_per_run, Nrep, order="F")
        stim_sort_inds = np.argsort(stim_log, axis=0)

        for n in range(Nrep):
            stack_sorted[:, :, :, :, n] = stack_sorted[:, :, :, stim_sort_inds[:, n], n]

        stack_result = stack_sorted.reshape(
            dim[0], dim[1], (nframes_per_stim * nstim_per_run * Nrep), order="F"
        )

    # TODO: test for 4D pattern
    elif ndim == 4:
        stack_sorted = stack.reshape(
            dim[0], dim[1], dim[2], nframes_per_stim, nstim_per_run, Nrep, order="F"
        )

        stim_log = np.array(stim_log_input)
        stim_log = stim_log.reshape(nstim_per_run, Nrep, order="F")
        stim_sort_inds = np.argsort(stim_log, axis=0)

        for n in range(Nrep):
            stack_sorted[:, :, :, :, :, n] = stack_sorted[
                :, :, :, :, stim_sort_inds[:, n], n
            ]

        stack_result = stack_sorted.reshape(
            dim[0], dim[1], dim[2], (nframes_per_stim * nstim_per_run * Nrep), order="F"
        )

    return stack_result


def generate_gaussian_filter(kernel_size: int, sigma: int) -> np.ndarray:
    """
    Generate gaussian filter
    """

    from scipy.signal import gaussian

    # 標準偏差がsigmaの1次元ガウシアンフィルター
    kernel_1d = gaussian(kernel_size, sigma)

    # 1次元フィルターから2次元ガウシアンフィルターを生成
    gaussian_kernel = np.outer(kernel_1d, kernel_1d)

    # 正規化（合計が1になるように）
    gaussian_kernel /= gaussian_kernel.sum()

    return gaussian_kernel


def filter2_nd(filter: np.ndarray, stack: np.ndarray, mode: str = "same") -> np.ndarray:
    """
    Based on Ohki Lab's MATLAB code filter2n.m.
    """
    from scipy.signal import convolve2d

    stack_dim = stack.shape
    assert stack.ndim in [2, 3], "stack should be 2d or 3d"

    # Note: MATLABとPythonの各conv2d処理では、フィルターを適用する中心点が異なることから
    # （1行1列分ずれている）、Python版では modeを"full"とし、
    # その後中心点を補正（Crop）する処理を実施する。
    mode = "full" if mode == "same" else mode

    # stack: (y, x, t) or (y, x, z, t)
    n = np.prod(stack_dim[2:])
    reshaped_stack = stack.reshape((stack_dim[0], stack_dim[1], n), order="F")
    filtered_stack = np.zeros((stack_dim[0], stack_dim[1], n))

    for i in range(n):
        # 中心点を調整（MATLAB形式に合わせるため、1行1列分をシフト）
        filtered_plane = convolve2d(
            reshaped_stack[:, :, i], np.rot90(filter), mode=mode
        )
        filtered_plane = filtered_plane[1 : stack_dim[0] + 1, 1 : stack_dim[1] + 1]

        # stackへ格納
        filtered_stack[:, :, i] = filtered_plane

    result_stack = filtered_stack.reshape(stack_dim, order="F")

    # returns a copied ndarray from input ndarray.
    return result_stack


def calc_F(
    ave: np.ndarray, stim_inds: list, nframes_per_stim: int, nstim_per_run: int
) -> np.ndarray:
    """
    Based on Ohki Lab's MATLAB code calc_F.m.
    calculate images to each stimulation
    stim_inds specify activation frames in one trial. e.g. [5:9].
    one trial starts from frame 1 and end at frame 'nframes_per_stim'.
    nframes_per_stim: number of frames in one trial (=stimulation).
    nstim_per_run: number of stims in one run.
    """

    dim = ave.shape
    ndim = ave.ndim

    # TODO: test for 4D pattern
    if ndim == 4:
        temp = np.reshape(ave, (*dim[:3], nframes_per_stim, nstim_per_run), order="F")
        dir_F = np.squeeze(np.mean(temp[:, :, :, stim_inds, :], (ndim - 1)))
    else:
        temp = np.reshape(ave, (*dim[:2], nframes_per_stim, nstim_per_run), order="F")
        dir_F = np.squeeze(np.mean(temp[:, :, stim_inds, :], (ndim - 1)))

    # returns a copied ndarray from input ndarray.
    return dir_F


def calc_dF(
    dir_F: np.ndarray,
    bases: np.ndarray,
    sp_filter: np.ndarray,
    use_eachbase: bool = False,
) -> list:
    """
    Based on Ohki Lab's MATLAB code calc_dF.m.
    calculate dF images (and their smoothed images) to each direction.
    """

    dim = dir_F.shape
    ndim = dir_F.ndim
    ndir = dim[-1]

    base = np.mean(bases, ndim - 1)

    # TODO: test for 4D pattern
    if ndim == 4:
        if use_eachbase:
            dir_dF = dir_F - bases
        else:
            # transpose to appropriate shape for numpy array
            base_tile = np.tile(base, (ndir, 1, 1, 1)).transpose(1, 2, 0)
            dir_dF = dir_F - base_tile

        dir_dF_sm = filter2_nd(sp_filter, dir_dF)

    else:
        if use_eachbase:
            dir_dF = dir_F - bases
        else:
            # transpose to appropriate shape for numpy array
            base_tile = np.tile(base, (ndir, 1, 1)).transpose(1, 2, 0)
            dir_dF = dir_F - base_tile

        dir_dF_sm = filter2_nd(sp_filter, dir_dF)

    # returns a copied ndarray from input ndarray.
    return [dir_dF.copy(), dir_dF_sm.copy()]


def calc_ratio_change(
    dir_dF_sm: np.ndarray, bases_sm: np.ndarray, use_eachbase: bool = False
) -> np.ndarray:
    """
    Based on Ohki Lab's MATLAB code calc_ratio_change.m.
    calculate dF/F images to each direction and orientation.
    """

    dim = dir_dF_sm.shape
    ndim = dir_dF_sm.ndim
    ndir = dim[-1]

    bases_sm = np.mean(bases_sm, ndim - 1)

    # TODO: test for 4D pattern
    if ndim == 4:
        if use_eachbase:
            dir_ratio = dir_dF_sm / bases_sm
        else:
            # transpose to appropriate shape for numpy array
            base_sm_tile = np.tile(bases_sm, (ndir, 1, 1, 1)).transpose(1, 2, 0)
            dir_ratio = dir_dF_sm / base_sm_tile

    else:
        if use_eachbase:
            dir_ratio = dir_dF_sm / bases_sm
        else:
            # transpose to appropriate shape for numpy array
            base_sm_tile = np.tile(bases_sm, (ndir, 1, 1)).transpose(1, 2, 0)
            dir_ratio = dir_dF_sm / base_sm_tile

    # returns a copied ndarray from input ndarray.
    return dir_ratio.copy()


def calc_ori_dF(dir_dF: np.ndarray) -> np.ndarray:
    """
    Based on Ohki Lab's MATLAB code calc_ori_dF.m.
    """
    dim = dir_dF.shape
    ndim = dir_dF.ndim
    ndir = dim[-1]
    nori = int(ndir / 2)

    ori_dF = np.squeeze(
        np.mean(dir_dF.reshape(*dim[: (ndim - 1)], nori, 2, order="F"), ndim)
    )

    # returns a copied ndarray from input ndarray.
    return ori_dF


def calc_map_params_fast2D(dir: np.ndarray) -> MapParams:
    """
    Based on Ohki Lab's MATLAB code calc_map_params_fast2D.m.
    a set of parameters of direction (orientation) selectivity are obtained
    by vector averaging.
    th: preferred angle obtained by vector averaging, normalized to 0-1.
    mag: vector magnitude
    ave_change: average signal change to all directions
    max_change: max signal change to any directions
    tune: vector sum / scalar sum of signal changes to all directions,
    according to Bonhoeffer et al. (1995)
    this function can be used to estimate parameters
    of both orientation & direction selectivity.
    if input is dF, mag, ave_change and max_change will be absolute change.
    if input is ratio, mag, ave_change and max_change will be ratio change.
    th & tune will be the same, regardless the input is dF or ratio.
    when the signal change to one direction is negative, it is replaced by zero,
    because tune becomes strange.
    thus, tune parameter is between 0 and 1.
    """

    dim = dir.shape
    ndim = dir.ndim
    ndir = dim[-1]

    params = MapParams()

    if ndim == 4:
        params.th = np.zeros(dim[:3])
        params.mag = np.zeros(dim[:3])
        params.ave_change = np.zeros(dim[:3])
        params.max_change = np.zeros(dim[:3])
        params.tune = np.zeros(dim[:3])
    else:
        params.th = np.zeros(dim[:2])
        params.mag = np.zeros(dim[:2])
        params.ave_change = np.zeros(dim[:2])
        params.max_change = np.zeros(dim[:2])
        params.tune = np.zeros(dim[:2])

    a = np.zeros((ndir, 1))

    # TODO: test for 4D pattern
    if ndim == 4:
        for x in range(dim[0]):
            for y in range(dim[1]):
                for z in range(dim[2]):
                    Vx = 0
                    Vy = 0
                    sum = 0

                    # vector averageing
                    for i in range(ndir):
                        if dir[x, y, z, i] < 0:
                            a[i] = 0
                        else:
                            a[i] = dir[x, y, z, i].copy()  # explicitly copy.

                        Vx = Vx + a[i] * np.cos(2 * i * np.pi / ndir)
                        Vy = Vy + a[i] * np.sin(2 * i * np.pi / ndir)
                        sum = sum + a[i]

                    params.th[x, y, z] = np.arctan2(Vx, Vy)
                    params.mag[x, y, z] = np.sqrt(Vx**2 + Vy**2)
                    params.ave_change[x, y, z] = sum / ndir
                    params.max_change[x, y, z] = np.max(a)

                    if sum > 0:
                        params.tune[x, y, z] = params.mag[x, y, z] / sum
                    else:
                        params.tune[x, y, z] = 0

    else:
        Vx = np.zeros(dim[:2])
        Vy = np.zeros(dim[:2])
        sum = np.zeros(dim[:2])
        a = np.zeros(dim[:3])

        # vector averageing
        for i in range(ndir):
            temp = dir[:, :, i].copy()  # explicitly copy.
            temp[dir[:, :, i] < 0] = 0
            a[:, :, i] = temp
            Vx = Vx + a[:, :, i] * np.cos(2 * i * np.pi / ndir)
            Vy = Vy + a[:, :, i] * np.sin(2 * i * np.pi / ndir)
            sum = sum + a[:, :, i]

        params.th = np.arctan2(Vx, Vy)
        params.mag = np.sqrt(Vx**2 + Vy**2)
        params.ave_change = sum / ndir
        params.max_change = np.max(a, axis=2)
        params.tune = np.zeros(dim[0:2])
        params.tune[sum != 0] = params.mag[sum != 0] / sum[sum != 0]

    params.th = params.th / np.pi / 2 + 0.5  # normalize to 0-1.

    return params


def writetiff8(
    image: np.ndarray,
    output_dir: str,
    fname: str,
    normalize: bool = True,
) -> None:
    """
    Based on Ohki Lab's MATLAB code writetiff8.m.
    write an image (or volume) as a 8bit tif
    map 0-1 in original image to 0-255, with and without normalization
    Kenichi Ohki
    """

    if normalize:
        image = image / np.max(image[:])

    tifffile.imwrite(
        join_filepath([output_dir, f"{fname}.tif"]),
        (image * 255).astype(np.uint8),
    )


def hsv2rgbKO_fast2D(hueKO_stack: np.array) -> np.ndarray:
    """
    Based on Ohki Lab's MATLAB code hsv2rgbKO_fast2D.m.
    """
    import matplotlib.colors as mcolors

    hueKO_stack_copy = hueKO_stack.copy()
    h_temp = hueKO_stack_copy[:, :, 0]

    h_temp[h_temp < 0] = 0
    h_temp[h_temp > 1] = 1
    h_temp = h_temp * 2 / 3
    h_temp[h_temp > (1 / 3)] = h_temp[h_temp > (1 / 3)] * 2 - 1 / 3
    hueKO_stack_copy[:, :, 0] = h_temp

    rgb = mcolors.hsv_to_rgb(hueKO_stack_copy)

    return rgb


def write_dF_images(
    dir_dF_sm: np.ndarray,
    dir_ratio: np.ndarray,
    output_dir: str,
    prefix: str,
) -> list:
    """
    Based on Ohki Lab's MATLAB code write_dF_images.m.
    write dF images & ratio change images as tif files
    auto scaled between zero and max value
    """
    ndir = dir_dF_sm.shape[-1]
    max_dir_dF = np.max(dir_dF_sm[:])
    max_dir_ratio_change = np.max(dir_ratio[:])

    # TODO: test for 4D pattern
    if dir_dF_sm.ndim == 4:
        for i in range(ndir):
            image_no = i + 1
            writetiff8(
                dir_dF_sm[:, :, :, i] / max_dir_dF,
                output_dir,
                f"{prefix}_dF_{image_no}",
            )
            writetiff8(
                dir_ratio[:, :, :, i] / max_dir_ratio_change,
                output_dir,
                f"{prefix}_ratio_{image_no}",
            )

    else:
        for i in range(ndir):
            image_no = i + 1
            writetiff8(
                dir_dF_sm[:, :, i] / max_dir_dF,
                output_dir,
                f"{prefix}_dF_{image_no}",
            )
            writetiff8(
                dir_ratio[:, :, i] / max_dir_ratio_change,
                output_dir,
                f"{prefix}_ratio_{image_no}",
            )

    return [max_dir_dF, max_dir_ratio_change]


def write_intensity_maps(
    params: np.ndarray,
    output_dir: str,
    prefix: str,
    max: float,
) -> None:
    """
    Based on Ohki Lab's MATLAB code write_intensity_maps.m.
    write selectivity parameter images as tif files
    auto scaled between zero and max value (for mag, ave_change, max_change)
    tune is between 0-1, without normalization.
    """

    writetiff8(params.mag / max, output_dir, f"{prefix}_mag")
    writetiff8(params.ave_change / max, output_dir, f"{prefix}_ave_change")
    writetiff8(params.max_change / max, output_dir, f"{prefix}_max_change")
    writetiff8(params.tune, output_dir, f"{prefix}_tune")


def write_angle_map_fast2D(th: np.ndarray, output_dir: str, prefix: str) -> np.ndarray:
    """
    Based on Ohki Lab's MATLAB code write_angle_map_fast2D.m.
    """
    dim = th.shape

    th_map = np.ones((dim[0], dim[1], 3))
    th_map[:, :, 0] = th.copy()  # explicitly copy
    angle = np.zeros((dim[0], dim[1], 3))

    angle = hsv2rgbKO_fast2D(th_map)

    writetiff8(angle, output_dir, f"{prefix}_angle")

    return angle


def write_polar_map_fast2D(
    params: np.ndarray,
    output_dir: str,
    prefix: str,
    max: float,
) -> np.ndarray:
    """
    Based on Ohki Lab's MATLAB code write_polar_map_fast2D.m.
    hue: preferred angle
    intenisity: vector magnitude
    polar_hc: high contrast polar map
    """

    dim = params.th.T.shape

    seed = np.ones((dim[0], dim[1], 3))
    seed[:, :, 0] = params.th.copy()  # explicitly copy
    seed_hc = seed.copy()

    m1 = params.mag / max
    m2 = params.mag * 2 / max
    m1[m1 > 1] = 1
    m2[m2 > 1] = 1

    seed[:, :, 2] = m1
    seed_hc[:, :, 2] = m2

    polar = hsv2rgbKO_fast2D(seed)
    polar_hc = hsv2rgbKO_fast2D(seed_hc)

    writetiff8(polar, output_dir, f"{prefix}_polar")
    writetiff8(polar_hc, output_dir, f"{prefix}_polar_hc")

    return polar


def write_HLS_map_fast2D(
    params: np.ndarray,
    output_dir: str,
    prefix: str,
    max: float,
    tune_max: float,
) -> np.ndarray:
    """
    Based on Ohki Lab's MATLAB code write_HLS_map_fast2D.m.
    hue: preferred angle
    intenisity: max_change
    saturation: tune (0-tune_max)
    HLS_hc: high contrast HLS map
    """
    dim = params.th.T.shape

    HLS = np.zeros((dim[0], dim[1], 3))
    HLS_hc = np.zeros((dim[0], dim[1], 3))

    m1 = params.mag / max
    m2 = params.mag * 2 / max
    m1[m1 > 1] = 1
    m2[m2 > 1] = 1

    seed = np.ones((dim[0], dim[1], 3))
    seed[:, :, 0] = params.th.copy()  # explicitly copy
    seed[:, :, 1] = params.tune / tune_max
    seed_hc = seed.copy()

    seed[:, :, 2] = m1
    seed_hc[:, :, 2] = m2

    HLS = hsv2rgbKO_fast2D(seed)
    HLS_hc = hsv2rgbKO_fast2D(seed_hc)

    writetiff8(HLS, output_dir, f"{prefix}_HLS")
    writetiff8(HLS_hc, output_dir, f"{prefix}_HLS_hc")

    return HLS


def save_mat(k: str, v: np.ndarray, output_dir: str) -> None:
    import scipy.io as sio

    sio.savemat(join_filepath([output_dir, f"{k}.mat"]), {k: v})


def get_orimap(
    stack: ImageData,
    expdb: ExpDbData,
    output_dir: str,
    params: dict = None,
    **kwargs,
) -> None:
    """
    Based on Ohki Lab's MATLAB code scriptGetOrimap.m.
    """
    ts = expdb.ts
    assert ts is not None, "ts should not be None"

    exp_id = params.get("exp_id", "")
    # channel = params.get("channel")
    # nbinning = params.get("nbinning")
    lowpass = params.get("lowpass")
    kernel_size = params.get("kernel_size")
    tune_max = params.get("tune_max")

    # spatial lowpass filter in pixel unit (after binning)
    sp_filter = generate_gaussian_filter(kernel_size, lowpass)

    stack = stack.data  # (t, y, x) or (t, z, y, x)
    assert stack.ndim in [3, 4], "raw_stack should be 3d or 4d"

    if stack.ndim == 3:
        stack = stack.transpose(1, 2, 0)  # (y, x, t)
    elif stack.ndim == 4:
        # TODO: test for 4D pattern
        stack = stack.transpose(2, 3, 1, 0)  # (y, x, z, t)

    stack = sort_stim(
        stack,
        ts.stim_log,
        ts.nframes_per_stim,
        ts.nstim_per_run if ts.has_base else ts.nstim_per_trial,
        ts.ntrials,
    )

    run_inds = np.arange(ts.ntrials)

    # sort randomized sequence
    ave = stack_average(stack, ts.nframes_per_trial, run_inds)
    del stack

    if not ts.has_base:
        ave = ave[:, :, 0 : ts.nframes_per_trial]

    assert ave.ndim <= 4, "too many dimensions"
    save_mat("ave", ave, output_dir)

    fov = np.sum(ave, ave.ndim - 1)
    writetiff8(fov, output_dir, f"{exp_id}_FOV")
    save_mat(f"{exp_id}_FOV", fov, output_dir)
    del fov

    base_inds = np.arange(
        (ts.nframes_base - (1 * int(ts.framerate)) - 2), ts.nframes_base
    )
    bases = calc_F(ave, base_inds, ts.nframes_per_stim, ts.nstim_per_run)
    bases_sm = filter2_nd(sp_filter, bases)
    save_mat("bases", bases, output_dir)
    save_mat("bases_sm", bases_sm, output_dir)

    stim_inds = np.arange(ts.nframes_base, ts.nframes_per_stim)
    dir_F = calc_F(ave, stim_inds, ts.nframes_per_stim, ts.nstim_per_run)
    dir_dF, dir_dF_sm = calc_dF(dir_F, bases, sp_filter)
    save_mat("dir_F", dir_F, output_dir)
    save_mat("dir_dF", dir_dF, output_dir)
    save_mat("dir_dF_sm", dir_dF_sm, output_dir)

    dir_ratio = calc_ratio_change(dir_dF_sm, bases_sm)
    save_mat("dir_ratio", dir_ratio, output_dir)
    del bases, bases_sm, base_inds, ave, stim_inds, dir_F

    max_dir_dF, max_dir_ratio_change = write_dF_images(
        dir_dF_sm, dir_ratio, output_dir, f"{exp_id}_dir"
    )

    dir_dF_params = calc_map_params_fast2D(dir_dF_sm)
    dir_ratio_params = calc_map_params_fast2D(dir_ratio)
    save_mat("dir_dF_params", dir_dF_params, output_dir)
    save_mat("dir_ratio_params", dir_ratio_params, output_dir)
    write_intensity_maps(dir_dF_params, output_dir, f"{exp_id}_dir_dF", max_dir_dF)
    write_intensity_maps(
        dir_ratio_params, output_dir, f"{exp_id}_dir_ratio", max_dir_ratio_change
    )

    dir_angle = write_angle_map_fast2D(dir_dF_params.th, output_dir, f"{exp_id}_dir")
    dir_dF_polar = write_polar_map_fast2D(
        dir_dF_params, output_dir, f"{exp_id}_dir_dF_polar", max_dir_dF
    )
    dir_ratio_polar = write_polar_map_fast2D(
        dir_ratio_params, output_dir, f"{exp_id}_dir_ratio_polar", max_dir_ratio_change
    )
    save_mat("dir_angle", dir_angle, output_dir)
    save_mat("dir_dF_polar", dir_dF_polar, output_dir)
    save_mat("dir_ratio_polar", dir_ratio_polar, output_dir)
    del dir_angle, dir_dF_polar, dir_ratio_polar

    dir_dF_HLS = write_HLS_map_fast2D(
        dir_dF_params, output_dir, f"{exp_id}_dir_dF", max_dir_dF, tune_max
    )
    dir_ratio_HLS = write_HLS_map_fast2D(
        dir_ratio_params,
        output_dir,
        f"{exp_id}_dir_ratio",
        max_dir_ratio_change,
        tune_max,
    )
    save_mat("dir_dF_HLS", dir_dF_HLS, output_dir)
    save_mat("dir_ratio_HLS", dir_ratio_HLS, output_dir)
    del (
        max_dir_dF,
        max_dir_ratio_change,
        dir_dF_params,
        dir_ratio_params,
        dir_dF_HLS,
        dir_ratio_HLS,
    )

    dir_ratio_hc = np.maximum(
        dir_ratio / (np.mean(dir_ratio[:]) + (3 * np.std(dir_ratio[:]))), 0
    )
    for n in range(dir_ratio_hc.shape[2]):
        writetiff8(dir_ratio_hc[:, :, n], output_dir, f"{exp_id}_dir_ratio_hc_{n}")

    ori_dF = calc_ori_dF(dir_dF)
    ori_dF_sm = calc_ori_dF(dir_dF_sm)
    ori_ratio = calc_ori_dF(dir_ratio)
    save_mat("ori_dF", ori_dF, output_dir)
    save_mat("ori_dF_sm", ori_dF_sm, output_dir)
    save_mat("ori_ratio", ori_ratio, output_dir)
    del dir_dF, dir_dF_sm, ori_dF, dir_ratio, dir_ratio_hc

    max_ori_dF, max_ori_ratio_change = write_dF_images(
        ori_dF_sm, ori_ratio, output_dir, f"{exp_id}_ori"
    )
    ori_dF_params = calc_map_params_fast2D(ori_dF_sm)
    ori_ratio_params = calc_map_params_fast2D(ori_ratio)
    write_intensity_maps(ori_dF_params, output_dir, f"{exp_id}_ori_dF", max_ori_dF)
    write_intensity_maps(
        ori_ratio_params, output_dir, f"{exp_id}_ori_ratio", max_ori_ratio_change
    )
    ori_angle = write_angle_map_fast2D(ori_dF_params.th, output_dir, f"{exp_id}_ori")
    save_mat("ori_angle", ori_angle, output_dir)
    ori_ratio_hc = np.maximum(
        ori_ratio / (np.mean(ori_ratio[:]) + (3 * np.std(ori_ratio[:]))), 0
    )
    for n in range(ori_ratio_hc.shape[2]):
        writetiff8(ori_ratio_hc[:, :, n], output_dir, f"{exp_id}_ori_ratio_hc_{n}")
    del ori_dF_sm, ori_angle, ori_ratio, ori_ratio_hc

    ori_dF_polar = write_polar_map_fast2D(
        ori_dF_params, output_dir, f"{exp_id}_ori_dF", max_ori_dF
    )
    ori_ratio_polar = write_polar_map_fast2D(
        ori_ratio_params, output_dir, f"{exp_id}_ori_ratio", max_ori_ratio_change
    )
    save_mat("ori_dF_polar", ori_dF_polar, output_dir)
    save_mat("ori_ratio_polar", ori_ratio_polar, output_dir)
    del ori_dF_polar, ori_ratio_polar

    ori_dF_HLS = write_HLS_map_fast2D(
        ori_dF_params, output_dir, f"{exp_id}_ori_dF", max_ori_dF, tune_max
    )
    ori_ratio_HLS = write_HLS_map_fast2D(
        ori_ratio_params,
        output_dir,
        f"{exp_id}_ori_ratio",
        max_ori_ratio_change,
        tune_max,
    )
    save_mat("ori_dF_HLS", ori_dF_HLS, output_dir)
    save_mat("ori_ratio_HLS", ori_ratio_HLS, output_dir)
    del (
        max_ori_dF,
        max_ori_ratio_change,
        ori_dF_params,
        ori_ratio_params,
        ori_dF_HLS,
        ori_ratio_HLS,
    )
