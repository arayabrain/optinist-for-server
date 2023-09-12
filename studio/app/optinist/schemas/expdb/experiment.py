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


class PublishStatus(int, Enum):
    on = 1
    off = 0


class ExpDbExperimentFields(BaseModel):
    brain_area: Optional[str]
    cre_driver: Optional[str]
    reporter_line: Optional[str]
    imaging_depth: Optional[int]


class ExpDbExperimentHeader(BaseModel):
    graph_titles: List[str] = []


class ImageInfo(BaseModel):
    url: str
    thumb_url: Optional[str]
    params: Optional[dict]

    def __init__(self, url, params=None, thumb_url=None):
        super().__init__(url=url, thumb_url=thumb_url, params=params)
        if thumb_url is None:
            self.thumb_url = url.replace(".png", ".thumb.png")


class ExpDbExperiment(BaseModel):
    id: int
    experiment_id: str
    fields: ExpDbExperimentFields = None
    attributes: Optional[dict] = {}
    cell_image_urls: List[ImageInfo] = None
    graph_urls: List[ImageInfo] = None
    share_type: int = Field(description="1: default(per users), 2: for organization")
    publish_status: int = Field(description="0: private, 1: public")
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        orm_mode = True


class ExpDbExperimentCreate(BaseModel):
    experiment_id: str
    organization_id: int
    attributes: Optional[dict] = {}


class ExpDbExperimentUpdate(BaseModel):
    experiment_id: Optional[str]
    organization_id: Optional[int]
    attributes: Optional[dict]
    share_type: Optional[int]
    publish_status: Optional[int]


class ExpDbExperimentsSearchOptions(BaseModel):
    experiment_id: Optional[str] = Field(
        Query(default="", description="partial match (experiments.experiment_id)")
    )
    brain_area: Optional[List[str]] = Field(
        Query(default=None, description="complete match")
    )
    cre_driver: Optional[List[str]] = Field(
        Query(default=None, description="complete match")
    )
    reporter_line: Optional[List[str]] = Field(
        Query(default=None, description="complete match")
    )
    imaging_depth: Optional[List[int]] = Field(Query(default=None))


class ExpDbExperimentShareStatus(BaseModel):
    share_type: int = Field(
        description="0: no share, 1: default(per users), 2: for organization"
    )
    users: Optional[List[UserInfo]]


class ExpDbExperimentSharePostStatus(BaseModel):
    share_type: int = Field(
        description="0: no share, 1: default(per users), 2: for organization"
    )
    user_ids: Optional[List[int]]


class ExperimentShareType(int, Enum):
    no_share = 0
    per_user = 1
    for_org = 2
