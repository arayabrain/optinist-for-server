import numpy as np

from studio.app.common.dataclass import MatlabData
from studio.app.const import TS_FIELDNAME


class TsData(MatlabData):
    def __init__(self, data, params={}, file_name="ts"):
        params = {"fieldName": TS_FIELDNAME, **params}

        super().__init__(data, params, file_name=file_name)

        self.nframes_stim = int(self.data["Nframes_stim"].item())
        self.nstim_per_trial = int(self.data["Nstim_per_trial"].item())
        self.ntrials = int(self.data["Ntrials"].item())
        self.stim_log = self.data["stim_log"].item()
        self.framarate = self.data["frameRate"].item()

        if "Nframes_base" in [descr[0] for descr in self.data.dtype.descr]:
            self.has_base = True
            self.nframes_base = int(self.data["Nframes_base"].item())
            self.nframes_post = 0
        else:
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
