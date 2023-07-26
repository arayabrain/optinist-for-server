import math

import numpy as np

from studio.app.common.dataclass.histogram import HistogramData
from studio.app.optinist.dataclass.stat import AnovaStat, StatData, VectorStat


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
    stat: StatData, anova: AnovaStat, output_dir: str, params: dict = None
) -> dict(vector=VectorStat):
    vector = VectorStat(stat.ncells)

    for i in range(stat.ncells):
        (
            vector.dir_vector_angle[i],
            vector.dir_vector_mag[i],
            vector.dir_vector_tune[i],
        ) = get_1d_vector_average(stat.dirstat.ratio_change[i])
        (
            vector.ori_vector_angle[i],
            vector.ori_vector_mag[i],
            vector.ori_vector_tune[i],
        ) = get_1d_vector_average(stat.oristat.ratio_change[i])

    vector.ori_vector_angle /= 2

    return {
        "vector": vector,
        "preferred_dir_hist": HistogramData(
            data=vector.dir_vector_angle[anova.index_dir_selective],
            file_name="preferred_dir_hist",
        ),
        "preferred_ori_hist": HistogramData(
            data=vector.ori_vector_angle[anova.index_ori_selective],
            file_name="preferred_ori_hist",
        ),
    }
