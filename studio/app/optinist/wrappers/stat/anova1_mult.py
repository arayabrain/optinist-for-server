import numpy as np
from scipy.stats import f_oneway, tukey_hsd

from studio.app.optinist.dataclass import StatData


def multi_compare(data):
    _, size = data.shape
    tukey = tukey_hsd(*data.T).confidence_interval()
    sig = tukey.high * tukey.low
    sig[range(size), range(size)] = 0

    sig_epochs = np.where(
        (
            np.where(np.triu(tukey.low, k=1) > 0, 1, 0)
            | np.where(np.tril(tukey.high, k=-1) > 0, 1, 0)
        )
        & (np.where(sig > 0, 1, 0)),
        1,
        0,
    )

    return sig_epochs


def anova1_mult(
    stat: StatData, output_dir: str, params: dict = None
) -> dict(stat=StatData):
    stat.p_value_threshold = params["p_value_threshold"]
    stat.r_best_threshold = params["r_best_threshold"]
    stat.si_threshold = params["si_threshold"]

    for i in range(stat.ncells):
        this_data = stat.data_table[i]
        stat.p_value_resp[i] = f_oneway(*this_data.T)[1]
        stat.sig_epochs_resp[i] = multi_compare(this_data)

        sel_data = this_data[:, : stat.nstim]
        stat.p_value_sel[i] = f_oneway(*sel_data.T)[1]
        stat.sig_epochs_sel[i] = multi_compare(sel_data)
        stat.dir_sig[i] = (
            1
            if (stat.best_dir[i], stat.null_dir[i])
            in list(zip(*np.where(stat.sig_epochs_sel[i])))
            else 0
        )

        half_nstim = int(stat.nstim / 2)
        temp_data = np.hstack(
            (
                (this_data[:, 0:half_nstim] + this_data[:, half_nstim : stat.nstim])
                / 2,
                this_data[:, stat.nstim][:, np.newaxis],
            )
        )
        stat.p_value_ori_resp[i] = f_oneway(*temp_data.T)[1]
        stat.sig_epochs_ori_resp[i] = multi_compare(temp_data)

        half_temp_data = temp_data[:, :half_nstim]
        stat.p_value_ori_sel[i] = f_oneway(*half_temp_data.T)[1]
        stat.sig_epochs_ori_sel[i] = multi_compare(half_temp_data)

    stat.set_responsivity_and_selectivity()

    return {
        "stat": stat,
        "direction_responsivity_ratio": stat.direction_responsivity_ratio,
        "orientation_responsivity_ratio": stat.orientation_responsivity_ratio,
        "direction_selectivity": stat.direction_selectivity,
        "orientation_selectivity": stat.orientation_selectivity,
        "best_responsivity": stat.best_responsivity,
    }
