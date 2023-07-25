import numpy as np

from studio.app.common.dataclass.base import BaseData


class StatIndex:
    def __init__(self, row, col) -> None:
        self.ratio_change = np.full((row, col), np.NaN)
        self.r_best = np.full(row, np.NaN)
        self.r_null = np.full(row, np.NaN)
        self.si = None
        self.selective_cell_index = None
        self.selective_cell_ncells = None


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
        p_value,
        index_visually_responsive_cell,
        dir_index_selective_cell,
        ori_index_selective_cell,
        file_name="anova",
    ):
        super().__init__(file_name)
        self.p_value = p_value
        self.index_visually_responsive_cell = index_visually_responsive_cell
        self.dir_index_selective_cell = dir_index_selective_cell
        self.ori_index_selective_cell = ori_index_selective_cell


class VectorStat(BaseData):
    def __init__(self, dir_vector_angle, ori_vector_angle, file_name="vector_avg"):
        super().__init__(file_name)
        self.dir_vector_angle = dir_vector_angle
        self.ori_vector_angle = ori_vector_angle


class TuningStat(BaseData):
    def __init__(self, tuning_width, file_name="tuning"):
        super().__init__(file_name)
        self.tuning_width = tuning_width
