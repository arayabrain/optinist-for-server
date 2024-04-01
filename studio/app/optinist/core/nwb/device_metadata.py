from pynwb import get_class, load_namespaces
from pynwb.spec import NWBDatasetSpec, NWBGroupSpec, NWBNamespaceBuilder

name = "device_metadata"
ns_path = f"{name}.namespace.yaml"
ext_source = f"{name}.extensions.yaml"

img_ext = NWBGroupSpec(
    doc="Imaging metadata",
    name="Image",
    datasets=[
        NWBDatasetSpec(doc="Name", name="Name", dtype="text", quantity="?"),
        NWBDatasetSpec(
            doc="AcquisitionDate", name="AcquisitionDate", dtype="text", quantity="?"
        ),
        NWBDatasetSpec(
            doc="ImagingRate", name="ImagingRate", dtype="float", quantity="?"
        ),
    ],
    neurodata_type_def="ImagingMetaData",
    neurodata_type_inc="NWBContainer",
    quantity="?",
)
pixels_ext = NWBGroupSpec(
    doc="Pixels metadata",
    name="Pixels",
    datasets=[
        NWBDatasetSpec(doc="SizeC", name="SizeC", dtype="int", quantity="?"),
        NWBDatasetSpec(doc="SizeT", name="SizeT", dtype="int", quantity="?"),
        NWBDatasetSpec(doc="SizeX", name="SizeX", dtype="int", quantity="?"),
        NWBDatasetSpec(doc="SizeY", name="SizeY", dtype="int", quantity="?"),
        NWBDatasetSpec(doc="SizeZ", name="SizeZ", dtype="int", quantity="?"),
        NWBDatasetSpec(
            doc="SignificantBits", name="SignificantBits", dtype="int", quantity="?"
        ),
        NWBDatasetSpec(doc="Type", name="Type", dtype="text", quantity="?"),
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

device_ext = NWBGroupSpec(
    doc="Device metadata",
    groups=[img_ext, pixels_ext, objective_ext],
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
DeviceMetaData = get_class("DeviceMetaData", name)
