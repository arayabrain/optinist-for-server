from fastapi import HTTPException
from sqlmodel import Session

from studio.app.optinist.models import Cell as CellModel
from studio.app.optinist.models import Experiment as ExperimentModel


async def bulk_insert_cells(db: Session, experiment_uid: int, cells: int):
    try:
        experiment = db.query(ExperimentModel).get(experiment_uid)
        assert experiment is not None, "Experiment not found"

        db.query(CellModel).filter(CellModel.experiment_uid == experiment_uid).delete()

        for cell in range(cells):
            db.add(CellModel(sequence=cell, experiment_uid=experiment_uid))

        db.commit()

        return True
    except AssertionError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


async def bulk_delete_cells(db: Session, experiment_uid: int):
    try:
        db.query(CellModel).filter(CellModel.experiment_uid == experiment_uid).delete()

        db.commit()

        return True
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
