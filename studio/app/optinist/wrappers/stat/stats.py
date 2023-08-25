from studio.app.optinist.dataclass import ExpDbData, StatData
from studio.app.optinist.wrappers.stat.anova1_mult import anova1_mult
from studio.app.optinist.wrappers.stat.curvefit_tuning import curvefit_tuning
from studio.app.optinist.wrappers.stat.file_convert import stat_file_convert
from studio.app.optinist.wrappers.stat.vector_average import vector_average


def stats(
    expdb: ExpDbData, output_dir: str, params: dict = None
) -> dict(stat=StatData):
    stat = stat_file_convert(expdb, output_dir, params).get("stat")
    stat = anova1_mult(stat, output_dir, params).get("stat")
    stat = vector_average(stat, output_dir, params).get("stat")
    stat = curvefit_tuning(stat, output_dir, params).get("stat")

    return {
        "stat": stat,
        "tuning_curve": stat.tuning_curve,
        "tuning_curve_polar": stat.tuning_curve_polar,
        "direction_responsivity_ratio": stat.direction_responsivity_ratio,
        "orientation_responsivity_ratio": stat.orientation_responsivity_ratio,
        "direction_selectivity": stat.direction_selectivity,
        "orientation_selectivity": stat.orientation_selectivity,
        "best_responsivity": stat.best_responsivity,
        "preferred_direction": stat.preferred_direction,
        "preferred_orientation": stat.preferred_orientation,
        "direction_tuning_width": stat.direction_tuning_width,
        "orientation_tuning_width": stat.orientation_tuning_width,
    }
