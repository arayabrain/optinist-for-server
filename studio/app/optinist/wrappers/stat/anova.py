import numpy as np
from scipy.stats import f_oneway

from studio.app.common.dataclass import HistogramData, PieData
from studio.app.optinist.dataclass import AnovaStat, StatData


def anova(
    stat: StatData, output_dir: str, params: dict = None, export_plot: bool = False
) -> dict(anova_stat=AnovaStat):
    anova = AnovaStat(stat.ncells)

    for i in range(stat.ncells):
        this_data = stat.data_tables[i][0]
        _, anova.p_value_responsive[i] = f_oneway(*this_data.T)
        _, anova.p_value_selective[i] = f_oneway(*this_data[:, : stat.nstim].T)

    anova.index_visually_responsive = np.where(
        (anova.p_value_responsive < params["p_value_threshold"])
        & (stat.dirstat.r_best >= params["r_best_threshold"]),
        True,
        False,
    )

    anova.index_dir_selective = np.where(
        anova.index_visually_responsive & (stat.dirstat.si >= params["si_threshold"]),
        True,
        False,
    )

    anova.index_ori_selective = np.where(
        anova.index_visually_responsive & (stat.oristat.si >= params["si_threshold"]),
        True,
        False,
    )

    dir_selective_pie = PieData(
        data=np.array(
            (
                anova.ncells_dir_selective,
                anova.ncells_visually_responsive - anova.ncells_dir_selective,
                stat.ncells - anova.ncells_visually_responsive,
            )
        ),
        labels=["DS", "non-DS", "non-responsive"],
        file_name="dir_selective_pie",
    )

    ori_selective_pie = PieData(
        data=np.array(
            (
                anova.ncells_ori_selective,
                anova.ncells_visually_responsive - anova.ncells_ori_selective,
                stat.ncells - anova.ncells_visually_responsive,
            )
        ),
        labels=["OS", "non-OS", "non-responsive"],
        file_name="ori_selective_pie",
    )

    dir_selective_hist = HistogramData(
        data=stat.dirstat.si[anova.index_dir_selective],
        file_name="dir_selective_hist",
    )

    ori_selective_hist = HistogramData(
        data=stat.oristat.si[anova.index_ori_selective],
        file_name="ori_selective_hist",
    )

    dir_response_strength_hist = HistogramData(
        data=stat.dirstat.r_best[anova.index_visually_responsive] * 100,
        file_name="dir_response_strength_hist",
    )

    if export_plot:
        dir_selective_pie.save_plot(output_dir)
        ori_selective_pie.save_plot(output_dir)
        dir_selective_hist.save_plot(output_dir)
        ori_selective_hist.save_plot(output_dir)
        dir_response_strength_hist.save_plot(output_dir)
        return anova
    else:
        return {
            "anova_stat": anova,
            "dir_selective_pie": dir_selective_pie,
            "ori_selective_pie": ori_selective_pie,
            "dir_selective_hist": dir_selective_hist,
            "ori_selective_hist": ori_selective_hist,
            "dir_response_strength_hist": dir_response_strength_hist,
        }
