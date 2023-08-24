import numpy as np
from scipy.stats import f_oneway

from studio.app.optinist.dataclass import StatData


def oneway_anova(
    stat: StatData, output_dir: str, params: dict = None
) -> dict(stat=StatData):
    stat.p_value_threshold = params["p_value_threshold"]
    stat.r_best_threshold = params["r_best_threshold"]
    stat.si_threshold = params["si_threshold"]

    for i in range(stat.ncells):
        this_data = stat.data_table[i]
        _, stat.p_value_resp[i] = f_oneway(*this_data.T)
        _, stat.p_value_sel[i] = f_oneway(*this_data[:, : stat.nstim].T)

        half_nstim = int(stat.nstim / 2)
        temp = np.hstack(
            (
                (this_data[:, 0:half_nstim] + this_data[:, half_nstim : stat.nstim])
                / 2,
                this_data[:, stat.nstim][:, np.newaxis],
            )
        )
        _, stat.p_value_ori_resp[i] = f_oneway(*temp.T)
        _, stat.p_value_ori_sel[i] = f_oneway(*temp[:, :half_nstim].T)

    stat.set_responsivity_and_selectivity()

    return {
        "stat": stat,
        "direction_responsivity_ratio": stat.direction_responsivity_ratio,
        "orientation_responsivity_ratio": stat.orientation_responsivity_ratio,
        "direction_selectivity": stat.direction_selectivity,
        "orientation_selectivity": stat.orientation_selectivity,
        "best_responsivity": stat.best_responsivity,
    }
