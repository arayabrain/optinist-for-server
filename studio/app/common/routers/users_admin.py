from fastapi import APIRouter, Depends
from fastapi_pagination import LimitOffsetPage
from sqlmodel import Session

from studio.app.common.core.auth.auth_dependencies import get_admin_user
from studio.app.common.core.users import crud_users
from studio.app.common.db.database import get_db
from studio.app.common.schemas.users import User, UserCreate, UserUpdate

router = APIRouter(
    prefix="/admin/users", tags=["admin"], dependencies=[Depends(get_admin_user)]
)


@router.get("", response_model=LimitOffsetPage[User])
async def list_user(db: Session = Depends(get_db)):
    return await crud_users.list_user(db)


@router.post("", response_model=User)
async def create_user(data: UserCreate, db: Session = Depends(get_db)):
    return await crud_users.create_user(db, data)


@router.get("/{user_id}", response_model=User)
async def get_user(user_id: int, db: Session = Depends(get_db)):
    return await crud_users.get_user(db, user_id)


@router.put("/{user_id}", response_model=User)
async def update_user(user_id: int, data: UserUpdate, db: Session = Depends(get_db)):
    return await crud_users.update_user(db, user_id, data)


@router.delete("/{user_id}")
async def delete_user(user_id: int, db: Session = Depends(get_db)):
    return await crud_users.delete_user(db, user_id)
