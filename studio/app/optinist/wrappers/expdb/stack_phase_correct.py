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
    stack_dim = stack.shape  # (y, x, t) or (y, x, z, t)
    fov_dim = fov.shape  # (y, x) or (y, x, z)
    assert len(fov_dim) in [2, 3], "fov must be 2d or 3d"
    assert first_dim in [1, 2], "first_dim must be 1 or 2"

    if first_dim == 1:
        # separate odd lines and even lines
        reshaped_fov = fov.reshape(
            [int(fov_dim[1] / 2), 2, fov_dim[0], int(np.prod(fov_dim[2:]))]
        )

        # estimate phase mismatch
        outs, out_stack = stack_register_nD(
            reshaped_fov[:, 0, :, :], reshaped_fov[:, 1, :, :]
        )
        dx = -outs[1][0]

        # align phase of stack
        result_stack = stack.reshape(
            [int(stack_dim[1] / 2), 2, stack_dim[0], int(np.prod(stack_dim[2:]))]
        )
        for i in range(np.prod(stack_dim[2:])):
            result_stack[:, 1, :, i] = np.roll(result_stack[:, 1, :, i], dx, axis=1)

    elif first_dim == 2:
        # separate odd lines and even lines
        reshaped_fov = fov.reshape(
            [2, fov_dim[1], int(fov_dim[0] / 2), int(np.prod(fov_dim[2:]))]
        )

        # estimate phase mismatch
        outs, outstack = stack_register_nD(
            np.squeeze(reshaped_fov[0, :, :, :]), np.squeeze(reshaped_fov[1, :, :, :])
        )
        dx = -outs[1][1]

        # align phase of stack
        result_stack = stack.reshape(
            [2, int(stack_dim[0] / 2), stack_dim[1], int(np.prod(stack_dim[2:]))]
        )
        for i in range(np.prod(stack_dim[3:])):
            result_stack[1, :, :, i] = np.roll(result_stack[1, :, :, i], [0, 0, dx])

    result_stack = result_stack.reshape(stack_dim)
    return result_stack, dx
