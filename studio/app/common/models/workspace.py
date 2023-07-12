from datetime import datetime
from typing import Optional

from sqlalchemy.sql.functions import current_timestamp
from sqlmodel import Column, Field, Integer, String, UniqueConstraint

from studio.app.common.models.base import Base, TimestampMixin


class Workspace(Base, TimestampMixin, table=True):
    __tablename__ = "workspaces"

    name: str = Field(sa_column=Column(String(100), nullable=False))
    user_id: int = Field(nullable=False, index=True)
    deleted: bool = Field(nullable=False)


class WorkspacesShareUser(Base, table=True):
    __tablename__ = "workspaces_share_users"
    __table_args__ = (
        UniqueConstraint("workspace_id", "user_id", name="idx_workspace_id"),
    )

    workspace_id: int = Field(
        sa_column=Column(
            Integer(),
            nullable=False,
            comment="foregn key for workspaces.id",
        ),
    )
    user_id: int = Field(nullable=False)
    created_at: Optional[datetime] = Field(
        sa_column_kwargs={"server_default": current_timestamp()},
    )
