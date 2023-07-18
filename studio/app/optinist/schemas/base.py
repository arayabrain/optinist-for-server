from enum import Enum
from typing import List

from fastapi import Query
from pydantic import dataclasses


class SortDirection(str, Enum):
    asc = "asc"
    desc = "desc"


@dataclasses.dataclass
class SortOptions:
    sort: List = Query(
        default=(None, SortDirection.asc),
        description="field-0: sort column<br/>field-1: order ('asc' or 'desc')",
    )
    limit: int = Query(0, description="records limit")
    offset: int = Query(0, description="records offset")
