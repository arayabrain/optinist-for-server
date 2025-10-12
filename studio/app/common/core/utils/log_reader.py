import re
from enum import Enum

from studio.app.common.core.utils.file_reader import (
    ContentUnitReader,
    PaginatedFileReader,
)
from studio.app.dir_path import DIRPATH


class LogLevel(str, Enum):
    ALL = "ALL"
    INFO = "INFO"
    ERROR = "ERROR"
    DEBUG = "DEBUG"
    WARNING = "WARNING"
    CRITICAL = "CRITICAL"


class LogRecordReader(ContentUnitReader):
    """Log record reader that treats each log entry as a unit"""

    def __init__(
        self,
        levels: list[LogLevel],
        filter_user_id: str = None,
        **kwargs,
    ) -> None:
        if LogLevel.ALL in levels:
            self.levels: list[bytes] = []
        else:
            self.levels: list[bytes] = [level.value.encode() for level in levels]

        # User ID filter (None means no filtering)
        self.filter_user_id: bytes = filter_user_id.encode() if filter_user_id else None

        # Timestamp pattern shared between start_pattern and full pattern
        timestamp_pattern = rb"\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2},\d{3}"

        # Pattern to detect the start of a log entry (for multiline support)
        self.start_pattern = re.compile(
            rb"(?=^" + timestamp_pattern + rb")", re.MULTILINE
        )

        # Full pattern to parse complete log entries including user_id field
        self.pattern = re.compile(
            rb"^(?P<asctime>" + timestamp_pattern + rb") "
            rb"(?:\x1b\[\d+m)?(?P<levelprefix>\w+)(?:\x1b\[0m)?:?\s+"
            rb"\[(?P<name>[^\]]+)\] "
            rb"\((?P<process>\w+)\) "
            rb"\(user:(?P<user_id>[^\)]*)\) "
            rb"(?P<funcName>\w+)\(\):(?P<lineno>\d+) - "
            rb"(?P<message>.*)",
            re.DOTALL,
        )
        self.exclude_pattern: list[bytes] = [b"GET /logs", b"OPTIONS /logs"]

    def is_unit_start(self, line: bytes) -> bool:
        return bool(self.start_pattern.match(line))

    def parse(self, content: bytes) -> dict:
        if not content:
            return {"raw": b"", "parsed": False}

        match = self.pattern.match(content)
        if not match:
            return {"raw": content, "parsed": False}

        components = match.groupdict()

        return {
            "timestamp": components["asctime"],
            "level": components["levelprefix"],
            "name": components["name"],
            "user_id": components["user_id"],
            "function": components["funcName"],
            "line": int(components["lineno"]),
            "message": components["message"],
            "raw": content,
            "parsed": True,
        }

    def validate(self, content: bytes) -> bool:
        if any([pattern in content for pattern in self.exclude_pattern]):
            return False

        unit_dict = self.parse(content)
        if not unit_dict["parsed"]:
            return False

        # Filter by log level
        if self.levels:
            if unit_dict["level"] not in self.levels:
                return False

        # Filter by user_id
        if self.filter_user_id is not None:
            if unit_dict["user_id"] != self.filter_user_id:
                return False

        return True


class LogReader(PaginatedFileReader):
    def __init__(
        self,
        file_path=DIRPATH.LOG_FILE_PATH,
        levels: list[LogLevel] = [],
        filter_user_id: str = None,
        **kwargs,
    ):
        super().__init__(file_path, **kwargs)
        self.file_path = file_path
        self.unit_reader = LogRecordReader(levels=levels, filter_user_id=filter_user_id)
