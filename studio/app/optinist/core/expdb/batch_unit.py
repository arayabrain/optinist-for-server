import json
import logging
import math
import os
from dataclasses import dataclass
from glob import glob
from typing import Optional, Tuple

import cv2
import numpy as np
import tifffile
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
    EXP_METADATA_SUFFIX,
    FOV_CONTRAST,
    FOV_SUFFIX,
    TC_SUFFIX,
    THUMBNAIL_HEIGHT,
    TS_SUFFIX,
)
from studio.app.dir_path import DIRPATH
from studio.app.optinist.core.expdb.crud_cells import bulk_delete_cells
from studio.app.optinist.core.expdb.crud_expdb import (
    delete_experiment,
    extract_experiment_view_attributes,
    get_experiment,
)
from studio.app.optinist.dataclass import ExpDbData, StatData
from studio.app.optinist.wrappers.expdb import analyze_stats


@dataclass
class Result:
    success: bool
    message: Optional[str] = None


def get_default_params(name: str):
    filepath = find_param_filepath(name)
    return ConfigReader.read(filepath)


def save_image_with_thumb(img_path: str, img):
    cv2.imwrite(img_path, img)
    thumb_img = cv2.resize(img, dsize=(THUMBNAIL_HEIGHT, THUMBNAIL_HEIGHT))
    cv2.imwrite(img_path.replace(".png", ".thumb.png"), thumb_img)


class ExpDbPath:
    def __init__(self, exp_id: str, is_raw=False):
        subject_id = exp_id.split("_")[0]

        if is_raw:
            self.exp_dir = join_filepath([DIRPATH.EXPDB_DIR, subject_id, exp_id])
            assert os.path.exists(self.exp_dir), f"exp_dir not found: {self.exp_dir}"
            self.output_dir = join_filepath([self.exp_dir, "outputs"])
            self.tc_file = join_filepath([self.exp_dir, f"{exp_id}_{TC_SUFFIX}.mat"])
            self.ts_file = join_filepath([self.exp_dir, f"{exp_id}_{TS_SUFFIX}.mat"])
            self.cellmask_file = join_filepath(
                [self.exp_dir, f"{exp_id}_{CELLMASK_SUFFIX}.mat"]
            )
            self.fov_file = join_filepath([self.exp_dir, f"{exp_id}_{FOV_SUFFIX}.tif"])
            self.exp_metadata_file = join_filepath(
                [self.exp_dir, f"{exp_id}_{EXP_METADATA_SUFFIX}.json"]
            )
            assert os.path.exists(self.tc_file), f"tc_file not found: {self.tc_file}"
            assert os.path.exists(self.ts_file), f"ts_file not found: {self.ts_file}"
            assert os.path.exists(
                self.cellmask_file
            ), f"cellmask_file not found: {self.cellmask_file}"
            assert os.path.exists(self.fov_file), f"fov_file not found: {self.fov_file}"
            # Note: Metadata file is allowed to be missing.
        else:
            self.exp_dir = join_filepath([DIRPATH.PUBLIC_EXPDB_DIR, subject_id, exp_id])
            self.output_dir = self.exp_dir

        # outputs
        self.stat_file = join_filepath([self.output_dir, f"{exp_id}_oristats.hdf5"])
        self.plot_dir = join_filepath([self.output_dir, "plots"])
        self.cellmask_dir = join_filepath([self.output_dir, "cellmasks"])
        self.pixelmap_dir = join_filepath([self.output_dir, "pixelmaps"])


