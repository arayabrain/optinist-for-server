from datetime import datetime
from typing import Dict, List, Optional

from sqlalchemy.dialects.mysql import BIGINT
from sqlalchemy.sql.functions import current_timestamp
from sqlmodel import (
    JSON,
    Column,
    Field,
    ForeignKey,
    Integer,
    Relationship,
    String,
    UniqueConstraint,
)

from studio.app.common.models.base import Base, TimestampMixin


class ExperimentShareUser(Base, table=True):
    __tablename__ = "experiments_share_users"
    __table_args__ = (
        UniqueConstraint(
            "experiment_uid", "user_id", name="idx_experiment_uid_user_id"
        ),
    )

    experiment_uid: int = Field(
        sa_column=Column(
            BIGINT(unsigned=True), ForeignKey("experiments.id"), nullable=False
        ),
    )
    user_id: int = Field(
        sa_column=Column(BIGINT(unsigned=True), ForeignKey("users.id"), nullable=False),
    )
    created_at: Optional[datetime] = Field(
        sa_column_kwargs={"server_default": current_timestamp()},
    )


class Experiment(Base, TimestampMixin, table=True):
    __tablename__ = "experiments"
    __table_args__ = (UniqueConstraint("experiment_id", name="idx_experiment_id"),)

    organization_id: int = Field(
        sa_column=Column(
            BIGINT(unsigned=True), ForeignKey("organization.id"), nullable=False
        ),
    )
    experiment_id: str = Field(sa_column=Column(String(100), nullable=False))
    attributes: Optional[Dict] = Field(default={}, sa_column=Column(JSON))
    share_type: int = Field(
        sa_column=Column(
            Integer(),
            nullable=False,
            comment="1: default(per users), 2: for organization",
        )
    )
    publish_status: int = Field(
        sa_column=Column(Integer(), nullable=False, comment="0: private, 1: public")
    )

    organization: "Organization" = Relationship(  # noqa: F821
        sa_relationship_kwargs=dict(backref="experiments")
    )
    user_share: List["User"] = Relationship(  # noqa: F821
        back_populates="experiment_share", link_model=ExperimentShareUser
    )
