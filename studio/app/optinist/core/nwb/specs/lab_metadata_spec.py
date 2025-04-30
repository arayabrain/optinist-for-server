"""
*If this NWB Spec definition file is updated,
run the generation script (`python export_spec_files.py`)
to regenerate the nwb spec files.
"""

from pynwb.spec import NWBDatasetSpec, NWBGroupSpec

NAME = "lab_specific_metadata"

SPECIMEN_KEY = "Specimen type Brain region"
SPECIMEN_TYPES = {
    "Specimen type": "text",
    # NOTE: json data's key is "Brain region Marmoset" or "Brain region Mouse"
    "Brain region": ("text", [(None,), (None, None)]),
}

specimen_type_ext = NWBGroupSpec(
    doc=SPECIMEN_KEY,
    name=SPECIMEN_KEY,
    datasets=[
        (
            NWBDatasetSpec(doc=k, name=k, dtype=v[0], shape=v[1])
            if isinstance(v, tuple)
            else NWBDatasetSpec(doc=k, name=k, dtype=v)
        )
        for k, v in SPECIMEN_TYPES.items()
    ],
    neurodata_type_def="SpecimenTypeMetaData",
    neurodata_type_inc="LabMetaData",
)

MODALITY_IMAGING_KEY = "Modality Imaging"
MODALITY_IMAGING_TYPES = {
    "Modality": "text",
    "Imaging method": "text",
    "Ca Imaging": "text",
    "Ca Imaging>Indicator": "text",
    "Ca Imaging>Promoter": "text",
    "Ca Imaging>Depth": "text",
    "Ca Imaging>Field of view": "text",
    "Ca Imaging>Field of view x": "text",
    "Ca Imaging>Field of view y": "text",
    "Ca Imaging>Image size x": "text",
    "Ca Imaging>Image size y": "text",
    "Ca Imaging>Sampling speed": "text",
    "Ca Imaging>Optical resolution (psf)": "text",
    "Intrinsic imaging": "text",
    "Other imaging Sensor": "text",
    "Photo Multiplier Tube": "text",
    "Optics company": "text",
    "Optics product ID": "text",
    "Photon": "text",
    "Analyte": "text",
}

modality_imaging_ext = NWBGroupSpec(
    doc=MODALITY_IMAGING_KEY,
    name=MODALITY_IMAGING_KEY,
    datasets=[
        (
            NWBDatasetSpec(doc=k, name=k, dtype=v[0], shape=v[1])
            if isinstance(v, tuple)
            else NWBDatasetSpec(doc=k, name=k, dtype=v)
        )
        for k, v in MODALITY_IMAGING_TYPES.items()
    ],
    neurodata_type_def="ModalityImagingMetaData",
    neurodata_type_inc="LabMetaData",
)

TECHNIQUE_VIRUS_INJECTION_KEY = "Technique Virus injection"
TECHNIQUE_VIRUS_INJECTION_TYPES = {
    "Technique": "text",
    "Virus type": "text",
    "serotypes": "text",
    "Virus": ("text", [(None,), (None, None)]),
    # NOTE: json data's key is "Injection region Marmoset" or "Injection region Mouse"
    "Injection region": ("text", [(None,), (None, None)]),
    "Injection age": "text",
    "Incubation period": "text",
}

technique_virus_injection_ext = NWBGroupSpec(
    doc=TECHNIQUE_VIRUS_INJECTION_KEY,
    name=TECHNIQUE_VIRUS_INJECTION_KEY,
    datasets=[
        (
            NWBDatasetSpec(doc=k, name=k, dtype=v[0], shape=v[1])
            if isinstance(v, tuple)
            else NWBDatasetSpec(doc=k, name=k, dtype=v)
        )
        for k, v in TECHNIQUE_VIRUS_INJECTION_TYPES.items()
    ],
    neurodata_type_def="TechniqueVirusInjectionMetaData",
    neurodata_type_inc="LabMetaData",
)

LAB_SPECIFIC_KEY = "Common"
LAB_SPECIFIC_TYPES = {
    "DOI": "text",
    "Title": "text",
    "Abstract": "text",
    "Additional Notes": "text",
    "Data Creator": ("text", (None,)),
    "Publisher": "text",
    "Publication Date": "text",
    "Funding": ("text", (None,)),
    "Data collection date": ("text", (None,)),
    "License": ("text", (None,)),
    "DOI for paper publication": "text",
    "DOI for related work": ("text", (None,)),
    "Journal": "text",
    "Version": "text",
    "DOI for initial version of this dataset": "text",
    "Keywords": ("text", (None,)),
    "Laboratory": "text",
}

lab_specific_ext = NWBGroupSpec(
    doc="Lab specific metadata",
    name="Lab specific metadata",
    datasets=[
        (
            NWBDatasetSpec(doc=k, name=k, dtype=v[0], shape=v[1])
            if isinstance(v, tuple)
            else NWBDatasetSpec(doc=k, name=k, dtype=v)
        )
        for k, v in LAB_SPECIFIC_TYPES.items()
    ],
    groups=[specimen_type_ext, modality_imaging_ext, technique_virus_injection_ext],
    neurodata_type_def="LabSpecificMetaData",
    neurodata_type_inc="LabMetaData",
)

GROUP_SPEC = lab_specific_ext
