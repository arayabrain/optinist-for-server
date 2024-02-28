from typing import Dict, Optional

from sqlmodel import JSON, Column, Field

from studio.app.common.models.base import Base, TimestampMixin


class Config(Base, TimestampMixin, table=True):
    __tablename__ = "configs"

    experiment_config: Optional[Dict] = Field(default={}, sa_column=Column(JSON))
