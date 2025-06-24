"""
*If this NWB Spec definition file is updated,
run the generation script (`python export_spec_files.py`)
to regenerate the nwb spec files.
"""

from pynwb.spec import NWBDatasetSpec, NWBGroupSpec

NAME = "subject_marmoset"

# define subject metadata name and type
SUBJECT_TYPES = {
    "Scientific name": "text",
    "Genetic Background": "text",
    "Stage": "text",
    "Family": "text",
    "RIKEN ID": "text",
}

subject_ext = NWBGroupSpec(
    name="Species Marmoset",
    doc="meta data for marmoset subject",
    datasets=[NWBDatasetSpec(doc=k, name=k, dtype=v) for k, v in SUBJECT_TYPES.items()],
    neurodata_type_def="SubjectMarmoset",
    neurodata_type_inc="Subject",
)

GROUP_SPEC = subject_ext
