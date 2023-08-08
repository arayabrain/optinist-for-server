from studio.app.optinist.wrappers.stat.curvefit_tuning import curvefit_tuning
from studio.app.optinist.wrappers.stat.file_convert import stat_file_convert
from studio.app.optinist.wrappers.stat.oneway_anova import oneway_anova
from studio.app.optinist.wrappers.stat.vector_average import vector_average

stat_wrapper_dict = {
    "stat": {
        "stat_file_convert": {
            "function": stat_file_convert,
            "conda_name": "stat",
        },
        "oneway_anova": {
            "function": oneway_anova,
            "conda_name": "stat",
        },
        "vector_average": {
            "function": vector_average,
            "conda_name": "stat",
        },
        "curvefit_tuning": {
            "function": curvefit_tuning,
            "conda_name": "stat",
        },
    }
}
