from typing import List

import sqlalchemy
from fastapi import HTTPException
from fastapi_pagination import LimitOffsetPage
from fastapi_pagination.ext.sqlmodel import paginate
from sqlmodel import Session, select

from studio.app.common.models import Group as GroupModel
from studio.app.common.models import User as UserModel
from studio.app.common.schemas.group import GroupCreate, GroupUpdate, GroupWithUserCount
from studio.app.optinist.schemas.base import SortOptions


def list_group(
    db: Session, sort_options: SortOptions, organization_id: int
) -> LimitOffsetPage[GroupWithUserCount]:
    try:
        query = (
            select(GroupModel)
            .filter(GroupModel.organization_id == organization_id)
            .order_by(*sort_options.get_sa_sort_list(GroupModel))
        )
        data = paginate(session=db, query=query)
        return data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


def group_get(db: Session, id: int, organization_id: int) -> GroupModel:
    try:
        group = (
            db.query(GroupModel)
            .filter(GroupModel.id == id, GroupModel.organization_id == organization_id)
            .one()
        )
        return group
    except sqlalchemy.exc.NoResultFound:
        raise HTTPException(status_code=404, detail="Group not found")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


def group_create(db: Session, data: GroupCreate, organization_id: int) -> GroupModel:
    try:
        new_group = GroupModel(**data.dict())
        new_group.organization_id = organization_id
        db.add(new_group)
        db.commit()
        db.refresh(new_group)
        return new_group
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


def group_update(
    db: Session, id: int, data: GroupUpdate, organization_id: int
) -> GroupModel:
    group = group_get(db, id, organization_id)
    try:
        group.name = data.name
        db.commit()
        return group
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


def group_delete(db: Session, id: int, organization_id: int):
    group = group_get(db, id, organization_id)
    try:
        assert group.users_count == 0, "Can not delete group that has registered user"
        db.delete(group)
        db.commit()
        return True
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


def group_set_users(
    db: Session, id: int, user_ids: List[int], organization_id: int
) -> bool:
    group = group_get(db, id, organization_id)
    try:
        users = db.query(UserModel).filter(UserModel.id.in_(user_ids)).all()
        group.group_user = users
        db.commit()
        return True
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


def group_search_share(db: Session, keyword, organization_id: int) -> List[GroupModel]:
    MAX_RESPONSE_COUNT = 10
    try:
        return (
            db.query(GroupModel)
            .filter(
                GroupModel.name.like("%{0}%".format(keyword)),
                GroupModel.organization_id == organization_id,
            )
            .limit(MAX_RESPONSE_COUNT)
            .all()
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


def group_search_user(db: Session, id, organization_id: int):
    group = group_get(db, id, organization_id)
    try:
        return group.active_group_user
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
