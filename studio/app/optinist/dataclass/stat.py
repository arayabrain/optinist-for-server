import numpy as np

from studio.app.common.dataclass.base import BaseData


class StatData(BaseData):
    def __init__(self, data_table, file_name="stat"):
        super().__init__(file_name)
        ncells = data_table.shape[0]

        # params
        self.ncells = ncells  #
        self.data_table = data_table  #
        self.ntrials, self.nstimplus = data_table[0][0].shape
        self.nstim = self.nstimplus - 1  #
        self.p_value_threshold = 0.05
        self.r_best_threshold = 0.05
        self.si_threshold = 0.3

        # Direction
        self.dir_ratio_change = np.full((ncells, self.nstim), np.NaN)
        self.best_dir = np.full(ncells, np.NaN)
        self.null_dir = np.full(ncells, np.NaN)
        self.r_best_dir = np.full(ncells, np.NaN)
        self.r_null_dir = np.full(ncells, np.NaN)
        self.r_min_dir = np.full(ncells, np.NaN)
        self.di = np.full(ncells, np.NaN)
        self.dir_vector_angle = np.full(ncells, np.NaN)
        self.dir_vector_mag = np.full(ncells, np.NaN)
        self.dir_vector_tune = np.full(ncells, np.NaN)
        self.best_dir_interp = np.full(ncells, np.NaN)
        self.null_dir_interp = np.full(ncells, np.NaN)
        self.r_best_dir_interp = np.full(ncells, np.NaN)
        self.r_null_dir_interp = np.full(ncells, np.NaN)
        self.di_interp = np.full(ncells, np.NaN)
        self.best_dir_fit = np.full(ncells, np.NaN)
        self.null_dir_fit = np.full(ncells, np.NaN)
        self.r_best_dir_fit = np.full(ncells, np.NaN)
        self.r_null_dir_fit = np.full(ncells, np.NaN)
        self.di_fit = np.full(ncells, np.NaN)
        self.ds = np.full(ncells, np.NaN)
        self.dir_tuning_width = np.full(ncells, np.NaN)
        self.dir_a1 = np.full(ncells, np.NaN)
        self.dir_a2 = np.full(ncells, np.NaN)
        self.dir_k1 = np.full(ncells, np.NaN)
        self.dir_k2 = np.full(ncells, np.NaN)

        # Orientation
        self.ori_ratio_change = np.full((ncells, int(self.nstim / 2)), np.NaN)
        self.best_ori = np.full(ncells, np.NaN)
        self.null_ori = np.full(ncells, np.NaN)
        self.r_best_ori = np.full(ncells, np.NaN)
        self.r_null_ori = np.full(ncells, np.NaN)
        self.r_min_ori = np.full(ncells, np.NaN)
        self.oi = np.full(ncells, np.NaN)
        self.ori_vector_angle = np.full(ncells, np.NaN)
        self.ori_vector_mag = np.full(ncells, np.NaN)
        self.ori_vector_tune = np.full(ncells, np.NaN)
        self.best_ori_fit = np.full(ncells, np.NaN)
        self.ori_tuning_width = np.full(ncells, np.NaN)
        self.ori_k1 = np.full(ncells, np.NaN)
        self.ori_a1 = np.full(ncells, np.NaN)
        self.dir_sig = np.full(ncells, np.NaN)

        # anova
        self.p_value_resp = np.full(ncells, np.NaN)  #
        self.p_value_sel = np.full(ncells, np.NaN)  #
        self.p_value_ori_resp = np.full(ncells, np.NaN)  #
        self.p_value_ori_sel = np.full(ncells, np.NaN)  #

    @property
    def dsi(self):
        return (self.r_best_dir - np.maximum(self.r_null_dir, 0)) / (
            self.r_best_dir + np.maximum(self.r_null_dir, 0)
        )

    @property
    def osi(self):
        return (self.r_best_ori - np.maximum(self.r_null_ori, 0)) / (
            self.r_best_ori + np.maximum(self.r_null_ori, 0)
        )

    @property
    def index_visually_responsive_cell(self):
        return np.where(
            (self.p_value_resp < self.p_value_threshold)
            & (self.r_best_dir >= self.r_best_threshold),
            True,
            False,
        )

    @property
    def index_direction_selective_cell(self):
        return np.where(
            self.index_visually_responsive_cell & (self.dsi >= self.si_threshold),
            True,
            False,
        )

    @property
    def index_orientation_selective_cell(self):
        return np.where(
            self.index_visually_responsive_cell & (self.osi >= self.si_threshold),
            True,
            False,
        )

    @property
    def ncells_visually_responsive_cell(self):
        return np.sum(self.index_visually_responsive_cell)

    @property
    def ncells_direction_selective_cell(self):
        return np.sum(self.index_direction_selective_cell)

    @property
    def ncells_orientation_selective_cell(self):
        return np.sum(self.index_orientation_selective_cell)
