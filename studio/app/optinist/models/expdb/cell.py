from sqlmodel import JSON, Column, Field, Integer, UniqueConstraint

from studio.app.common.models.base import Base, TimestampMixin


class Cell(Base, TimestampMixin, table=True):
    __tablename__ = "cells"
    __table_args__ = (
        UniqueConstraint(
            "experiment_uid", "cell_number", name="idx_experiment_uid_cell_number"
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
            Integer(),
            nullable=False,
            index=True,
            comment="foregn key for experiments.id",
        ),
    )

    statistics: dict = Field(sa_column=Column(JSON), default={})
