from typing import Optional

from fastapi import Depends, HTTPException, Response, status
from fastapi.security import APIKeyHeader, HTTPAuthorizationCredentials, HTTPBearer
from firebase_admin import auth as firebase_auth
from sqlmodel import Session

from studio.app.common.core.auth.auth_config import AUTH_CONFIG
from studio.app.common.core.auth.security import validate_access_token
from studio.app.common.db.database import get_db
from studio.app.common.models import User as UserModel
from studio.app.common.models import UserRole as UserRoleModel
from studio.app.common.schemas.users import User


async def get_current_user(
    res: Response,
    ex_token: Optional[str] = Depends(APIKeyHeader(name="ExToken", auto_error=False)),
    credential: HTTPAuthorizationCredentials = Depends(HTTPBearer(auto_error=False)),
    db: Session = Depends(get_db),
):
    if AUTH_CONFIG.USE_FIREBASE_TOKEN:
        if credential is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Unauthorized",
                headers={"WWW-Authenticate": "Bearer realm='auth_required'"},
            )
        try:
            user = firebase_auth.verify_id_token(credential.credentials)
            authed_user, role_id = (
                db.query(UserModel, UserRoleModel.role_id)
                .outerjoin(UserRoleModel, UserRoleModel.user_id == UserModel.id)
                .filter(UserModel.uid == user["uid"], UserModel.active.is_(True))
                .first()
            )
            authed_user.__dict__["role_id"] = role_id
            return User.from_orm(authed_user)
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer realm='invalid_token'"},
            )

    if ex_token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            headers={"WWW-Authenticate": 'Bearer realm="auth_required"'},
        )

    payload, err = validate_access_token(ex_token)

    if err:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            headers={"WWW-Authenticate": 'Bearer realm="auth_required"'},
            detail=str(err),
        )

    try:
        authed_user, role_id = (
            db.query(UserModel, UserRoleModel.role_id)
            .outerjoin(UserRoleModel, UserRoleModel.user_id == UserModel.id)
            .filter(UserModel.uid == payload["sub"])
            .first()
        )
        authed_user.__dict__["role_id"] = role_id
        return User.from_orm(authed_user)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            headers={"WWW-Authenticate": 'Bearer realm="auth_required"'},
            detail="Could not validate credentials",
        )


async def get_admin_user(current_user: User = Depends(get_current_user)):
    if current_user.is_admin:
        return current_user
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient privileges",
        )
