import json
import logging
import math
import os
from dataclasses import dataclass
from glob import glob
from typing import Optional, Tuple

import numpy as np
import tifffile
from lauda import stopwatch
from PIL import Image
from scipy.io import loadmat, savemat
from sqlmodel import Session

from studio.app.common.core.utils.config_handler import ConfigReader
from studio.app.common.core.utils.filepath_creater import (
    create_directory,
    join_filepath,
)
from studio.app.common.core.utils.filepath_finder import find_param_filepath
from studio.app.common.dataclass.image import ImageData
from studio.app.const import (
    ACCEPT_FILE_EXT,
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
from studio.app.optinist.core.nwb.nwb import NWBDATASET
from studio.app.optinist.core.nwb.nwb_creater import save_nwb
from studio.app.optinist.dataclass import ExpDbData, StatData
from studio.app.optinist.dataclass.microscope import MicroscopeData
from studio.app.optinist.wrappers.caiman.cnmf_preprocessing import (
    caiman_cnmf_preprocessing,
)
from studio.app.optinist.wrappers.expdb import analyze_stats
from studio.app.optinist.wrappers.expdb.get_orimap import get_orimap
from studio.app.optinist.wrappers.expdb.kmeans_analysis import (
    generate_kmeans_visualization,
    kmeans_analysis,
)
from studio.app.optinist.wrappers.expdb.pca_analysis import (
    generate_pca_visualization,
    pca_analysis,
)
from studio.app.optinist.wrappers.expdb.preprocessing import preprocessing


@dataclass
class Result:
    success: bool
    message: Optional[str] = None


def get_default_params(name: str):
    filepath = find_param_filepath(name)
    return ConfigReader.read(filepath)


def save_image_with_thumb(img_path: str, img):
    if isinstance(img, np.ndarray):
        img = Image.fromarray(img)
        if img.mode == "F":
            img = img.convert("RGB")
    img.save(img_path)
    w, h = img.size
    new_width = int(w * (THUMBNAIL_HEIGHT / h))
    thumb_img = img.resize((new_width, THUMBNAIL_HEIGHT), Image.Resampling.LANCZOS)
    thumb_img.save(img_path.replace(".png", ".thumb.png"))


class ExpDbPath:
    def __init__(self, exp_id: str, is_raw=False):
        subject_id = exp_id.split("_")[0]

        if is_raw:
            self.exp_dir = join_filepath([DIRPATH.EXPDB_DIR, subject_id, exp_id])
            assert os.path.exists(self.exp_dir), f"exp_dir not found: {self.exp_dir}"
            self.output_dir = join_filepath([self.exp_dir, "outputs"])

            # input_files
            microscope_files = []
            for ext in ACCEPT_FILE_EXT.MICROSCOPE_EXT.value:
                microscope_files.extend(glob(join_filepath([self.exp_dir, f"*{ext}"])))
            self.microscope_file = (
                microscope_files[0] if len(microscope_files) > 0 else None
            )
            # NOTE: Metadata file is allowed to be missing.
            self.exp_metadata_file = join_filepath(
                [self.exp_dir, f"{exp_id}_{EXP_METADATA_SUFFIX}.json"]
            )
            self.ts_file = join_filepath([self.exp_dir, f"{exp_id}_{TS_SUFFIX}.mat"])
            assert os.path.exists(self.ts_file), f"ts_file not found: {self.ts_file}"

            # preprocess
            self.preprocess_dir = join_filepath([self.exp_dir, "preprocess"])
            self.info_file = join_filepath([self.preprocess_dir, f"{exp_id}_info.mat"])

            self.orimaps_dir = join_filepath([self.preprocess_dir, "orimaps"])
            self.fov_file = join_filepath(
                [self.orimaps_dir, f"{exp_id}_{FOV_SUFFIX}.tif"]
            )

            self.tc_file = join_filepath(
                [self.preprocess_dir, f"{exp_id}_{TC_SUFFIX}.mat"]
            )
            self.cellmask_file = join_filepath(
                [self.preprocess_dir, f"{exp_id}_{CELLMASK_SUFFIX}.mat"]
            )
        else:
            self.exp_dir = join_filepath([DIRPATH.PUBLIC_EXPDB_DIR, subject_id, exp_id])
            self.output_dir = self.exp_dir

        # outputs
        self.plot_dir = join_filepath([self.output_dir, "plots"])
        self.cellmask_dir = join_filepath([self.output_dir, "cellmasks"])
        self.pixelmap_dir = join_filepath([self.output_dir, "pixelmaps"])
        self.pca_spatial_dir = join_filepath(
            [self.output_dir, "pca_components_spatial"]
        )
        self.pca_time_dir = join_filepath([self.output_dir, "pca_components_time"])
        self.nwb_file = join_filepath([self.output_dir, f"{exp_id}.nwb"])


class ExpDbBatch:
    LOGGER_NAME = None  # Note: use root logger (empty name)

    def __init__(self, exp_id: str, org_id: int) -> None:
        self.logger_ = logging.getLogger(__class__.LOGGER_NAME)
        self.exp_id = exp_id
        self.org_id = org_id

        self.raw_path = ExpDbPath(self.exp_id, is_raw=True)
        self.pub_path = ExpDbPath(self.exp_id)
        self.expdb_paths = [self.raw_path, self.pub_path]
        self.nwb_input_config = ConfigReader.read(filepath=find_param_filepath("nwb"))
        self.nwbfile = {}

    def __stopwatch_callback(watch, function=None):
        logging.getLogger(__class__.LOGGER_NAME).info(
            "processing done. [%s()][elapsed_time: %.6f sec]",
            (function.__name__ if function is not None else "(N/A)"),
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
    def preprocess(self) -> ImageData:
        self.logger_.info("process 'preprocess' start.")
        create_directory(self.raw_path.preprocess_dir)

        preprocess_results = preprocessing(
            microscope=MicroscopeData(self.raw_path.microscope_file),
            output_dir=self.raw_path.preprocess_dir,
            params=get_default_params("preprocessing"),
            nwbfile=self.nwb_input_config,
        )

        savemat(
            join_filepath([self.raw_path.info_file]),
            {
                k: v.data
                for k, v in preprocess_results.items()
                if isinstance(v, ImageData)
            },
        )
        self.nwb_input_config = preprocess_results["nwbfile"]["input"]

        return preprocess_results["stack"]

    @stopwatch(callback=__stopwatch_callback)
    def generate_orimaps(self, stack: ImageData):
        self.logger_.info("process 'generate_orimaps' start.")
        create_directory(self.raw_path.orimaps_dir)

        expdb = ExpDbData(paths=[self.raw_path.ts_file])
        get_orimap(
            stack=stack,
            expdb=expdb,
            output_dir=self.raw_path.orimaps_dir,
            params={**get_default_params("get_orimap"), "exp_id": self.exp_id},
        )

    @stopwatch(callback=__stopwatch_callback)
    def cell_detection_cnmf(self, stack: ImageData):
        # NOTE: frame rateなどの情報を引き渡すためにnwb_input_configを引数に与える
        self.logger_.info("process 'cell_detection_cnmf' start.")
        return caiman_cnmf_preprocessing(
            images=stack,
            output_dir=self.raw_path.preprocess_dir,
            params=get_default_params("caiman_cnmf_preprocessing"),
            nwbfile=self.nwb_input_config,
        )

    @stopwatch(callback=__stopwatch_callback)
    def generate_statdata(self) -> StatData:
        self.logger_.info("process 'generate_statdata' start.")

        expdb = ExpDbData(paths=[self.raw_path.tc_file, self.raw_path.ts_file])
        result = analyze_stats(
            expdb, self.raw_path.output_dir, get_default_params("analyze_stats")
        )
        stat = result.get("stat")
        assert isinstance(stat, StatData), "generate statdata failed"

        self.nwbfile[NWBDATASET.ORISTATS] = result["nwbfile"][NWBDATASET.ORISTATS]

        return stat

    @stopwatch(callback=__stopwatch_callback)
    def generate_cellmasks(self) -> int:
        self.logger_.info("process 'generate_cellmasks' start.")

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
    def generate_plots(self, stat_data: StatData):
        self.logger_.info("process 'generate_plots' start.")

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
        self.logger_.info("process 'generate_pixelmaps' start.")

        for expdb_path in self.expdb_paths:
            create_directory(expdb_path.pixelmap_dir)

        pixelmaps = glob(join_filepath([self.raw_path.orimaps_dir, "*_hc.tif"]))
        pixlemaps_with_num = glob(
            join_filepath([self.raw_path.orimaps_dir, "*_hc_*.tif"])
        )
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

    def generate_pca_plots(self, stat_data: StatData, cnmf_info: dict):
        self.logger_.info("process 'generate_pca_analysis_plots' start.")

        # Perform PCA analysis
        pca_results = pca_analysis(
            stat=stat_data,
            cnmf_info=cnmf_info,
            output_dir=self.raw_path.output_dir,
            params=get_default_params("pca_analysis"),
            nwbfile=self.nwbfile,
        )

        # Update nwbfile with PCA results
        self.nwbfile = pca_results["nwbfile"]

        # Save plots for each path
        for expdb_path in self.expdb_paths:
            create_directory(expdb_path.plot_dir)
            create_directory(expdb_path.pca_spatial_dir)
            create_directory(expdb_path.pca_time_dir)

            # Save visualization objects with correct names
            stat_data.pca_analysis.save_plot(expdb_path.plot_dir)
            stat_data.pca_analysis_variance.save_plot(expdb_path.plot_dir)
            stat_data.pca_contribution.save_plot(expdb_path.plot_dir)

            # Generate additional detailed visualization
            generate_pca_visualization(
                scores=stat_data.pca_scores,
                explained_variance=stat_data.pca_explained_variance,
                components=stat_data.pca_components,
                roi_masks=cnmf_info["cell_roi"].data,
                output_dir=expdb_path.plot_dir,
                pca_spatial_dir=expdb_path.pca_spatial_dir,
                pca_time_dir=expdb_path.pca_time_dir,
            )

    def generate_kmeans_plots(self, stat_data, cnmf_info):
        self.logger_.info("process 'generate_kmeans_analysis_plots' start.")

        # Perform KMeans analysis
        kmeans_results = kmeans_analysis(
            stat=stat_data,
            cnmf_info=cnmf_info,
            output_dir=self.raw_path.output_dir,
            params=get_default_params("kmeans_analysis"),
            nwbfile=self.nwbfile,
        )

        # Update nwbfile with clustering results
        self.nwbfile = kmeans_results["nwbfile"]

        # Save plots for each path
        for expdb_path in self.expdb_paths:
            dir_path = expdb_path.plot_dir
            create_directory(dir_path)

            # Save visualization object
            stat_data.clustering_analysis.save_plot(dir_path)

            # Generate additional visualizations
            generate_kmeans_visualization(
                labels=stat_data.cluster_labels,
                corr_matrix=stat_data.cluster_corr_matrix,
                fluorescence=stat_data.fluorescence,
                roi_masks=cnmf_info["cell_roi"].data,
                output_dir=dir_path,
            )

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

    @stopwatch(callback=__stopwatch_callback)
    def save_nwb(self, metadata: dict):
        if self.raw_path.microscope_file is not None:
            self.nwb_input_config[NWBDATASET.IMAGE_SERIES][
                "external_file"
            ] = self.raw_path.microscope_file
        self.nwb_input_config[NWBDATASET.LAB_METADATA] = metadata

        for expdb_path in self.expdb_paths:
            save_nwb(expdb_path.nwb_file, self.nwb_input_config, self.nwbfile)
