import numpy as np

from studio.app.optinist.wrappers.expdb.stack_register import stack_register_nD


def stack_phase_correct(stack: np.ndarray, fov: np.ndarray, first_dim):
    """
    Correct phase mismatch in bidirectional scanning with galvano and resonant mirrors

    Parameters
    ----------
    stack: ndarray
        3-4 dimensions
    fov: ndarray
        2-3 dimensions
    first_dim: int
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
            [fov_dim[0], 2, int(fov_dim[1] / 2), int(np.prod(fov_dim[2:]))],
            order="F",
        )

        # estimate phase mismatch
        outs, out_stack = stack_register_nD(
            np.squeeze(reshaped_fov[:, 0, :, :]),
            np.squeeze(reshaped_fov[:, 1, :, :]),
        )
        dx = -np.array(outs[2])  # shift

        # align phase of stack
        result_stack = stack.reshape(
            [stack_dim[0], 2, int(stack_dim[1] / 2), int(np.prod(stack_dim[2:]))],
            order="F",
        )
        for i in range(np.prod(stack_dim[2:])):
            result_stack[:, 1, :, i] = np.roll(result_stack[:, 1, :, i], dx, axis=0)

    elif first_dim == 2:
        # separate odd lines and even lines
        reshaped_fov = fov.reshape(
            [2, int(fov_dim[0] / 2), fov_dim[1], int(np.prod(fov_dim[2:]))],
            order="F",
        )

        # estimate phase mismatch
        outs, outstack = stack_register_nD(
            np.squeeze(reshaped_fov[0, :, :, :]),
            np.squeeze(reshaped_fov[1, :, :, :]),
        )
        dx = -np.array(outs[2])  # shift

        # align phase of stack
        result_stack = stack.reshape(
            [2, int(stack_dim[0] / 2), stack_dim[1], int(np.prod(stack_dim[2:]))],
            order="F",
        )
        for i in range(np.prod(stack_dim[2:])):
            result_stack[1, :, :, i] = np.roll(result_stack[1, :, :, i], dx, axis=1)

    result_stack = result_stack.reshape(stack_dim, order="F")
    return result_stack, dx
