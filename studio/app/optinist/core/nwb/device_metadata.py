from pynwb import get_class, load_namespaces

from studio.app.optinist.core.nwb.nwb_spec_utils import get_namespace_file_path
from studio.app.optinist.core.nwb.specs.device_metadata_spec import NAME

load_namespaces(get_namespace_file_path(NAME))

ImagingMetaData = get_class("ImagingMetaData", NAME)
PixelsMetaData = get_class("PixelsMetaData", NAME)
ObjectiveMetaData = get_class("ObjectiveMetaData", NAME)
MicroscopeOMEMetaData = get_class("MicroscopeOMEMetaData", NAME)
MicroscopeLabMetaData = get_class("MicroscopeLabMetaData", NAME)
DeviceMetaData = get_class("DeviceMetaData", NAME)
