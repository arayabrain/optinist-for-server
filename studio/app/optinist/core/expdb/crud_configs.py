from sqlmodel import Session, func

import datetime
from studio.app.optinist.models.expdb.config import Config as ConfigModel
from studio.app.optinist.models import Experiment as ExperimentModel

from studio.app.optinist.schemas.expdb.config import (
    ExpDbConfig,
    ExpDbConfigUpdate,
)


def summarize_experiment_metadata(db: Session) -> bool:
    """
    Note: In this process, organization_id is not referenced
          (aggregation is performed on data from all organizations)
    """

    meta_field_names = ["brain_area", "imaging_depth", "promoter", "indicator"]
    summarized_meta_fields = {}
    for meta_field_name in meta_field_names:
        meta_field = func.json_extract(
            ExperimentModel.view_attributes, f"$.{meta_field_name}"
        )
        summarized_meta_values = (
            db.query(func.json_unquote(meta_field))
            .group_by(meta_field)
            .filter(meta_field.is_not(None))
            .all()
        )
        filter_param_name = f"{meta_field_name}s"
        summarized_meta_fields[filter_param_name] = [
            values[0] for values in summarized_meta_values
        ]

    experiment_config = {"filter_params": summarized_meta_fields}

    update_expdb_config(
        db,
        ExpDbConfigUpdate(
            experiment_config=experiment_config,
        ),
    )

    return True


def update_expdb_config(
    db: Session,
    data: ExpDbConfigUpdate,
) -> ExpDbConfig:
    id = 1  # Fixed at "1"
    config = db.query(ConfigModel).get(id)
    assert config is not None, "ExpDbConfig not found"

    data.updated_at = datetime.datetime.now()
    new_data = data.dict(exclude_unset=True)
    for key, value in new_data.items():
        setattr(config, key, value)
    db.flush()
    db.refresh(config)
    return ExpDbConfig.from_orm(config)
