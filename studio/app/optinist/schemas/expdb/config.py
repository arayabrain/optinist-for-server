from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class ExpDbConfig(BaseModel):
    id: int
    experiment_config: Optional[dict]
    created_at: datetime = None
    updated_at: datetime = None

    class Config:
        orm_mode = True


class ExpDbConfigCreate(BaseModel):
    id: int
    experiment_config: Optional[dict]


class ExpDbConfigUpdate(BaseModel):
    experiment_config: Optional[dict]
    updated_at: Optional[datetime]


class ExpDbExperimentFilterParams(BaseModel):
    brain_areas: List[str]
    imaging_depths: List[str]
    promoters: List[str]
    indicators: List[str]
