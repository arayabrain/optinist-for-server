from typing import List

from fastapi import APIRouter, Depends, Query
from fastapi_pagination import LimitOffsetPage

from studio.app.common.core.auth.auth_dependencies import get_admin_user
from studio.app.common.core.users.crud_groups import (
    group_create,
    group_delete,
    group_get,
    group_update,
    list_group,
)
from studio.app.common.db.database import get_db
from studio.app.common.schemas.group import Group, GroupCreate, GroupUpdate
from studio.app.optinist.schemas.base import SortOptions

router = APIRouter(prefix="/group", tags=["group"])


@router.get(
    "",
    response_model=LimitOffsetPage[Group],
    description="""
- Groupsを検索し、結果を応答
""",
)
def search_groups(db=Depends(get_db), sortOptions: SortOptions = Depends()):
    return list_group(db, sortOptions)


@router.get(
    "/{id}",
    response_model=Group,
    description="""
- Groupを検索し、結果を応答
""",
)
def get_group(
    id: int,
    db=Depends(get_db),
):
    group, group_user_count = group_get(db, id)
    return Group(**group.dict(), users_count=group_user_count)


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
):
    return group_create(db, group)


@router.put(
    "/{id}",
    response_model=Group,
    dependencies=[Depends(get_admin_user)],
    description="""
- Group を更新する
""",
)
def update_group(id: int, group: GroupUpdate, db=Depends(get_db)):
    updated_group, group_user_count = group_update(db, id, group)
    return Group(**updated_group.dict(), users_count=group_user_count)


@router.delete(
    "/{id}",
    response_model=bool,
    dependencies=[Depends(get_admin_user)],
    description="""
- Group を削除する
""",
)
def delete_group(id: int, db=Depends(get_db)):
    return group_delete(db, id)


@router.get(
    "/search/share_groups",
    response_model=List[Group],
    description="""
- Get a list of groups with whom content is shared.
- Note: Maximum of 10 responses. (security considerations)
""",
)
def search_share_groups(
    keyword: str = Query(default=None, description="partial match (user.name)"),
    db=Depends(get_db),
):
    MAX_RESPONSE_COUNT = 10

    # search records
    return [
        {
            "id": 1,
            "name": "Group 1",
        },
        {
            "id": 2,
            "name": "Group 2",
        },
        {
            "id": 3,
            "name": "Group 3",
        },
    ][:MAX_RESPONSE_COUNT]


@router.post(
    "/users",
    response_model=bool,
    description="""
- Group へ User を登録する

""",
)
def set_group_users(group_id: int, user_ids: List[int], db=Depends(get_db)):
    return True
