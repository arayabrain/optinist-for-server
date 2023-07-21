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
    use_firebase_auth = AUTH_CONFIG.USE_FIREBASE_TOKEN
    try:
        assert credential is not None if use_firebase_auth else True
        assert ex_token is not None if not use_firebase_auth else True

        uid = None
        if use_firebase_auth:
            user = firebase_auth.verify_id_token(credential.credentials)
            uid = user["uid"]
        else:
            payload, err = validate_access_token(ex_token)
            assert err is not None, str(err)
            uid = payload["sub"]

        authed_user, role_id = (
            db.query(UserModel, UserRoleModel.role_id)
            .outerjoin(UserRoleModel, UserRoleModel.user_id == UserModel.id)
            .filter(UserModel.uid == uid)
            .first()
        )
        authed_user.__dict__["role_id"] = role_id
        return User.from_orm(authed_user)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            headers={"WWW-Authenticate": 'Bearer realm="auth_required"'},
            detail=str(e) or "Could not validate credentials",
        )


async def get_admin_user(current_user: User = Depends(get_current_user)):
    if current_user.is_admin:
        return current_user
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient privileges",
        )
