from typing import Literal, Optional

from fastapi import APIRouter, Depends, Query

from studio.app.common.schemas.base import BaseQueryParams
from studio.app.common.schemas.database.cell import DbCells
from studio.app.common.schemas.database.experiment import (
    DbExperiments,
    SearchExperimentQueryParam,
)

router = APIRouter()


@router.get(
    "/public/experiments",
    response_model=DbExperiments,
    description="* 公開 Experiments を検索し、結果を応答",
)
async def search_public_experiments(
    experiment_query_param: SearchExperimentQueryParam = Depends(),
    base_query_param: BaseQueryParams = Depends(),
):
    return


@router.get(
    "/public/cells",
    response_model=DbCells,
    description="* 公開 Cells を検索し、結果を応答",
)
async def search_public_cells(
    exp_id: Optional[int] = Query(None, description="experiments.id"),
    experiment_query_param: SearchExperimentQueryParam = Depends(),
    query_param: BaseQueryParams = Depends(),
):
    return


@router.get(
    "/db/experiments",
    response_model=DbExperiments,
    description="* Experiments を検索し、結果を応答",
)
async def search_db_experiments(
    experiment_query_param: SearchExperimentQueryParam = Depends(),
    base_query_param: BaseQueryParams = Depends(),
):
    return


@router.get(
    "/db/cells",
    response_model=DbCells,
    description="* Cells を検索し、結果を応答",
)
async def search_db_cells(
    exp_id: Optional[int] = Query(None, description="experiments.id"),
    experiment_query_param: SearchExperimentQueryParam = Depends(),
    base_query_param: BaseQueryParams = Depends(),
):
    return


@router.post(
    "/db/experiment/publish/{id}/{flag}",
    response_model=bool,
    description="* Cells を検索し、結果を応答",
)
async def publish_db_experiment(
    id: int,
    flag: Literal["on", "off"],
):
    return 1
