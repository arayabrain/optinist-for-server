from pynwb import get_class, load_namespaces
from pynwb.spec import NWBDatasetSpec, NWBGroupSpec, NWBNamespaceBuilder

name = "behavior_subject"
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
    doc="meta data for subject",
    datasets=[NWBDatasetSpec(doc=k, name=k, dtype=v) for k, v in SUBJECT_TYPES.items()],
    neurodata_type_def="BehaviorSubject",
    neurodata_type_inc="Subject",
)

ns_builder = NWBNamespaceBuilder(f"{name} extensions", name, version="0.1.0")
ns_builder.add_spec(ext_source, subject_ext)
ns_builder.export(ns_path)
load_namespaces(ns_path)

BehaviorSubject = get_class("BehaviorSubject", name)
