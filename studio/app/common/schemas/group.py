from typing import Optional

from pydantic import BaseModel


class Group(BaseModel):
    id: Optional[int]
    name: str
    users_count: Optional[int]


class GroupCreate(BaseModel):
    name: str


class GroupUpdate(GroupCreate):
    pass
