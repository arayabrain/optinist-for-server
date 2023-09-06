import logging
import math
import os
import shutil
from dataclasses import dataclass
from glob import glob
from typing import Optional

import numpy as np
import tifffile
from fastapi import HTTPException
from lauda import stopwatch
from scipy.io import loadmat
from sqlmodel import Session

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
from studio.app.optinist.core.expdb.crud_cells import bulk_delete_cells
from studio.app.optinist.core.expdb.crud_expdb import delete_experiment, get_experiment
from studio.app.optinist.dataclass import ExpDbData, StatData
from studio.app.optinist.wrappers.expdb import analyze_stats


@dataclass
class Result:
    success: bool
    message: Optional[str] = None


def get_default_params(name: str):
    filepath = find_param_filepath(name)
    return ConfigReader.read(filepath)


class ExpDbBatch:
    def __init__(self, exp_id: str, org_id: int) -> None:
        self.logger_ = logging.getLogger()
        self.exp_id = exp_id
        self.org_id = org_id
        self.subject_id = self.exp_id.split("_")[0]
        self.exp_dir = join_filepath([DIRPATH.EXPDB_DIR, self.subject_id, self.exp_id])
        if not (os.path.exists(self.exp_dir)):
            raise Exception(
                f"Experiment directory for id: {self.exp_id} does not exist"
            )

        self.pixelmap_dir = join_filepath([self.exp_dir, "pixelmaps"])
        self.plot_dir = join_filepath([self.exp_dir, "plots"])

        self.stat_file = join_filepath([self.exp_dir, f"{self.exp_id}_oristats.hdf5"])
        self.cellmask_file = join_filepath(
            [self.exp_dir, f"{self.exp_id}_{CELLMASK_SUFFIX}.mat"]
        )
        self.fov_file = join_filepath([self.exp_dir, f"{self.exp_id}_{FOV_SUFFIX}.tif"])

    def __stopwatch_callback(watch, function):
        logging.getLogger().info(
            "processing done. [%s()][elapsed_time: %.6f sec]",
            function.__name__,
            watch.elapsed_time,
        )

    @stopwatch(callback=__stopwatch_callback)
    async def cleanup_exp_record(self, db: Session):
        if os.path.exists(self.stat_file):
            os.remove(self.stat_file)
        if os.path.exists(self.pixelmap_dir):
            shutil.rmtree(self.pixelmap_dir)
        if os.path.exists(self.plot_dir):
            shutil.rmtree(self.plot_dir)

        try:
            exp = await get_experiment(db, self.exp_id, self.org_id)
            await bulk_delete_cells(db, exp.id)
            await delete_experiment(db, exp.id)
        except HTTPException as e:
            if e.status_code != 404:
                raise e

    @stopwatch(callback=__stopwatch_callback)
    def generate_statdata(self):
        expdb = ExpDbData(
            paths=[
                join_filepath([self.exp_dir, f"{self.exp_id}_{TS_SUFFIX}.mat"]),
                join_filepath([self.exp_dir, f"{self.exp_id}_{TC_SUFFIX}.mat"]),
            ]
        )

        stat: StatData = analyze_stats(
            expdb, self.exp_dir, get_default_params("analyze_stats")
        ).get("stat")
        assert isinstance(stat, StatData), "generate statdata failed"

        stat.save_as_hdf5(self.exp_dir, f"{self.exp_id}_oristats")
        assert os.path.exists(self.stat_file), "save statdata failed"

    @stopwatch(callback=__stopwatch_callback)
    def generate_pixelmaps(self) -> int:
        create_directory(self.pixelmap_dir)

        # csr_matrix to numpy array
        cellmask = loadmat(self.cellmask_file).get(CELLMASK_FIELDNAME).toarray()
        fov = tifffile.imread(self.fov_file).astype(np.double)
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
            pixelmap_file = join_filepath(
                [self.pixelmap_dir, f"fov_cell_merge_{i}.tif"]
            )
            tifffile.imwrite(pixelmap_file, fov_cell_merge)

        assert (
            len(glob(join_filepath([self.pixelmap_dir, "fov_cell_merge_*.tif"])))
            == ncells
        ), "generate pixelmaps failed"

        return ncells

    @stopwatch(callback=__stopwatch_callback)
    def generate_plots(self):
        create_directory(self.plot_dir)

        stat = StatData.load_from_hdf5(
            join_filepath([self.exp_dir, f"{self.exp_id}_oristats.hdf5"])
        )

        stat.tuning_curve.save_plot(self.plot_dir)
        stat.tuning_curve_polar.save_plot(self.plot_dir)

        stat.direction_responsivity_ratio.save_plot(self.plot_dir)
        stat.orientation_responsivity_ratio.save_plot(self.plot_dir)
        stat.direction_selectivity.save_plot(self.plot_dir)
        stat.orientation_selectivity.save_plot(self.plot_dir)
        stat.best_responsivity.save_plot(self.plot_dir)

        stat.preferred_direction.save_plot(self.plot_dir)
        stat.preferred_orientation.save_plot(self.plot_dir)

        stat.direction_tuning_width.save_plot(self.plot_dir)
        stat.orientation_tuning_width.save_plot(self.plot_dir)
