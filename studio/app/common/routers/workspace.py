from fastapi import APIRouter, Depends, HTTPException
from fastapi_pagination import LimitOffsetPage
from fastapi_pagination.ext.sqlmodel import paginate
from sqlmodel import Session, select

from studio.app.common import models as common_model
from studio.app.common.core.auth.auth_dependencies import get_current_user
from studio.app.common.db.database import get_db
from studio.app.common.schemas.users import UserInfo
from studio.app.common.schemas.workspace import (
    Workspace,
    WorkspaceSharePostStatus,
    WorkspaceShareStatus,
    WorkspacesSetting,
)
from studio.app.optinist.schemas.base import SortOptions

router = APIRouter()


@router.get(
    "/workspaces",
    response_model=LimitOffsetPage[Workspace],
    dependencies=[Depends(get_current_user)],
    description="""
- Workspacesを検索し、結果を応答
""",
)
def search_workspaces(
    sortOptions: SortOptions = Depends(), db: Session = Depends(get_db)
):
    return paginate(session=db, query=select(common_model.Workspace))


@router.get(
    "/workspace/{id}",
    response_model=Workspace,
    dependencies=[Depends(get_current_user)],
    description="""
- Workspaceを検索し、結果を応答
""",
)
def get_workspace(id: int, db: Session = Depends(get_db)):
    workspace = (
        db.query(common_model.Workspace).filter(common_model.Workspace.id == id).first()
    )
    if not workspace:
        raise HTTPException(status_code=404)
    user = (
        db.query(common_model.User)
        .filter(common_model.User.id == workspace.user_id)
        .first()
    )
    workspace = Workspace.from_orm(workspace)
    workspace.user = UserInfo.from_orm(user)
    return workspace


@router.post(
    "/workspace",
    response_model=Workspace,
    dependencies=[Depends(get_current_user)],
    description="""
- Workspace を作成する

""",
)
def create_workspace(workspace: Workspace, db: Session = Depends(get_db)):
    workspace = (
        db.query(common_model.Workspace)
        .filter_by(common_model.Workspace.id == id)
        .first()
    )
    workspace = common_model.Workspace(**workspace.dict())
    db.add(workspace)
    db.commit()
    db.refresh(workspace)
    return workspace


@router.put(
    "/workspace/{id}",
    response_model=Workspace,
    dependencies=[Depends(get_current_user)],
    description="""
- Workspace を更新する
""",
)
def update_workspace(id: int, workspace: Workspace, db: Session = Depends(get_db)):
    ws = (
        db.query(common_model.Workspace)
        .filter_by(common_model.Workspace.id == id)
        .first()
    )
    if not ws:
        raise HTTPException(status_code=404)
    data = workspace.dict(exclude_unset=True)
    for key, value in data.items():
        setattr(ws, key, value)
    db.add(ws)
    db.commit()
    db.refresh(ws)
    return ws


@router.delete(
    "/workspace/{id}",
    response_model=bool,
    dependencies=[Depends(get_current_user)],
    description="""
- Workspace を削除する
""",
)
def delete_workspace(id: int, db: Session = Depends(get_db)):
    ws = (
        db.query(common_model.Workspace)
        .filter_by(common_model.Workspace.id == id)
        .first()
    )
    if not ws:
        raise HTTPException(status_code=404)
    db.delete(ws)
    db.commit()
    return True


@router.get(
    "/workspace/export/{id}",
    response_model=WorkspacesSetting,
    dependencies=[Depends(get_current_user)],
    description="""
- Workspace 設定をExportする
""",
)
def export_workspace(id: int, db: Session = Depends(get_db)):
    return {"todo_dummy": {}}


@router.post(
    "/workspace/import",
    response_model=bool,
    dependencies=[Depends(get_current_user)],
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
    dependencies=[Depends(get_current_user)],
    description="""
- Workspace の共有状態を取得する
""",
)
def get_workspace_share_status(id: int, db: Session = Depends(get_db)):
    users = (
        db.query(common_model.User)
        .join(
            common_model.WorkspacesShareUser,
            common_model.WorkspacesShareUser.workspace_id == id,
        )
        .all()
    )
    return WorkspaceShareStatus(users=users)


@router.post(
    "/workspace/share/{id}/status",
    response_model=bool,
    dependencies=[Depends(get_current_user)],
    description="""
- Workspace の共有状態を更新する（総入れ替え）
""",
)
def update_workspace_share_status(
    id: int, data: WorkspaceSharePostStatus, db: Session = Depends(get_db)
):
    current_workspace_share = (
        db.query(common_model.WorkspacesShareUser)
        .filter(common_model.WorkspacesShareUser.workspace_id == id)
        .all()
    )
    current_workspace_share_user_ids = [ws.user_id for ws in current_workspace_share]
    new_workspace_share_user_ids = list(
        set(data.user_ids) - set(current_workspace_share_user_ids)
    )
    delete_workspace_share_user_ids = list(
        set(current_workspace_share_user_ids) - set(data.user_ids)
    )
    delete_workspace_share_user = [
        ws
        for ws in current_workspace_share
        if ws.user_id in delete_workspace_share_user_ids
    ]
    try:
        for user_id in new_workspace_share_user_ids:
            workspace_share = common_model.WorkspacesShareUser(
                workspace_id=id, user_id=user_id
            )
            db.add(workspace_share)
        for ws in delete_workspace_share_user:
            db.delete(ws)
        db.commit()
        return True
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))
