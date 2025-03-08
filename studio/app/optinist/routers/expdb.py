import os
from glob import glob
from typing import Dict, List, Optional, Sequence

import sqlalchemy
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi_pagination.ext.sqlmodel import paginate
from pydantic import parse_obj_as
from sqlalchemy.sql import Select
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
from studio.app.optinist.core.expdb.crud_expdb import extract_experiment_view_attributes
from studio.app.optinist.schemas.base import SortDirection, SortOptions
from studio.app.optinist.schemas.expdb.cell import ExpDbCell
from studio.app.optinist.schemas.expdb.config import ExpDbExperimentFilterParams
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


def expdbcell_transformer(items: Sequence) -> Sequence:
    expdbcells = []
    for item in items:
        expdbcell = ExpDbCell.from_orm(item)
        subject_id = expdbcell.experiment_id.split("_")[0]
        exp_dir = f"{DIRPATH.GRAPH_HOST}/{subject_id}/{expdbcell.experiment_id}"
        try:
            expdbcell.fields = ExpDbExperimentFields(**item.view_attributes)
        except Exception:
            expdbcell.fields = ExpDbExperimentFields()

        expdbcell.graph_urls = get_cell_urls(CELL_GRAPHS, exp_dir, item.cell_number)
        expdbcell.statistics = {
            k: "{:.4g}".format(v) if v else None
            for k, v in expdbcell.statistics.items()
        }
        expdbcells.append(expdbcell)
    return expdbcells


def experiment_transformer(items: Sequence) -> Sequence:
    experiments = []
    for item in items:
        expdb: optinist_model.Experiment = item
        exp = ExpDbExperiment.from_orm(expdb)
        subject_id = exp.experiment_id.split("_")[0]
        exp_dir = f"{DIRPATH.GRAPH_HOST}/{subject_id}/{exp.experiment_id}"

        try:
            exp.fields = ExpDbExperimentFields(**expdb.view_attributes)
        except Exception:
            exp.fields = ExpDbExperimentFields()

        exp.cell_image_urls = get_pixelmap_urls(exp_dir)
        exp.graph_urls = get_experiment_urls(EXPERIMENT_GRAPHS, exp_dir)
        experiments.append(exp)
    return experiments


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
        ImageInfo(urls=[f"{exp_dir}/{v['dir']}/{k}.png"], params=params)
        for k, v in source.items()
    ]


def get_pixelmap_urls(exp_dir, params=None):
    dirs = exp_dir.split("/")
    pub_dir = f"{DIRPATH.PUBLIC_EXPDB_DIR}/{dirs[-2]}/{dirs[-1]}/pixelmaps/"
    pixelmaps = sorted(
        list(set(glob(f"{pub_dir}/*.png")) - set(glob(f"{pub_dir}/*.thumb.png")))
    )

    return [
        ImageInfo(urls=[f"{exp_dir}/pixelmaps/{os.path.basename(k)}"], params=params)
        for k in pixelmaps
    ]


CELL_GRAPHS = {
    "fov_cell_merge": {"title": "Cell Mask", "dir": "cellmasks"},
    "tuning_curve": {"title": "Tuning Curve", "dir": "plots"},
    "tuning_curve_polar": {"title": "Tuning Curve Polar", "dir": "plots"},
}

EXP_ATTRIBUTE_SORT_MAPPING = {
    "brain_area": func.json_value(
        optinist_model.Experiment.view_attributes, "$.brain_area"
    ),
    "imaging_depth": func.json_value(
        optinist_model.Experiment.view_attributes, "$.imaging_depth"
    ),
    "promoter": func.json_value(
        optinist_model.Experiment.view_attributes, "$.promoter"
    ),
    "indicator": func.json_value(
        optinist_model.Experiment.view_attributes, "$.indicator"
    ),
}


def get_cell_urls(source, exp_dir, index: int, params=None):
    return [
        ImageInfo(urls=[f"{exp_dir}/{v['dir']}/{k}_{index}.png"], params=params)
        for k, v in source.items()
    ]


