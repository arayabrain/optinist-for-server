from typing import Sequence

from fastapi import APIRouter, Depends, HTTPException
from fastapi_pagination.ext.sqlmodel import paginate
from sqlmodel import Session, and_, or_, select

from studio.app.common import models as common_model
from studio.app.common.core.auth.auth_dependencies import (
    get_admin_data_user,
    get_current_user,
)
from studio.app.common.db.database import get_db
from studio.app.common.schemas.users import User
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
    ExperimentShareType,
    ImageInfo,
    PageWithHeader,
    PublishFlags,
    PublishStatus,
)

router = APIRouter(tags=["Experiment Database"])


def expdbcell_transformer(items: Sequence) -> Sequence:
    expdbcells = []
    for item in items:
        expdbcell = ExpDbCell.from_orm(item[0])
        expdbcell.experiment_id = item[1]
        expdbcell.fields = ExpDbExperimentFields(**DUMMY_EXPERIMENTS_FIELDS)
        # TODO: set dummy data.
        expdbcell.cell_image_url = DUMMY_EXPERIMENTS_CELL_IMAGE_URLS[0]
        # TODO: set dummy data.
        expdbcell.graph_urls = DUMMY_CELLS_GRAPH_URLS
        expdbcells.append(expdbcell)
    return expdbcells


def experiment_transformer(items: Sequence) -> Sequence:
    experiments = []
    for item in items:
        exp = ExpDbExperiment.from_orm(item)
        # TODO: set dummy data.
        exp.fields = ExpDbExperimentFields(**DUMMY_EXPERIMENTS_FIELDS)
        # TODO: set dummy data.
        exp.cell_image_urls = DUMMY_EXPERIMENTS_CELL_IMAGE_URLS
        # TODO: set dummy data.
        exp.graph_urls = DUMMY_EXPERIMENTS_GRAPH_URLS
        experiments.append(exp)
    return experiments


# TODO: set dummy data.
DUMMY_EXPERIMENTS_FIELDS = {
    "brain_area": 13,
    "cre_driver": 20,
    "reporter_line": 30,
    "imaging_depth": 40,
}

# TODO: set dummy data.
DUMMY_EXPERIMENTS_GRAPH_TITLES = [
    "Direction Responsivity Ratio",
    "Orientation Responsivity Ratio",
    "Preferred Direction",
    "Preferred Orientation",
    "Direction Selectivity",
    "Orientation Selectivity",
    "Best Responsivity",
    "Direction Tuning Width",
    "Orientation Tuning Width",
]

# TODO: set dummy data.
DUMMY_CELLS_GRAPH_TITLES = [
    "Responsivity Statistic",
    "Preferred Direction",
    "Preferred Orientation",
    "Direction Selectivity",
    "Orientation Selectivity",
    "Best Responsivity",
    "Direction Tuning Width",
    "Orientation Tuning Width",
    "Tuning Curve",
    "Tuning Curve Poler",
]

# TODO: set dummy data.
DUMMY_EXPERIMENTS_CELL_IMAGE_URLS = [
    ImageInfo(
        url="http://localhost:8000/static/sample_media/pixel_image.png",
        thumb_url="http://localhost:8000/static/sample_media/pixel_image_thumb.png",
    )
    for _ in range(5)
]

# TODO: set dummy data.
DUMMY_EXPERIMENTS_GRAPH_URLS = [
    ImageInfo(
        url=f"http://localhost:8000/static/sample_media/bar_chart_{(_ % 3) + 1}.png",
        thumb_url=f"http://localhost:8000/static/sample_media/bar_chart_{(_ % 3) + 1}.png",  # noqa: E501
    )
    for _, __ in enumerate(DUMMY_EXPERIMENTS_GRAPH_TITLES)
]

