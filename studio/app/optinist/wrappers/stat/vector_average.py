import math

import numpy as np

from studio.app.common.dataclass.histogram import HistogramData
from studio.app.optinist.dataclass.stat import StatData


def get_1d_vector_average(ratio):
    nstim_per_run = ratio.shape[0]
    vx, vy, sum = 0, 0, 0

    for i in range(nstim_per_run):
        a = max(ratio[i], 0)
        vx += a * math.cos(i * 2 * math.pi / nstim_per_run)
        vy += a * math.sin(i * 2 * math.pi / nstim_per_run)
        sum += a
    vector_angle = np.mod(math.atan2(vy, vx) * 180 / math.pi, 360)
    vector_mag = (vx**2 + vy**2) ** 0.5
    vector_tune = vector_mag / sum if sum > 0 else 0

    return vector_angle, vector_mag, vector_tune


def vector_average(
    stat: StatData,
    output_dir: str,
    params: dict = None,
    export_plot: bool = False,
) -> dict(stat=StatData):
    for i in range(stat.ncells):
        (
            stat.dir_vector_angle[i],
            stat.dir_vector_mag[i],
            stat.dir_vector_tune[i],
        ) = get_1d_vector_average(stat.dir_ratio_change[i])
        (
            stat.ori_vector_angle[i],
            stat.ori_vector_mag[i],
            stat.ori_vector_tune[i],
        ) = get_1d_vector_average(stat.ori_ratio_change[i])

    stat.ori_vector_angle /= 2

    preferred_dir_hist = HistogramData(
        data=stat.dir_vector_angle[stat.index_direction_selective_cell],
        file_name="preferred_direction",
    )
    preferred_ori_hist = HistogramData(
        data=stat.ori_vector_angle[stat.index_orientation_selective_cell],
        file_name="preferred_orientation",
    )

    stat.save_as_hdf5(output_dir, "vector_average")
    if export_plot:
        preferred_dir_hist.save_plot(output_dir)
        preferred_ori_hist.save_plot(output_dir)
    else:
        return {
            "stat": stat,
            "preferred_dir_hist": preferred_dir_hist,
            "preferred_ori_hist": preferred_ori_hist,
        }
