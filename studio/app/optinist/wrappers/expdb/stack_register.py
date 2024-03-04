import numpy as np
from studio.app.optinist.wrappers.expdb.dft_registration import dft_registration_nD


def stack_register(stack, target, us_fac=100):
    """
    Fourier-domain subpixel 2d rigid body registration.

    Parameters
    ----------
    stack : ndarray
        3d array containing stack to register
    target : ndarray
        2d array

    Returns
    -------
    ndarray
        outs(:,0): correlation coefficients
        outs(:,1): global phase difference between images
                (should be zero if images real and non-negative).
        outs(:,2) is net row shift
        outs(:,3) is net column shift
    """
    from scipy.fftpack import fft2, ifft2

    target_after_fft = fft2(target.astype(np.float32))
    ny, nx, nframes = stack.shape
    outs = np.zeros((nframes, 4))

    for i in range(nframes):
        slice_ = fft2(stack[:, :, i].astype(np.float32))
        outs[i, :], temp = dft_registration_nD(target_after_fft, slice_, us_fac)

        stack[:, :, i] = np.abs(ifft2(temp)).astype(stack.dtype)

    return outs, stack


def stack_register_3d(stack, target, le, shift_method):
    """ """
    pass


def stack_register_nD(stack, target):
    """
    Based on DFTREGISTRATION by Manuel Guizar
    Extended to n-dimension by Kenichi Ohki  2011.7.8.
    """
    from scipy.fftpack import fftn

    target_after_fft = fftn(target.astype(np.float32))
    stack_dim = stack.shape
    target_dim = target.shape
    outstack = np.zeros(stack_dim)

    dim_diff = len(stack_dim) - len(target_dim)
    assert dim_diff in [0, 1], "mismatch of stack and target dimension"

    if dim_diff == 1:
        nframes = stack_dim[-1]
        # reshape stack to handle n-dimension
        reshaped_stack = stack.reshape(np.prod(target_dim), nframes)
        outs = np.zeros((nframes, len(target_dim) + 2))

        for i in range(nframes):
            slice_ = reshaped_stack[:, i].reshape(target_dim)
            source = fftn(slice_.astype(np.float32))
            # outs is (error, diffphase, shift)
            outs[i, :] = dft_registration_nD(target_after_fft, source)
            # roll with shift
            outstack[:, :, i] = np.roll(slice_, outs[i, 2])

    elif dim_diff == 0:
        source = fftn(stack.astype(np.float32))
        # outs is (error, diffphase, shift)
        outs = dft_registration_nD(target_after_fft, source)
        # roll with shift
        outstack = np.roll(stack, outs[2])

    return outs, outstack
