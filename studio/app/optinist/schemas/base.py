from typing import List

from fastapi import Query
from pydantic import dataclasses


@dataclasses.dataclass
class BaseQueryParams:
    sort: List = Query(
        [None, "asc"],
        description="field-0: sort column<br/>field-1: order ('asc' or 'desc')",
    )
    limit: int = Query(0, description="records limit")
    offset: int = Query(0, description="records offset")
