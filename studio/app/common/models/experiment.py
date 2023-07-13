from typing import Dict, Optional

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
