from pynwb import get_class, load_namespaces
from pynwb.spec import NWBDatasetSpec, NWBGroupSpec, NWBNamespaceBuilder

name = "subject_mouse"
ns_path = f"{name}.namespace.yaml"
ext_source = f"{name}.extensions.yaml"

# define subject metadata name and type
SUBJECT_TYPES = {
    "Scientific name": "text",
    "Genetic Background": "text",
    "Stage": "text",
    "Vendor": "text",
}

subject_ext = NWBGroupSpec(
    name="Species Mouse",
    doc="meta data for mouse subject",
    datasets=[NWBDatasetSpec(doc=k, name=k, dtype=v) for k, v in SUBJECT_TYPES.items()],
    neurodata_type_def="SubjectMouse",
    neurodata_type_inc="Subject",
)

ns_builder = NWBNamespaceBuilder(f"{name} extensions", name, version="0.1.0")
ns_builder.add_spec(ext_source, subject_ext)
ns_builder.export(ns_path)
load_namespaces(ns_path)

SubjectMouse = get_class("SubjectMouse", name)
