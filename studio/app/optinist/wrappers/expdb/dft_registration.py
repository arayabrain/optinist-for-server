import numpy as np


# NOTE: still in progress
def dft_ups(inp: np.ndarray, nor=None, noc=None, usfac=1, roff=0, coff=0):
    """
    Upsampled DFT by matrix multiplies,
    can compute an upsampled DFT in just a small region.
    Receives DC in upper left corner, image center must be in (1,1)
    Manuel Guizar - Dec 13, 2007
    Modified from dftus, by J.R. Fienup 7/31/06
    This code is intended to provide the same result as if
    the following operations were performed

    - Embed the array "in" in an array that is usfac times larger in each dimension.
        ifftshift to bring the center of the image to (1,1).
    - Take the FFT of the larger array
    - Extract an [nor, noc] region of the result.
        Starting with the  [roff+1 coff+1] element.

    It achieves this result by computing the DFT in the output array
    without the need to zeropad.
    Much faster and memory efficient than the zero-padded FFT approach
    if [nor noc] are much smaller than [nr*usfac nc*usfac]

    Parameters
    ----------
    inp: ndarray
        input array
    usfac: int
        Upsampling factot
    nor, noc: int
        Number of pixels in the output upsampled DFT,
        in units of upsampled pixels (default = size(in))
    roff, coff: int
        Row and column offsets,
        allow to shift the output array to a region of interest on the DFT
    """
    from numpy.fft import ifftshift

    nr, nc = inp.shape

    if nor is None:
        nor = nr
    if noc is None:
        noc = nc

    # Compute kernels and obtain DFT by matrix products
    kern_row = np.outer(
        (np.arange(nor) - roff),
        (ifftshift(np.arange(nr) - np.floor(nr / 2)) * 2 * np.pi / (nr * usfac)),
    )
    kern_col = np.outer(
        (ifftshift(np.arange(nc)) - int(np.floor(nc / 2))),
        (np.arange(noc) - coff) * 2 * np.pi / (nc * usfac),
    )

    return np.exp(kern_row * (-1j)) @ inp @ np.exp(kern_col * (-1j))


