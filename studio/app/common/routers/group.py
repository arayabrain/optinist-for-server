from typing import List

from fastapi import APIRouter, Depends, Query
from fastapi_pagination import LimitOffsetPage

from studio.app.common.core.auth.auth_dependencies import (
    get_admin_user,
    get_current_user,
)
from studio.app.common.core.users.crud_groups import (
    group_create,
    group_delete,
    group_get,
    group_search_share,
    group_search_user,
    group_set_users,
    group_update,
    list_group,
)
from studio.app.common.db.database import get_db
from studio.app.common.schemas.group import (
    Group,
    GroupCreate,
    GroupUpdate,
    GroupWithUserCount,
)
from studio.app.common.schemas.users import User, UserInfo
from studio.app.optinist.schemas.base import SortOptions

router = APIRouter(prefix="/group", tags=["group"])


@router.get(
    "",
    response_model=LimitOffsetPage[GroupWithUserCount],
    description="""
- Groupsを検索し、結果を応答
""",
)
def search_groups(
    db=Depends(get_db),
    sortOptions: SortOptions = Depends(),
    current_user: User = Depends(get_current_user),
):
    return list_group(db, sortOptions, current_user.organization.id)


@router.get(
    "/{id}",
    response_model=GroupWithUserCount,
    description="""
- Groupを検索し、結果を応答
""",
)
def get_group(
    id: int,
    db=Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return group_get(db, id, current_user.organization.id)


@router.post(
    "",
    response_model=Group,
    dependencies=[Depends(get_admin_user)],
    description="""
- Group を作成する

""",
)
def create_group(
    group: GroupCreate,
    db=Depends(get_db),
    current_admin: User = Depends(get_admin_user),
):
    return group_create(db, group, current_admin.organization.id)


@router.put(
    "/{id}",
    response_model=Group,
    dependencies=[Depends(get_admin_user)],
    description="""
- Group を更新する
""",
)
def update_group(
    id: int,
    group: GroupUpdate,
    db=Depends(get_db),
    current_admin: User = Depends(get_admin_user),
):
    return group_update(db, id, group, current_admin.organization.id)


@router.delete(
    "/{id}",
    response_model=bool,
    # dependencies=[Depends(],
    description="""
- Group を削除する
""",
)
def delete_group(
    id: int,
    db=Depends(get_db),
    current_admin: User = Depends(get_admin_user),
):
    return group_delete(db, id, current_admin.organization.id)


@router.get(
    "/users/search",
    response_model=List[UserInfo],
    description="""
- Group への 登録User を検索する
""",
)
def search_group_users(
    group_id: int,
    db=Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return group_search_user(db, group_id, current_user.organization.id)


@router.get(
    "/search/share_groups",
    response_model=List[Group],
    description="""
- Get a list of groups with name.
- Note: Maximum of 10 responses. (security considerations)
""",
)
def search_share_groups(
    keyword: str = Query(default="", description="partial match (group.name)"),
    db=Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return group_search_share(db, keyword, current_user.organization.id)


@router.post(
    "/users",
    response_model=bool,
    dependencies=[Depends(get_admin_user)],
    description="""
- Group へ User を登録する

""",
)
def set_group_users(
    group_id: int,
    user_ids: List[int],
    db=Depends(get_db),
    current_admin: User = Depends(get_admin_user),
):
    return group_set_users(db, group_id, user_ids, current_admin.organization.id)
