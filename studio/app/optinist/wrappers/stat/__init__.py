from studio.app.optinist.wrappers.stat.anova import anova
from studio.app.optinist.wrappers.stat.file_convert import stat_file_convert
from studio.app.optinist.wrappers.stat.vector_average import vector_average

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
        "vector_average": {
            "function": vector_average,
            "conda_name": "stat",
        },
    }
}
