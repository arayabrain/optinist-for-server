import math

import numpy as np
from scipy.interpolate import interp1d, make_interp_spline
from scipy.optimize import curve_fit

from studio.app.common.dataclass.histogram import HistogramData
from studio.app.optinist.dataclass.stat import AnovaStat, StatData, TuningStat


def base_von_mises(x, a, k, phi, deg):
    return a * np.exp(k * (np.cos((x - phi) * np.pi / deg) - 1))


def dir_von_mises(x, a1, a2, k1, k2, phi1, phi2):
    return base_von_mises(x, a1, k1, phi1, 180) + base_von_mises(x, a2, k2, phi2, 180)


def ori_von_mises(x, a, k, phi):
    return base_von_mises(x, a, k, phi, 90)


class TempTuning:
    CURVEFIT_MAX_RETRIES = 3
    CURVEFIT_RETRY_FEVS = 10000

    def __init__(self, ydata, interp_method, do_interp) -> None:
        self.raw_ydata = ydata
        self.interp_method = interp_method if interp_method else "linear"
        self.do_interp = do_interp

    @property
    def nstim_per_run(self):
        return self.raw_ydata.shape[0]

    @property
    def raw_xdata(self):
        return np.arange(self.nstim_per_run) * 2 * self.DEGREE / self.nstim_per_run

    @property
    def ymax(self):
        return np.max(self.raw_ydata, axis=0)

    @property
    def ymin(self):
        # NOTE: provided script forces the best direction to be 0, check if it's correct
        # return np.min(self.raw_ydata, axis=0)
        return 0

    @property
    def best_index(self):
        return np.argmax(self.raw_ydata, axis=0)

    @property
    def x(self):
        return np.arange(-1, self.nstim_per_run + 2)

    @property
    def xq(self):
        return np.arange(-1, self.nstim_per_run + 1.5, step=0.5)

    @property
    def ydata_interp(self):
        _ydata_interp = np.hstack(
            (self.raw_ydata[-1], self.raw_ydata, self.raw_ydata[:2])
        )

        if self.interp_method == "spline":
            _ydata_interp = make_interp_spline(self.x, _ydata_interp)(self.xq)
        else:
            _ydata_interp = interp1d(self.x, _ydata_interp, kind=self.interp_method)(
                self.xq
            )
        return _ydata_interp[2 : self.nstim_per_run * 2 + 2]

    @property
    def xdata_interp(self):
        return np.arange(self.nstim_per_run * 2) * self.DEGREE / self.nstim_per_run

    @property
    def ydata(self):
        return self.ydata_interp if self.do_interp else self.raw_ydata

    @property
    def xdata(self):
        return self.xdata_interp if self.do_interp else self.raw_xdata

    @property
    def tuning_width(self):
        params = {}
        for i in range(self.CURVEFIT_MAX_RETRIES):
            if i > 0:
                params["maxfev"] = i * self.CURVEFIT_RETRY_FEVS

            try:
                k = self.curve_fit_result(params)
                break
            except RuntimeError:
                continue

        if k > math.log(2) / 2:
            return math.acos(math.log(0.5) / k + 1) * self.DEGREE / math.pi
        else:
            return self.DEGREE


class DirTempTuning(TempTuning):
    DEGREE = 180

    @property
    def null_index(self):
        return int(
            np.mod((self.best_index + self.nstim_per_run / 2), self.nstim_per_run)
        )

    @property
    def p0(self):
        return np.array(
            [
                self.ymax - self.ymin,
                self.raw_ydata[self.null_index] - self.ymin,
                2,
                2,
                self.best_index * 2 * self.DEGREE / self.nstim_per_run,
                self.null_index * 2 * self.DEGREE / self.nstim_per_run,
            ]
        )

    def curve_fit_result(self, params):
        res = curve_fit(
            dir_von_mises,
            self.xdata,
            self.ydata - self.ymin,
            p0=self.p0,
            method="lm",
            **params,
        )[0]
        return res[2] if res[0] >= res[1] else res[3]


class OriTempTuning(TempTuning):
    DEGREE = 90

    @property
    def p0(self):
        return np.array(
            [
                self.ymax - self.ymin,
                1,
                self.best_index * 2 * self.DEGREE / self.nstim_per_run,
            ]
        )

    def curve_fit_result(self, params):
        res = curve_fit(
            ori_von_mises,
            self.xdata,
            self.ydata - self.ymin,
            p0=self.p0,
            method="lm",
            **params,
        )[0]
        return res[1]


def curvefit_tuning(
    stat: StatData, anova: AnovaStat, output_dir: str, params: dict = None
) -> dict(tuning=TuningStat):
    tuning = TuningStat(stat.ncells)

    interp_method = params["interp_method"]
    do_interp = params["do_interpolation"]
    p_threshold = params["p_threshold"]

    for i in range(stat.ncells):
        if anova.p_value_selective[i] > p_threshold:
            continue

        dir_temp = DirTempTuning(stat.dirstat.ratio_change[i], interp_method, do_interp)
        tuning.dir_tuning_width[i] = dir_temp.tuning_width
        ori_temp = OriTempTuning(stat.oristat.ratio_change[i], interp_method, do_interp)
        tuning.ori_tuning_width[i] = ori_temp.tuning_width

    return {
        "tuning": tuning,
        "dir_tuning_width_hist": HistogramData(
            data=tuning.dir_tuning_width[anova.index_dir_selective],
            file_name="dir_tuning_width_hist",
        ),
        "ori_tuning_width_hist": HistogramData(
            data=tuning.ori_tuning_width[anova.index_ori_selective],
            file_name="ori_tuning_width_hist",
        ),
    }
