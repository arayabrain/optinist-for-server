from pynwb import get_class, load_namespaces
from pynwb.spec import NWBDatasetSpec, NWBGroupSpec

from studio.app.optinist.core.nwb.nwb_loader import export_nwb_namespace_file

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

export_nwb_namespace_file(name, ns_path, ext_source, subject_ext)

load_namespaces(ns_path)

SubjectMouse = get_class("SubjectMouse", name)
