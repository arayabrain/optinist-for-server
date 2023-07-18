from datetime import datetime
from typing import List, Tuple

from pydantic import BaseModel, Field

from studio.app.optinist.schemas.expdb.experiment import ExpDbExperimentFields


class ExpDbCell(BaseModel):
    id: int
    exp_id: int = None
    fields: ExpDbExperimentFields = None
    cell_image_url: str = None
    graph_urls: List[Tuple[str, dict]] = Field(
        [], description="[0]:graph_url, [1]:graph_params"
    )
    created_at: datetime = None
    updated_at: datetime = None
