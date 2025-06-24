from pynwb import get_class, load_namespaces

from studio.app.optinist.core.nwb.nwb_spec_utils import get_namespace_file_path
from studio.app.optinist.core.nwb.specs.lab_metadata_spec import NAME

load_namespaces(get_namespace_file_path(NAME))

SpecimenTypeMetaData = get_class("SpecimenTypeMetaData", NAME)
ModalityImagingMetaData = get_class("ModalityImagingMetaData", NAME)
TechniqueVirusInjectionMetaData = get_class("TechniqueVirusInjectionMetaData", NAME)
LabSpecificMetaData = get_class("LabSpecificMetaData", NAME)