def get_search_db_experiment_query(
    query: Select, options: ExpDbExperimentsSearchOptions
) -> Select:
    if options.experiment_id is not None:
        query = query.filter(
            optinist_model.Experiment.experiment_id.like(
                "%{0}%".format(options.experiment_id)
            )
        )

    if options.brain_area is not None:
        query = query.filter(
            func.json_value(
                optinist_model.Experiment.view_attributes, "$.brain_area"
            ).in_(options.brain_area)
        )

    if options.imaging_depth is not None:
        query = query.filter(
            func.json_value(
                optinist_model.Experiment.view_attributes, "$.imaging_depth"
            ).in_(options.imaging_depth)
        )

    if options.indicator is not None:
        query = query.filter(
            func.json_value(
                optinist_model.Experiment.view_attributes, "$.indicator"
            ).in_(options.indicator)
        )

    if options.promoter is not None:
        query = query.filter(
            func.json_value(
                optinist_model.Experiment.view_attributes, "$.promoter"
            ).in_(options.promoter)
        )

    return query


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
    sa_sort_list = sortOptions.get_sa_sort_list(
        sa_table=optinist_model.Experiment,
        mapping=EXP_ATTRIBUTE_SORT_MAPPING,
        default=["experiment_id", SortDirection.asc],
    )

    graph_titles = [v["title"] for v in EXPERIMENT_GRAPHS.values()]
    query = select(optinist_model.Experiment).filter_by(
        publish_status=PublishStatus.on.value
    )

    query = get_search_db_experiment_query(query, options)
    query = query.group_by(optinist_model.Experiment.id).order_by(*sa_sort_list)

    data = paginate(
        session=db,
        query=query,
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
    limit: int = Query(50, description="records limit"),
    offset: int = Query(0, description="records offset"),
    sortOptions: SortOptions = Depends(),
    db: Session = Depends(get_db),
):
    sa_sort_list = sortOptions.get_sa_sort_list(
        sa_table=optinist_model.Cell,
        mapping={
            "experiment_id": optinist_model.Experiment.experiment_id,
            **EXP_ATTRIBUTE_SORT_MAPPING,
        },
        default=["experiment_id", SortDirection.asc],
    )
    base_query = (
        select(optinist_model.Cell.id)
        .join(
            optinist_model.Experiment,
            optinist_model.Cell.experiment_uid == optinist_model.Experiment.id,
        )
        .filter(optinist_model.Experiment.publish_status == PublishStatus.on.value)
    )

    base_query = get_search_db_experiment_query(base_query, options)
    sub_query = (
        base_query.order_by(*sa_sort_list).limit(limit).offset(offset).subquery()
    )
    query = (
        select(
            optinist_model.Cell.id,
            optinist_model.Cell.statistics,
            optinist_model.Cell.cell_number,
            optinist_model.Cell.created_at,
            optinist_model.Cell.updated_at,
            optinist_model.Cell.experiment_uid,
            optinist_model.Experiment.experiment_id,
            optinist_model.Experiment.publish_status,
            optinist_model.Experiment.view_attributes,
        )
        .join(
            optinist_model.Experiment,
            optinist_model.Cell.experiment_uid == optinist_model.Experiment.id,
        )
        .join(sub_query, sub_query.c.id == optinist_model.Cell.id)
        .order_by(*sa_sort_list)
    )
    graph_titles = [v["title"] for v in CELL_GRAPHS.values()]

    """
    The two indexes are used to improve performance of fetching data query.
    But in count query, it makes execution slower.

    Since `fastapi-pagination` library is using the same base query
    for both the purpose of fetching data and calculating the amount
    of data and does not allow customization of the quantity calculation method,
    pagination needs to be implement manually to improve performance.
    """
    return PageWithHeader[ExpDbCell](
        header=ExpDbExperimentHeader(graph_titles=graph_titles),
        items=expdbcell_transformer(db.execute(query).all()),
        total=db.scalar(select(func.count()).select_from(base_query.subquery())),
        limit=limit,
        offset=offset,
    )


