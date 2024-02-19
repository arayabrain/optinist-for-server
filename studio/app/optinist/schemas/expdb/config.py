from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class ExpDbConfig(BaseModel):
    id: int
    experiment_config: Optional[dict]
    created_at: datetime = None
    updated_at: datetime = None

    class Config:
        orm_mode = True


class ExpDbConfigUpdate(BaseModel):
    experiment_config: Optional[dict]
    updated_at: Optional[datetime]
