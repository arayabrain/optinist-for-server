import os
from glob import glob
from typing import Optional, Sequence

from fastapi import APIRouter, Depends, HTTPException
from fastapi_pagination.ext.sqlmodel import paginate
from sqlmodel import Session, and_, func, or_, select

from studio.app.common import models as common_model
from studio.app.common.core.auth.auth_dependencies import (
    get_admin_data_user,
    get_current_user,
)
from studio.app.common.db.database import get_db
from studio.app.common.schemas.users import User
from studio.app.dir_path import DIRPATH
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
public_router = APIRouter(tags=["Experiment Database"])

GRAPH_HOST = (
    "http://localhost:8000/datasets"
    if DIRPATH.GRAPH_HOST is None
    else DIRPATH.GRAPH_HOST
)


def expdbcell_transformer(items: Sequence) -> Sequence:
    expdbcells = []
    for item in items:
        expdbcell = ExpDbCell.from_orm(item[0])
        cell_number = item[0].cell_number
        expdbcell.experiment_id = item[1]
        subject_id = expdbcell.experiment_id.split("_")[0]
        exp_dir = f"{GRAPH_HOST}/{subject_id}/{expdbcell.experiment_id}"
        expdbcell.publish_status = item[2]
        expdbcell.fields = ExpDbExperimentFields(**DUMMY_EXPERIMENTS_FIELDS)
        expdbcell.graph_urls = get_cell_urls(
            CELL_GRAPHS,
            exp_dir,
            cell_number,
            params={"param1": 10, "param2": 20},
        )
        expdbcells.append(expdbcell)
    return expdbcells


def experiment_transformer(items: Sequence) -> Sequence:
    experiments = []
    for item in items:
        expdb, cell_count = item
        exp = ExpDbExperiment.from_orm(expdb)
        subject_id = exp.experiment_id.split("_")[0]
        exp_dir = f"{GRAPH_HOST}/{subject_id}/{exp.experiment_id}"
        exp.fields = ExpDbExperimentFields(**DUMMY_EXPERIMENTS_FIELDS)
        exp.cell_image_urls = get_pixelmap_urls(exp_dir)
        exp.graph_urls = get_experiment_urls(EXPERIMENT_GRAPHS, exp_dir)
        experiments.append(exp)
    return experiments


# TODO: use real data
DUMMY_EXPERIMENTS_FIELDS = {
    "brain_area": 13,
    "cre_driver": 20,
    "reporter_line": 30,
    "imaging_depth": 40,
}


EXPERIMENT_GRAPHS = {
    "direction_responsivity_ratio": {
        "title": "Direction Responsivity Ratio",
        "dir": "plots",
    },
    "orientation_responsivity_ratio": {
        "title": "Orientation Responsivity Ratio",
        "dir": "plots",
    },
    "preferred_direction": {"title": "Preferred Direction", "dir": "plots"},
    "preferred_orientation": {"title": "Preferred Orientation", "dir": "plots"},
    "direction_selectivity": {"title": "Direction Selectivity", "dir": "plots"},
    "orientation_selectivity": {"title": "Orientation Selectivity", "dir": "plots"},
    "best_responsivity": {"title": "Best Responsivity", "dir": "plots"},
    "direction_tuning_width": {"title": "Direction Tuning Width", "dir": "plots"},
    "orientation_tuning_width": {"title": "Orientation Tuning Width", "dir": "plots"},
}


def get_experiment_urls(source, exp_dir, params=None):
    return [
        ImageInfo(
            url=f"{exp_dir}/{v['dir']}/{k}.png",
            params=params,
        )
        for k, v in source.items()
    ]


def get_pixelmap_urls(exp_dir, params=None):
    dirs = exp_dir.split("/")
    pub_dir = f"{DIRPATH.PUBLIC_EXPDB_DIR}/{dirs[-2]}/{dirs[-1]}/pixelmaps/"
    pixelmaps = sorted(
        list(set(glob(f"{pub_dir}/*.png")) - set(glob(f"{pub_dir}/*.thumb.png")))
    )

    return [
        ImageInfo(
            url=f"{exp_dir}/pixelmaps/{os.path.basename(k)}",
            params=params,
        )
        for k in pixelmaps
    ]


CELL_GRAPHS = {
    "fov_cell_merge": {"title": "Cell Mask", "dir": "cellmasks"},
    "tuning_curve": {"title": "Tuning Curve", "dir": "plots"},
    "tuning_curve_polar": {"title": "Tuning Curve Polar", "dir": "plots"},
}


def get_cell_urls(source, exp_dir, index: int, params=None):
    return [
        ImageInfo(
            url=f"{exp_dir}/{v['dir']}/{k}_{index}.png",
            params=params,
        )
        for k, v in source.items()
    ]


