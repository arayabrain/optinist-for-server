from sqlmodel import Column, Field, Float, Integer, UniqueConstraint

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

    p_value_resp: float = Field(sa_column=Column(Float(), nullable=True))
    p_value_sel: float = Field(sa_column=Column(Float(), nullable=True))
    p_value_ori_resp: float = Field(sa_column=Column(Float(), nullable=True))
    p_value_ori_sel: float = Field(sa_column=Column(Float(), nullable=True))
    dir_vector_angle: float = Field(sa_column=Column(Float(), nullable=True))
    ori_vector_angle: float = Field(sa_column=Column(Float(), nullable=True))
    oi: float = Field(sa_column=Column(Float(), nullable=True))
    di: float = Field(sa_column=Column(Float(), nullable=True))
    dsi: float = Field(sa_column=Column(Float(), nullable=True))
    osi: float = Field(sa_column=Column(Float(), nullable=True))
    r_best_dir: float = Field(sa_column=Column(Float(), nullable=True))
    dir_tuning_width: float = Field(sa_column=Column(Float(), nullable=True))
    ori_tuning_width: float = Field(sa_column=Column(Float(), nullable=True))