@public_router.get(
    "/public/config/filter_params",
    response_model=ExpDbExperimentFilterParams,
    description="""
- Responds to the parameter list for Filter for Experiments.
- Data is obtained from DB table `configs.experiment_config`.
""",
)
async def get_config_filter_params(
    db: Session = Depends(get_db),
):
    try:
        config = db.query(optinist_model.Config).one_or_none()
        return parse_obj_as(
            ExpDbExperimentFilterParams, config.experiment_config["filter_params"]
        )
    except sqlalchemy.exc.MultipleResultsFound as e:
        raise HTTPException(status_code=500, detail=str(e))


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
    sa_sort_list = sortOptions.get_sa_sort_list(
        sa_table=optinist_model.Experiment,
        mapping=EXP_ATTRIBUTE_SORT_MAPPING,
        default=["experiment_id", SortDirection.asc],
    )
    query = select(optinist_model.Experiment)
    if current_user.is_admin_data:
        query = query.filter(
            optinist_model.Experiment.organization_id == current_user.organization.id
        )
    else:
        query = (
            query.join(
                optinist_model.ExperimentShareUser,
                optinist_model.ExperimentShareUser.experiment_uid
                == optinist_model.Experiment.id,
                isouter=True,
            )
            .join(
                optinist_model.ExperimentShareGroup,
                optinist_model.ExperimentShareGroup.experiment_uid
                == optinist_model.Experiment.id,
                isouter=True,
            )
            .join(
                common_model.UserGroup,
                common_model.UserGroup.group_id
                == optinist_model.ExperimentShareGroup.group_id,
                isouter=True,
            )
            .filter(
                or_(
                    and_(
                        optinist_model.Experiment.share_type
                        == ExperimentShareType.for_org.value,
                        optinist_model.Experiment.organization_id
                        == current_user.organization.id,
                    ),
                    and_(
                        optinist_model.Experiment.share_type
                        == ExperimentShareType.per_user_or_group.value,
                        or_(
                            optinist_model.ExperimentShareUser.user_id
                            == current_user.id,
                            common_model.UserGroup.user_id == current_user.id,
                        ),
                    ),
                )
            )
        )

    query = get_search_db_experiment_query(query, options)

    if publish_status is not None:
        query = query.filter(optinist_model.Experiment.publish_status == publish_status)

    query = query.group_by(optinist_model.Experiment.id).order_by(*sa_sort_list)

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
    limit: int = Query(50, description="records limit"),
    offset: int = Query(0, description="records offset"),
    options: ExpDbExperimentsSearchOptions = Depends(),
    sortOptions: SortOptions = Depends(),
    current_user: User = Depends(get_current_user),
):
    sa_sort_list = sortOptions.get_sa_sort_list(
        sa_table=optinist_model.Cell,
        mapping={
            "experiment_id": optinist_model.Experiment.experiment_id,
            "publish_status": optinist_model.Experiment.publish_status,
            **EXP_ATTRIBUTE_SORT_MAPPING,
        },
        default=["experiment_id", SortDirection.asc],
    )
    query = select(
        optinist_model.Cell.id,
        optinist_model.Cell.statistics,
        optinist_model.Cell.cell_number,
        optinist_model.Cell.created_at,
        optinist_model.Cell.updated_at,
        optinist_model.Cell.experiment_uid,
        optinist_model.Experiment.experiment_id,
        optinist_model.Experiment.publish_status,
        optinist_model.Experiment.view_attributes,
    )
    if any(
        hasattr(sort, "element")
        and hasattr(sort.element, "table")
        and sort.element.table.name == optinist_model.Cell.__table__.name
        for sort in sa_sort_list
    ):
        query = query.with_hint(
            optinist_model.Cell,
            text="USE INDEX (cells_id_created_at_updated_at_index)",
            dialect_name="mysql",
        )
    query = query.join(
        optinist_model.Experiment,
        optinist_model.Experiment.id == optinist_model.Cell.experiment_uid,
    ).with_hint(
        optinist_model.Experiment,
        text="FORCE INDEX FOR JOIN (experiments_id_org_id_experiment_id_publish_status_index)",  # noqa
        dialect_name="mysql",
    )
    total_query = select(optinist_model.Cell.id).join(
        optinist_model.Experiment,
        optinist_model.Experiment.id == optinist_model.Cell.experiment_uid,
    )

    if current_user.is_admin_data:
        query = query.filter(
            optinist_model.Experiment.organization_id == current_user.organization.id
        )
        total_query = total_query.filter(
            optinist_model.Experiment.organization_id == current_user.organization.id
        )

    else:
        query = (
            query.join(
                optinist_model.ExperimentShareUser,
                optinist_model.ExperimentShareUser.experiment_uid
                == optinist_model.Experiment.id,
                isouter=True,
            )
            .join(
                optinist_model.ExperimentShareGroup,
                optinist_model.ExperimentShareGroup.experiment_uid
                == optinist_model.Experiment.id,
                isouter=True,
            )
            .join(
                common_model.UserGroup,
                common_model.UserGroup.group_id
                == optinist_model.ExperimentShareGroup.group_id,
                isouter=True,
            )
            .filter(
                or_(
                    and_(
                        optinist_model.Experiment.share_type
                        == ExperimentShareType.for_org.value,
                        optinist_model.Experiment.organization_id
                        == current_user.organization.id,
                    ),
                    and_(
                        optinist_model.Experiment.share_type
                        == ExperimentShareType.per_user_or_group.value,
                        or_(
                            optinist_model.ExperimentShareUser.user_id
                            == current_user.id,
                            common_model.UserGroup.user_id == current_user.id,
                        ),
                    ),
                )
            )
        )

        total_query = (
            total_query.join(
                optinist_model.ExperimentShareUser,
                optinist_model.ExperimentShareUser.experiment_uid
                == optinist_model.Experiment.id,
                isouter=True,
            )
            .join(
                optinist_model.ExperimentShareGroup,
                optinist_model.ExperimentShareGroup.experiment_uid
                == optinist_model.Experiment.id,
                isouter=True,
            )
            .join(
                common_model.UserGroup,
                common_model.UserGroup.group_id
                == optinist_model.ExperimentShareGroup.group_id,
                isouter=True,
            )
            .filter(
                or_(
                    and_(
                        optinist_model.Experiment.share_type
                        == ExperimentShareType.for_org.value,
                        optinist_model.Experiment.organization_id
                        == current_user.organization.id,
                    ),
                    and_(
                        optinist_model.Experiment.share_type
                        == ExperimentShareType.per_user_or_group.value,
                        or_(
                            optinist_model.ExperimentShareUser.user_id
                            == current_user.id,
                            common_model.UserGroup.user_id == current_user.id,
                        ),
                    ),
                )
            )
        )

    query = get_search_db_experiment_query(query, options)
    total_query = get_search_db_experiment_query(total_query, options)
    if publish_status is not None:
        query = query.filter(
            optinist_model.Experiment.publish_status == publish_status
        ).group_by(optinist_model.Cell.id)
        total_query = total_query.filter(
            optinist_model.Experiment.publish_status == publish_status
        ).group_by(optinist_model.Cell.id)

    query = query.order_by(*sa_sort_list)

    graph_titles = [v["title"] for v in CELL_GRAPHS.values()]

    return PageWithHeader[ExpDbCell](
        header=ExpDbExperimentHeader(graph_titles=graph_titles),
        items=expdbcell_transformer(
            db.execute(query.limit(limit).offset(offset)).all()
        ),
        total=db.scalar(select(func.count()).select_from(total_query.subquery())),
        limit=limit,
        offset=offset,
    )


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