@public_router.get(
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

    graph_titles = [v["title"] for v in EXPERIMENT_GRAPHS.values()]

    data = paginate(
        session=db,
        query=select(
            optinist_model.Experiment,
            func.count(optinist_model.Cell.id).label("cell_count"),
        )
        .filter_by(publish_status=PublishStatus.on.value)
        .filter(
            optinist_model.Experiment.experiment_id.like(
                "%{0}%".format(options.experiment_id)
            )
        )
        .join(
            optinist_model.Cell,
            optinist_model.Cell.experiment_uid == optinist_model.Experiment.id,
        )
        .group_by(optinist_model.Experiment.id)
        .order_by(*sa_sort_list),
        transformer=experiment_transformer,
        additional_data={"header": ExpDbExperimentHeader(graph_titles=graph_titles)},
    )
    return data


@public_router.get(
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
        select(
            optinist_model.Cell,
            optinist_model.Experiment.experiment_id,
            optinist_model.Experiment.publish_status,
        )
        .join(
            optinist_model.Experiment,
            optinist_model.Cell.experiment_uid == optinist_model.Experiment.id,
        )
        .filter(optinist_model.Experiment.publish_status == PublishStatus.on.value)
        .filter(
            optinist_model.Experiment.experiment_id.like(
                "%{0}%".format(options.experiment_id)
            )
        )
    )
    query = query.group_by(optinist_model.Cell.id).order_by(*sa_sort_list)

    graph_titles = [v["title"] for v in CELL_GRAPHS.values()]

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
    publish_status: Optional[bool] = None,
    options: ExpDbExperimentsSearchOptions = Depends(),
    sortOptions: SortOptions = Depends(),
    current_user: User = Depends(get_current_user),
):
    sa_sort_list = sortOptions.get_sa_sort_list(sa_table=optinist_model.Experiment)
    query = (
        select(
            optinist_model.Experiment,
            func.count(optinist_model.Cell.id).label("cell_count"),
        )
        .join(
            common_model.Organization,
            optinist_model.Experiment.organization_id == common_model.Organization.id,
        )
        .join(
            optinist_model.Cell,
            optinist_model.Cell.experiment_uid == optinist_model.Experiment.id,
        )
    )
    if current_user.is_admin_data:
        query = query.filter(
            common_model.Organization.id == current_user.organization.id
        )
    else:
        query = query.join(
            optinist_model.ExperimentShareUser,
            optinist_model.ExperimentShareUser.experiment_uid
            == optinist_model.Experiment.id,
            isouter=True,
        ).filter(
            or_(
                and_(
                    optinist_model.Experiment.share_type
                    == ExperimentShareType.for_org.value,
                    common_model.Organization.id == current_user.organization.id,
                ),
                and_(
                    optinist_model.Experiment.share_type
                    == ExperimentShareType.per_user.value,
                    optinist_model.ExperimentShareUser.user_id == current_user.id,
                ),
            )
        )
    query = (
        query.filter(
            optinist_model.Experiment.experiment_id.like(
                "%{0}%".format(options.experiment_id)
            ),
            optinist_model.Experiment.publish_status == publish_status
            if publish_status is not None
            else True,
        )
        .group_by(optinist_model.Experiment.id)
        .order_by(*sa_sort_list)
    )

    graph_titles = [v["title"] for v in EXPERIMENT_GRAPHS.values()]

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
    publish_status: Optional[bool] = None,
    options: ExpDbExperimentsSearchOptions = Depends(),
    sortOptions: SortOptions = Depends(),
    current_user: User = Depends(get_current_user),
):
    sa_sort_list = sortOptions.get_sa_sort_list(
        sa_table=optinist_model.Cell,
        mapping={
            "experiment_id": optinist_model.Experiment.experiment_id,
            "publish_status": optinist_model.Experiment.publish_status,
        },
    )
    query = (
        select(
            optinist_model.Cell,
            optinist_model.Experiment.experiment_id,
            optinist_model.Experiment.publish_status,
        )
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
            common_model.Organization.id == current_user.organization.id
        )
    else:
        query = query.join(
            optinist_model.ExperimentShareUser,
            optinist_model.ExperimentShareUser.experiment_uid
            == optinist_model.Experiment.id,
            isouter=True,
        ).filter(
            or_(
                and_(
                    optinist_model.Experiment.share_type
                    == ExperimentShareType.for_org.value,
                    common_model.Organization.id == current_user.organization.id,
                ),
                and_(
                    optinist_model.Experiment.share_type
                    == ExperimentShareType.per_user.value,
                    optinist_model.ExperimentShareUser.user_id == current_user.id,
                ),
            )
        )
    query = (
        query.filter(
            optinist_model.Experiment.experiment_id.like(
                "%{0}%".format(options.experiment_id)
            ),
            optinist_model.Experiment.publish_status == publish_status
            if publish_status is not None
            else True,
        )
        .group_by(optinist_model.Cell.id)
        .order_by(*sa_sort_list)
    )

    graph_titles = [v["title"] for v in CELL_GRAPHS.values()]

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
