import numpy as np

from studio.app.common.dataclass.base import BaseData


class StatIndex:
    def __init__(self, row, col) -> None:
        self.ratio_change = np.full((row, col), np.NaN)
        self.r_best = np.full(row, np.NaN)
        self.r_null = np.full(row, np.NaN)
        self.selective_cell_index = None
        self.selective_cell_ncells = None

    @property
    def si(self):
        return (self.r_best - np.maximum(self.r_null, 0)) / (
            self.r_best + np.maximum(self.r_null, 0)
        )


class StatData(BaseData):
    def __init__(self, data_tables, file_name="stat"):
        super().__init__(file_name)
        self.data_tables = data_tables
        self.ncells = data_tables.shape[0]
        self.ntrials, self.nstimplus = data_tables[0][0].shape
        self.nstim = self.nstimplus - 1
        self.dirstat = StatIndex(self.ncells, self.nstim)
        self.oristat = StatIndex(self.ncells, int(self.nstim / 2))


class AnovaStat(BaseData):
    def __init__(
        self,
        row,
        file_name="anova",
    ):
        super().__init__(file_name)
        self.p_value_responsive = np.full(row, np.NaN)
        self.p_value_selective = np.full(row, np.NaN)
        self.index_visually_responsive = None
        self.index_dir_selective = None
        self.index_ori_selective = None

    @property
    def ncells_visually_responsive(self):
        return np.sum(self.index_visually_responsive)

    @property
    def ncells_dir_selective(self):
        return np.sum(self.index_dir_selective)

    @property
    def ncells_ori_selective(self):
        return np.sum(self.index_ori_selective)


class VectorStat(BaseData):
    def __init__(self, row, file_name="vector_avg"):
        super().__init__(file_name)
        self.dir_vector_angle = np.full(row, np.NaN)
        self.dir_vector_mag = np.full(row, np.NaN)
        self.dir_vector_tune = np.full(row, np.NaN)
        self.ori_vector_angle = np.full(row, np.NaN)
        self.ori_vector_mag = np.full(row, np.NaN)
        self.ori_vector_tune = np.full(row, np.NaN)


class TuningStat(BaseData):
    def __init__(self, row, file_name="tuning"):
        super().__init__(file_name)
        self.dir_tuning_width = np.full(row, np.NaN)
        self.ori_tuning_width = np.full(row, np.NaN)
