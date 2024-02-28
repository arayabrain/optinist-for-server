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


def stack_register_nD(stack, target):
    """
    Based on DFTREGISTRATION by Manuel Guizar
    Extended to n-dimension by Kenichi Ohki  2011.7.8.
    """
    from scipy.ndimage import shift
    from scipy.fftpack import fftn

    target_after_fft = fftn(target.astype(np.float32))
    dim = stack.shape
    dimension = len(dim)
    dimtarget = target.shape
    outstack = np.zeros(dim)

    if dimension - len(dimtarget) == 1:
        nframes = dim[-1]
        # reshape stack to handle n-dimension
        stack = stack.reshape(np.prod(dimtarget), nframes)

        outs = np.zeros((nframes, len(dimtarget) + 2))

        for i in range(nframes):
            slice_ = stack[:, i].reshape(dimtarget)
            source = fftn(slice_.astype(np.float32))
            outs[i, :] = dft_registration_nD(target_after_fft, source)

            outstack[:, :, i] = shift(slice_, outs[i, 2:])

    return outs, outstack