def dft_registration(buf1ft: np.ndarray, buf2ft: np.ndarray, usfac: int):
    """
    Efficient subpixel image registration by crosscorrelation. This code
    gives the same precision as the FFT upsampled cross correlation in a
    small fraction of the computation time and with reduced memory
    requirements. It obtains an initial estimate of the crosscorrelation peak
    by an FFT and then refines the shift estimation by upsampling the DFT
    only in a small neighborhood of that estimate by means of a
    matrix-multiply DFT. With this procedure all the image points are used to
    compute the upsampled crosscorrelation.
    Manuel Guizar - Dec 13, 2007
    Portions of this code were taken from code written by Ann M. Kowalczyk
    and James R. Fienup.
    J.R. Fienup and A.M. Kowalczyk, "Phase retrieval for a complex-valued
    object by using a low-resolution image," J. Opt. Soc. Am. A 7, 450-458
    (1990).
    Citation for this algorithm:
    Manuel Guizar-Sicairos, Samuel T. Thurman, and James R. Fienup,
    "Efficient subpixel image registration algorithms," Opt. Lett. 33,
    156-158 (2008).

    change log
    09/04/17 VB replaced abs(a).^2 with a.*conj(a)
            computer as 'single' if inputs are 'single'

    Parameters
    ----------
    buf1ft: ndarray
        Fourier transform of reference image, DC in (1,1)   [DO NOT FFTSHIFT]
    buf2ft: ndarray
        Fourier transform of image to register, DC in (1,1) [DO NOT FFTSHIFT]
    usfac: int
        Upsampling factor. Images will be registered to within 1/usfac of a pixel.
        For example usfac = 20 means the images will be registered
        within1/20 of a pixel. (default = 1)

    Returns
    -------
    error: float
        Translation invariant normalized RMS error between f and g
    diffphase: float
        Global phase difference between the two images
        (should be zero if images are non-negative).
    net_row_shift, net_col_shift: int
        Pixel shifts between images
    g_reg: ndarray, (Optional)
        Fourier transform of registered version of buf2ft,
        the global phase difference is compensated for.

    """
    from numpy import ceil, conj, exp, fix, meshgrid, pi
    from numpy.fft import fftshift, ifft2, ifftshift

    if usfac == 0:
        cc_max = np.sum(buf1ft * conj(buf2ft))
        rfzero = np.sum(buf1ft.flatten() * conj(buf1ft.flatten()))
        rgzero = np.sum(buf2ft.flatten() * conj(buf2ft.flatten()))
        error = 1.0 - cc_max * conj(cc_max) / (rgzero * rfzero)
        error = np.sqrt(np.abs(error))
        diffphase = np.arctan2(np.imag(cc_max), np.real(cc_max))
        row_shift = None
        col_shift = None

    elif usfac == 1:
        m, n = buf1ft.shape
        cc = ifft2(buf1ft * conj(buf2ft))
        loc_1 = np.argmax(cc, axis=0)
        loc_2 = np.argmax(np.max(cc, axis=0))
        loc_row = loc_1[loc_2]
        loc_col = loc_2
        cc_max = cc[loc_row, loc_col]

        rfzero = np.sum(buf1ft.flatten() * conj(buf1ft.flatten())) / (m * n)
        rgzero = np.sum(buf2ft.flatten() * conj(buf2ft.flatten())) / (m * n)
        error = np.sqrt(np.abs(1.0 - cc_max * conj(cc_max) / (rgzero * rfzero)))
        diffphase = np.arctan2(np.imag(cc_max), np.real(cc_max))

        row_shift = loc_row - m if loc_row > fix(m / 2) else loc_row
        col_shift = loc_col - n if loc_col > fix(n / 2) else loc_col

    else:
        m, n = buf1ft.shape
        m_large = m * 2
        n_large = n * 2
        cc = np.zeros((m_large, n_large), dtype=buf1ft.dtype)
        cc[
            m - int(fix(m / 2)) : m + int(fix((m - 1) / 2)) + 1,
            n - int(fix(n / 2)) : n + int(fix((n - 1) / 2)) + 1,
        ] = fftshift(buf1ft) * conj(fftshift(buf2ft))

        cc = ifft2(ifftshift(cc))
        loc_1 = np.argmax(cc, axis=0)
        loc_2 = np.argmax(np.max(cc, axis=0))
        loc_row = loc_1[loc_2]
        loc_col = loc_2
        cc_max = cc[loc_row, loc_col]

        m, n = cc.shape
        md2 = fix(m / 2)
        nd2 = fix(n / 2)
        row_shift = loc_row - m if loc_row > md2 else loc_row
        col_shift = loc_col - n if loc_col > nd2 else loc_col
        row_shift /= 2
        col_shift /= 2

        if usfac > 2:
            row_shift = round(row_shift * usfac) / usfac
            col_shift = round(col_shift * usfac) / usfac
            dftshift = fix(ceil(usfac * 1.5) / 2)
            cc = conj(
                dft_ups(
                    buf2ft * conj(buf1ft),
                    ceil(usfac * 1.5),
                    ceil(usfac * 1.5),
                    usfac,
                    dftshift - row_shift * usfac,
                    dftshift - col_shift * usfac,
                )
            ) / (md2 * nd2 * usfac**2)
            loc_1 = np.argmax(cc, axis=0)
            loc_2 = np.argmax(np.max(cc, axis=0))
            loc_row = loc_1[loc_2]
            loc_col = loc_2
            cc_max = cc[loc_row, loc_col]

            rgzero = dft_ups(buf1ft * conj(buf1ft), 1, 1, usfac) / (
                md2 * nd2 * usfac**2
            )
            rfzero = dft_ups(buf2ft * conj(buf2ft), 1, 1, usfac) / (
                md2 * nd2 * usfac**2
            )
            loc_row = loc_row - dftshift
            loc_col = loc_col - dftshift
            row_shift = row_shift + loc_row / usfac
            col_shift = col_shift + loc_col / usfac

        else:
            rgzero = np.sum(buf1ft * conj(buf1ft)) / m / n
            rfzero = np.sum(buf2ft * conj(buf2ft)) / m / n

        error = np.sqrt(np.abs(1.0 - cc_max * conj(cc_max) / (rgzero * rfzero)))
        diffphase = np.arctan2(np.imag(cc_max), np.real(cc_max))

        if md2 == 1:
            row_shift = 0
        if nd2 == 1:
            col_shift = 0

    if usfac > 0:
        n_row, n_col = buf2ft.shape
        grid_col, grid_row = meshgrid(
            ifftshift(range(-int(fix(n_col / 2)), int(ceil(n_col / 2)))),
            ifftshift(range(-int(fix(n_row / 2)), int(ceil(n_row / 2)))),
        )
        g_reg = buf2ft * exp(
            1j * 2 * pi * (-row_shift * grid_row / n_row - col_shift * grid_col / n_col)
        )
        g_reg = g_reg * exp(1j * diffphase)

    elif usfac == 0:
        g_reg = buf2ft * exp(1j * diffphase)

    return np.squeeze(error), diffphase, row_shift, col_shift, g_reg


