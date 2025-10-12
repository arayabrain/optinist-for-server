"""
Logging middleware for capturing user context in logs
"""

from typing import Optional

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

from studio.app.common.core.auth.auth_helper import extract_uid_from_request
from studio.app.common.core.logger import AppLogger
from studio.app.common.core.mode import MODE


class UserIdLoggingMiddleware(BaseHTTPMiddleware):
    """
    Middleware to extract user_id from request and set it in logging context

    This middleware:
    - Extracts user_id from authentication tokens (Firebase or JWT (ExToken))
    - Sets the user_id in the logging context for all log messages during the request
    - In standalone mode, skips user_id extraction and logging (user_id is blank)
    """

    async def dispatch(self, request: Request, call_next):
        user_id: Optional[str] = None

        # Skip user_id extraction for standalone mode
        if not MODE.IS_STANDALONE:
            user_id = extract_uid_from_request(request)

        # Set user_id in logging context
        AppLogger.set_user_id(user_id)

        # Process the request
        response = await call_next(request)

        return response
