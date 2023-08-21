import os

from fastapi import APIRouter, BackgroundTasks

from studio.app.common.core.utils.config_handler import ConfigReader
from studio.app.common.core.utils.filepath_creater import (
    create_directory,
    join_filepath,
)
from studio.app.common.core.utils.filepath_finder import find_param_filepath
from studio.app.const import TC_SUFFIX, TS_SUFFIX
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


def expdb_batch(dirpath: str, expdb: ExpDbData):
    plot_dir = join_filepath([dirpath, "plots"])
    create_directory(plot_dir, delete_dir=True)

    stat = stat_file_convert(
        expdb=expdb,
        output_dir=plot_dir,
        params=get_default_params("stat_file_convert"),
        export_plot=True,
    )

    oneway_anova(
        stat=stat,
        output_dir=plot_dir,
        params=get_default_params("oneway_anova"),
        export_plot=True,
    )

    curvefit_tuning(
        stat=stat,
        output_dir=plot_dir,
        params=get_default_params("curvefit_tuning"),
        export_plot=True,
    )

    vector_average(
        stat=stat,
        output_dir=plot_dir,
        params=get_default_params("vector_average"),
        export_plot=True,
    )


@router.post("")
async def run_expdb_batch(expdb_dirpath: str, background_tasks: BackgroundTasks):
    assert os.path.exists(expdb_dirpath) and os.path.isdir(
        expdb_dirpath
    ), f"Directory {expdb_dirpath} does not exist"

    exp_id = os.path.basename(expdb_dirpath)
    paths = [
        os.path.join(expdb_dirpath, f"{exp_id}_{TC_SUFFIX}.mat"),
        os.path.join(expdb_dirpath, f"{exp_id}_{TS_SUFFIX}.mat"),
    ]
    expdb = ExpDbData(paths, None)

    background_tasks.add_task(expdb_batch, expdb_dirpath, expdb)
    return True