def dft_registration_nD(buf1ft: np.ndarray, buf2ft: np.ndarray):
    """
    Efficient subpixel image registration by crosscorrelation.
    This code gives the same precision as the FFT upsampled cross correlation
    in a small fraction of the computation time and with reduced memory requirements.
    It obtains an initial estimate of the crosscorrelation peak
    by an FFT and then refines the shift estimation by upsampling the DFT
    only in a small neighborhood of that estimate by means of a matrix-multiply DFT.
    With this procedure all the image points are used
    to compute the upsampled crosscorrelation.
    Manuel Guizar - Dec 13, 2007

    Portions of this code were taken from code written by Ann M. Kowalczyk
    and James R. Fienup.
    J.R. Fienup and A.M. Kowalczyk, "Phase retrieval for a complex-valued
    object by using a low-resolution image," J. Opt. Soc. Am. A 7, 450-458 (1990).

    Citation for this algorithm:
        Manuel Guizar-Sicairos, Samuel T. Thurman, and James R. Fienup,
        "Efficient subpixel image registration algorithms,"
        Opt. Lett. 33, 156-158 (2008).

    change log
    09/04/17 VB replaced abs(a).^2 with a.*conj(a)
                computer as 'single' if inputs are 'single'

    Parameters
    ----------
    buf1ft : ndarray
        Fourier transform of reference image, DC in (1,1) [DO NOT FFTSHIFT]
    buf2ft : ndarray
        Fourier transform of image to register, DC in (1,1) [DO NOT FFTSHIFT]

    Returns
    -------
    error : float
        Translation invariant normalized RMS error between f and g
    diffphase : float
        Global phase difference between the two images.
        Should be zero if images are non-negative.
    shift : tuple
        Pixel shifts between images

    """
    dim = buf1ft.shape

    cc = np.fft.ifftn(buf1ft * np.conj(buf2ft))
    cc_max = np.max(cc, axis=0)
    loc = np.unravel_index(
        np.argmax(cc), cc.shape
    )  # n-dimensional position of peak. loc[0],...,loc[n]

    # a.*conj(a) instead of abs(a).^2 because faster
    rfzero = np.sum(buf1ft * np.conj(buf1ft)) / np.prod(dim)
    rgzero = np.sum(buf2ft * np.conj(buf2ft)) / np.prod(dim)

    error = 1.0 - cc_max * np.conj(cc_max) / (rgzero * rfzero)
    error = np.sqrt(np.abs(error))
    diffphase = np.arctan2(np.imag(cc_max), np.real(cc_max))
    shift = np.array(loc)

    for d in range(len(dim)):
        if shift[d] > np.floor(dim[d] / 2):
            shift[d] = shift[d] - dim[d]

    return error, diffphase, shift
