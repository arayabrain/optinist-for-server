from datetime import datetime
from enum import Enum
from typing import List, Optional

from fastapi import Query
from pydantic import BaseModel, Field

from studio.app.common.schemas.users import UserInfo


class PublishFlags(str, Enum):
    on = "on"
    off = "off"


class ExpDbExperimentFields(BaseModel):
    brain_area: str
    cre_driver: str
    reporter_line: str
    imaging_depth: int


class ExpDbExperimentHeader(BaseModel):
    graph_titles: List[str]


class ExpDbExperiment(BaseModel):
    id: int
    experiment_id: str
    fields: ExpDbExperimentFields
    attributes: dict
    cell_image_urls: List[str]
    graph_urls: List[str]
    share_type: int = Field(description="1: default(per users), 2: for organization")
    publish_status: int = Field(description="0: private, 1: public")
    created_time: Optional[datetime]
    updated_time: Optional[datetime]


class ExpDbExperiments(BaseModel):
    header: ExpDbExperimentFields
    records: List[ExpDbExperiment]


class ExpDbExperimentsSearchOptions(BaseModel):
    brain_area: Optional[List[str]] = Field(Query(default=None, description="完全一致"))
    cre_driver: Optional[List[str]] = Field(Query(default=None, description="完全一致"))
    reporter_line: Optional[List[str]] = Field(Query(default=None, description="完全一致"))
    imaging_depth: Optional[List[int]] = Field(Query(default=0))


class ExpDbExperimentShareStatus(BaseModel):
    share_type: int = Field(description="1: default(per users), 2: for organization")
    users: Optional[List[UserInfo]]


class ExpDbExperimentSharePostStatus(BaseModel):
    share_type: int = Field(description="1: default(per users), 2: for organization")
    user_ids: Optional[List[int]]