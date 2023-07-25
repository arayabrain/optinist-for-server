from typing import Tuple

import numpy as np
from scipy.signal import lfilter

from studio.app.common.dataclass import LineData, PolarData
from studio.app.optinist.dataclass import StatData, StatIndex, TcData, TsData


def percentile_tc(tc_data: np.ndarray, window, n_percentile):
    half_window = int(np.floor(window / 2))
    shape = tc_data.shape

    tc_data = np.vstack(
        (
            tc_data[half_window - 1 :: -1, :],
            tc_data,
            tc_data[: (len(tc_data) - half_window - 1) : -1, :],
        )
    )

    percentiled = np.zeros(shape)
    for i in range(shape[0]):
        # method='hazen' is same as matlab's prctile method
        percentiled[i] = np.percentile(
            tc_data[i : window + i, :], n_percentile, axis=0, method="hazen"
        )
    return percentiled


def moving_average_tc(tc_data: np.ndarray, tclength, window):
    tc_margin = int(np.floor(window / 2))
    if window != 0:
        trend = np.vstack(
            (
                tc_data[tc_margin - 1 :: -1, :],
                tc_data,
                tc_data[-1 : tclength - tc_margin - 1 : -1, :],
            )
        )
        trend = lfilter(np.ones(window) / window, 1, trend, axis=0)
        trend = trend[window - 1 : (len(trend) - window % 2 + 1), :]
    else:
        trend = tc_data

    return trend


def detrend_tc(
    tc_data: np.ndarray, percentile_window, n_percentile, moving_avg_window, nbinning
):
    """
    Args:
        tc_data : cell timecourses (timecourse * cell)
        percentile_window : percentile filter window
        moving_avg_window : moving average window
        nbinning : option (for smoothing)

    trend : estimated trend (percentile filter + moving average)
    trend_raw : estimated trend (percentile filter)

    Returns:
        tc_detrended : detrended timecourse
    """
    tc_len, ncells = tc_data.shape
    if tc_len % nbinning != 0:
        nbinning = 1

    tiled_tc = np.tile(
        np.mean(
            tc_data.reshape((nbinning, int(tc_len / nbinning), ncells), order="F"),
            axis=0,
        ),
        [nbinning, 1, 1],
    ).reshape((tc_len, ncells), order="F")
    trend_raw = percentile_tc(tiled_tc, percentile_window, n_percentile)

    trend = moving_average_tc(trend_raw, tc_len, moving_avg_window)

    tc_detrended = tc_data + np.tile(np.mean(trend, axis=0), [tc_len, 1]) - trend

    return tc_detrended


def sort_tc(
    tc_data: np.ndarray,
    stim_log: np.ndarray,
    base_stim_duration,
    n_directions_of_motion,
    n_trials,
):
    if n_directions_of_motion is None:
        n_directions_of_motion = stim_log.max() + 1
    if n_trials is None:
        n_trials = stim_log.shape[0]
    if base_stim_duration is None:
        base_stim_duration = tc_data.shape[0] / n_trials / n_directions_of_motion

    tc_len, ncells = tc_data.shape
    stim_log = stim_log[: n_directions_of_motion * n_trials + 1, 0]
    stim_log = np.reshape(stim_log, (n_directions_of_motion, n_trials), order="F") + 1

    sorted_indices = np.argsort(stim_log, axis=0).astype(np.float64)
    sorted_indices += np.tile(
        np.arange(
            n_directions_of_motion * (n_trials - 1) + 1, step=n_directions_of_motion
        ),
        (n_directions_of_motion, 1),
    ).astype(np.float64)
    sorted_indices = np.reshape(
        sorted_indices, (n_directions_of_motion * n_trials, 1), order="F"
    )

    sorted_tc = np.reshape(
        tc_data,
        (base_stim_duration, n_directions_of_motion * n_trials, ncells),
        order="F",
    )
    sorted_tc = sorted_tc[:, sorted_indices.astype(np.int32)[:, 0], :]
    sorted_tc = np.reshape(sorted_tc, (tc_len, ncells), order="F")
    return sorted_tc


