from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi_pagination.ext.sqlmodel import paginate
from sqlmodel import Session, and_, or_, select

from studio.app.common import models as common_model
from studio.app.common.core.auth.auth_dependencies import (
    get_admin_user,
    get_current_user,
)
from studio.app.common.db.database import get_db
from studio.app.common.schemas.users import User
from studio.app.optinist import models as optinist_model
from studio.app.optinist.schemas.base import SortDirection, SortOptions
from studio.app.optinist.schemas.expdb.cell import ExpDbCell
from studio.app.optinist.schemas.expdb.experiment import (
    ExpDbExperiment,
    ExpDbExperimentFields,
    ExpDbExperimentHeader,
    ExpDbExperimentSharePostStatus,
    ExpDbExperimentShareStatus,
    ExpDbExperimentsSearchOptions,
    ExperimentShareType,
    PageWithHeader,
    PublishFlags,
    PublishStatus,
)

router = APIRouter()


@router.get(
    "/public/experiments",
    response_model=PageWithHeader[ExpDbExperiment],
    description="""
- 公開 Experiments を検索し、結果を応答
""",
)
async def search_public_experiments(
    options: ExpDbExperimentsSearchOptions = Depends(),
    sortOptions: SortOptions = Depends(),
    db: Session = Depends(get_db),
):
    sort_column = getattr(optinist_model.Experiment, sortOptions.sort[0] or "id")
    data = paginate(
        session=db,
        query=select(optinist_model.Experiment)
        .filter_by(publish_status=PublishStatus.on)
        .order_by(
            sort_column.desc()
            if sortOptions.sort[1] == SortDirection.desc
            else sort_column.asc()
        ),
        additional_data={"header": ExpDbExperimentHeader(graph_titles=[])},
    )
    for item in data.items:
        item.fields = ExpDbExperimentFields(
            brain_area=0, cre_driver=0, reporter_line=0, imaging_depth=0
        )
    return data


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
    sort_column = getattr(optinist_model.Cell, sortOptions.sort[0] or "id")
    query = (
        select(optinist_model.Cell)
        .join(
            optinist_model.Experiment,
            optinist_model.Cell.experiment_seqid == optinist_model.Experiment.id,
        )
        .filter(optinist_model.Experiment.publish_status == PublishStatus.on)
    )
    query = query.filter(optinist_model.Experiment.id == exp_id) if exp_id else query
    query = query.order_by(
        sort_column.desc()
        if sortOptions.sort[1] == SortDirection.desc
        else sort_column.asc()
    )
    data = paginate(
        session=db,
        query=query,
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
    description="""
- Experiments を検索し、結果を応答
""",
)
async def search_db_experiments(
    db: Session = Depends(get_db),
    options: ExpDbExperimentsSearchOptions = Depends(),
    sortOptions: SortOptions = Depends(),
    current_user: User = Depends(get_current_user),
):
    sort_column = getattr(optinist_model.Experiment, sortOptions.sort[0] or "id")
    query = select(optinist_model.Experiment).join(
        common_model.Organization,
        optinist_model.Experiment.organization_id == common_model.Organization.id,
    )
    if current_user.is_admin:
        query = query.filter(
            common_model.Organization.id == current_user.organization_id
        )
    else:
        query = query.join(
            optinist_model.ExperimentShareUser,
            optinist_model.ExperimentShareUser.experiment_seqid
            == optinist_model.Experiment.id,
        ).filter(
            or_(
                and_(
                    optinist_model.Experiment.share_type == ExperimentShareType.for_org,
                    common_model.Organization.id == current_user.organization_id,
                ),
                and_(
                    optinist_model.Experiment.share_type
                    == ExperimentShareType.per_user,
                    optinist_model.ExperimentShareUser.user_id == current_user.id,
                ),
            )
        )
    query = query.order_by(
        sort_column.desc()
        if sortOptions.sort[1] == SortDirection.desc
        else sort_column.asc()
    )
    data = paginate(
        session=db,
        query=query,
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
    description="""
- Cells を検索し、結果を応答
""",
)
async def search_db_cells(
    db: Session = Depends(get_db),
    exp_id: Optional[int] = Query(None, description="experiments.id"),
    options: ExpDbExperimentsSearchOptions = Depends(),
    sortOptions: SortOptions = Depends(),
    current_user: User = Depends(get_current_user),
):
    sort_column = getattr(optinist_model.Cell, sortOptions.sort[0] or "id")
    query = (
        select(optinist_model.Cell)
        .join(
            optinist_model.Experiment,
            optinist_model.Experiment.id == optinist_model.Cell.experiment_seqid,
        )
        .join(
            common_model.Organization,
            optinist_model.Experiment.organization_id == common_model.Organization.id,
        )
    )
    if current_user.is_admin:
        query = query.filter(
            common_model.Organization.id == current_user.organization_id
        )
    else:
        query = query.join(
            optinist_model.ExperimentShareUser,
            optinist_model.ExperimentShareUser.experiment_seqid
            == optinist_model.Experiment.id,
        ).filter(
            or_(
                and_(
                    optinist_model.Experiment.share_type == ExperimentShareType.for_org,
                    common_model.Organization.id == current_user.organization_id,
                ),
                and_(
                    optinist_model.Experiment.share_type
                    == ExperimentShareType.per_user,
                    optinist_model.ExperimentShareUser.user_id == current_user.id,
                ),
            )
        )
    query = (
        query.filter(optinist_model.Cell.experiment_seqid == exp_id)
        if exp_id
        else query
    )
    query = query.order_by(
        sort_column.desc()
        if sortOptions.sort[1] == SortDirection.desc
        else sort_column.asc()
    )
    data = paginate(
        session=db,
        query=query,
        additional_data={"header": ExpDbExperimentHeader(graph_titles=[])},
    )
    return data


