from fastapi import HTTPException
from fastapi_pagination.ext.sqlmodel import paginate
from firebase_admin import auth as firebase_auth
from firebase_admin.auth import UserRecord
from sqlmodel import Session, select

from studio.app.common.core.auth.auth import authenticate_user
from studio.app.common.models import User as UserModel
from studio.app.common.models import UserRole as UserRoleModel
from studio.app.common.schemas.auth import UserAuth
from studio.app.common.schemas.users import (
    User,
    UserCreate,
    UserPasswordUpdate,
    UserUpdate,
)


async def set_role(db: Session, user_id: int, role_id: int, auto_commit=True):
    try:
        db.query(UserRoleModel).filter_by(user_id=user_id).delete(
            synchronize_session=False
        )
        role_user = UserRoleModel(user_id=user_id, role_id=role_id)
        db.add(role_user)
        db.flush()
        if auto_commit:
            db.commit()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


async def get_user(db: Session, user_id: int) -> User:
    try:
        data = (
            db.query(UserModel, UserRoleModel.role_id)
            .outerjoin(UserRoleModel, UserModel.id == UserRoleModel.user_id)
            .filter(UserModel.id == user_id, UserModel.active.is_(True))
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


async def list_user(db: Session):
    try:
        users = paginate(
            db,
            query=select(UserModel).filter(UserModel.active.is_(True)),
        )
        for user in users.items:
            role = (
                db.query(UserRoleModel).filter(UserRoleModel.user_id == user.id).first()
            )
            user.__dict__["role_id"] = role.role_id if role else None
        return users
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


async def create_user(db: Session, data: UserCreate):
    try:
        user: UserRecord = firebase_auth.create_user(
            email=data.email, password=data.password
        )
        user_db = UserModel(
            uid=user.uid,
            email=user.email,
            name=data.name,
            organization_id=1,
            active=True,
        )
        db.add(user_db)
        db.flush()
        await set_role(db, user_id=user_db.id, role_id=data.role_id, auto_commit=False)
        db.commit()
        user_db.__dict__["role_id"] = data.role_id
        return User.from_orm(user_db)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


async def update_user(db: Session, user_id: int, data: UserUpdate):
    try:
        user_db = (
            db.query(UserModel)
            .filter(UserModel.active.is_(True), UserModel.id == user_id)
            .first()
        )
        user_data = data.dict(exclude_unset=True)
        role_id = user_data.pop("role_id", None)
        for key, value in user_data.items():
            setattr(user_db, key, value)
        if role_id is not None:
            await set_role(db, user_id=user_db.id, role_id=role_id, auto_commit=False)
        role = (
            db.query(UserRoleModel).filter(UserRoleModel.user_id == user_db.id).first()
        )
        user_db.__dict__["role_id"] = role.role_id if role else None
        db.commit()
        firebase_auth.update_user(user_db.uid, email=data.email)
        return User.from_orm(user_db)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


async def upate_password(db: Session, user_id: int, data: UserPasswordUpdate):
    user = await get_user(db, user_id)
    await authenticate_user(data=UserAuth(email=user.email, password=data.old_password))
    try:
        user = firebase_auth.update_user(user.uid, password=data.new_password)
        return True
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


async def delete_user(db: Session, user_id: int):
    try:
        user_db = (
            db.query(UserModel)
            .filter(UserModel.active.is_(True), UserModel.id == user_id)
            .first()
        )
        assert user_db is not None, "User not found"
        db.delete(user_db)
        db.commit()
        firebase_auth.delete_user(user_db.uid)
        return User.from_orm(user_db)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
