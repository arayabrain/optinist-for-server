from sqlmodel import Column, Field, Integer, UniqueConstraint

from studio.app.common.models.base import Base, TimestampMixin


class Cell(Base, TimestampMixin, table=True):
    __tablename__ = "cells"
    __table_args__ = (
        UniqueConstraint("experiment_uid", "sequence", name="idx_experiment_uid_seq"),
    )

    sequence: int = Field(
        sa_column=Column(
            Integer(),
            nullable=False,
            comment="sequence number of cell in experiment",
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
