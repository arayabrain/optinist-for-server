import logging
import math
import os
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


class ExpDbPath:
    def __init__(self, exp_id: str, is_raw=False):
        base_dir = DIRPATH.EXPDB_DIR if is_raw else DIRPATH.PUBLIC_EXPDB_DIR
        subject_id = exp_id.split("_")[0]

        self.exp_dir = join_filepath([base_dir, subject_id, exp_id])
        self.output_dir = join_filepath([self.exp_dir, "outputs"])
        self.pixelmap_dir = join_filepath([self.output_dir, "pixelmaps"])
        self.plot_dir = join_filepath([self.output_dir, "plots"])
        self.stat_file = join_filepath([self.output_dir, f"{exp_id}_oristats.hdf5"])

        if is_raw:
            self.tc_file = join_filepath([self.exp_dir, f"{exp_id}_{TC_SUFFIX}.mat"])
            self.ts_file = join_filepath([self.exp_dir, f"{exp_id}_{TS_SUFFIX}.mat"])
            self.cellmask_file = join_filepath(
                [self.exp_dir, f"{exp_id}_{CELLMASK_SUFFIX}.mat"]
            )
            self.fov_file = join_filepath([self.exp_dir, f"{exp_id}_{FOV_SUFFIX}.tif"])


class ExpDbBatch:
    def __init__(self, exp_id: str, org_id: int) -> None:
        self.logger_ = logging.getLogger()
        self.exp_id = exp_id
        self.org_id = org_id

        self.raw_path = ExpDbPath(self.exp_id, is_raw=True)
        if not (os.path.exists(self.raw_path.exp_dir)):
            raise Exception(
                f"Experiment directory for id: {self.exp_id} does not exist"
            )

        self.pub_path = ExpDbPath(self.exp_id)
        self.expdb_paths = [self.raw_path, self.pub_path]

    def __stopwatch_callback(watch, function):
        logging.getLogger().info(
            "processing done. [%s()][elapsed_time: %.6f sec]",
            function.__name__,
            watch.elapsed_time,
        )

    @stopwatch(callback=__stopwatch_callback)
    def cleanup_exp_record(self, db: Session):
        try:
            exp = get_experiment(db, self.exp_id, self.org_id)
            bulk_delete_cells(db, exp.id)
            delete_experiment(db, exp.id)
        except HTTPException as e:
            if e.status_code != 404:
                raise e

        for expdb_path in self.expdb_paths:
            create_directory(expdb_path.output_dir, delete_dir=True)

    @stopwatch(callback=__stopwatch_callback)
    def generate_statdata(self):
        expdb = ExpDbData(paths=[self.raw_path.tc_file, self.raw_path.ts_file])
        stat: StatData = analyze_stats(
            expdb, self.raw_path.output_dir, get_default_params("analyze_stats")
        ).get("stat")
        assert isinstance(stat, StatData), "generate statdata failed"

        for expdb_path in self.expdb_paths:
            stat.save_as_hdf5(expdb_path.stat_file)
            assert os.path.exists(
                expdb_path.stat_file
            ), f"save statfile failed: {expdb_path.stat_file}"

    @stopwatch(callback=__stopwatch_callback)
    def generate_pixelmaps(self) -> int:
        for expdb_path in self.expdb_paths:
            create_directory(expdb_path.pixelmap_dir)

        # csr_matrix to numpy array
        cellmask = (
            loadmat(self.raw_path.cellmask_file).get(CELLMASK_FIELDNAME).toarray()
        )
        fov = tifffile.imread(self.raw_path.fov_file).astype(np.double)
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

            for expdb_path in self.expdb_paths:
                pixelmap_file = join_filepath(
                    [expdb_path.pixelmap_dir, f"fov_cell_merge_{i}.tif"]
                )
                tifffile.imwrite(pixelmap_file, fov_cell_merge)

        for expdb_path in self.expdb_paths:
            assert (
                len(
                    glob(
                        join_filepath([expdb_path.pixelmap_dir, "fov_cell_merge_*.tif"])
                    )
                )
                == ncells
            ), f"generate pixelmaps in failed: {expdb_path.pixelmap_dir}"

        return ncells

    @stopwatch(callback=__stopwatch_callback)
    def generate_plots(self):
        stat = StatData.load_from_hdf5(self.raw_path.stat_file)

        for expdb_path in self.expdb_paths:
            dir_path = expdb_path.plot_dir
            create_directory(dir_path)

            stat.tuning_curve.save_plot(dir_path)
            stat.tuning_curve_polar.save_plot(dir_path)

            stat.direction_responsivity_ratio.save_plot(dir_path)
            stat.orientation_responsivity_ratio.save_plot(dir_path)
            stat.direction_selectivity.save_plot(dir_path)
            stat.orientation_selectivity.save_plot(dir_path)
            stat.best_responsivity.save_plot(dir_path)

            stat.preferred_direction.save_plot(dir_path)
            stat.preferred_orientation.save_plot(dir_path)

            stat.direction_tuning_width.save_plot(dir_path)
            stat.orientation_tuning_width.save_plot(dir_path)
