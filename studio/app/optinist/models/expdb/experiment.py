from datetime import datetime
from typing import Dict, List, Optional

from sqlalchemy.dialects.mysql import BIGINT
from sqlalchemy.sql.functions import current_timestamp
from sqlmodel import (
    JSON,
    Column,
    Field,
    ForeignKey,
    Index,
    Integer,
    Relationship,
    String,
    UniqueConstraint,
)

from studio.app.common.models.base import Base, TimestampMixin
from studio.app.optinist.schemas.expdb.experiment import (
    ExperimentShareType,
    PublishStatus,
)


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


class ExperimentShareGroup(Base, table=True):
    __tablename__ = "experiments_share_groups"
    __table_args__ = (
        UniqueConstraint(
            "experiment_uid", "group_id", name="idx_experiment_uid_group_id"
        ),
    )

    experiment_uid: int = Field(
        sa_column=Column(
            BIGINT(unsigned=True), ForeignKey("experiments.id"), nullable=False
        ),
    )
    group_id: int = Field(
        sa_column=Column(
            BIGINT(unsigned=True), ForeignKey("groups.id"), nullable=False
        ),
    )
    created_at: Optional[datetime] = Field(
        sa_column_kwargs={"server_default": current_timestamp()},
    )


class Experiment(Base, TimestampMixin, table=True):
    __tablename__ = "experiments"
    __table_args__ = (
        UniqueConstraint("experiment_id", name="idx_experiment_id"),
        Index(
            "experiments_id_experiment_id_publish_status_index",
            "id",
            "experiment_id",
            "publish_status",
        ),
        Index(
            "experiments_id_org_id_experiment_id_publish_status_index",
            "organization_id",
            "id",
            "experiment_id",
            "publish_status",
        ),
    )

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
            default=ExperimentShareType.no_share.value,
            comment="1: default(per users), 2: for organization",
        )
    )
    publish_status: int = Field(
        sa_column=Column(
            Integer(),
            nullable=False,
            default=PublishStatus.off.value,
            comment="0: private, 1: public",
        )
    )

    organization: "Organization" = Relationship(  # noqa: F821
        sa_relationship_kwargs=dict(backref="experiments")
    )
    user_share: List["User"] = Relationship(  # noqa: F821
        back_populates="experiment_share", link_model=ExperimentShareUser
    )
    active_user_share: List["User"] = Relationship(  # noqa: F821
        back_populates="experiment_share",
        link_model=ExperimentShareUser,
        sa_relationship_kwargs=dict(
            primaryjoin="Experiment.id==ExperimentShareUser.experiment_uid",
            secondaryjoin="and_(ExperimentShareUser.user_id==User.id, User.active==1)",
            viewonly=True,
        ),
    )
    group_share: List["Group"] = Relationship(  # noqa: F821
        back_populates="experiment_share", link_model=ExperimentShareGroup
    )
