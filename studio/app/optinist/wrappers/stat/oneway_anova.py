import numpy as np
from scipy.stats import f_oneway

from studio.app.common.core.utils.filepath_creater import join_filepath
from studio.app.common.dataclass import HistogramData, PieData
from studio.app.optinist.dataclass import StatData


def oneway_anova(
    stat: StatData, output_dir: str, params: dict = None, export_plot: bool = False
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

    dir_selective_pie = PieData(
        data=np.array(
            (
                stat.ncells_direction_selective_cell,
                stat.ncells_visually_responsive_cell
                - stat.ncells_direction_selective_cell,
                stat.ncells - stat.ncells_visually_responsive_cell,
            )
        ),
        labels=["DS", "non-DS", "non-responsive"],
        file_name="direction_responsivity_ratio",
    )

    ori_selective_pie = PieData(
        data=np.array(
            (
                stat.ncells_orientation_selective_cell,
                stat.ncells_visually_responsive_cell
                - stat.ncells_orientation_selective_cell,
                stat.ncells - stat.ncells_visually_responsive_cell,
            )
        ),
        labels=["OS", "non-OS", "non-responsive"],
        file_name="orientation_responsivity_ratio",
    )

    dir_selective_hist = HistogramData(
        data=stat.dsi[stat.index_direction_selective_cell],
        file_name="direction_selectivity",
    )

    ori_selective_hist = HistogramData(
        data=stat.osi[stat.index_orientation_selective_cell],
        file_name="orientation_selectivity",
    )

    dir_response_strength_hist = HistogramData(
        data=stat.r_best_dir[stat.index_visually_responsive_cell] * 100,
        file_name="best_responsivity",
    )

    if export_plot:
        stat.save_as_hdf5(join_filepath([output_dir, "stats"]), "oneway_anova")
        plots_dir = join_filepath([output_dir, "plots"])
        dir_selective_pie.save_plot(plots_dir)
        ori_selective_pie.save_plot(plots_dir)
        dir_selective_hist.save_plot(plots_dir)
        ori_selective_hist.save_plot(plots_dir)
        dir_response_strength_hist.save_plot(plots_dir)
    else:
        stat.save_as_hdf5(output_dir, "oneway_anova")
        return {
            "stat": stat,
            "dir_selective_pie": dir_selective_pie,
            "ori_selective_pie": ori_selective_pie,
            "dir_selective_hist": dir_selective_hist,
            "ori_selective_hist": ori_selective_hist,
            "dir_response_strength_hist": dir_response_strength_hist,
        }
