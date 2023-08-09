from fastapi import APIRouter, Depends, HTTPException
from fastapi_pagination import LimitOffsetPage
from fastapi_pagination.ext.sqlmodel import paginate
from sqlalchemy import func
from sqlmodel import Session, or_, select

from studio.app.common import models as common_model
from studio.app.common.core.auth.auth_dependencies import get_current_user
from studio.app.common.db.database import get_db
from studio.app.common.schemas.users import User
from studio.app.common.schemas.workspace import (
    Workspace,
    WorkspaceCreate,
    WorkspaceSharePostStatus,
    WorkspaceShareStatus,
    WorkspacesSetting,
    WorkspaceUpdate,
)
from studio.app.optinist.schemas.base import SortOptions

router = APIRouter(tags=["Workspace"])


shared_count_subquery = (
    select(func.count())
    .select_from(common_model.WorkspacesShareUser)
    .join(
        common_model.User,
        common_model.WorkspacesShareUser.user_id == common_model.User.id,
    )
    .where(
        common_model.WorkspacesShareUser.workspace_id == common_model.Workspace.id,
        common_model.User.active.is_(True),
    )
    .correlate(common_model.Workspace)
    .as_scalar()
)


@router.get(
    "/workspaces",
    response_model=LimitOffsetPage[Workspace],
    description="""
- Workspacesを検索し、結果を応答
""",
)
def search_workspaces(
    sortOptions: SortOptions = Depends(),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    sa_sort_list = sortOptions.get_sa_sort_list(sa_table=common_model.Workspace)

    def workspace_transformer(items):
        list_ws = []
        for item in items:
            item[0].__dict__["shared_count"] = item.shared_count
            list_ws.append(item[0])
        return list_ws

    query = (
        select(common_model.Workspace, shared_count_subquery.label("shared_count"))
        .join(
            common_model.WorkspacesShareUser,
            common_model.Workspace.id == common_model.WorkspacesShareUser.workspace_id,
            isouter=True,
        )
        .filter(
            common_model.Workspace.deleted.is_(False),
            or_(
                common_model.WorkspacesShareUser.user_id == current_user.id,
                common_model.Workspace.user_id == current_user.id,
            ),
        )
        .group_by(common_model.Workspace.id)
        .order_by(*sa_sort_list)
    )

    data = paginate(
        db,
        query,
        transformer=workspace_transformer,
    )
    return data


@router.get(
    "/workspace/{id}",
    response_model=Workspace,
    description="""
- Workspaceを検索し、結果を応答
""",
)
def get_workspace(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    data = (
        db.query(common_model.Workspace, shared_count_subquery.label("shared_count"))
        .outerjoin(
            common_model.WorkspacesShareUser,
            common_model.Workspace.id == common_model.WorkspacesShareUser.workspace_id,
        )
        .filter(
            common_model.Workspace.id == id,
            common_model.Workspace.deleted.is_(False),
            or_(
                common_model.WorkspacesShareUser.user_id == current_user.id,
                common_model.Workspace.user_id == current_user.id,
            ),
        )
        .first()
    )
    if not data:
        raise HTTPException(status_code=404)
    workspace, shared_count = data
    workspace.__dict__["shared_count"] = shared_count
    return Workspace.from_orm(workspace)


@router.post(
    "/workspace",
    response_model=Workspace,
    description="""
- Workspace を作成する
""",
)
def create_workspace(
    workspace: WorkspaceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    workspace = common_model.Workspace(
        **workspace.dict(), user_id=current_user.id, deleted=0
    )
    db.add(workspace)
    db.commit()
    db.refresh(workspace)
    workspace.__dict__["user"] = current_user
    workspace.__dict__["shared_count"] = 0
    return Workspace.from_orm(workspace)


@router.put(
    "/workspace/{id}",
    response_model=Workspace,
    description="""
- Workspace を更新する
""",
)
def update_workspace(
    id: int,
    workspace: WorkspaceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    data = (
        db.query(common_model.Workspace, shared_count_subquery)
        .filter(
            common_model.Workspace.id == id,
            common_model.Workspace.user_id == current_user.id,
            common_model.Workspace.deleted.is_(False),
        )
        .first()
    )
    if not data:
        raise HTTPException(status_code=404)
    ws, shared_count = data
    data = workspace.dict(exclude_unset=True)
    for key, value in data.items():
        setattr(ws, key, value)
    db.commit()
    db.refresh(ws)
    ws.__dict__["user"] = current_user
    ws.__dict__["shared_count"] = shared_count
    return Workspace.from_orm(ws)


@router.delete(
    "/workspace/{id}",
    response_model=bool,
    description="""
- Workspace を削除する
""",
)
def delete_workspace(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ws = (
        db.query(common_model.Workspace)
        .filter(
            common_model.Workspace.id == id,
            common_model.Workspace.user_id == current_user.id,
            common_model.Workspace.deleted.is_(False),
        )
        .first()
    )
    if not ws:
        raise HTTPException(status_code=404)
    ws.deleted = True
    db.commit()
    return True


@router.get(
    "/workspace/export/{id}",
    response_model=WorkspacesSetting,
    description="""
- Workspace 設定をExportする
""",
)
def export_workspace(id: int, db: Session = Depends(get_db)):
    return {"todo_dummy": {}}


@router.post(
    "/workspace/import",
    response_model=bool,
    description="""
- Workspace 設定をImportする
""",
)
def import_workspace(
    setting: WorkspacesSetting,
):
    return True


@router.get(
    "/workspace/share/{id}/status",
    response_model=WorkspaceShareStatus,
    description="""
- Workspace の共有状態を取得する
""",
)
def get_workspace_share_status(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    workspace = (
        db.query(common_model.Workspace)
        .filter(
            common_model.Workspace.id == id,
            common_model.Workspace.user_id == current_user.id,
            common_model.Workspace.deleted.is_(False),
        )
        .first()
    )
    if not workspace:
        raise HTTPException(status_code=404)
    users = (
        db.query(common_model.User)
        .join(
            common_model.WorkspacesShareUser,
            common_model.WorkspacesShareUser.user_id == common_model.User.id,
        )
        .filter(
            common_model.WorkspacesShareUser.workspace_id == id,
            common_model.User.active.is_(True),
        )
        .all()
    )
    return WorkspaceShareStatus(users=users)


@router.post(
    "/workspace/share/{id}/status",
    response_model=bool,
    description="""
- Workspace の共有状態を更新する（総入れ替え）
""",
)
def update_workspace_share_status(
    id: int,
    data: WorkspaceSharePostStatus,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    workspace = (
        db.query(common_model.Workspace)
        .filter(
            common_model.Workspace.id == id,
            common_model.Workspace.user_id == current_user.id,
            common_model.Workspace.deleted.is_(False),
        )
        .first()
    )
    if not workspace:
        raise HTTPException(status_code=404)

    (
        db.query(common_model.WorkspacesShareUser)
        .filter(common_model.WorkspacesShareUser.workspace_id == id)
        .delete(synchronize_session=False)
    )
    db.bulk_save_objects(
        common_model.WorkspacesShareUser(workspace_id=id, user_id=user_id)
        for user_id in data.user_ids
    )
    db.commit()
    return True
