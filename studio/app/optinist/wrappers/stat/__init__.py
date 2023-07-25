from studio.app.optinist.wrappers.stat.anova import anova
from studio.app.optinist.wrappers.stat.file_convert import stat_file_convert

stat_wrapper_dict = {
    "stat": {
        "stat_file_convert": {
            "function": stat_file_convert,
            "conda_name": "stat",
        },
        "anova": {
            "function": anova,
            "conda_name": "stat",
        },
    }
}
