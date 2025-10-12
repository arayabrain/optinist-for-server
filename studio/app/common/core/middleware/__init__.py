"""
Middleware modules for the Studio application
"""

from studio.app.common.core.middleware.logging_middleware import UserIdLoggingMiddleware

__all__ = ["UserIdLoggingMiddleware"]
