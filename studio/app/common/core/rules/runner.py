import copy
import gc
import os
import traceback
from dataclasses import asdict
from datetime import datetime
from pathlib import Path

import numpy as np
from filelock import FileLock

from studio.app.common.core.experiment.experiment_reader import ExptConfigReader
from studio.app.common.core.logger import AppLogger
from studio.app.common.core.snakemake.smk import Rule
from studio.app.common.core.utils.config_handler import ConfigWriter
from studio.app.common.core.utils.filepath_creater import join_filepath
from studio.app.common.core.utils.pickle_handler import PickleReader, PickleWriter
from studio.app.common.core.workflow.workflow import DataFilterParam
from studio.app.const import DATE_FORMAT
from studio.app.dir_path import DIRPATH
from studio.app.optinist.core.nwb.nwb_creater import (
    merge_nwbfile,
    overwrite_nwbfile,
    save_nwb,
)
from studio.app.optinist.dataclass import FluoData, IscellData, RoiData
from studio.app.wrappers import wrapper_dict

logger = AppLogger.get_logger()


class Runner:
    @classmethod
    def run(cls, __rule: Rule, last_output):
        try:
            logger.info("start rule runner")

            input_info = cls.read_input_info(__rule.input)

            cls.change_dict_key_exist(input_info, __rule)

            nwbfile = input_info["nwbfile"]

            # input_info
            for key in list(input_info):
                if key not in __rule.return_arg.values():
                    input_info.pop(key)

            cls.set_func_start_timestamp(os.path.dirname(__rule.output))

            output_info = {}
            dataFilterParam = DataFilterParam(**__rule.dataFilterParam)
            bak_output = __rule.output + ".bak"
            if not dataFilterParam.is_empty:
                if not os.path.exists(bak_output):
                    raise ValueError("Filter data failed")

                bak_output_info = PickleReader.read(bak_output)

                algorithm_output = Path(__rule.output).stem
                if algorithm_output == "lccd_cell_detection":
                    output_info = cls.filter_data(bak_output_info, dataFilterParam)
                elif algorithm_output == "caiman_cnmf":
                    output_info = {}
                elif algorithm_output == "suite2p_roi":
                    output_info = {}
            else:
                if os.path.exists(bak_output):
                    os.remove(bak_output)
                # output_info
                output_info = cls.execute_function(
                    __rule.path,
                    __rule.params,
                    nwbfile.get("input"),
                    os.path.dirname(__rule.output),
                    input_info,
                )

            # nwbfileの設定
            output_info["nwbfile"] = cls.save_func_nwb(
                f"{__rule.output.split('.')[0]}.nwb",
                __rule.type,
                nwbfile,
                output_info,
            )

            # 各関数での結果を保存
            PickleWriter.write(__rule.output, output_info)

            # NWB全体保存
            if __rule.output in last_output:
                # 全体の結果を保存する
                path = join_filepath(os.path.dirname(os.path.dirname(__rule.output)))
                path = join_filepath([path, "whole.nwb"])
                cls.save_all_nwb(path, output_info["nwbfile"])

            logger.info("rule output: %s", __rule.output)

            del input_info, output_info
            gc.collect()

        except Exception as e:
            err_msg = list(traceback.TracebackException.from_exception(e).format())

            # show full trace to console
            logger.error("\n".join(err_msg))

            # save msg for GUI
            PickleWriter.write(__rule.output, err_msg)

    @classmethod
    def set_func_start_timestamp(cls, output_dirpath):
        workflow_dirpath = os.path.dirname(output_dirpath)
        node_id = os.path.basename(output_dirpath)
        expt_config = ExptConfigReader.read(
            join_filepath([workflow_dirpath, DIRPATH.EXPERIMENT_YML])
        )
        expt_config.function[node_id].started_at = datetime.now().strftime(DATE_FORMAT)
        ConfigWriter.write(
            dirname=workflow_dirpath,
            filename=DIRPATH.EXPERIMENT_YML,
            config=asdict(expt_config),
        )

    @classmethod
    def save_func_nwb(cls, save_path, name, nwbfile, output_info):
        if "nwbfile" in output_info:
            nwbfile[name] = output_info["nwbfile"]
            save_nwb(
                save_path,
                nwbfile["input"],
                output_info["nwbfile"],
            )
        return nwbfile

    @classmethod
    def save_all_nwb(cls, save_path, all_nwbfile):
        input_nwbfile = all_nwbfile["input"]
        all_nwbfile.pop("input")
        nwbconfig = {}
        for x in all_nwbfile.values():
            nwbconfig = merge_nwbfile(nwbconfig, x)
        # 同一のnwbfileに対して、複数の関数を実行した場合、h5pyエラーが発生する
        lock_path = save_path + ".lock"
        timeout = 30  # ロック取得のタイムアウト時間（秒）
        with FileLock(lock_path, timeout=timeout):
            # ロックが取得できたら、ファイルに書き込みを行う
            if os.path.exists(save_path):
                overwrite_nwbfile(save_path, nwbconfig)
            else:
                save_nwb(save_path, input_nwbfile, nwbconfig)

    @classmethod
    def execute_function(cls, path, params, nwb_params, output_dir, input_info):
        wrapper = cls.dict2leaf(wrapper_dict, path.split("/"))
        func = copy.deepcopy(wrapper["function"])
        output_info = func(
            params=params,
            nwbfile=nwb_params,
            output_dir=output_dir,
            **input_info,
        )
        del func
        gc.collect()

        return output_info

    @classmethod
    def change_dict_key_exist(cls, input_info, rule_config: Rule):
        for return_name, arg_name in rule_config.return_arg.items():
            if return_name in input_info:
                input_info[arg_name] = input_info.pop(return_name)

    @classmethod
    def read_input_info(cls, input_files):
        input_info = {}
        for filepath in input_files:
            load_data = PickleReader.read(filepath)

            # validate load_data content
            assert PickleReader.check_is_valid_node_pickle(
                load_data
            ), f"Invalid node input data content. [{filepath}]"

            merged_nwb = cls.deep_merge(
                load_data.pop("nwbfile", {}), input_info.pop("nwbfile", {})
            )
            input_info = dict(list(load_data.items()) + list(input_info.items()))
            input_info["nwbfile"] = merged_nwb
        return input_info

    @classmethod
    def deep_merge(cls, dict1, dict2):
        if not isinstance(dict1, dict) or not isinstance(dict2, dict):
            return dict2
        merged = dict1.copy()
        for k, v in dict2.items():
            if k in merged and isinstance(merged[k], dict):
                merged[k] = cls.deep_merge(merged[k], v)
            else:
                merged[k] = v
        return merged

    @classmethod
    def dict2leaf(cls, root_dict: dict, path_list):
        path = path_list.pop(0)
        if len(path_list) > 0:
            return cls.dict2leaf(root_dict[path], path_list)
        else:
            return root_dict[path]

    @classmethod
    def filter_data(
        cls,
        output_info: dict,
        data_filter_param: DataFilterParam,
        output_dir=DIRPATH.OUTPUT_DIR,
    ) -> dict:
        im = output_info["edit_roi_data"].im
        fluorescence = output_info["fluorescence"].data
        dff = output_info["dff"].data if output_info.get("dff") else None
        iscell = output_info["iscell"].data

        if data_filter_param.dim1:
            dim1_filter_mask = data_filter_param.dim1_mask(max_size=im.shape[1])
            im = im[:, dim1_filter_mask, :]

        if data_filter_param.dim2:
            dim2_filter_mask = data_filter_param.dim2_mask(max_size=im.shape[2])
            im = im[:, :, dim2_filter_mask]

        if data_filter_param.dim3:
            dim3_filter_mask = data_filter_param.dim3_mask(
                max_size=fluorescence.shape[1]
            )
            fluorescence = fluorescence[:, dim3_filter_mask]
            if dff:
                dff = dff[:, dim3_filter_mask]

        if data_filter_param.roi:
            roi_filter_mask = data_filter_param.roi_mask(max_size=im.shape[0])
            iscell[~roi_filter_mask] = False

        output_info["edit_roi_data"].im = im

        # TODO: update nwbfile

        info = {
            **output_info,
            "cell_roi": RoiData(
                np.nanmax(im[iscell != 0], axis=0),
                output_dir=output_dir,
                file_name="cell_roi",
            ),
            "fluorescence": FluoData(fluorescence, file_name="fluorescence"),
            "iscell": IscellData(iscell),
        }

        if dff is not None:
            info["dff"] = FluoData(dff, file_name="dff")
        else:
            info["all_roi"] = RoiData(
                np.nanmax(im, axis=0), output_dir=output_dir, file_name="all_roi"
            )
            info["non_cell_roi"] = RoiData(
                np.nanmax(im[iscell == 0], axis=0),
                output_dir=output_dir,
                file_name="non_cell_roi",
            )

        return info
