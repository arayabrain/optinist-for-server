from typing import Dict, Optional

from sqlmodel import JSON, Column, Field, Integer, String, UniqueConstraint

from studio.app.common.models.base import Base, TimestampMixin


class Experiment(Base, TimestampMixin, table=True):
    __tablename__ = "experiments"
    __table_args__ = (UniqueConstraint("experiment_id", name="idx_experiment_id"),)

    experiment_id: str = Field(sa_column=Column(String(100), nullable=False))
    attributes: Optional[Dict] = Field(default={}, sa_column=Column(JSON))
    publish_status: Optional[int] = Field(
        sa_column=Column(Integer(), nullable=True, comment="0: private, 1: public")
    )
