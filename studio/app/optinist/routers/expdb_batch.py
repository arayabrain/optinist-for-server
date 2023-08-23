import os

from fastapi import APIRouter, HTTPException, Response

from studio.app.common.core.utils.config_handler import ConfigReader
from studio.app.common.core.utils.filepath_creater import (
    create_directory,
    join_filepath,
)
from studio.app.common.core.utils.filepath_finder import find_param_filepath
from studio.app.const import TC_SUFFIX, TS_SUFFIX
from studio.app.dir_path import DIRPATH
from studio.app.optinist.dataclass.expdb import ExpDbData
from studio.app.optinist.wrappers.stat import (
    curvefit_tuning,
    oneway_anova,
    stat_file_convert,
    vector_average,
)

router = APIRouter(prefix="/expdb/batch", tags=["Experiment Database"])


def get_default_params(name: str):
    filepath = find_param_filepath(name)
    return ConfigReader.read(filepath)


async def expdb_batch(exp_id: str):
    try:
        subject_id = exp_id.split("_")[0]
        exp_dir = join_filepath([DIRPATH.EXPDB_DIR, subject_id, exp_id])

        if not (os.path.exists(exp_dir) and os.path.isdir(exp_dir)):
            raise Exception(f"Data for experiment_id: {exp_id} does not exist")

        expdb = ExpDbData(
            paths=[
                join_filepath([exp_dir, f"{exp_id}_{TS_SUFFIX}.mat"]),
                join_filepath([exp_dir, f"{exp_id}_{TC_SUFFIX}.mat"]),
            ]
        )

        for dirname in ["plots", "stats"]:
            create_directory(join_filepath([exp_dir, dirname]), delete_dir=True)

        stat = stat_file_convert(
            expdb=expdb,
            output_dir=exp_dir,
            params=get_default_params("stat_file_convert"),
            export_plot=True,
        )

        oneway_anova(
            stat=stat,
            output_dir=exp_dir,
            params=get_default_params("oneway_anova"),
            export_plot=True,
        )

        curvefit_tuning(
            stat=stat,
            output_dir=exp_dir,
            params=get_default_params("curvefit_tuning"),
            export_plot=True,
        )

        vector_average(
            stat=stat,
            output_dir=exp_dir,
            params=get_default_params("vector_average"),
            export_plot=True,
        )
        return {"status": "success"}
    except Exception as e:
        return {"status": "failed", "message": str(e)}


@router.post("")
async def run_expdb_batch(exp_id: str):
    res = await expdb_batch(exp_id)
    if res["status"] == "failed":
        raise HTTPException(status_code=404, detail=res["message"])
    else:
        return Response(status_code=200)
