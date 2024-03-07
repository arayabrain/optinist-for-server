from pprint import pprint

import h5py
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
) -> dict(avg=ImageData, p_avg=ImageData):
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
    first_dim = params["first_dim"]

    # run preprocess for each channel
    for ch in range(ome_meta.size_c):
        if ome_meta.size_z > 1:
            stack = (  # (y, x, z, t)
                raw_stack[ch]
                .transpose(3, 2, 1, 0)
                .reshape(
                    ome_meta.size_y,
                    ome_meta.size_x,
                    ome_meta.size_z,
                    ome_meta.size_t,
                    order="F",
                )
            )
        else:
            stack = (  # (y, x, t)
                raw_stack[ch]
                .transpose(2, 1, 0)
                .reshape(
                    ome_meta.size_y,
                    ome_meta.size_x,
                    ome_meta.size_t,
                    order="F",
                )
            )

        if is_timeseries:
            period = params["period"]
            runs = params["runs"]

            fov = np.squeeze(stack_average(stack, period, runs))  # (y, x, (z))
            corrected_stack, dx = stack_phase_correct(stack, fov, first_dim)
            corrected_fov = np.squeeze(stack_average(corrected_stack, period, runs))

            info = {
                "avg": ImageData(
                    fov, output_dir=output_dir, file_name=f"avg_ch{ch + 1}"
                ),
                "p_avg": ImageData(
                    corrected_fov,
                    output_dir=output_dir,
                    file_name=f"p_avg_ch{ch + 1}",
                ),
            }

            if params["do_realign"]:
                if len(stack.size) == 3:
                    usfac = params["usfac"]
                    realign_params, realigned_stack = stack_register(
                        corrected_stack, corrected_fov, usfac
                    )
                elif len(stack.size) == 4:
                    le = params["le"]
                    shift_method = params["shift_method"]
                    realign_params, realigned_stack = stack_register_3d(
                        corrected_stack, corrected_fov, le, shift_method
                    )

                realigned_fov = np.squeeze(stack_average(realigned_stack, period, runs))
                info["rp_avg"] = ImageData(
                    realigned_fov,
                    output_dir=output_dir,
                    file_name=f"rp_avg_img_ch{ch + 1}",
                )

                # save array for debugging
                with h5py.File(output_dir + "/p_mat.hdf5", "w") as f:
                    f.create_dataset("raw_stack", data=stack)
                    f.create_dataset("fov", data=fov)
                    f.create_dataset("corrected_stack", data=corrected_stack)
                    f.create_dataset("corrected_fov", data=corrected_fov)
                    f.create_dataset("realigned_stack", data=realigned_stack)
                    f.create_dataset("realigned_fov", data=realigned_fov)
                    f.create_dataset("realign_params", data=realign_params)

            return info

        else:  # for anatomy (non-timeseries)
            corrected_stack, dx = stack_phase_correct(stack, stack, first_dim)

            return {
                "avg": ImageData(
                    stack, output_dir=output_dir, file_name=f"avg_ch{ch + 1}"
                ),
                "p_avg": ImageData(
                    corrected_stack,
                    output_dir=output_dir,
                    file_name=f"p_avg_ch{ch + 1}",
                ),
            }
