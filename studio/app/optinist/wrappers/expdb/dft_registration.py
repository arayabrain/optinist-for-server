import numpy as np


# NOTE: still in progress
def dft_ups(inp, nor=None, noc=None, usfac=1, roff=0, coff=0):
    """
    Upsampled DFT by matrix multiplies,
    can compute an upsampled DFT in just a small region.
    Recieves DC in upper left corner, image center must be in (1,1)
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
    usfac: int
        Upsampling factot
    nor, noc: int
        Number of pixels in the output upsampled DFT,
        in units of upsampled pixels (default = size(in))
    roff, coff: int
        Row and column offsets,
        allow to shift the output array to a region of interest on the DFT
    """
    nr, nc = inp.shape

    if nor is None:
        nor = nr
    if noc is None:
        noc = nc

    # Compute kernels and obtain DFT by matrix products
    kernc = np.exp(
        (-1j * 2 * np.pi / (nc * usfac))
        * (np.fft.ifftshift(np.arange(nc)) - np.floor(nc / 2))[:, None]
        * (np.arange(noc) - coff)
    )
    kernr = np.exp(
        (-1j * 2 * np.pi / (nr * usfac))
        * (np.arange(nor)[:, None] - roff)
        * (np.fft.ifftshift(np.arange(nr)) - np.floor(nr / 2))
    )
    out = np.dot(np.dot(kernr, inp), kernc)

    kernc2 = (
        (np.fft.ifftshift(np.arange(nc))[:, None] - np.floor(nc / 2))
        * (np.arange(noc) - coff)
        * 2
        * np.pi
        / (nc * usfac)
    )
    kernr2 = (
        (np.arange(nor)[:, None] - roff)
        * (np.fft.ifftshift(np.arange(nr)) - np.floor(nr / 2))
        * 2
        * np.pi
        / (nr * usfac)
    )
    out = np.exp(kernr2 * (-1j)) * inp * np.exp(kernc2 * (-1j))

    return out


