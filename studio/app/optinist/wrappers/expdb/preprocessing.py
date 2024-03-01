from studio.app.common.dataclass.image import ImageData
from studio.app.optinist.dataclass.microscope import MicroscopeData
from studio.app.optinist.wrappers.expdb.stack_average import stack_average
import numpy as np
from pprint import pprint

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

    microscope_data = microscope.data
    ome_meta = microscope_data.ome_metadata
    print()
    print()
    pprint(ome_meta)
    print()
    print()
    raw_stack = np.array(
        microscope_data.get_image_stacks()
    )  # (ch, t, y, x) or (ch, t, z, y, x)
    is_timeseries = ome_meta.size_t > 1

    # set common params to variables
    # first_dim = params["first_dim"]

    # run preprocess for each channel
    for ch in range(ome_meta.size_c):
        if ome_meta.size_z > 1:
            stack = raw_stack[ch].transpose(2, 3, 1, 0)  # (y, x, z, t)
        else:
            stack = np.squeeze(raw_stack[ch]).transpose(1, 2, 0)  # (y, x, t)

        if is_timeseries:
            period = params["period"]
            runs = params["runs"]

            fov = np.squeeze(stack_average(stack, period, runs))  # (y, x, (z))
            # corrected_stack, dx = stack_phase_correct(stack, fov, first_dim)
            # corrected_fov = stack_average(corrected_stack, period, runs)

            info = {
                "avg": ImageData(
                    fov, output_dir=output_dir, file_name=f"avg_img_ch{ch + 1}"
                ),
                # "p_avg": corrected_fov,  # Set ImageData for p_avg
                # Add some data for timecourse
            }

            if params["do_realign"]:
                # realign
                # if len(stack.size) == 3:
                return info
            else:
                return info

        else:  # for anatomy (non-timeseries)
            # save raw stack as avg tiff

            # stackPhaseCorrection
            # corrected_stack, dx = stack_phase_correct(stack, stack, first_dim)

            # save p_avg tiff
            # save p mat
            return {
                "avg": ImageData(
                    stack, output_dir=output_dir, file_name=f"avg_img_ch{ch + 1}"
                ),
                # "p_avg": ImageData(
                #     corrected_stack, output_dir=output_dir, file_name="pAvgImg"
                # ),
                # Add some data for timecourse
            }
