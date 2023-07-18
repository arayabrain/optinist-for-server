from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel

from studio.app.optinist.schemas.database.experiment import (
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
    header: DbExperimentHeader
    records: List[DbCell]
