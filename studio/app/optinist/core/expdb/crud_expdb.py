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
from studio.app.optinist.core.nwb.subject.marmoset import (
    SUBJECT_TYPES as SUBJECT_MARMOSET_TYPES,
)
from studio.app.optinist.core.nwb.subject.marmoset import SubjectMarmoset
from studio.app.optinist.core.nwb.subject.mouse import (
    SUBJECT_TYPES as SUBJECT_MOUSE_TYPES,
)
from studio.app.optinist.core.nwb.subject.mouse import SubjectMouse
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


def extract_experiment_nwb(attributes: dict):
    try:
        metadata = attributes["metadata"]["metadata"]
        specimen_type = metadata[SPECIMEN_KEY]
        technique_virus_injection = metadata[TECHNIQUE_VIRUS_INJECTION_KEY]

        if "Species Marmoset" in metadata:
            species = metadata["Species Marmoset"]
            subject_extended = {k: species[k] for k in SUBJECT_MARMOSET_TYPES.keys()}
            subject_nwb = SubjectMarmoset(
                # NWB's Subject fields
                age=species["Age"],
                sex=species["Sex"],
                species=species["Species"],
                subject_id=attributes["name"].split("_")[0],
                date_of_birth=datetime.datetime.strptime(
                    species["Date of birth"][0], "%Y-%m-%d"
                ),
                weight=species["Body weight"],
                strain=species["Strain"],
                # NWB's Subject extended fields
                **subject_extended,
            )

            brain_region = specimen_type.pop("Brain region Marmoset")
            injection_region = technique_virus_injection.pop(
                "Injection region Marmoset"
            )

        elif "Species Mouse" in metadata:
            species = metadata["Species Mouse"]
            subject_extended = {k: species[k] for k in SUBJECT_MOUSE_TYPES.keys()}
            subject_nwb = SubjectMouse(
                # NWB's Subject fields
                age=species["Age"],
                sex=species["Sex"],
                species=species["Species"],
                subject_id=attributes["name"].split("_")[0],
                strain=species["Strain"],
                # NWB's Subject extended fields
                **subject_extended,
            )

            brain_region = specimen_type.pop("Brain region Mouse")
            injection_region = technique_virus_injection.pop("Injection region Mouse")

        specimen_type["Brain region"] = brain_region
        technique_virus_injection["Injection region"] = injection_region

        specimen_type_nwb = SpecimenTypeMetaData(
            **{k: specimen_type[k] for k in SPECIMEN_TYPES.keys()}
        )

        modality_imaging = metadata[MODALITY_IMAGING_KEY]
        modality_imaging_nwb = ModalityImagingMetaData(
            **{k: modality_imaging[k] for k in MODALITY_IMAGING_TYPES.keys()}
        )

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
