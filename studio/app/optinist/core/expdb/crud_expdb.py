from sqlmodel import Session

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
