"""
Logging middleware for capturing user context in logs
"""

import hashlib
from datetime import datetime
from typing import Optional

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

from studio.app.common.core.auth.auth_helper import extract_uid_from_request
from studio.app.common.core.logger import AppLogger
from studio.app.common.core.mode import MODE


class ClientIdLoggingMiddleware(BaseHTTPMiddleware):
    """
    Middleware to extract "client_id" from request and set it in logging context

    This middleware:
    - Extracts uid from authentication tokens (Firebase or JWT (ExToken))
    - Generate client_id from uid (by hashing, etc.)
    - Sets the client_id in the logging context for all log messages during the request
    - In standalone mode, skips client_id extraction and logging (client_id is blank)
    """

    async def dispatch(self, request: Request, call_next):
        client_id: Optional[str] = None

        # Skip uid extraction for standalone mode
        if not MODE.IS_STANDALONE:
            uid = extract_uid_from_request(request)
            client_id = __class__.generate_client_id(uid)

        # Set client_id in logging context
        AppLogger.set_client_id(client_id)

        # Process the request
        response = await call_next(request)

        return response

    @staticmethod
    def generate_client_id(uid: str, auto_refresh: bool = False) -> str:
        """
        Generate a client_id for logging based on the specified uid.

        Args:
            auto_refresh: If true, refresh id at period interval
        """
        if not uid:
            return uid

        if auto_refresh:
            datetime_str = datetime.now().strftime(
                "%Y-%m-%d-%w"
            )  # Refresh by period (weekly)
            hash_source = f"{uid}-{datetime_str}"
        else:
            hash_source = uid

        client_id = hashlib.md5(hash_source.encode()).hexdigest()
        client_id = client_id[0:16]

        return client_id