@router.post(
    "/expdb/experiment/multiple/publish/{flag}",
    response_model=bool,
    description="""
- Experiments を一括公開する

""",
)
def multiple_publish_db_experiment(
    ids: List[int],
    flag: PublishFlags,
    db: Session = Depends(get_db),
    current_admin_user: User = Depends(get_admin_data_user),
):
    db.query(optinist_model.Experiment).filter(
        optinist_model.Experiment.id.in_(ids),
        common_model.Organization.id == optinist_model.Experiment.organization_id,
        common_model.User.organization_id == common_model.Organization.id,
        common_model.User.uid == current_admin_user.uid,
    ).update(
        {optinist_model.Experiment.publish_status: int(flag == PublishFlags.on)},
        synchronize_session=False,
    )
    db.commit()
    return True


@router.put(
    "/expdb/experiment/metadata/{id}",
    response_model=bool,
    tags=["Experiment Database"],
    description="""
- Experiments の Metadata を更新する
""",
    dependencies=[Depends(get_admin_data_user)],
)
def update_db_experiment_metadata(
    id: int,
    metadata: Dict,
    db: Session = Depends(get_db),
    current_admin_user: User = Depends(get_admin_data_user),
):
    view_attributes = extract_experiment_view_attributes(metadata)
    if not view_attributes:
        raise HTTPException(status_code=422)

    exp = (
        db.query(optinist_model.Experiment)
        .filter(
            optinist_model.Experiment.id == id,
            optinist_model.Experiment.organization_id
            == current_admin_user.organization.id,
        )
        .first()
    )
    if not exp:
        raise HTTPException(status_code=404)
    exp.attributes = metadata
    exp.view_attributes = view_attributes
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

    return ExpDbExperimentShareStatus(
        share_type=exp.share_type, users=exp.active_user_share, groups=exp.group_share
    )


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
    (
        db.query(optinist_model.ExperimentShareGroup)
        .filter(optinist_model.ExperimentShareGroup.experiment_uid == id)
        .delete(synchronize_session=False)
    )

    if data.share_type == ExperimentShareType.per_user_or_group:
        if len(data.user_ids) > 0:
            db.bulk_save_objects(
                optinist_model.ExperimentShareUser(experiment_uid=id, user_id=user_id)
                for user_id in data.user_ids
            )
        if len(data.group_ids) > 0:
            db.bulk_save_objects(
                optinist_model.ExperimentShareGroup(
                    experiment_uid=id, group_id=group_id
                )
                for group_id in data.group_ids
            )
    exp.share_type = data.share_type

    db.commit()

    return True


