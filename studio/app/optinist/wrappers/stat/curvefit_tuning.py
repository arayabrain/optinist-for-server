import math

import numpy as np
from scipy.interpolate import interp1d, make_interp_spline
from scipy.optimize import curve_fit

from studio.app.common.dataclass.histogram import HistogramData
from studio.app.optinist.dataclass.stat import StatData


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

    def get_curvefit_results(self):
        params = {}
        for i in range(self.CURVEFIT_MAX_RETRIES):
            if i > 0:
                params["maxfev"] = i * self.CURVEFIT_RETRY_FEVS

            try:
                return self.curve_fit_result(params)
            except RuntimeError:
                continue

    def tuning_width(self, k):
        return (
            math.acos(math.log(0.5) / k + 1) * self.DEGREE / math.pi
            if k > math.log(2) / 2
            else self.DEGREE
        )


class DirTempTuning(TempTuning):
    DEGREE = 180

    def __init__(self, ydata, interp_method, do_interp, use_fourier) -> None:
        super().__init__(ydata, interp_method, do_interp)
        self.use_fourier = use_fourier

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

    @property
    def ydata_fourier_interp(self):
        if self.use_fourier:
            res = np.zeros(360, dtype=np.complex128)
            f = np.fft.fft(self.ydata)
            n = self.ydata.shape[0]
            half_n = int(n / 2)
            if n % 2 == 0:
                res[:half_n] = f[:half_n]
                res[half_n] = f[half_n] / 2
                res[360 - half_n + 1 :] = f[half_n + 1 :]
                res[360 - half_n + 1] = f[half_n + 1] / 2
            else:
                res[:half_n] = f[:half_n]
                res[360 - half_n :] = f[half_n:]
            return np.fft.ifft(res).real * 360 / n
        else:
            _ydata_interp = np.hstack(
                (self.raw_ydata[-1], self.raw_ydata, self.raw_ydata[:2])
            )
            _ydata_interp = interp1d(self.x, _ydata_interp, kind=self.interp_method)(
                np.arange(
                    -1,
                    self.nstim_per_run + 1 + self.nstim_per_run / 360,
                    step=self.nstim_per_run / 360,
                )
            )
            return _ydata_interp[
                360 / self.nstim_per_run : 360 / self.nstim_per_run + 360
            ]

    @property
    def r_best_dir_interp(self):
        return np.max(self.ydata_fourier_interp, axis=0)

    @property
    def best_dir_interp(self):
        return np.argmax(self.ydata_fourier_interp, axis=0)

    @property
    def null_dir_interp(self):
        return np.mod(self.best_dir_interp + self.DEGREE, self.DEGREE * 2)

    @property
    def r_null_dir_interp(self):
        return self.ydata_fourier_interp[self.null_dir_interp]

    @property
    def di_interp(self):
        return 1 - self.r_null_dir_interp / self.r_best_dir_interp

    def curve_fit_result(self, params):
        res = curve_fit(
            dir_von_mises,
            self.xdata,
            self.ydata - self.ymin,
            p0=self.p0,
            method="lm",
            **params,
        )[0]

        if res[0] >= res[1]:
            a1, a2, k1, k2, best_dir_fit, phi2 = res
        else:
            a2, a1, k2, k1, phi2, best_dir_fit = res
        best_dir_fit = np.mod(best_dir_fit, self.DEGREE * 2)
        phi2 = np.mod(phi2, self.DEGREE * 2)
        null_dir_fit = np.mod(best_dir_fit + self.DEGREE, self.DEGREE * 2)
        r_best_dir_fit = (
            dir_von_mises(best_dir_fit, a1, a2, k1, k2, best_dir_fit, phi2) + self.ymin
        )
        r_null_dir_fit = (
            dir_von_mises(null_dir_fit, a1, a2, k1, k2, best_dir_fit, phi2) + self.ymin
        )
        di_fit = 1 - r_null_dir_fit / r_best_dir_fit
        ds = (a1 - a2) / (a1 + a2)
        dir_tuning_width = self.tuning_width(k1)

        return (
            a1,
            a2,
            k1,
            k2,
            best_dir_fit,
            null_dir_fit,
            r_best_dir_fit,
            r_null_dir_fit,
            di_fit,
            ds,
            dir_tuning_width,
        )


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

        a1, k1, best_ori_fit = res
        best_ori_fit = np.mod(best_ori_fit, self.DEGREE * 2)
        ori_tuning_width = self.tuning_width(k1)
        return (a1, k1, best_ori_fit, ori_tuning_width)


def curvefit_tuning(
    stat: StatData,
    output_dir: str,
    params: dict = None,
    export_plot: bool = False,
) -> dict(stat=StatData):
    interp_method = params["interp_method"]
    do_interp = params["do_interpolation"]
    p_threshold = params["p_threshold"]
    use_fourier = params["use_fourier"]

    for i in range(stat.ncells):
        dir_temp = DirTempTuning(
            stat.dir_ratio_change[i], interp_method, do_interp, use_fourier
        )
        stat.best_dir_interp[i] = dir_temp.best_dir_interp
        stat.null_dir_interp[i] = dir_temp.null_dir_interp
        stat.r_best_dir_interp[i] = dir_temp.r_best_dir_interp
        stat.r_null_dir_interp[i] = dir_temp.r_null_dir_interp
        stat.di_interp[i] = dir_temp.di_interp

        if stat.p_value_sel[i] > p_threshold:
            continue
        (
            stat.dir_a1[i],
            stat.dir_a2[i],
            stat.dir_k1[i],
            stat.dir_k2[i],
            stat.best_dir_fit[i],
            stat.null_dir_fit[i],
            stat.r_best_dir_fit[i],
            stat.r_null_dir_fit[i],
            stat.di_fit[i],
            stat.ds[i],
            stat.dir_tuning_width[i],
        ) = dir_temp.get_curvefit_results()

        ori_temp = OriTempTuning(stat.ori_ratio_change[i], interp_method, do_interp)
        (
            stat.ori_a1[i],
            stat.ori_k1[i],
            stat.best_ori_fit[i],
            stat.ori_tuning_width[i],
        ) = ori_temp.get_curvefit_results()

    dir_tuning_width_hist = HistogramData(
        data=stat.dir_tuning_width[stat.index_direction_selective_cell],
        file_name="dir_tuning_width_hist",
    )
    ori_tuning_width_hist = HistogramData(
        data=stat.ori_tuning_width[stat.index_orientation_selective_cell],
        file_name="ori_tuning_width_hist",
    )

    stat.save_as_hdf5(output_dir, "curvefit_tuning")
    if export_plot:
        dir_tuning_width_hist.save_plot(output_dir)
        ori_tuning_width_hist.save_plot(output_dir)
        return stat
    else:
        return {
            "stat": stat,
            "dir_tuning_width_hist": dir_tuning_width_hist,
            "ori_tuning_width_hist": ori_tuning_width_hist,
        }
