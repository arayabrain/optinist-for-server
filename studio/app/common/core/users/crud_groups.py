from typing import Tuple

from fastapi import HTTPException
from fastapi_pagination import LimitOffsetPage
from fastapi_pagination.ext.sqlmodel import paginate
from sqlalchemy import func
from sqlmodel import Session, select

from studio.app.common.models import Group as GroupModel
from studio.app.common.models import User as UserModel
from studio.app.common.models import UserGroup as UserGroupModel
from studio.app.common.schemas.group import Group, GroupCreate, GroupUpdate
from studio.app.optinist.schemas.base import SortOptions

group_user_count = (
    select(func.count())
    .select_from(UserGroupModel)
    .join(
        UserModel,
        UserModel.id == UserGroupModel.user_id,
    )
    .where(
        UserGroupModel.group_id == GroupModel.id,
        UserModel.active.is_(True),
    )
    .as_scalar()
    .label("users_count")
)


def list_group(db: Session, sort_options: SortOptions) -> LimitOffsetPage[Group]:
    try:
        query = select(GroupModel.id, GroupModel.name, group_user_count).order_by(
            *sort_options.get_sa_sort_list(GroupModel)
        )
        data = paginate(session=db, query=query)
        return data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


def group_get(db: Session, id: int) -> Tuple[GroupModel, int]:
    try:
        data = (
            db.query(GroupModel, group_user_count).filter(GroupModel.id == id).first()
        )
        assert data is not None, "Group not found"
        return data
    except AssertionError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


def group_create(db: Session, data: GroupCreate):
    try:
        new_group = GroupModel(**data.dict())
        db.add(new_group)
        db.commit()
        db.refresh(new_group)
        return new_group
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


def group_update(db: Session, id: int, data: GroupUpdate):
    group, group_user_count = group_get(db, id)
    try:
        group.name = data.name
        db.commit()
        return group, group_user_count
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


def group_delete(db: Session, id: int):
    group, _ = group_get(db, id)
    try:
        db.delete(group)
        db.commit()
        return True
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
