import numpy as np
from studio.app.optinist.wrappers.expdb.stack_register import stack_register_nD


def stack_phase_correct(stack, fov, first_dim=1):
    """
    Correct phase mismatch in bidirectional scanning with galvano and resonant mirrors

    Parameters
    ----------
    stack: ndarray
        2-5 dimensions
    fov: ndarray
        2-3 dimensions
    first_dim: int, optional
        First dimension, in which bidirectional scan was obtained.
        Usually 1, but sometimes could be 2.

    Returns
    -------
    ndarray
        phase corrected stack
    int
        phase shift
    """
    from scipy.ndimage import shift

    # stack: (ch, frames, (z,) y, x)
    stack_dim = stack.shape
    # fov: ((z,) y, x)
    fov_dim = fov.shape
    assert len(fov_dim) > 3, "fov must be 2d or 3d"
    assert first_dim in [1, 2], "first_dim must be 1 or 2"

    if first_dim == 1:
        # separate odd lines and even lines
        fov = fov.reshape([fov_dim[0], 2, int(fov_dim[1] / 2)] + list(fov_dim[3:]))

        # estimate phase mismatch
        outs = stack_register_nD(fov[:, 0, :, :], fov[:, 1, :, :])
        dx = -outs[2]

        # align phase of stack
        stack = stack.reshape(
            [stack_dim[0], 2, int(stack_dim[1] / 2)] + list(stack_dim[3:])
        )
        for i in range(np.prod(stack_dim[3:])):
            stack[:, 1, :, i] = shift(stack[:, 1, :, i], [dx, 0])
        stack = stack.reshape(stack_dim)

    elif first_dim == 2:
        # separate odd lines and even lines
        fov = fov.reshape([2, int(fov_dim[0] / 2), fov_dim[1]] + list(fov_dim[3:]))

        # estimate phase mismatch
        outs = stack_register_nD(fov[0, :, :, :], fov[1, :, :, :])
        dx = -outs[3]

        # align phase of stack
        stack = stack.reshape(
            [2, int(stack_dim[0] / 2), stack_dim[1]] + list(stack_dim[3:])
        )
        for i in range(np.prod(stack_dim[3:])):
            stack[1, :, :, i] = shift(stack[1, :, :, i], [0, 0, dx])
        stack = stack.reshape(stack_dim)

    return stack, dx