# TODO: set dummy data.
DUMMY_CELLS_GRAPH_URLS = [
    ImageInfo(
        url=f"http://localhost:8000/static/sample_media/bar_chart_{(_ % 3) + 1}.png",
        thumb_url=f"http://localhost:8000/static/sample_media/bar_chart_{(_ % 3) + 1}.png",  # noqa: E501
        params={"param1": 10, "param2": 20},
    )
    for _, __ in enumerate(DUMMY_CELLS_GRAPH_TITLES)
]


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
    sa_sort_list = sortOptions.get_sa_sort_list(sa_table=optinist_model.Experiment)

    # TODO: set dummy data.
    graph_titles = DUMMY_EXPERIMENTS_GRAPH_TITLES

    data = paginate(
        session=db,
        query=select(optinist_model.Experiment)
        .filter_by(publish_status=PublishStatus.on)
        .filter(
            optinist_model.Experiment.experiment_id.like(
                "%{0}%".format(options.experiment_id)
            )
        )
        .group_by(optinist_model.Experiment.id)
        .order_by(*sa_sort_list),
        transformer=experiment_transformer,
        additional_data={"header": ExpDbExperimentHeader(graph_titles=graph_titles)},
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
    options: ExpDbExperimentsSearchOptions = Depends(),
    sortOptions: SortOptions = Depends(),
    db: Session = Depends(get_db),
):
    sa_sort_list = sortOptions.get_sa_sort_list(
        sa_table=optinist_model.Cell,
        mapping={"experiment_id": optinist_model.Experiment.experiment_id},
    )
    query = (
        select(optinist_model.Cell, optinist_model.Experiment.experiment_id)
        .join(
            optinist_model.Experiment,
            optinist_model.Cell.experiment_uid == optinist_model.Experiment.id,
        )
        .filter(optinist_model.Experiment.publish_status == PublishStatus.on)
        .filter(
            optinist_model.Experiment.experiment_id.like(
                "%{0}%".format(options.experiment_id)
            )
        )
    )
    query = query.group_by(optinist_model.Cell.id).order_by(*sa_sort_list)

    # TODO: set dummy data.
    graph_titles = DUMMY_CELLS_GRAPH_TITLES

    data = paginate(
        session=db,
        query=query,
        transformer=expdbcell_transformer,
        additional_data={"header": ExpDbExperimentHeader(graph_titles=graph_titles)},
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
    sa_sort_list = sortOptions.get_sa_sort_list(sa_table=optinist_model.Experiment)
    query = select(optinist_model.Experiment).join(
        common_model.Organization,
        optinist_model.Experiment.organization_id == common_model.Organization.id,
    )
    if current_user.is_admin_data:
        query = query.filter(
            common_model.Organization.id == current_user.organization_id
        )
    else:
        query = query.join(
            optinist_model.ExperimentShareUser,
            optinist_model.ExperimentShareUser.experiment_uid
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
        query.filter(
            optinist_model.Experiment.experiment_id.like(
                "%{0}%".format(options.experiment_id)
            )
        )
        .group_by(optinist_model.Experiment.id)
        .order_by(*sa_sort_list)
    )

    # TODO: set dummy data.
    graph_titles = DUMMY_EXPERIMENTS_GRAPH_TITLES

    data = paginate(
        session=db,
        query=query,
        transformer=experiment_transformer,
        additional_data={"header": ExpDbExperimentHeader(graph_titles=graph_titles)},
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
    options: ExpDbExperimentsSearchOptions = Depends(),
    sortOptions: SortOptions = Depends(),
    current_user: User = Depends(get_current_user),
):
    sa_sort_list = sortOptions.get_sa_sort_list(
        sa_table=optinist_model.Cell,
        mapping={"experiment_id": optinist_model.Experiment.experiment_id},
    )
    query = (
        select(optinist_model.Cell, optinist_model.Experiment.experiment_id)
        .join(
            optinist_model.Experiment,
            optinist_model.Experiment.id == optinist_model.Cell.experiment_uid,
        )
        .join(
            common_model.Organization,
            optinist_model.Experiment.organization_id == common_model.Organization.id,
        )
    )
    if current_user.is_admin_data:
        query = query.filter(
            common_model.Organization.id == current_user.organization_id
        )
    else:
        query = query.join(
            optinist_model.ExperimentShareUser,
            optinist_model.ExperimentShareUser.experiment_uid
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
        query.filter(
            optinist_model.Experiment.experiment_id.like(
                "%{0}%".format(options.experiment_id)
            )
        )
        .group_by(optinist_model.Cell.id)
        .order_by(*sa_sort_list)
    )

    # TODO: set dummy data.
    graph_titles = DUMMY_CELLS_GRAPH_TITLES

    data = paginate(
        session=db,
        query=query,
        transformer=expdbcell_transformer,
        additional_data={"header": ExpDbExperimentHeader(graph_titles=graph_titles)},
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
    current_admin_user: User = Depends(get_admin_data_user),
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
    current_admin_user: User = Depends(get_admin_data_user),
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

    if exp.share_type == ExperimentShareType.per_user:
        users = (
            db.query(common_model.User)
            .filter(common_model.User.active.is_(True))
            .join(
                optinist_model.ExperimentShareUser,
                optinist_model.ExperimentShareUser.user_id == common_model.User.id,
            )
            .filter(optinist_model.ExperimentShareUser.experiment_uid == id)
            .all()
        )
    else:
        users = []
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
    current_admin_user: User = Depends(get_admin_data_user),
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
        .filter(optinist_model.ExperimentShareUser.experiment_uid == id)
        .delete(synchronize_session=False)
    )

    if data.share_type == ExperimentShareType.per_user:
        db.bulk_save_objects(
            optinist_model.ExperimentShareUser(experiment_uid=id, user_id=user_id)
            for user_id in data.user_ids
        )

    exp.share_type = data.share_type

    db.commit()

    return True
