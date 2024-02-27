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
        average stack, double float
    """
    # stack: (ch, frames, y, x) or (ch, frames, z, y, x)
    dim = stack.shape
    d = len(dim)
    frames = dim[1]

    if runs is None:
        runs = list(range(int(frames / period)))

    if d == 4:
        avg = np.zeros((1, period, dim[-2], dim[-1]))
    elif d == 5:
        avg = np.zeros((1, period, dim[-3], dim[-2], dim[-1]))
    else:
        return None

    for r in runs:
        start = r * period
        end = (r + 1) * period
        if d == 4:
            avg += stack[:, start:end, :, :].astype(float)
        elif d == 5:
            avg += stack[:, start:end, :, :, :].astype(float)
        else:
            return None

    avg /= len(runs)

    return avg
