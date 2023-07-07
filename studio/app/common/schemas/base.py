from typing import List, Optional

from fastapi import Query
from pydantic import BaseModel, dataclasses


class Pagenation(BaseModel):
    page: Optional[int] = 0
    limit: Optional[int] = 0
    total: Optional[int] = 0
    total_pages: Optional[int] = 0


@dataclasses.dataclass
class BaseQueryParams:
    sort: List = Query(
        [None, "asc"],
        description="field-0: sort column<br/>field-1: order ('asc' or 'desc')",
    )
    limit: int = Query(0, description="records limit")
    offset: int = Query(0, description="records offset")
