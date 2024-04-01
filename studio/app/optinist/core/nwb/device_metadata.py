from pynwb import get_class, load_namespaces
from pynwb.spec import NWBDatasetSpec, NWBGroupSpec, NWBNamespaceBuilder

name = "device_metadata"
ns_path = f"{name}.namespace.yaml"
ext_source = f"{name}.extensions.yaml"

IMAGE_TYPES = {
    "Name": "text",
    "AcquisitionDate": "text",
    "ImagingRate": "numeric",
}

img_ext = NWBGroupSpec(
    doc="Imaging metadata",
    name="Image",
    datasets=[
        NWBDatasetSpec(doc=k, name=k, dtype=v, quantity="?")
        for k, v in IMAGE_TYPES.items()
    ],
    neurodata_type_def="ImagingMetaData",
    neurodata_type_inc="NWBContainer",
    quantity="?",
)

PIXEL_TYPES = {
    "SizeC": "numeric",
    "SizeT": "numeric",
    "SizeX": "numeric",
    "SizeY": "numeric",
    "SizeZ": "numeric",
    "SignificantBits": "numeric",
    "Type": "text",
}

pixels_ext = NWBGroupSpec(
    doc="Pixels metadata",
    name="Pixels",
    datasets=[
        NWBDatasetSpec(doc=k, name=k, dtype=v, quantity="?")
        for k, v in PIXEL_TYPES.items()
    ],
    neurodata_type_def="PixelsMetaData",
    neurodata_type_inc="NWBContainer",
    quantity="?",
)

objective_ext = NWBGroupSpec(
    doc="Objective metadata",
    name="Objective",
    datasets=[
        NWBDatasetSpec(doc="Model", name="Model", dtype="text", quantity="?"),
    ],
    neurodata_type_def="ObjectiveMetaData",
    neurodata_type_inc="NWBContainer",
    quantity="?",
)

LAB_SPECIFIC_TYPES = {
    # Common
    "uiWidth": "numeric",
    "uiHeight": "numeric",
    "Loops": "numeric",
    "ZSlicenum": "numeric",
    "ZInterval": "numeric",
    "ObjectiveName": "text",
    "Date": "text",
    # ND2 specific
    "uiWidthBytes": "numeric",
    "uiColor": "numeric",
    "uiBpcInMemory": "numeric",
    "uiBpcSignificant": "numeric",
    "uiSequenceCount": "numeric",
    "uiTileWidth": "numeric",
    "uiTileHeight": "numeric",
    "uiCompression": "numeric",
    "uiQuality": "numeric",
    "Type": "text",
    "dTimeStart": "numeric",
    "MicroPerPixel": "numeric",
    "PixelAspect": "numeric",
    "dObjectiveMag": "numeric",
    "dObjectiveNA": "numeric",
    "dZoom": "numeric",
    "wszDescription": "text",
    "wszCapturing": "text",
    # OIR specific
    "nChannel": "numeric",
    "PixelLengthX": "numeric",
    "PixelLengthY": "numeric",
    "TInterval": "numeric",
    "ZStart": "numeric",
    "ZEnd": "numeric",
    "ObjectiveMag": "numeric",
    "ObjectiveNA": "numeric",
    "ReflectiveIndex": "numeric",
    "Immersion": "text",
    "NumberOfGroup": "numeric",
    "NumberOfLevel": "numeric",
    "NumberOfArea": "numeric",
    "ByteDepthCh0": "numeric",
    "SystemName": "text",
    "SystemVersion": "text",
    "DeviceName": "text",
    "UserName": "text",
    "CommentByUser": "text",
}

lab_specific_ext = NWBGroupSpec(
    doc="Lab specific microscope metadata",
    name="LabMicroscopeMetaData",
    datasets=[
        NWBDatasetSpec(doc=k, name=k, dtype=v, quantity="?")
        for k, v in LAB_SPECIFIC_TYPES.items()
    ],
    neurodata_type_def="LabMicroscopeMetaData",
    neurodata_type_inc="NWBContainer",
    quantity="?",
)

device_ext = NWBGroupSpec(
    doc="Device metadata",
    groups=[img_ext, pixels_ext, objective_ext, lab_specific_ext],
    neurodata_type_def="DeviceMetaData",
    neurodata_type_inc="Device",
)

ns_builder = NWBNamespaceBuilder(f"{name} extensions", name, version="0.1.0")
ns_builder.add_spec(ext_source, device_ext)
ns_builder.export(ns_path)
load_namespaces(ns_path)

ImagingMetaData = get_class("ImagingMetaData", name)
PixelsMetaData = get_class("PixelsMetaData", name)
ObjectiveMetaData = get_class("ObjectiveMetaData", name)
LabMicroscopeMetaData = get_class("LabMicroscopeMetaData", name)
DeviceMetaData = get_class("DeviceMetaData", name)
