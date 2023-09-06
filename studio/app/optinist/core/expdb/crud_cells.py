from sqlmodel import Session, insert

from studio.app.optinist.models import Cell as CellModel
from studio.app.optinist.models import Experiment as ExperimentModel


def bulk_insert_cells(db: Session, experiment_uid: int, cells: int):
    experiment = db.query(ExperimentModel).get(experiment_uid)
    assert experiment is not None, "Experiment not found"

    db.query(CellModel).filter(CellModel.experiment_uid == experiment_uid).delete()

    db.execute(
        insert(CellModel),
        [
            {"cell_number": cell_number, "experiment_uid": experiment_uid}
            for cell_number in range(cells)
        ],
    )

    db.commit()
    return True


def bulk_delete_cells(db: Session, experiment_uid: int):
    db.query(CellModel).filter(CellModel.experiment_uid == experiment_uid).delete()

    db.commit()
    return True
