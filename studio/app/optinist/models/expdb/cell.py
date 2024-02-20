from sqlalchemy.dialects.mysql import BIGINT
from sqlmodel import JSON, Column, Field, ForeignKey, Index, Integer, UniqueConstraint

from studio.app.common.models.base import Base, TimestampMixin


class Cell(Base, TimestampMixin, table=True):
    __tablename__ = "cells"
    __table_args__ = (
        UniqueConstraint(
            "experiment_uid", "cell_number", name="idx_experiment_uid_cell_number"
        ),
        Index(
            "cells_id_created_at_updated_at_index",
            "id",
            "created_at",
            "updated_at",
        ),
    )

    cell_number: int = Field(
        sa_column=Column(
            Integer(),
            nullable=False,
            comment="number of cell in experiment",
        ),
    )
    experiment_uid: int = Field(
        sa_column=Column(
            BIGINT(unsigned=True),
            ForeignKey("experiments.id"),
            nullable=False,
            index=True,
        ),
    )

    statistics: dict = Field(sa_column=Column(JSON), default={})