class ExpDbBatch:
    def __init__(self, exp_id: str, org_id: int) -> None:
        self.logger_ = logging.getLogger()
        self.exp_id = exp_id
        self.org_id = org_id

        self.raw_path = ExpDbPath(self.exp_id, is_raw=True)
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
        except AssertionError:
            pass

        for expdb_path in self.expdb_paths:
            create_directory(expdb_path.output_dir, delete_dir=True)

    @stopwatch(callback=__stopwatch_callback)
    def load_raw_cellmask_data(self) -> int:
        # csr_matrix to numpy array
        cellmask = (
            loadmat(self.raw_path.cellmask_file).get(CELLMASK_FIELDNAME).toarray()
        )

        imxx, ncells = cellmask.shape
        return (cellmask, imxx, ncells)

    @stopwatch(callback=__stopwatch_callback)
    def generate_statdata(self) -> StatData:
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

        return stat

    @stopwatch(callback=__stopwatch_callback)
    def generate_cellmasks(self) -> int:
        for expdb_path in self.expdb_paths:
            create_directory(expdb_path.cellmask_dir)

        # csr_matrix to numpy array
        cellmask, imxx, ncells = self.load_raw_cellmask_data()

        fov = tifffile.imread(self.raw_path.fov_file).astype(np.double)
        fov_n = fov / np.max(fov)

        imx = imy = int(math.sqrt(imxx))

        cellmask = np.reshape(cellmask, (imx, imy, ncells), order="F")

        for i in range(ncells):
            cell_mask = np.where(cellmask[:, :, i] == 0, 0.0, 1.0)
            fov_highcontrast = np.minimum(fov_n / FOV_CONTRAST, 1)
            fov_cell_merge = np.repeat(fov_highcontrast[:, :, np.newaxis], 3, axis=2)
            fov_cell_merge[:, :, 1] = fov_cell_merge[:, :, 2] * (1 - cell_mask / 2)
            fov_cell_merge = np.round(fov_cell_merge * 255).astype(np.uint8)

            for expdb_path in self.expdb_paths:
                save_image_with_thumb(
                    join_filepath([expdb_path.cellmask_dir, f"fov_cell_merge_{i}.png"]),
                    fov_cell_merge,
                )

        for expdb_path in self.expdb_paths:
            assert (
                len(
                    glob(
                        join_filepath(
                            [expdb_path.cellmask_dir, "fov_cell_merge_*.thumb.png"]
                        )
                    )
                )
                == ncells
            ), f"generate cellmasks failed in {expdb_path.cellmask_dir}"

        return ncells

    @stopwatch(callback=__stopwatch_callback)
    def generate_plots(self, stat_data: Optional[StatData] = None):
        if stat_data is None:
            stat_data = StatData.load_from_hdf5(self.raw_path.stat_file)

        for expdb_path in self.expdb_paths:
            dir_path = expdb_path.plot_dir
            create_directory(dir_path)

            stat_data.tuning_curve.save_plot(dir_path)
            stat_data.tuning_curve_polar.save_plot(dir_path)

            stat_data.direction_responsivity_ratio.save_plot(dir_path)
            stat_data.orientation_responsivity_ratio.save_plot(dir_path)
            stat_data.direction_selectivity.save_plot(dir_path)
            stat_data.orientation_selectivity.save_plot(dir_path)
            stat_data.best_responsivity.save_plot(dir_path)

            stat_data.preferred_direction.save_plot(dir_path)
            stat_data.preferred_orientation.save_plot(dir_path)

            stat_data.direction_tuning_width.save_plot(dir_path)
            stat_data.orientation_tuning_width.save_plot(dir_path)

    @stopwatch(callback=__stopwatch_callback)
    def generate_pixelmaps(self):
        for expdb_path in self.expdb_paths:
            create_directory(expdb_path.pixelmap_dir)

        pixelmaps = glob(join_filepath([self.raw_path.exp_dir, "*_hc.tif"]))
        pixlemaps_with_num = glob(join_filepath([self.raw_path.exp_dir, "*_hc_*.tif"]))
        for pixelmap in [*pixelmaps, *pixlemaps_with_num]:
            img = tifffile.imread(pixelmap)
            file_name = os.path.splitext(os.path.basename(pixelmap))[0]

            for expdb_path in self.expdb_paths:
                save_image_with_thumb(
                    join_filepath([expdb_path.pixelmap_dir, f"{file_name}.png"]), img
                )

        for expdb_path in self.expdb_paths:
            assert len(
                glob(join_filepath([expdb_path.pixelmap_dir, "*.thumb.png"]))
            ) == len(pixelmaps) + len(
                pixlemaps_with_num
            ), f"generate pixelmaps failed in {expdb_path.pixelmap_dir}"

    @stopwatch(callback=__stopwatch_callback)
    def load_exp_metadata(self) -> Tuple[dict, dict]:
        if not os.path.exists(self.raw_path.exp_metadata_file):
            return (None, None)
        else:
            with open(self.raw_path.exp_metadata_file) as f:
                attributes = json.load(f)
                view_attributes = extract_experiment_view_attributes(attributes)

                if not view_attributes:
                    raise KeyError("Invalid metadata format")

        return (attributes, view_attributes)
