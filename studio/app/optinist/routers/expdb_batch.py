import math
import os

import numpy as np
import tifffile
from fastapi import APIRouter, HTTPException, Response
from scipy.io import loadmat

from studio.app.common.core.utils.config_handler import ConfigReader
from studio.app.common.core.utils.filepath_creater import (
    create_directory,
    join_filepath,
)
from studio.app.common.core.utils.filepath_finder import find_param_filepath
from studio.app.const import (
    CELLMASK_FIELDNAME,
    CELLMASK_SUFFIX,
    FOV_CONTRAST,
    FOV_SUFFIX,
    TC_SUFFIX,
    TS_SUFFIX,
)
from studio.app.dir_path import DIRPATH
from studio.app.optinist.dataclass.expdb import ExpDbData
from studio.app.optinist.wrappers.stat import (
    curvefit_tuning,
    oneway_anova,
    stat_file_convert,
    vector_average,
)

router = APIRouter(prefix="/expdb/batch", tags=["Experiment Database"])


def get_default_params(name: str):
    filepath = find_param_filepath(name)
    return ConfigReader.read(filepath)


def generate_fov_cell_merge_img(exp_dir, exp_id):
    cellmask_file = join_filepath([exp_dir, f"{exp_id}_{CELLMASK_SUFFIX}.mat"])
    fov_file = join_filepath([exp_dir, f"{exp_id}_{FOV_SUFFIX}.tif"])

    # csr_matrix to numpy array
    cellmask = loadmat(cellmask_file).get(CELLMASK_FIELDNAME).toarray()
    fov = tifffile.imread(fov_file).astype(np.double)
    fov_n = fov / np.max(fov)

    imxx, ncells = cellmask.shape
    imx = imy = int(math.sqrt(imxx))

    cellmask = np.reshape(cellmask, (imx, imy, ncells), order="F")

    for i in range(ncells):
        cell_mask = np.where(cellmask[:, :, i] == 0, 0.0, 1.0)
        fov_highcontrast = np.minimum(fov_n / FOV_CONTRAST, 1)
        fov_cell_merge = np.repeat(fov_highcontrast[:, :, np.newaxis], 3, axis=2)
        fov_cell_merge[:, :, 1] = fov_cell_merge[:, :, 2] * (1 - cell_mask / 2)
        fov_cell_merge = np.round(fov_cell_merge * 255).astype(np.uint8)
        tifffile.imwrite(
            join_filepath([exp_dir, "pixelmaps", f"fov_cell_merge_{i}.tif"]),
            fov_cell_merge,
        )


async def expdb_batch(exp_id: str):
    try:
        subject_id = exp_id.split("_")[0]
        exp_dir = join_filepath([DIRPATH.EXPDB_DIR, subject_id, exp_id])

        if not (os.path.exists(exp_dir) and os.path.isdir(exp_dir)):
            raise Exception(f"Data for experiment_id: {exp_id} does not exist")

        expdb = ExpDbData(
            paths=[
                join_filepath([exp_dir, f"{exp_id}_{TS_SUFFIX}.mat"]),
                join_filepath([exp_dir, f"{exp_id}_{TC_SUFFIX}.mat"]),
            ]
        )

        for dirname in ["plots", "stats", "pixelmaps"]:
            create_directory(join_filepath([exp_dir, dirname]), delete_dir=True)

        generate_fov_cell_merge_img(exp_dir, exp_id)

        stat = stat_file_convert(
            expdb=expdb,
            output_dir=exp_dir,
            params=get_default_params("stat_file_convert"),
            export_plot=True,
        )

        oneway_anova(
            stat=stat,
            output_dir=exp_dir,
            params=get_default_params("oneway_anova"),
            export_plot=True,
        )

        curvefit_tuning(
            stat=stat,
            output_dir=exp_dir,
            params=get_default_params("curvefit_tuning"),
            export_plot=True,
        )

        vector_average(
            stat=stat,
            output_dir=exp_dir,
            params=get_default_params("vector_average"),
            export_plot=True,
        )
        return {"status": "success"}
    except Exception as e:
        return {"status": "failed", "message": str(e)}


@router.post("")
async def run_expdb_batch(exp_id: str):
    res = await expdb_batch(exp_id)
    if res["status"] == "failed":
        raise HTTPException(status_code=404, detail=res["message"])
    else:
        return Response(status_code=200)
