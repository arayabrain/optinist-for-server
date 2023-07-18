from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi_pagination.ext.sqlmodel import paginate
from sqlmodel import Session, select

from studio.app.common import models as common_model
from studio.app.common.core.auth.auth_dependencies import get_current_user
from studio.app.common.db.database import get_db
from studio.app.common.schemas.users import UserInfo
from studio.app.optinist import models as optinist_model
from studio.app.optinist.schemas.base import SortOptions
from studio.app.optinist.schemas.expdb.cell import ExpDbCell
from studio.app.optinist.schemas.expdb.experiment import (
    ExpDbExperiment,
    ExpDbExperimentFields,
    ExpDbExperimentHeader,
    ExpDbExperimentSharePostStatus,
    ExpDbExperimentShareStatus,
    ExpDbExperimentsSearchOptions,
    PageWithHeader,
    PublishFlags,
)

router = APIRouter()


@router.get(
    "/public/experiments",
    response_model=PageWithHeader[ExpDbExperiment],
    description="* 公開 Experiments を検索し、結果を応答",
)
async def search_public_experiments(
    options: ExpDbExperimentsSearchOptions = Depends(),
    sortOptions: SortOptions = Depends(),
    db: Session = Depends(get_db),
):
    return await search_db_experiments(db, options, sortOptions)


@router.get(
    "/public/cells",
    response_model=PageWithHeader[ExpDbCell],
    description="""
- 公開 Cells を検索し、結果を応答
""",
)
async def search_public_cells(
    exp_id: Optional[int] = Query(None, description="experiments.id"),
    options: ExpDbExperimentsSearchOptions = Depends(),
    sortOptions: SortOptions = Depends(),
    db: Session = Depends(get_db),
):
    data = paginate(
        session=db,
        query=select(optinist_model.Cell).filter(
            optinist_model.Cell.experiment_seqid == exp_id
        ),
        additional_data={"header": ExpDbExperimentHeader(graph_titles=[])},
    )
    for item in data.items:
        item.fields = ExpDbExperimentFields(
            brain_area=0, cre_driver=0, reporter_line=0, imaging_depth=0
        )
    return data


@router.get(
    "/expdb/experiments",
    response_model=PageWithHeader[ExpDbExperiment],
    dependencies=[Depends(get_current_user)],
    description="""
- Experiments を検索し、結果を応答
""",
)
async def search_db_experiments(
    db: Session = Depends(get_db),
    options: ExpDbExperimentsSearchOptions = Depends(),
    sortOptions: SortOptions = Depends(),
):
    data = paginate(
        session=db,
        query=select(optinist_model.Experiment),
        additional_data={"header": ExpDbExperimentHeader(graph_titles=[])},
    )
    for item in data.items:
        item.fields = ExpDbExperimentFields(
            brain_area=0, cre_driver=0, reporter_line=0, imaging_depth=0
        )
    return data


@router.get(
    "/expdb/cells",
    response_model=PageWithHeader[ExpDbCell],
    dependencies=[Depends(get_current_user)],
    description="""
- Cells を検索し、結果を応答
""",
)
async def search_db_cells(
    db: Session = Depends(get_db),
    exp_id: Optional[int] = Query(None, description="experiments.id"),
    options: ExpDbExperimentsSearchOptions = Depends(),
    sortOptions: SortOptions = Depends(),
):
    data = paginate(
        session=db,
        query=select(optinist_model.Cell).filter(
            optinist_model.Cell.experiment_seqid == exp_id
        ),
        additional_data={"header": ExpDbExperimentHeader(graph_titles=[])},
    )
    return data


@router.post(
    "/expdb/experiment/publish/{id}/{flag}",
    response_model=bool,
    dependencies=[Depends(get_current_user)],
    description="""
- Experiments を公開する

""",
)
async def publish_db_experiment(
    id: int,
    flag: PublishFlags,
    db: Session = Depends(get_db),
):
    exp = (
        db.query(optinist_model.Experiment)
        .filter(optinist_model.Experiment.id == id)
        .first()
    )
    if not exp:
        raise HTTPException(status_code=404)
    exp.publish_status = int(flag == PublishFlags.on)
    db.add(exp)
    db.commit()
    return True


@router.get(
    "/expdb/share/{id}/status",
    response_model=ExpDbExperimentShareStatus,
    dependencies=[Depends(get_current_user)],
    description="""
- Experiment Database の共有状態を取得する
""",
)
def get_experiment_database_share_status(
    id: int,
    db: Session = Depends(get_db),
):
    exp = (
        db.query(optinist_model.Experiment)
        .join(
            common_model.Organization,
            common_model.Organization.id == optinist_model.Experiment.organization_id,
        )
        .filter(optinist_model.Experiment.id == id)
        .first()
    )
    if not exp:
        raise HTTPException(status_code=404)
    users = (
        db.query(common_model.User)
        .filter(common_model.User.organization_id == exp.organization_id)
        .all()
    )
    return ExpDbExperimentShareStatus(
        share_type=exp.share_type, users=[UserInfo.from_orm(user) for user in users]
    )


@router.post(
    "/expdb/share/{id}/status",
    response_model=bool,
    dependencies=[Depends(get_current_user)],
    description="""
- Experiment Database の共有状態を更新する（総入れ替え）
""",
)
def update_experiment_database_share_status(
    id: int,
    data: ExpDbExperimentSharePostStatus,
    db: Session = Depends(get_db),
):
    exp = (
        db.query(optinist_model.Experiment)
        .filter(optinist_model.Experiment.id == id)
        .first()
    )
    if not exp:
        raise HTTPException(status_code=404)
    exp.share_type = data.share_type
    db.add(exp)
    db.commit()
    return True
