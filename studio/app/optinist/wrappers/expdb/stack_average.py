import numpy as np


def stack_average(stack: np.ndarray, period, runs=None) -> np.ndarray:
    """
    Based on Ohki Lab's stackAverage.m.
    Average stack over repeats.

    Parameters
    ----------
    stack : ndarray
    period : int
        specify period of one repeat
    runs : list, optional
        which runs you want to average. if None, use all repeats.

    Returns
    -------
    ndarray
        average stack with shape(y, x, (z)), double float
    """
    # stack: (y, x, t) or (y, x, z, t)
    dim = stack.shape
    d = stack.ndim
    assert d in [3, 4], "stack must be 2d, 3d"
    frames = dim[-1]

    if runs is None:
        runs = list(range(int(frames / period)))
    runs_len = len(runs)

    if d == 3:
        avg = np.zeros((dim[0], dim[1], period), dtype=np.float32)  # (y, x, t)
    # TODO: test for 4D pattern
    elif d == 4:
        avg = np.zeros(
            (dim[0], dim[1], dim[2], period), dtype=np.float32
        )  # (y, x, z, t)

    if d == 3:
        stack = stack[:, :, : (period * runs_len)].reshape(
            dim[0], dim[1], period, runs_len, order="F"
        )
        avg = np.average(stack, axis=3)
    # TODO: test for 4D pattern
    elif d == 4:
        stack = stack[:, :, :, : (period * runs_len)].reshape(
            dim[0], dim[1], dim[2], period, runs_len, order="F"
        )
        avg = np.average(stack, axis=4)

    return avg
