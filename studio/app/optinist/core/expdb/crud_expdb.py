import datetime

from sqlmodel import Session

from studio.app.optinist.core.nwb.lab_metadata import (
    LAB_SPECIFIC_KEY,
    LAB_SPECIFIC_TYPES,
    MODALITY_IMAGING_KEY,
    MODALITY_IMAGING_TYPES,
    SPECIMEN_KEY,
    SPECIMEN_TYPES,
    TECHNIQUE_VIRUS_INJECTION_KEY,
    TECHNIQUE_VIRUS_INJECTION_TYPES,
    LabSpecificMetaData,
    ModalityImagingMetaData,
    SpecimenTypeMetaData,
    TechniqueVirusInjectionMetaData,
)
from studio.app.optinist.core.nwb.subject_metadata import SUBJECT_TYPES, BehaviorSubject
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
        modality_imaging = attributes_metadata_attr["Modality Imaging"]

        specimen_type_brain_region = attributes_metadata_attr[
            "Specimen type Brain region"
        ]
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


def extract_experiment_nwb(attributes: dict):
    try:
        metadata = attributes["metadata"]["metadata"]

        speceis_marmoset = metadata["Species Marmoset"]
        subject_extended = {k: speceis_marmoset[k] for k in SUBJECT_TYPES.keys()}
        subject_nwb = BehaviorSubject(
            # NWB's Subject fields
            age=speceis_marmoset["Age"],
            sex=speceis_marmoset["Sex"],
            species=speceis_marmoset["Species"],
            subject_id=attributes["name"].split("_")[0],
            date_of_birth=datetime.datetime.strptime(
                speceis_marmoset["Date of birth"][0], "%Y-%m-%d"
            ),
            weight=speceis_marmoset["Body weight"],
            strain=speceis_marmoset["Strain"],
            # NWB's Subject extended fields
            **subject_extended,
        )
        specimen_type = metadata[SPECIMEN_KEY]
        specimen_type_nwb = SpecimenTypeMetaData(
            **{k: specimen_type[k] for k in SPECIMEN_TYPES.keys()}
        )

        modality_imaging = metadata[MODALITY_IMAGING_KEY]
        modality_imaging_nwb = ModalityImagingMetaData(
            **{k: modality_imaging[k] for k in MODALITY_IMAGING_TYPES.keys()}
        )

        technique_virus_injection = metadata[TECHNIQUE_VIRUS_INJECTION_KEY]
        technique_virus_injection_nwb = TechniqueVirusInjectionMetaData(
            **{
                k: technique_virus_injection[k]
                for k in TECHNIQUE_VIRUS_INJECTION_TYPES.keys()
            }
        )
        common = metadata[LAB_SPECIFIC_KEY]
        lab_specific_nwb = LabSpecificMetaData(
            **{
                SPECIMEN_KEY: specimen_type_nwb,
                MODALITY_IMAGING_KEY: modality_imaging_nwb,
                TECHNIQUE_VIRUS_INJECTION_KEY: technique_virus_injection_nwb,
            },
            **{k: common[k] for k in LAB_SPECIFIC_TYPES.keys()},
        )

        return subject_nwb, lab_specific_nwb

    except KeyError as e:
        print("==== Key error found ===", e)
        return None, None
