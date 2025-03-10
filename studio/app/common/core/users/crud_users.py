from fastapi import HTTPException
from fastapi_pagination.ext.sqlmodel import paginate
from firebase_admin import auth as firebase_auth
from firebase_admin.auth import UserRecord
from sqlmodel import Session, select

from studio.app.common.core.auth.auth import authenticate_user
from studio.app.common.models import Group as GroupModel
from studio.app.common.models import Role as RoleModel
from studio.app.common.models import User as UserModel
from studio.app.common.models import UserRole as UserRoleModel
from studio.app.common.schemas.auth import UserAuth
from studio.app.common.schemas.base import SortOptions
from studio.app.common.schemas.users import (
    User,
    UserCreate,
    UserPasswordUpdate,
    UserSearchOptions,
    UserUpdate,
)


async def get_user(db: Session, user_id: int, organization_id: int) -> User:
    try:
        data = (
            db.query(UserModel, UserRoleModel.role_id)
            .outerjoin(UserRoleModel, UserModel.id == UserRoleModel.user_id)
            .filter(
                UserModel.id == user_id,
                UserModel.active.is_(True),
                UserModel.organization_id == organization_id,
            )
            .first()
        )
        assert data is not None, "User not found"
        user, role_id = data
        user.__dict__["role_id"] = role_id
        return User.from_orm(user)
    except AssertionError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


async def list_user(
    db: Session,
    organization_id: int,
    options: UserSearchOptions,
    sortOptions: SortOptions,
):
    try:
        sa_sort_list = sortOptions.get_sa_sort_list(
            sa_table=UserModel,
            mapping={"role_id": RoleModel.id, "role": RoleModel.role},
        )
        users = paginate(
            db,
            query=select(UserModel)
            .join(UserModel.role)
            .filter(
                UserModel.active.is_(True),
                UserModel.organization_id == organization_id,
            )
            .filter(
                UserModel.name.like("%{0}%".format(options.name)),
                UserModel.email.like("%{0}%".format(options.email)),
            )
            .order_by(*sa_sort_list),
            unique=False,
        )
        return users
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


async def create_user(db: Session, data: UserCreate, organization_id: int):
    try:
        user: UserRecord = firebase_auth.create_user(
            email=data.email, password=data.password
        )
        user_db = UserModel(
            uid=user.uid,
            email=user.email,
            name=data.name,
            organization_id=organization_id,
            active=True,
        )
        user_db.groups = (
            db.query(GroupModel).filter(GroupModel.id.in_(data.group_ids)).all()
        )
        user_db.role = db.query(RoleModel).get(data.role_id)
        # it may be possible to specify the organization_id externally in the future
        db.add(user_db)
        db.commit()
        db.refresh(user_db)
        return User.from_orm(user_db)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


async def update_user(
    db: Session, user_id: int, data: UserUpdate, organization_id: int
):
    try:
        user_db = (
            db.query(UserModel)
            .filter(
                UserModel.active.is_(True),
                UserModel.id == user_id,
                UserModel.organization_id == organization_id,
            )
            .first()
        )
        assert user_db is not None, "User not found"
        user_data = data.dict(exclude_unset=True, exclude_defaults=True)
        role_id = user_data.pop("role_id", None)
        group_ids = user_data.pop("group_ids", None)

        for key, value in user_data.items():
            setattr(user_db, key, value)
        if role_id is not None:
            user_db.role = db.query(RoleModel).get(role_id)
        if group_ids is not None:
            user_db.groups = (
                db.query(GroupModel).filter(GroupModel.id.in_(group_ids)).all()
            )
        if data.email is not None:
            firebase_auth.update_user(user_db.uid, email=data.email)
        db.commit()
        db.refresh(user_db)
        return User.from_orm(user_db)
    except AssertionError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


async def update_password(
    db: Session,
    user_id: int,
    data: UserPasswordUpdate,
    organization_id: int,
):
    user = await get_user(db, user_id, organization_id)
    await authenticate_user(
        db, data=UserAuth(email=user.email, password=data.old_password)
    )
    try:
        user = firebase_auth.update_user(user.uid, password=data.new_password)
        return True
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


async def delete_user(db: Session, user_id: int, organization_id: int) -> bool:
    try:
        user_db = (
            db.query(UserModel)
            .filter(
                UserModel.active.is_(True),
                UserModel.id == user_id,
                UserModel.organization_id == organization_id,
            )
            .first()
        )
        assert user_db is not None, "User not found"
        user_db.active = False
        db.commit()
        firebase_auth.delete_user(user_db.uid)
        return True
    except AssertionError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
