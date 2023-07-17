from datetime import datetime
from typing import Any, Dict, List, Optional

from fastapi import Query
from pydantic import BaseModel, dataclasses


class DbExperimentHeader(BaseModel):
    graph_titles: List[str]


class DbExperimentFields(BaseModel):
    brain_area: str
    cre_driver: str
    reporter_line: str
    imaging_depth: int


class DbExperiment(BaseModel):
    id: int
    experiment_id: int
    fields: DbExperimentFields
    attributes: Dict[str, Any]
    cell_image_urls: List[str]
    graph_urls: List[str]
    created_time: Optional[datetime]
    updated_time: Optional[datetime]


class DbExperiments(BaseModel):
    header: DbExperimentHeader
    records: List[DbExperiment]


@dataclasses.dataclass
class SearchExperimentQueryParam:
    brain_area: Optional[str] = Query(None, description="like検索")
    cre_driver: Optional[str] = Query(None, description="like検索")
    reporter_line: Optional[str] = Query(None, description="like検索")
    imaging_depth: Optional[int] = 0
