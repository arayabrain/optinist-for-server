from studio.app.optinist.wrappers.caiman.cnmf import caiman_cnmf
from studio.app.optinist.wrappers.expdb.analyze_stats import analyze_stats
from studio.app.optinist.wrappers.expdb.anova1_mult import anova1_mult
from studio.app.optinist.wrappers.expdb.curvefit_tuning import curvefit_tuning
from studio.app.optinist.wrappers.expdb.preprocessing import preprocessing
from studio.app.optinist.wrappers.expdb.stat_file_convert import stat_file_convert
from studio.app.optinist.wrappers.expdb.vector_average import vector_average

expdb_wrapper_dict = {
    "analysis_preset": {
        "analyze_stats": {
            "function": analyze_stats,
            "conda_name": "expdb",
        },
    },
    "preset_components": {
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
    },
    "preprocess_components": {
        "preprocessing": {
            "function": preprocessing,
            "conda_name": "expdb",
        },
        "caiman_cnmf": {
            "function": caiman_cnmf,
            "conda_name": "caiman",
        },
    },
}