def dft_registration(buf1ft, buf2ft, usfac=1):
    from scipy.fft import fftshift, ifftshift, ifft2
    from numpy import conj, exp, pi, meshgrid, fix, ceil

    c = buf1ft.dtype

    assert (
        c == np.float32 or c == np.float64
    ), "buf1ft should be of class single or double"

    if usfac == 0:
        CCmax = np.sum(buf1ft * conj(buf2ft))
        rfzero = np.sum(buf1ft.flatten() * conj(buf1ft.flatten()))
        rgzero = np.sum(buf2ft.flatten() * conj(buf2ft.flatten()))
        error = 1.0 - CCmax * conj(CCmax) / (rgzero * rfzero)
        error = np.sqrt(np.abs(error))
        diffphase = np.arctan2(np.imag(CCmax), np.real(CCmax))
        output = [error, diffphase]

    elif usfac == 1:
        m, n = buf1ft.shape
        CC = ifft2(buf1ft * conj(buf2ft))
        max1 = np.max(CC, axis=0)
        # max2 = np.max(max1)
        loc1 = np.argmax(CC, axis=0)
        loc2 = np.argmax(max1)
        rloc = loc1[loc2]
        cloc = loc2
        CCmax = CC[rloc, cloc]

        rfzero = np.sum(buf1ft.flatten() * conj(buf1ft.flatten())) / (m * n)
        rgzero = np.sum(buf2ft.flatten() * conj(buf2ft.flatten())) / (m * n)
        error = 1.0 - CCmax * conj(CCmax) / (rgzero * rfzero)
        error = np.sqrt(np.abs(error))
        diffphase = np.arctan2(np.imag(CCmax), np.real(CCmax))
        md2 = fix(m / 2)
        nd2 = fix(n / 2)
        row_shift = rloc - m - 1 if rloc > md2 else rloc - 1
        col_shift = cloc - n - 1 if cloc > nd2 else cloc - 1
        output = [error, diffphase, row_shift, col_shift]

    else:
        m, n = buf1ft.shape
        mlarge = m * 2
        nlarge = n * 2
        CC = np.zeros((mlarge, nlarge), dtype=c)
        CC[
            m + 1 - fix(m / 2) - 1 : m + fix((m - 1) / 2),
            n + 1 - fix(n / 2) - 1 : n + fix((n - 1) / 2),
        ] = fftshift(buf1ft) * conj(fftshift(buf2ft))

        CC = ifft2(ifftshift(CC))
        max1 = np.max(CC, axis=0)
        # max2 = np.max(max1)
        loc1 = np.argmax(CC, axis=0)
        loc2 = np.argmax(max1)
        rloc = loc1[loc2]
        cloc = loc2
        CCmax = CC[rloc, cloc]

        m, n = CC.shape
        md2 = fix(m / 2)
        nd2 = fix(n / 2)
        row_shift = rloc - m - 1 if rloc > md2 else rloc - 1
        col_shift = cloc - n - 1 if cloc > nd2 else cloc - 1
        row_shift = row_shift / 2
        col_shift = col_shift / 2

        if usfac > 2:
            row_shift = round(row_shift * usfac) / usfac
            col_shift = round(col_shift * usfac) / usfac
            dftshift = fix(ceil(usfac * 1.5) / 2)
            CC = conj(
                dft_ups(
                    buf2ft * conj(buf1ft),
                    ceil(usfac * 1.5),
                    ceil(usfac * 1.5),
                    usfac,
                    dftshift - row_shift * usfac,
                    dftshift - col_shift * usfac,
                )
            ) / (md2 * nd2 * usfac**2)
            max1 = np.max(CC, axis=0)
            # max2 = np.max(max1)
            loc1 = np.argmax(CC, axis=0)
            loc2 = np.argmax(max1)
            rloc = loc1[loc2]
            cloc = loc2
            CCmax = CC[rloc, cloc]
            rg00 = dft_ups(buf1ft * conj(buf1ft), 1, 1, usfac) / (md2 * nd2 * usfac**2)
            rf00 = dft_ups(buf2ft * conj(buf2ft), 1, 1, usfac) / (md2 * nd2 * usfac**2)
            rloc = rloc - dftshift - 1
            cloc = cloc - dftshift - 1
            row_shift = row_shift + rloc / usfac
            col_shift = col_shift + cloc / usfac

        else:
            rg00 = np.sum(buf1ft * conj(buf1ft)) / m / n
            rf00 = np.sum(buf2ft * conj(buf2ft)) / m / n

        error = 1.0 - CCmax * conj(CCmax) / (rg00 * rf00)
        error = np.sqrt(np.abs(error))
        diffphase = np.arctan2(np.imag(CCmax), np.real(CCmax))

        if md2 == 1:
            row_shift = 0
        if nd2 == 1:
            col_shift = 0

        output = [error, diffphase, row_shift, col_shift]

    output = np.array(output, dtype=np.float64)

    if usfac > 0:
        nr, nc = buf2ft.shape
        from numpy import fix

        # TODO: fix this
        Nr = np.zeros()
        Nc = np.zeros()
        # Nr = ifftshift([-fix(nr / 2) : ceil(nr / 2) - 1])
        # Nc = ifftshift([-fix(nc / 2 ) : ceil(nc / 2) - 1])
        Nc, Nr = meshgrid(Nc, Nr)
        Greg = buf2ft * exp(1j * 2 * pi * (-row_shift * Nr / nr - col_shift * Nc / nc))
        Greg = Greg * exp(1j * diffphase)
    elif usfac == 0:
        Greg = buf2ft * exp(1j * diffphase)

    return output, Greg


def dft_registration_nD(buf1ft, buf2ft):
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
    dimension = len(dim)

    cc = np.fft.ifftn(buf1ft * np.conj(buf2ft))
    cc_max = cc.max()
    loc = np.unravel_index(
        np.argmax(cc), cc.shape
    )  # n-dimensional position of peak. loc[0],...,loc[n]

    # a.*conj(a) instead of abs(a).^2 because faster
    rfzero = np.sum(buf1ft * np.conj(buf1ft)) / np.prod(dim)
    rgzero = np.sum(buf2ft * np.conj(buf2ft)) / np.prod(dim)

    error = 1.0 - cc_max * np.conj(cc_max) / (rgzero * rfzero)
    error = np.sqrt(np.abs(error))
    diffphase = np.arctan2(np.imag(cc_max), np.real(cc_max))

    shift = np.array(loc) - 1

    for d in range(dimension):
        if shift[d] > np.floor(dim[d] / 2):
            shift[d] = shift[d] - dim[d]

    return error, diffphase, shift
