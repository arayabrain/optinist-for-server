import numpy as np

from studio.app.common.dataclass import MatlabData
from studio.app.common.dataclass.base import BaseData
from studio.app.const import TC_FIELDNAME, TC_SUFFIX, TS_FIELDNAME, TS_SUFFIX


class TcData(MatlabData):
    def __init__(self, data, params={}, file_name="tc"):
        params = {"fieldName": TC_FIELDNAME, **params}

        super().__init__(data, params, file_name=file_name)

        assert self.data.ndim == 2, "TC Dimension Error"

        self.tc_length, self.n_cells = self.data.shape


class TsData(MatlabData):
    """
    Temporal Stimulus (TS) data class containing stimulus timing parameters.

    This class stores timing information used for calculating response statistics
    and orientation maps. The parameters define how timecourse and image data are
    segmented and analyzed:

    Data Size Calculations:
        - nframes_epoch: Total frames per stimulus epoch
            (nframes_base + nframes_stim + nframes_post)
          Used to reshape timecourse data into trials and stimuli.

        - nframes_per_trial: Total frames in one trial (nframes_epoch * nstim_per_run)
          Used to segment timecourse data by trial in sort_tc() and stack_average().

        - base_index: Frame indices for baseline calculation
            (4 frames from nframes_base-3 to nframes_base, inclusive)
          Used in get_orimap() to calculate baseline fluorescence (F0) via calc_F().

        - stim_index: Frame indices during stimulus presentation
            (nframes_base frames starting at nframes_base+1)
          Used in get_orimap() to calculate stimulus-evoked response (F) via calc_F().

        - data_table shape: (ncells, ntrials, nstimplus)
          Created in get_data_tables() where nstimplus = nstim + 1 (stimuli + baseline).
          Each cell contains averaged responses during base_index and stim_index periods

    Calculation Flow:
        1. Timecourse data (tc_length × n_cells) is reshaped using
            nframes_epoch (nframes_base + nframes_stim + nframes_post)
        2. Baseline calculated from frames in base_index range
        3. Stimulus response calculated from frames in stim_index range
        4. dF/F ratio calculated: (F_stim - F_base) / F_base
            where F_stim = mean fluorescence during stim_index frames
            and F_base = mean fluorescence during base_index frames
        5. Statistics computed in StatData using dir_ratio_change, ori_ratio_change
            dir_ratio_change = (stim_response / baseline) - 1 for each direction
            ori_ratio_change = averaging opposite directions from dir_ratio_change
    """

    def __init__(self, data, params={}, file_name="ts"):
        params = {"fieldName": TS_FIELDNAME, **params}

        super().__init__(data, params, file_name=file_name)

        self.nframes_stim = int(self.data["Nframes_stim"].item())
        self.nstim_per_trial = int(self.data["Nstim_per_trial"].item())
        self.ntrials = int(self.data["Ntrials"].item())
        self.stim_log = self.data["stim_log"].item()
        self.framerate = self.data["frameRate"].item()

        if "Nframes_base" in [descr[0] for descr in self.data.dtype.descr]:
            # ORI
            self.has_base = True
            self.nframes_base = int(self.data["Nframes_base"].item())
            self.nframes_post = 0
        else:
            # OF_PRC
            self.has_base = False
            self.nframes_base = int(self.data["pre_stim"].item())
            self.nframes_post = int(self.data["post_stim"].item())

            self.nstim_per_trial_radial = int(
                self.data["Nstim_per_trial_radial"].item()
            )
            self.nstim_per_trial_circular = int(
                self.data["Nstim_per_trial_circular"].item()
            )
            self.nstim_per_trial_planar = self.nstim_per_trial - (
                self.nstim_per_trial_radial + self.nstim_per_trial_circular
            )

        self.base_index = np.arange(self.nframes_base - 3, self.nframes_base + 1)
        self.stim_index = np.arange(self.nframes_base + 1, 2 * self.nframes_base + 1)
        self.nframes_epoch = self.nframes_base + self.nframes_stim + self.nframes_post

    @property
    def nframes_per_stim(self):
        return self.nframes_epoch

    @property
    def nstim_per_run(self):
        return self.nstim_per_trial if self.has_base else self.nstim_per_trial_planar

    @property
    def nframes_per_trial(self):
        return self.nframes_per_stim * self.nstim_per_run


class ExpDbData(BaseData):
    def __init__(self, paths, params={}, file_name="expdb"):
        super().__init__(file_name)
        self.tc = None
        self.ts = None
        self.path = paths

        for path in paths:
            assert isinstance(path, str), "path should be str"
            if path.endswith(f"{TC_SUFFIX}.mat"):
                self.tc = TcData(path)
            elif path.endswith(f"{TS_SUFFIX}.mat"):
                self.ts = TsData(path)

    def save_json(self, json_dir):
        pass
