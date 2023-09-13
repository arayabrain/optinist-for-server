from studio.app.optinist.wrappers.expdb.analyze_stats import analyze_stats
from studio.app.optinist.wrappers.expdb.anova1_mult import anova1_mult
from studio.app.optinist.wrappers.expdb.curvefit_tuning import curvefit_tuning
from studio.app.optinist.wrappers.expdb.stat_file_convert import stat_file_convert
from studio.app.optinist.wrappers.expdb.vector_average import vector_average

expdb_wrapper_dict = {
    "expdb": {
        "analyze_stats": {
            "function": analyze_stats,
            "conda_name": "expdb",
        },
        "stat_file_convert": {
            "function": stat_file_convert,
            "conda_name": "expdb",
        },
        "anova1_mult": {
            "function": anova1_mult,
            "conda_name": "expdb",
        },
        "vector_average": {
            "function": vector_average,
            "conda_name": "expdb",
        },
        "curvefit_tuning": {
            "function": curvefit_tuning,
            "conda_name": "expdb",
        },
    }
}
