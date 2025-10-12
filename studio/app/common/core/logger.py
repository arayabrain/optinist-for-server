import logging
import logging.config
import os
import platform
import traceback
from contextvars import ContextVar
from typing import Optional

import yaml

from studio.app.common.core.mode import MODE
from studio.app.dir_path import DIRPATH

# Context variable for storing user_id per request/context
_user_id_context: ContextVar[Optional[str]] = ContextVar("user_id", default=None)


class AppLogger:
    """
    Generic Application Logger
    """

    LOGGER_NAME = "optinist"

    class UserIdFilter(logging.Filter):
        """
        Logging filter to inject user_id from context into log records
        """

        def filter(self, record):
            # Get user_id from context, default to "none" if not set
            user_id = _user_id_context.get()
            record.user_id = user_id if user_id is not None else "none"
            return True

    @classmethod
    def init_logger(cls):
        """
        Note #1.
            At the time of starting to use this Logger,
            the logging initialization process has already been performed
            at the following location,
            so no explicit initialization process is required.

            - logger initialization location
              - Web App ... studio.__main_unit__
              - Batch App ... studio.app.optinist.core.expdb.batch_runner
                (optinist-for-server)

        Note #2.
            However, only in the case of the snakemake process,
            the initialization process is required because it is a separate process.
        """

        # read logging config
        logging_config = cls.get_logging_config()

        # create log output directory (if none exists)
        log_file = (
            logging_config.get("handlers", {}).get("rotating_file", {}).get("filename")
        )
        if log_file:
            log_dir = os.path.dirname(log_file)
            if not os.path.isdir(log_dir):
                os.makedirs(log_dir)

        # set logging config
        logging.config.dictConfig(logging_config)

    @staticmethod
    def get_logging_config() -> dict:
        logging_config_file = (
            f"{DIRPATH.CONFIG_DIR}/logging.yaml"
            if MODE.IS_STANDALONE
            else f"{DIRPATH.CONFIG_DIR}/logging.multiuser.yaml"
        )

        logging_config = None

        with open(logging_config_file) as file:
            logging_config = yaml.load(file.read(), yaml.FullLoader)

        logging_handers = logging_config.get("handlers", {})

        # Switch rotating_file depending on platform
        if __class__.is_native_windows():
            # ATTENTION:
            # On the Windows Native Platform, "rotating_file_concurrency"
            # is currently not supported because pywin32 is required to use
            # concurrent_log_handler. (which is not installed in the conda env).
            pass
        else:
            if ("rotating_file" in logging_handers) and (
                "rotating_file_concurrency"
            ) in logging_handers:
                logging_config["handlers"]["rotating_file"] = logging_config[
                    "handlers"
                ]["rotating_file_concurrency"]

        # Delete unnecessary items
        if "rotating_file_concurrency" in logging_handers:
            del logging_config["handlers"]["rotating_file_concurrency"]

        # Adjust log file path (if none exists)
        log_file = logging_handers.get("rotating_file", {}).get("filename")
        if log_file:
            log_file = f"{DIRPATH.DATA_DIR}/{log_file}"
            logging_config["handlers"]["rotating_file"]["filename"] = log_file

        # Add UserIdFilter configuration to filters section
        if "filters" not in logging_config:
            logging_config["filters"] = {}
        logging_config["filters"]["user_id_filter"] = {
            "()": "studio.app.common.core.logger.AppLogger.UserIdFilter"
        }

        # Add user_id_filter to all handlers
        for handler_config in logging_config.get("handlers", {}).values():
            if "filters" not in handler_config:
                handler_config["filters"] = []
            if "user_id_filter" not in handler_config["filters"]:
                handler_config["filters"].append("user_id_filter")

        return logging_config

    @staticmethod
    def get_logger() -> logging.Logger:
        logger = logging.getLogger(__class__.LOGGER_NAME)

        # If before initialization, call init
        if not logger.handlers:
            __class__.init_logger()

        return logger

    @staticmethod
    def set_user_id(user_id: Optional[str]):
        """
        Set user_id in the current context for logging
        """
        _user_id_context.set(user_id)

    @staticmethod
    def get_user_id() -> Optional[str]:
        """
        Get user_id from the current context
        """
        return _user_id_context.get()

    @staticmethod
    def format_exc_traceback(e: Exception):
        return "{}: {}\n{}".format(type(e), e, traceback.format_exc())

    @staticmethod
    def is_native_windows():
        if platform.system() != "Windows":
            return False

        # Check WSL Platform
        if "WSL_DISTRO_NAME" in os.environ or "WSL_INTEROP" in os.environ:
            return False

        return True
