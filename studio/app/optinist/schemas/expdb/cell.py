from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field

from studio.app.optinist.schemas.expdb.experiment import (
    ExpDbExperimentFields,
    ImageInfo,
)


class ExpDbCell(BaseModel):
    id: int
    experiment_id: str = None
    publish_status: Optional[int] = Field(description="0: private, 1: public")
    fields: ExpDbExperimentFields = None
    cell_image_url: ImageInfo = None
    graph_urls: List[ImageInfo] = None
    created_at: datetime = None
    updated_at: datetime = None

    class Config:
        orm_mode = True
