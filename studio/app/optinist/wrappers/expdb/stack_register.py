import numpy as np

from studio.app.optinist.wrappers.expdb.dft_registration import (
    dft_registration,
    dft_registration_nD,
)
from studio.app.optinist.wrappers.expdb.stack_average import stack_average


def stack_register(stack: np.ndarray, target: np.ndarray, usfac: int):
    """
    Fourier-domain subpixel 2d rigid body registration.

    Parameters
    ----------
    stack : ndarray
        3d array containing stack to register
    target : ndarray
        2d array
    usfac : int
        upsampling factor

    Returns
    -------
    ndarray
        outs(:,0): correlation coefficients
        outs(:,1): global phase difference between images
                (should be zero if images real and non-negative).
        outs(:,2) is net row shift
        outs(:,3) is net column shift
    """
    from numpy.fft import fft2, ifft2

    target = fft2(target.astype(np.float32))
    nframes = stack.shape[-1]
    outs = np.empty((nframes, 4))

    for i in range(nframes):
        slice_ = fft2(stack[:, :, i].astype(np.float32))
        error, diffphase, row_shift, col_shift, greg = dft_registration(
            target, slice_, usfac
        )
        outs[i, :] = [error, diffphase, row_shift, col_shift]

        if greg is not None:
            stack[:, :, i] = np.abs(ifft2(greg)).astype(stack.dtype)

    return outs, stack


def translate_stack(stack: np.ndarray, y: int, x: int, z: int):
    ny, nx, nz = stack.shape

    out = np.zeros(stack.shape)
    xmin = max(1, x + 1)
    xmax = min(nx + x, nx)
    ymin = max(1, y + 1)
    ymax = min(ny + y, ny)
    zmin = max(1, z + 1)
    zmax = min(nz + z, nz)

    out[ymin - 1 : ymax, xmin - 1 : xmax, zmin - 1 : zmax] = stack[
        ymin - 1 - y : ymax - y, xmin - 1 - x : xmax - x, zmin - 1 - z : zmax - z
    ]

    return out


def stack_register_3d(
    stack: np.ndarray,
    target: np.ndarray,
    le: int,
    shift_method: str,
):
    """
    DFT-based xy registration of 3D stacks
    assuming rigid body translation, it calculates xy shift from
    representative three planes around the center and shift entire stack.

    Parameters
    ----------
    stack : ndarray
        xyz time course 4-D data
    target : ndarray
        average xyz 3-D data
    le : int
        if LE is 1, LE version (default 0)
        LE version does not correct Z shift
        if LE is 2, XY alignment is done in each depth, independently
        if Z correction needed,use LE=0
    shift_method: str
        'circ' circular shift
        'zero' shift and pad by zero

    Returns
    -------
    ndarray
        outs(:,0): correlation coefficients
        outs(:,1): global phase difference between images
                (should be zero if images real and non-negative).
        outs(:,2) is net row shift
        outs(:,3) is net column shift
    ndarray
        registered stack
    """
    from numpy.fft import fftn, ifftn

    # reshape stack to handle 3d (y, x, z, t)
    if stack.ndim < 4:  # (y, x, t)
        stack = np.expand_dims(stack, axis=2)

    ny, nx, nz, nframes = stack.shape

    if le == 2 and nz > 1:
        result_params = []
        for z in range(nz):
            realign_params, stack[:, :, z, :] = stack_register(
                stack[:, :, z, :],
                stack_average(stack[:, :, z, :], period=1),
                usfac=100,
            )
            # insert shifts
            result_params.extend(realign_params[:, 2:4])
        return np.array(result_params, dtype=np.int64), stack

    if le == 1 and nz > 2:
        z_center = int(np.round(nz / 2))
        plane_index = np.arange(z_center)
    else:
        plane_index = np.arange(nz)

    target = fftn(target[:, :, plane_index].astype(np.float32))
    result_params = np.zeros((nframes, 3))

    for i in range(nframes):
        original = np.squeeze(stack[:, :, :, i])
        source = original[:, :, plane_index]
        f_stack = fftn(source.astype(np.float32))
        ref_v = ifftn(target * np.conj(f_stack))
        loc = np.unravel_index(np.argmax(np.abs(ref_v)), ref_v.shape)
        loc_row, loc_col = loc[:2]

        rd_2 = int(np.fix(ny / 2))
        cd_2 = int(np.fix(nx / 2))

        row_shift = loc_row - ny if loc_row > rd_2 else loc_row
        col_shift = loc_col - nx if loc_col > cd_2 else loc_col

        if shift_method == "circ":
            stack[:, :, :, i] = np.roll(original, [row_shift, col_shift, 0])
        else:
            stack[:, :, :, i] = translate_stack(original, row_shift, col_shift, 0)

        result_params[i, :] = [row_shift, col_shift, 0]

    return result_params, stack


def stack_register_nD(stack: np.ndarray, target: np.ndarray):
    """
    Based on DFTREGISTRATION by Manuel Guizar
    Extended to n-dimension by Kenichi Ohki  2011.7.8.
    """
    from numpy.fft import fftn

    target_dim = target.shape
    stack_dim = stack.shape
    target = fftn(target.astype(np.float32))
    outstack = np.zeros(stack_dim)

    dim_diff = stack.ndim - target.ndim
    assert dim_diff in [0, 1], "mismatch of stack and target dimension"

    if dim_diff == 1:
        nframes = stack_dim[-1]
        # reshape stack to handle n-dimension
        reshaped_stack = stack.reshape(np.prod(target_dim), nframes)
        outs = np.zeros((nframes, target.ndim + 2))

        for i in range(nframes):
            slice_ = reshaped_stack[:, i].reshape(target_dim)
            source = fftn(slice_.astype(np.float32))
            # outs is (error, diffphase, shift)
            outs[i, :] = dft_registration_nD(target, source)
            # roll with shift
            outstack[:, :, i] = np.roll(slice_, outs[i, 2])

    elif dim_diff == 0:
        source = fftn(stack.astype(np.float32))
        # outs is (error, diffphase, shift)
        outs = tuple(dft_registration_nD(target, source))
        # roll with shift
        outstack = np.roll(stack, outs[2])

    return outs, outstack
