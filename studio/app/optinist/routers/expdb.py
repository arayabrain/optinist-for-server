from typing import Optional

from fastapi import APIRouter, Depends, Query

from studio.app.optinist.schemas.base import SortOptions
from studio.app.optinist.schemas.expdb.cell import ExpDbCells
from studio.app.optinist.schemas.expdb.experiment import (
    ExpDbExperiments,
    ExpDbExperimentSharePostStatus,
    ExpDbExperimentShareStatus,
    ExpDbExperimentsSearchOptions,
    PublishFlags,
)

router = APIRouter()


@router.get(
    "/public/experiments",
    response_model=ExpDbExperiments,
    description="* 公開 Experiments を検索し、結果を応答",
)
async def search_public_experiments(
    options: ExpDbExperimentsSearchOptions = Depends(),
    sortOptions: SortOptions = Depends(),
):
    return search_db_experiments(options, sortOptions)


@router.get(
    "/public/cells",
    response_model=ExpDbCells,
    summary=None,
    description="""
- 公開 Cells を検索し、結果を応答
""",
)
async def search_public_cells(
    exp_id: Optional[int] = Query(None, description="experiments.id"),
    options: ExpDbExperimentsSearchOptions = Depends(),
    query_param: SortOptions = Depends(),
):
    return


@router.get(
    "/expdb/experiments",
    response_model=ExpDbExperiments,
    summary=None,
    description="""
- Experiments を検索し、結果を応答
""",
)
async def search_db_experiments(
    options: ExpDbExperimentsSearchOptions = Depends(),
    sortOptions: SortOptions = Depends(),
):
    return


@router.get(
    "/expdb/cells",
    response_model=ExpDbCells,
    summary=None,
    description="""
- Cells を検索し、結果を応答
""",
)
async def search_db_cells(
    exp_id: Optional[int] = Query(None, description="experiments.id"),
    options: ExpDbExperimentsSearchOptions = Depends(),
    sortOptions: SortOptions = Depends(),
):
    return


@router.post(
    "/expdb/experiment/publish/{id}/{flag}",
    response_model=bool,
    summary=None,
    description="""
- Experiments を公開する

""",
)
async def publish_db_experiment(id: int, flag: PublishFlags):
    return 1


@router.get(
    "/expdb/share/{id}/status",
    response_model=ExpDbExperimentShareStatus,
    summary=None,
    description="""
- Experiment Database の共有状態を取得する
""",
)
def get_experiment_database_share_status(id: int):
    return


@router.post(
    "/expdb/share/{id}/status",
    response_model=bool,
    summary=None,
    description="""
- Experiment Database の共有状態を更新する（総入れ替え）
""",
)
def update_experiment_database_share_status(
    id: int, data: ExpDbExperimentSharePostStatus
):
    return True
