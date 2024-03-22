import h5py
import numpy as np

from studio.app.common.dataclass.base import BaseData
from studio.app.common.dataclass.histogram import HistogramData
from studio.app.common.dataclass.line import LineData
from studio.app.common.dataclass.pie import PieData
from studio.app.common.dataclass.polar import PolarData
from studio.app.optinist.core.nwb.oristat import Oristats


class StatData(BaseData):
    def __init__(self, data_table=np.empty((1, 1, 1)), file_name="stat"):
        super().__init__(file_name)
        # params
        self.ncells, self.ntrials, self.nstimplus = data_table.shape
        self.data_table = data_table
        self.nstim = self.nstimplus - 1
        half_nstim = int(self.nstim / 2)
        self.p_value_threshold = 0.05
        self.r_best_threshold = 0.05
        self.si_threshold = 0.3

        # --- stat_file_convert ---
        self.nstim_per_trial = None
        self.dir_ratio_change = np.full((self.ncells, self.nstim), np.NaN)
        self.best_dir = np.full(self.ncells, np.NaN)
        self.null_dir = np.full(self.ncells, np.NaN)
        self.r_best_dir = np.full(self.ncells, np.NaN)
        self.r_null_dir = np.full(self.ncells, np.NaN)
        self.r_min_dir = np.full(self.ncells, np.NaN)
        self.di = np.full(self.ncells, np.NaN)
        self.dsi = None
        self.ori_ratio_change = np.full((self.ncells, half_nstim), np.NaN)
        self.best_ori = np.full(self.ncells, np.NaN)
        self.null_ori = np.full(self.ncells, np.NaN)
        self.r_best_ori = np.full(self.ncells, np.NaN)
        self.r_null_ori = np.full(self.ncells, np.NaN)
        self.r_min_ori = np.full(self.ncells, np.NaN)
        self.oi = np.full(self.ncells, np.NaN)
        self.osi = None

        # --- anova1_mult ---
        self.p_value_resp = np.full(self.ncells, np.NaN)
        self.sig_epochs_resp = np.full(
            (self.ncells, self.nstimplus, self.nstimplus), np.NaN
        )
        self.p_value_sel = np.full(self.ncells, np.NaN)
        self.sig_epochs_sel = np.full((self.ncells, self.nstim, self.nstim), np.NaN)
        self.dir_sig = np.full(self.ncells, np.NaN)
        self.p_value_ori_resp = np.full(self.ncells, np.NaN)
        self.sig_epochs_ori_resp = np.full(
            (self.ncells, half_nstim + 1, half_nstim + 1), np.NaN
        )
        self.p_value_ori_sel = np.full(self.ncells, np.NaN)
        self.sig_epochs_ori_sel = np.full((self.ncells, half_nstim, half_nstim), np.NaN)
        self.index_visually_responsive_cell = None
        self.ncells_visually_responsive_cell = None
        self.index_direction_selective_cell = None
        self.ncells_direction_selective_cell = None
        self.index_orientation_selective_cell = None
        self.ncells_orientation_selective_cell = None

        # --- vector_average ---
        self.dir_vector_angle = np.full(self.ncells, np.NaN)
        self.dir_vector_mag = np.full(self.ncells, np.NaN)
        self.dir_vector_tune = np.full(self.ncells, np.NaN)
        self.ori_vector_angle = np.full(self.ncells, np.NaN)
        self.ori_vector_mag = np.full(self.ncells, np.NaN)
        self.ori_vector_tune = np.full(self.ncells, np.NaN)

        # --- curvefit_tuning ---
        self.best_dir_interp = np.full(self.ncells, np.NaN)
        self.null_dir_interp = np.full(self.ncells, np.NaN)
        self.r_best_dir_interp = np.full(self.ncells, np.NaN)
        self.r_null_dir_interp = np.full(self.ncells, np.NaN)
        self.di_interp = np.full(self.ncells, np.NaN)
        self.best_dir_fit = np.full(self.ncells, np.NaN)
        self.null_dir_fit = np.full(self.ncells, np.NaN)
        self.r_best_dir_fit = np.full(self.ncells, np.NaN)
        self.r_null_dir_fit = np.full(self.ncells, np.NaN)
        self.di_fit = np.full(self.ncells, np.NaN)
        self.ds = np.full(self.ncells, np.NaN)
        self.dir_tuning_width = np.full(self.ncells, np.NaN)
        self.dir_a1 = np.full(self.ncells, np.NaN)
        self.dir_a2 = np.full(self.ncells, np.NaN)
        self.dir_k1 = np.full(self.ncells, np.NaN)
        self.dir_k2 = np.full(self.ncells, np.NaN)
        self.best_ori_fit = np.full(self.ncells, np.NaN)
        self.ori_tuning_width = np.full(self.ncells, np.NaN)
        self.ori_k1 = np.full(self.ncells, np.NaN)
        self.ori_a1 = np.full(self.ncells, np.NaN)

    # --- stat_file_convert ---
    def set_si(self):
        self.dsi = (self.r_best_dir - np.maximum(self.r_null_dir, 0)) / (
            self.r_best_dir + np.maximum(self.r_null_dir, 0)
        )
        self.osi = (self.r_best_ori - np.maximum(self.r_null_ori, 0)) / (
            self.r_best_ori + np.maximum(self.r_null_ori, 0)
        )

    @property
    def tuning_curve(self):
        return LineData(
            data=self.dir_ratio_change,
            columns=np.arange(0, 360, 360 / self.nstim_per_trial),
            file_name="tuning_curve",
        )

    @property
    def tuning_curve_polar(self):
        return PolarData(
            data=self.dir_ratio_change,
            thetas=np.linspace(
                0, 360, self.dir_ratio_change[0].shape[0], endpoint=False
            ),
            file_name="tuning_curve_polar",
        )

    # --- anova ---
    def set_responsivity_and_selectivity(self):
        self.index_visually_responsive_cell = np.where(
            (self.p_value_resp < self.p_value_threshold)
            & (self.r_best_dir >= self.r_best_threshold),
            True,
            False,
        )

        self.ncells_visually_responsive_cell = np.sum(
            self.index_visually_responsive_cell
        )

        self.index_direction_selective_cell = np.where(
            self.index_visually_responsive_cell & (self.dsi >= self.si_threshold),
            True,
            False,
        )
        self.ncells_direction_selective_cell = np.sum(
            self.index_direction_selective_cell
        )

        self.index_orientation_selective_cell = np.where(
            self.index_visually_responsive_cell & (self.osi >= self.si_threshold),
            True,
            False,
        )
        self.ncells_orientation_selective_cell = np.sum(
            self.index_orientation_selective_cell
        )

    @property
    def direction_responsivity_ratio(self):
        return PieData(
            data=np.array(
                (
                    self.ncells_direction_selective_cell,
                    self.ncells_visually_responsive_cell
                    - self.ncells_direction_selective_cell,
                    self.ncells - self.ncells_visually_responsive_cell,
                )
            ),
            labels=["DS", "non-DS", "non-responsive"],
            file_name="direction_responsivity_ratio",
        )

    @property
    def orientation_responsivity_ratio(self):
        return PieData(
            data=np.array(
                (
                    self.ncells_orientation_selective_cell,
                    self.ncells_visually_responsive_cell
                    - self.ncells_orientation_selective_cell,
                    self.ncells - self.ncells_visually_responsive_cell,
                )
            ),
            labels=["OS", "non-OS", "non-responsive"],
            file_name="orientation_responsivity_ratio",
        )

    @property
    def direction_selectivity(self):
        return HistogramData(
            data=self.dsi[self.index_direction_selective_cell],
            file_name="direction_selectivity",
        )

    @property
    def orientation_selectivity(self):
        return HistogramData(
            data=self.osi[self.index_orientation_selective_cell],
            file_name="orientation_selectivity",
        )

    @property
    def best_responsivity(self):
        return HistogramData(
            data=self.r_best_dir[self.index_visually_responsive_cell] * 100,
            file_name="best_responsivity",
        )

    # --- vector_average ---
    @property
    def preferred_direction(self):
        return HistogramData(
            data=self.dir_vector_angle[self.index_direction_selective_cell],
            file_name="preferred_direction",
        )

    @property
    def preferred_orientation(self):
        return HistogramData(
            data=self.ori_vector_angle[self.index_orientation_selective_cell],
            file_name="preferred_orientation",
        )

    # --- curvefit_tuning ---
    @property
    def direction_tuning_width(self):
        return HistogramData(
            data=self.dir_tuning_width[self.index_direction_selective_cell],
            file_name="direction_tuning_width",
        )

    @property
    def orientation_tuning_width(self):
        return HistogramData(
            data=self.ori_tuning_width[self.index_orientation_selective_cell],
            file_name="orientation_tuning_width",
        )

    @property
    def nwb_data(self):
        stats_dict = self.__dict__.copy()
        stats_dict.pop("file_name")
        stats_dict.update(
            {
                "tuning_curve": self.tuning_curve.data,
                "tuning_curve_polar": self.tuning_curve_polar.data,
                "direction_responsivity_ratio": self.direction_responsivity_ratio.data,
                "orientation_responsivity_ratio": self.orientation_responsivity_ratio.data,  # noqa: E501
                "direction_selectivity": self.direction_selectivity.data,
                "orientation_selectivity": self.orientation_selectivity.data,
                "best_responsivity": self.best_responsivity.data,
                "preferred_direction": self.preferred_direction.data,
                "preferred_orientation": self.preferred_orientation.data,
                "direction_tuning_width": self.direction_tuning_width.data,
                "orientation_tuning_width": self.orientation_tuning_width.data,
            }
        )
        return Oristats(**stats_dict)

    def save_as_hdf5(self, filepath):
        with h5py.File(filepath, "w") as f:
            for k, v in self.__dict__.items():
                f.create_dataset(k, data=v)

    @classmethod
    def load_from_hdf5(cls, file_path):
        cls = cls()
        with h5py.File(file_path, "r") as f:
            for k, v in f.items():
                cls.__dict__[k] = v[()]
        return cls

    @classmethod
    def fill_nan_with_none(cls, data):
        return np.where(np.isnan(data), None, data)
