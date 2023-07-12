from sqlmodel import Column, Field, Integer

from studio.app.common.models.base import Base, TimestampMixin


class Cell(Base, TimestampMixin, table=True):
    __tablename__ = "cells"

    exp_id: int = Field(
        sa_column=Column(
            Integer(),
            nullable=False,
            index=True,
            comment="foregn key for experiments.id",
        ),
    )
