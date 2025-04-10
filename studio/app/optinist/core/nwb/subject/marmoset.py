from pynwb import get_class, load_namespaces
from pynwb.spec import NWBDatasetSpec, NWBGroupSpec

from studio.app.optinist.core.nwb.nwb_loader import export_nwb_namespace_file

name = "subject_marmoset"
ns_path = f"{name}.namespace.yaml"
ext_source = f"{name}.extensions.yaml"

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

export_nwb_namespace_file(name, ns_path, ext_source, subject_ext)

load_namespaces(ns_path)

SubjectMarmoset = get_class("SubjectMarmoset", name)
