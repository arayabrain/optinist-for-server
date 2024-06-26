import datetime

from sqlmodel import Session

from studio.app.optinist.core.nwb.lab_metadata import MODALITY_IMAGING_KEY, SPECIMEN_KEY
from studio.app.optinist.models import Experiment as ExperimentModel
from studio.app.optinist.models.expdb.experiment import (
    ExperimentShareUser as ExperimentShareUserModel,
)
from studio.app.optinist.schemas.expdb.experiment import (
    ExpDbExperiment,
    ExpDbExperimentCreate,
    ExpDbExperimentUpdate,
)


def get_experiment(
    db: Session,
    experiment_id: str,
    organization_id: int,
) -> ExpDbExperiment:
    expdb = (
        db.query(ExperimentModel)
        .filter(
            ExperimentModel.organization_id == organization_id,
            ExperimentModel.experiment_id == experiment_id,
        )
        .first()
    )
    assert expdb is not None, "Experiment not found"
    return ExpDbExperiment.from_orm(expdb)


def create_experiment(db: Session, data: ExpDbExperimentCreate) -> ExpDbExperiment:
    expdb = ExperimentModel(
        experiment_id=data.experiment_id,
        organization_id=data.organization_id,
        attributes=data.attributes,
        view_attributes=data.view_attributes,
    )

    db.add(expdb)
    db.flush()
    db.refresh(expdb)
    return ExpDbExperiment.from_orm(expdb)


def update_experiment(
    db: Session,
    id: int,
    data: ExpDbExperimentUpdate,
) -> ExpDbExperiment:
    expdb = db.query(ExperimentModel).get(id)
    assert expdb is not None, "Experiment not found"

    data.updated_at = datetime.datetime.now()
    new_data = data.dict(exclude_unset=True)
    for key, value in new_data.items():
        setattr(expdb, key, value)
    db.flush()
    db.refresh(expdb)
    return ExpDbExperiment.from_orm(expdb)


def delete_experiment(db: Session, id: int):
    expdb = db.query(ExperimentModel).get(id)
    assert expdb is not None, "Experiment not found"

    db.delete(expdb)
    db.flush()

    db.query(ExperimentShareUserModel).filter(
        ExperimentShareUserModel.experiment_uid == id
    ).delete()
    db.flush()

    return True


def extract_experiment_view_attributes(attributes: dict) -> dict:
    try:
        attributes_metadata_attr = attributes["metadata"]["metadata"]
        modality_imaging = attributes_metadata_attr[MODALITY_IMAGING_KEY]

        specimen_type_brain_region = attributes_metadata_attr[SPECIMEN_KEY]
        if "Brain region Marmoset" in specimen_type_brain_region:
            brain_region = specimen_type_brain_region["Brain region Marmoset"]
        elif "Brain region Mouse" in specimen_type_brain_region:
            brain_region = specimen_type_brain_region["Brain region Mouse"]
        else:
            raise KeyError()

        view_attributes = {
            "brain_area": brain_region[-1]["label"],
            "imaging_depth": modality_imaging["Ca Imaging>Depth"],
            "promoter": modality_imaging["Ca Imaging>Promoter"],
            "indicator": modality_imaging["Ca Imaging>Indicator"],
        }

        return view_attributes

    except KeyError:
        return None