@router.post(
    "/expdb/experiment/publish/{id}/{flag}",
    response_model=bool,
    description="""
- Experiments を公開する
""",
)
async def publish_db_experiment(
    id: int,
    flag: PublishFlags,
    db: Session = Depends(get_db),
    current_admin_user: User = Depends(get_admin_user),
):
    exp = (
        db.query(optinist_model.Experiment)
        .filter(
            optinist_model.Experiment.id == id,
        )
        .join(
            common_model.Organization,
            common_model.Organization.id == optinist_model.Experiment.organization_id,
        )
        .join(
            common_model.User,
            common_model.User.organization_id == common_model.Organization.id,
        )
        .filter(
            common_model.User.uid == current_admin_user.uid,
        )
        .first()
    )
    if not exp:
        raise HTTPException(status_code=404)
    exp.publish_status = int(flag == PublishFlags.on)
    db.commit()
    return True


@router.get(
    "/expdb/share/{id}/status",
    response_model=ExpDbExperimentShareStatus,
    description="""
- Experiment Database の共有状態を取得する
""",
)
def get_experiment_database_share_status(
    id: int,
    db: Session = Depends(get_db),
    current_admin_user: User = Depends(get_admin_user),
):
    exp = (
        db.query(optinist_model.Experiment)
        .filter(
            optinist_model.Experiment.id == id,
        )
        .join(
            common_model.Organization,
            common_model.Organization.id == optinist_model.Experiment.organization_id,
        )
        .join(
            common_model.User,
            common_model.User.organization_id == common_model.Organization.id,
        )
        .filter(
            common_model.User.uid == current_admin_user.uid,
        )
        .first()
    )
    if not exp:
        raise HTTPException(status_code=404)

    users = (
        db.query(common_model.User)
        .join(
            optinist_model.ExperimentShareUser,
            optinist_model.ExperimentShareUser.experiment_seqid == id,
        )
        .all()
    )

    return ExpDbExperimentShareStatus(share_type=exp.share_type, users=users)


@router.post(
    "/expdb/share/{id}/status",
    response_model=bool,
    description="""
- Experiment Database の共有状態を更新する（総入れ替え）
""",
)
def update_experiment_database_share_status(
    id: int,
    data: ExpDbExperimentSharePostStatus,
    db: Session = Depends(get_db),
    current_admin_user: User = Depends(get_admin_user),
):
    exp = (
        db.query(optinist_model.Experiment)
        .join(
            common_model.Organization,
            common_model.Organization.id == optinist_model.Experiment.organization_id,
        )
        .join(
            common_model.User,
            common_model.User.organization_id == common_model.Organization.id,
        )
        .filter(
            common_model.User.uid == current_admin_user.uid,
            optinist_model.Experiment.id == id,
        )
        .first()
    )
    if not exp:
        raise HTTPException(status_code=404)

    (
        db.query(optinist_model.ExperimentShareUser)
        .filter(optinist_model.ExperimentShareUser.experiment_seqid == id)
        .delete(synchronize_session=False)
    )

    [
        db.add(optinist_model.ExperimentShareUser(experiment_seqid=id, user_id=user_id))
        for user_id in data.user_ids
    ]

    exp.share_type = data.share_type

    db.commit()

    return True
