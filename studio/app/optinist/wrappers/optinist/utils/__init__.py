"""
Shared utility functions for Optinist wrappers.
"""

# Import mat_file_io functions for shared access
from studio.app.optinist.wrappers.optinist.utils.mat_file_io import (
    save_auxiliary_mats,
    save_cellmask_mat,
    save_timecourse_mat,
)

__all__ = [
    "standard_norm",
    "recursive_flatten_params",
    "param_check",
    "save_timecourse_mat",
    "save_cellmask_mat",
    "save_auxiliary_mats",
]


def standard_norm(X, mean, std):
    from sklearn.preprocessing import StandardScaler

    sc = StandardScaler(with_mean=mean, with_std=std)
    tX = sc.fit_transform(X)
    return tX


def recursive_flatten_params(params, result_params: dict, nest_counter=0):
    assert nest_counter <= 10, f"Nest depth overflow. [{nest_counter}]"
    nest_counter += 1

    for key, nested_param in params.items():
        if type(nested_param) is dict:
            recursive_flatten_params(nested_param, result_params, nest_counter)
        else:
            result_params[key] = nested_param


def param_check(params):
    for key in params:
        if (params[key] == "") or (params[key] == "None"):
            params[key] = None
    return params
