from studio.app.common.dataclass.image import ImageData
from studio.app.optinist.dataclass.microscope import MicroscopeData
from studio.app.optinist.wrappers.expdb.stack_average import stack_average
import numpy as np

# from studio.app.optinist.wrappers.expdb.stack_phase_correct import stack_phase_correct


def preprocessing(
    microscope: MicroscopeData, output_dir: str, params: dict = None, **kwargs
) -> dict(
    # avg=ImageData,
    p_avg=ImageData,
):
    # convert_onefileの処理を実装
    params_flatten = {}
    for segment in params.values():
        params_flatten.update(segment)
    params = params_flatten

    microscope = microscope.data
    stack = np.array(microscope.get_image_stacks())
    is_timeseries = microscope.ome_metadata.size_t > 1

    # set common params to variables
    # first_dim = params["first_dim"]

    if is_timeseries:
        period = params["period"]
        runs = params["runs"]

        fov = stack_average(stack, period, runs)
        # stack_average returns (1, 1, (z,) y, x)
        # convert into ((z,) y, x) by squeezing
        fov = np.squeeze(fov)
        # corrected_stack, dx = stack_phase_correct(stack, fov, first_dim)
        # corrected_fov = stack_average(corrected_stack, period, runs)

        info = {
            "avg": ImageData(fov, output_dir=output_dir, file_name="avgImg"),
            # "p_avg": corrected_fov,  # Set ImageData for p_avg
            # Add some data for timecourse
        }

        if params["do_realign"]:
            # realign
            # if len(stack.size) == 3:
            return info
        else:
            return info

    else:
        # for anatomy
        # save raw stack as avg tiff

        # stackPhaseCorrection
        # corrected_stack, dx = stack_phase_correct(stack, stack, first_dim)

        # save p_avg tiff
        # save p mat
        return {
            "avg": ImageData(stack, output_dir=output_dir, file_name="avgImg"),
            # "p_avg": ImageData(
            #     corrected_stack, output_dir=output_dir, file_name="pAvgImg"
            # ),
            # Add some data for timecourse
        }
