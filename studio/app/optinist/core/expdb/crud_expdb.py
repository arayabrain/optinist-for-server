from fastapi import HTTPException
from sqlmodel import Session

from studio.app.optinist.models import Experiment as ExperimentModel
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
    try:
        experiment = (
            db.query(ExperimentModel)
            .filter(
                ExperimentModel.organization_id == organization_id,
                ExperimentModel.experiment_id == experiment_id,
            )
            .first()
        )
        assert experiment is not None, "Experiment not found"
        return ExpDbExperiment.from_orm(experiment)
    except AssertionError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


def create_experiment(
    db: Session,
    data: ExpDbExperimentCreate,
) -> ExpDbExperiment:
    try:
        expdb = ExperimentModel(
            experiment_id=data.experiment_id,
            organization_id=data.organization_id,
            attributes=data.attributes,
        )

        db.add(expdb)
        db.flush()
        db.commit()
        return ExpDbExperiment.from_orm(expdb)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


def update_experiment(
    db: Session,
    id: int,
    data: ExpDbExperimentUpdate,
) -> ExpDbExperiment:
    try:
        expdb = db.query(ExperimentModel).get(id)
        assert expdb is not None, "Experiment not found"

        new_data = data.dict(exclude_unset=True)
        for key, value in new_data.items():
            setattr(expdb, key, value)
        db.commit()
        return ExpDbExperiment.from_orm(expdb)
    except AssertionError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


def delete_experiment(
    db: Session,
    id: int,
):
    try:
        expdb = db.query(ExperimentModel).get(id)
        assert expdb is not None, "Experiment not found"

        db.delete(expdb)
        db.commit()
        return True
    except AssertionError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
