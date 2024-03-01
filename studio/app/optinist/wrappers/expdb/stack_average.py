import numpy as np


def stack_average(stack: np.ndarray, period, runs=None):
    """
    Average stack over repeats

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
    d = len(dim)
    assert d in [3, 4], "stack must be 2d, 3d"
    frames = dim[-1]

    if runs is None:
        runs = list(range(int(frames / period)))

    if d == 3:
        avg = np.zeros((dim[0], dim[1], period))  # (y, x, t)
    elif d == 4:
        avg = np.zeros((dim[0], dim[1], dim[2], period))  # (y, x, z, t)

    for r in runs:
        start = r * period
        end = (r + 1) * period
        if d == 3:
            avg += stack[:, :, start:end].astype(float)
        elif d == 4:
            avg += stack[:, :, :, start:end].astype(float)

    avg /= len(runs)

    return avg
