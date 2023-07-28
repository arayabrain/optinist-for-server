from datetime import datetime
from typing import List

from pydantic import BaseModel

from studio.app.optinist.schemas.expdb.experiment import (
    ExpDbExperimentFields,
    ImageInfo,
)


class ExpDbCell(BaseModel):
    id: int
    experiment_id: str = None
    fields: ExpDbExperimentFields = None
    cell_image_url: ImageInfo = None
    graph_urls: List[ImageInfo] = None
    created_at: datetime = None
    updated_at: datetime = None

    class Config:
        orm_mode = True
