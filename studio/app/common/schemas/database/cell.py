from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel

from studio.app.common.schemas.base import Pagenation
from studio.app.common.schemas.database.experiment import (
    DbExperimentFields,
    DbExperimentHeader,
)


class DbCell(BaseModel):
    id: int
    exp_id: int
    fields: DbExperimentFields
    cell_image_url: str
    graph_urls: List[str]
    created_time: Optional[datetime]
    updated_time: Optional[datetime]


class DbCells(BaseModel):
    pagenation: Pagenation
    header: DbExperimentHeader
    records: List[DbCell]
