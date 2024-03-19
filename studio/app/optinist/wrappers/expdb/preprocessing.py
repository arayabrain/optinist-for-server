import numpy as np

from studio.app.common.dataclass.image import ImageData
from studio.app.optinist.dataclass.microscope import MicroscopeData
from studio.app.optinist.wrappers.expdb.stack_average import stack_average
from studio.app.optinist.wrappers.expdb.stack_phase_correct import stack_phase_correct
from studio.app.optinist.wrappers.expdb.stack_register import (
    stack_register,
    stack_register_3d,
)


def preprocessing(
    microscope: MicroscopeData, output_dir: str, params: dict = None, **kwargs
) -> dict(stack=ImageData):
    # convert_onefileの処理を実装
    params_flatten = {}
    for segment in params.values():
        params_flatten.update(segment)
    params = params_flatten

    microscope_data = microscope.data
    ome_meta = microscope_data.ome_metadata
    raw_stack = microscope_data.get_image_stacks()  # (ch, t, y, x) or (ch, t, z, y, x)
    is_timeseries = ome_meta.size_t > 1

    # set common params to variables
    first_dim = params["first_dim"]

    # run preprocess for each channel
    for ch in range(ome_meta.size_c):
        if ome_meta.size_z > 1:
            stack = raw_stack[ch].transpose(2, 3, 1, 0)  # (y, x, z, t)
        else:
            stack = raw_stack[ch].transpose(1, 2, 0)  # (y, x, t)

        info = {}

        if is_timeseries:
            period = params["period"]
            runs = params["runs"]

            fov = np.squeeze(stack_average(stack, period, runs))  # (y, x, (z))
            info["avg"] = ImageData(
                fov.copy(), output_dir=output_dir, file_name=f"avg_ch{ch + 1}"
            )
            stack, dx = stack_phase_correct(stack, fov, first_dim)
            fov = np.squeeze(stack_average(stack, period, runs))
            info["p_avg"] = ImageData(
                fov.copy(), output_dir=output_dir, file_name=f"p_avg_ch{ch + 1}"
            )

            if params["do_realign"]:
                if stack.ndim == 3:
                    usfac = params["usfac"]
                    realign_params, stack = stack_register(stack, fov, usfac)
                elif stack.ndim == 4:
                    le = params["le"]
                    shift_method = params["shift_method"]
                    realign_params, stack = stack_register_3d(
                        stack, fov, le, shift_method
                    )

                fov = np.squeeze(stack_average(stack, period, runs))
                info["rp_avg"] = ImageData(
                    fov,
                    output_dir=output_dir,
                    file_name=f"rp_avg_img_ch{ch + 1}",
                )
                info["stack"] = ImageData(  # (t, y, x) or (t, z, y, x)
                    # TODO: test for 4D stack
                    (
                        stack.transpose(2, 0, 1)
                        if stack.ndim == 3
                        else stack.transpose(3, 2, 0, 1)
                    ),
                    output_dir=output_dir,
                    file_name=f"realigned_stack_ch{ch + 1}",
                )

            else:
                info["stack"] = ImageData(  # (t, y, x) or (t, z, y, x)
                    # TODO: test for 4D stack
                    (
                        stack.transpose(2, 0, 1)
                        if stack.ndim == 3
                        else stack.transpose(3, 2, 0, 1)
                    ),
                    output_dir=output_dir,
                    file_name=f"corrected_stack_ch{ch + 1}",
                )

        else:  # for anatomy (non-timeseries)
            info["avg"] = ImageData(
                stack.copy(),
                output_dir=output_dir,
                file_name=f"avg_ch{ch + 1}",
            )
            stack, dx = stack_phase_correct(stack, stack, first_dim)
            info["p_avg"] = ImageData(
                stack,
                output_dir=output_dir,
                file_name=f"p_avg_ch{ch + 1}",
            )
            info["stack"] = ImageData(
                stack,
                output_dir=output_dir,
                file_name=f"corrected_stack_ch{ch + 1}",
            )

        return info
