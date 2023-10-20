from datetime import datetime
from typing import List, Optional

from sqlalchemy.dialects.mysql import BIGINT
from sqlalchemy.sql.functions import current_timestamp
from sqlmodel import Column, Field, ForeignKey, Relationship, String, UniqueConstraint

from studio.app.common.models.base import Base


class UserGroup(Base, table=True):
    __tablename__ = "user_groups"
    __table_args__ = (UniqueConstraint("user_id", "group_id", name="idx_user_id"),)

    user_id: int = Field(
        sa_column=Column(BIGINT(unsigned=True), ForeignKey("users.id"), nullable=False),
    )
    group_id: int = Field(
        sa_column=Column(
            BIGINT(unsigned=True), ForeignKey("groups.id"), nullable=False
        ),
    )
    created_at: Optional[datetime] = Field(
        sa_column_kwargs={"server_default": current_timestamp()},
    )


class Group(Base, table=True):
    __tablename__ = "groups"

    name: str = Field(sa_column=Column(String(100), nullable=False))
    created_at: Optional[datetime] = Field(
        sa_column_kwargs={"server_default": current_timestamp()},
    )

    group_user: List["User"] = Relationship(  # noqa: F821
        back_populates="groups", link_model=UserGroup
    )

    active_group_user: List["User"] = Relationship(  # noqa: F821
        back_populates="groups",
        link_model=UserGroup,
        sa_relationship_kwargs=dict(
            primaryjoin="Group.id==UserGroup.group_id",
            secondaryjoin="and_(UserGroup.user_id==User.id, User.active==1)",
            viewonly=True,
        ),
    )

    @property
    def users_count(self):
        return len(self.active_group_user) if self.active_group_user else 0