@router.post(
    "/expdb/multiple/share/status",
    response_model=bool,
    description="""
- Experiment Database の共有状態を一括更新する（総入れ替え）
""",
)
def update_multiple_experiment_database_share_status(
    ids: List[int],
    data: ExpDbExperimentSharePostStatus,
    db: Session = Depends(get_db),
    current_admin_user: User = Depends(get_admin_data_user),
):
    exps = (
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
            optinist_model.Experiment.id.in_(ids),
        )
        .all()
    )

    (
        db.query(optinist_model.ExperimentShareUser)
        .filter(
            optinist_model.ExperimentShareUser.experiment_uid.in_(
                [exp.id for exp in exps]
            )
        )
        .delete(synchronize_session=False)
    )
    (
        db.query(optinist_model.ExperimentShareGroup)
        .filter(
            optinist_model.ExperimentShareGroup.experiment_uid.in_(
                [exp.id for exp in exps]
            )
        )
        .delete(synchronize_session=False)
    )
    for exp in exps:
        exp.share_type = data.share_type
        if data.share_type == ExperimentShareType.per_user_or_group:
            if len(data.user_ids) > 0:
                db.bulk_save_objects(
                    optinist_model.ExperimentShareUser(
                        experiment_uid=exp.id, user_id=user_id
                    )
                    for user_id in data.user_ids
                )
            if len(data.group_ids) > 0:
                db.bulk_save_objects(
                    optinist_model.ExperimentShareGroup(
                        experiment_uid=exp.id, group_id=group_id
                    )
                    for group_id in data.group_ids
                )

    db.commit()

    return True
