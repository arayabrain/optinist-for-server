from datetime import datetime
from enum import Enum
from typing import Generic, List, Optional, TypeVar

from fastapi import Query
from fastapi_pagination import LimitOffsetPage
from pydantic import BaseModel, Field

from studio.app.common.schemas.users import UserInfo

T = TypeVar("T")


class PageWithHeader(LimitOffsetPage[T], Generic[T]):
    header: Optional["ExpDbExperimentHeader"] = {}


class PublishFlags(str, Enum):
    on = "on"
    off = "off"


class PublishStatus(str, Enum):
    on = 1
    off = 0


class ExpDbExperimentFields(BaseModel):
    brain_area: str
    cre_driver: str
    reporter_line: str
    imaging_depth: int


class ExpDbExperimentHeader(BaseModel):
    graph_titles: List[str] = []


class ExpDbExperiment(BaseModel):
    id: int
    experiment_id: str
    fields: ExpDbExperimentFields = None
    attributes: Optional[dict] = {}
    cell_image_urls: List[str] = []
    graph_urls: List[str] = []
    share_type: int = Field(description="1: default(per users), 2: for organization")
    publish_status: int = Field(description="0: private, 1: public")
    created_at: Optional[datetime]
    updated_at: Optional[datetime]


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
