from datetime import datetime
from typing import Dict, Optional

from sqlalchemy.sql.functions import current_timestamp
from sqlmodel import JSON, Column, Field, Integer, String, UniqueConstraint

from studio.app.common.models.base import Base, TimestampMixin


class Experiment(Base, TimestampMixin, table=True):
    __tablename__ = "experiments"
    __table_args__ = (UniqueConstraint("experiment_id", name="idx_experiment_id"),)

    organization_id: int = Field(nullable=False)
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


class ExperimentShareUser(Base, table=True):
    __tablename__ = "experiments_share_users"
    __table_args__ = (
        UniqueConstraint(
            "experiment_seqid", "user_id", name="idx_experiment_seqid_user_id"
        ),
    )
    experiment_seqid: int = Field(
        sa_column=Column(
            Integer(),
            nullable=False,
            index=True,
            comment="foregn key for experiments.id",
        ),
    )
    user_id: int = Field(nullable=False)
    created_at: Optional[datetime] = Field(
        sa_column_kwargs={"server_default": current_timestamp()},
    )