def get_data_tables(
    tc_data: np.ndarray, direction_of_motion, trials, base_period, stim_period
):
    tc_len, ncells = tc_data.shape
    base_and_stim_duration = int(tc_len / direction_of_motion / trials)

    tc2 = np.reshape(
        tc_data,
        (base_and_stim_duration, direction_of_motion, trials, ncells),
        order="F",
    )

    tc3 = np.concatenate(
        (
            np.mean(tc2[base_period - 1, :, :, :], axis=0, keepdims=True),
            np.mean(tc2[stim_period - 1, :, :, :], axis=0, keepdims=True),
        ),
        axis=0,
    )
    tc3 = tc3.transpose((2, 1, 0, 3))

    tc2_base = np.mean(
        np.mean(tc2[base_period - 1, :, :, :], axis=0), axis=0, keepdims=True
    )
    tc2_stim = np.mean(tc2[stim_period - 1, :, :, :], axis=0)
    tc2 = np.concatenate((tc2_stim, tc2_base), axis=0).transpose((1, 0, 2))

    data_tables = np.empty((ncells, 1), order="F", dtype=np.object_)
    for n in range(ncells):
        data_tables[n, 0] = tc2[:, :, n]

    return data_tables


def get_r(ratio_change):
    best_dir = np.argmax(ratio_change, axis=0)
    nstim_per_run = ratio_change.shape[0]
    null_dir = int(np.mod((best_dir + nstim_per_run / 2), nstim_per_run))
    r_best = np.max(ratio_change, axis=0)
    r_null = ratio_change[null_dir]

    return r_best, r_null


def get_stat_data(data_tables) -> Tuple[StatIndex, StatIndex]:
    stat = StatData(data_tables=data_tables)

    for i in range(stat.ncells):
        this_data = data_tables[i][0]
        temp = np.sum(this_data, axis=0)
        stat.dirstat.ratio_change[i] = temp[: stat.nstim] / temp[stat.nstim] - 1
        stat.oristat.ratio_change[i] = (
            np.sum(
                np.reshape(
                    stat.dirstat.ratio_change[i], (int(stat.nstim / 2), 2), order="F"
                )
                .conj()
                .transpose(),
                axis=0,
            )
            / 2
        )

        if stat.ntrials < 1:
            continue

        stat.dirstat.r_best[i], stat.dirstat.r_null[i] = get_r(
            stat.dirstat.ratio_change[i]
        )
        stat.oristat.r_best[i], stat.oristat.r_null[i] = get_r(
            stat.oristat.ratio_change[i]
        )

    return stat


def stat_file_convert(
    tc: TcData, ts: TsData, output_dir: str, params: dict = None
) -> dict(stat=StatData):
    tc_detrended = detrend_tc(
        tc.data,
        params["percentile_window"],
        params["n_percentile"],
        params["moving_avg_window"],
        params["nbinning"],
    )

    tc_detrended_sorted = sort_tc(
        tc_detrended, ts.stim_log, ts.nframes_epoch, ts.nstim_per_trial, ts.ntrials
    )
    if not ts.has_base:
        tc_detrended_sorted = np.reshape(
            tc_detrended_sorted,
            (ts.nframes_epoch, ts.nstim_per_trial, ts.ntrials, tc.n_cells),
            order="F",
        )
        tc_detrended_sorted = np.reshape(
            tc_detrended_sorted[:, 0 : ts.nstim_per_trial_planar, :, :],
            (ts.nframes_epoch * ts.nstim_per_trial_planar * ts.ntrials, tc.n_cells),
            order="F",
        )

    data_tables = get_data_tables(
        tc_detrended_sorted,
        ts.nstim_per_trial,
        ts.ntrials,
        ts.base_index,
        ts.stim_index,
    )

    stat = get_stat_data(data_tables)

    return {
        "stat": stat,
        "dir_ratio_change": LineData(
            data=stat.dirstat.ratio_change,
            columns=np.arange(0, 360, 360 / ts.nstim_per_trial),
        ),
        "dir_polar": PolarData(
            data=stat.dirstat.ratio_change,
            thetas=np.linspace(
                0, 360, stat.dirstat.ratio_change[0].shape[0], endpoint=False
            ),
        ),
    }
