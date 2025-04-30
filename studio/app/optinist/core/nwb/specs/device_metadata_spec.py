"""
*If this NWB Spec definition file is updated,
run the generation script (`python export_spec_files.py`)
to regenerate the nwb spec files.
"""

from pynwb.spec import NWBDatasetSpec, NWBGroupSpec

NAME = "device_metadata"

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
    "PhysicalSizeX": "numeric",
    "PhysicalSizeXUnit": "text",
    "PhysicalSizeY": "numeric",
    "PhysicalSizeYUnit": "text",
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

ome_ext = NWBGroupSpec(
    doc="OME metadata",
    name="MicroscopeOMEMetaData",
    groups=[img_ext, pixels_ext, objective_ext],
    neurodata_type_def="MicroscopeOMEMetaData",
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

lab_ext = NWBGroupSpec(
    doc="Lab specific microscope metadata",
    name="MicroscopeLabMetaData",
    datasets=[
        NWBDatasetSpec(doc=k, name=k, dtype=v, quantity="?")
        for k, v in LAB_SPECIFIC_TYPES.items()
    ],
    neurodata_type_def="MicroscopeLabMetaData",
    neurodata_type_inc="NWBContainer",
    quantity="?",
)

device_ext = NWBGroupSpec(
    doc="Device metadata",
    groups=[ome_ext, lab_ext],
    neurodata_type_def="DeviceMetaData",
    neurodata_type_inc="Device",
)

GROUP_SPEC = device_ext
