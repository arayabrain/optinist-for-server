from datetime import datetime
from typing import List, Tuple

from pydantic import BaseModel, Field

from studio.app.optinist.schemas.expdb.experiment import (
    ExpDbExperimentFields,
    ExpDbExperimentHeader,
)


class ExpDbCell(BaseModel):
    id: int
    exp_id: int
    fields: ExpDbExperimentFields
    cell_image_url: str
    graph_urls: List[Tuple[str, dict]] = Field(
        description="[0]:graph_url, [1]:graph_params"
    )
    created_time: datetime = None
    updated_time: datetime = None


class ExpDbCells(BaseModel):
    header: ExpDbExperimentHeader
    records: List[ExpDbCell]
