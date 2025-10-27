import ctypes
import json
import os
import platform
import re
import shutil
from enum import Enum, IntEnum

import numpy as np
import requests

from studio.app.dir_path import DIRPATH
from studio.app.optinist.microscopes.MicroscopeDataReaderBase import (
    MicroscopeDataReaderBase,
    OMEDataModel,
)

# Import nd2 package for macOS support
try:
    import nd2

    ND2_PACKAGE_AVAILABLE = True
except ImportError:
    ND2_PACKAGE_AVAILABLE = False


class LimCode(IntEnum):
    LIM_OK = 0
    LIM_ERR_UNEXPECTED = -1


class ExperimentLoopType(Enum):
    Unknown = "Unknown"
    TimeLoop = "TimeLoop"
    XYPosLoop = "XYPosLoop"
    ZStackLoop = "ZStackLoop"
    NETimeLoop = "NETimeLoop"


class DimensionType(Enum):
    D_2D_SINGLE = "2Ds"
    D_2D_MULTI = "2Dm"
    D_3D_SINGLE = "3Ds"
    D_3D_MULTI = "3Dm"


class LIMPICTURE(ctypes.Structure):
    _fields_ = [
        ("uiWidth", ctypes.c_uint),
        ("uiHeight", ctypes.c_uint),
        ("uiBitsPerComp", ctypes.c_uint),
        ("uiComponents", ctypes.c_uint),
        ("uiWidthBytes", ctypes.c_size_t),
        ("uiSize", ctypes.c_size_t),
        ("pImageData", ctypes.c_void_p),
    ]


class ND2Reader(MicroscopeDataReaderBase):
    """Nikon ND2 data reader

    Supports two backends:
    - SDK-based: Uses Nikon SDK (Windows/Linux only)
    - nd2 package: Uses nd2 Python package (all platforms, including macOS)
    """

    SDK_LIBRARY_FILES = {
        "Windows": {
            "main": "/nikon/windows/nd2readsdk-shared.dll",
        },
        "Linux": {
            "main": "/nikon/linux/libnd2readsdk-shared.so",
            "dependencies": ("libjpeg.so.8", "libtiff.so.5"),
        },
    }

    def __init__(self):
        """Initialize ND2Reader with appropriate backend"""
        # Determine which backend to use
        is_darwin = platform.system() == "Darwin"
        self._use_nd2_package = is_darwin or not self._has_sdk_support()

        if self._use_nd2_package and not ND2_PACKAGE_AVAILABLE:
            raise ImportError(
                "nd2 package is required for macOS or when SDK is not "
                "available. Install it with: pip install nd2"
            )

        super().__init__()

    def _has_sdk_support(self):
        """Check if current platform has SDK support"""
        return platform.system() in self.SDK_LIBRARY_FILES

    @staticmethod
    def unpack_libs():
        """Unpack library files"""
        if not os.path.isdir(DIRPATH.MICROSCOPE_LIB_DIR):
            if not os.path.exists(DIRPATH.MICROSCOPE_LIB_ZIP):
                response = requests.get(
                    "https://github.com/oist/optinist/raw/v1.2.1/studio/app/optinist/microscopes/libs.zip"  # noqa: E501
                )
                with open(DIRPATH.MICROSCOPE_LIB_ZIP, "wb") as f:
                    f.write(response.content)
            shutil.unpack_archive(
                DIRPATH.MICROSCOPE_LIB_ZIP, DIRPATH.MICROSCOPE_LIB_DIR
            )

    @staticmethod
    def get_library_path() -> str:
        """Returns the path of the library (dll) file"""
        platform_name = platform.system()

        if not os.path.isdir(DIRPATH.MICROSCOPE_LIB_DIR):
            return None

        if platform_name not in __class__.SDK_LIBRARY_FILES:
            return None

        return (
            DIRPATH.MICROSCOPE_LIB_DIR
            + __class__.SDK_LIBRARY_FILES[platform_name]["main"]
        )

    @staticmethod
    def is_available() -> bool:
        """Determine if library is available"""
        # On macOS (or when SDK is not available), check for nd2 package
        if platform.system() == "Darwin":
            return ND2_PACKAGE_AVAILABLE

        # On Windows/Linux, check for SDK library
        __class__.unpack_libs()
        library_path = __class__.get_library_path()
        sdk_available = os.path.isfile(library_path) if library_path else False

        # Return True if either SDK is available or nd2 package is available
        return sdk_available or ND2_PACKAGE_AVAILABLE

    def _init_library(self):
        """Initialize the appropriate backend (SDK or nd2 package)"""
        if self._use_nd2_package:
            # nd2 package doesn't require initialization
            self.__nd2_file = None
        else:
            # load sdk libraries (dependencies)
            __class__.unpack_libs()

            if "dependencies" in __class__.SDK_LIBRARY_FILES[platform.system()]:
                platform_library_dir = os.path.dirname(__class__.get_library_path())
                dependencies = __class__.SDK_LIBRARY_FILES[platform.system()][
                    "dependencies"
                ]

                for dependency in dependencies:
                    dependency_path = f"{platform_library_dir}/{dependency}"
                    ctypes.cdll.LoadLibrary(dependency_path)

            # load sdk library
            self.__dll = ctypes.cdll.LoadLibrary(__class__.get_library_path())

            # define ctypes interfaces
            self.__dll.Lim_FileOpenForReadUtf8.argtypes = (ctypes.c_char_p,)
            self.__dll.Lim_FileOpenForReadUtf8.restype = ctypes.c_void_p
            self.__dll.Lim_FileGetMetadata.argtypes = (ctypes.c_void_p,)
            self.__dll.Lim_FileGetMetadata.restype = ctypes.c_char_p
            self.__dll.Lim_FileGetAttributes.argtypes = (ctypes.c_void_p,)
            self.__dll.Lim_FileGetAttributes.restype = ctypes.c_char_p
            self.__dll.Lim_FileGetTextinfo.argtypes = (ctypes.c_void_p,)
            self.__dll.Lim_FileGetTextinfo.restype = ctypes.c_char_p
            self.__dll.Lim_FileGetExperiment.argtypes = (ctypes.c_void_p,)
            self.__dll.Lim_FileGetExperiment.restype = ctypes.c_char_p
            self.__dll.Lim_FileGetFrameMetadata.argtypes = (
                ctypes.c_void_p,
                ctypes.c_uint,
            )
            self.__dll.Lim_FileGetFrameMetadata.restype = ctypes.c_char_p
            self.__dll.Lim_FileGetSeqCount.argtypes = (ctypes.c_void_p,)
            self.__dll.Lim_FileGetSeqCount.restype = ctypes.c_uint
            self.__dll.Lim_FileGetCoordSize.argtypes = (ctypes.c_void_p,)
            self.__dll.Lim_FileGetCoordSize.restype = ctypes.c_size_t
            self.__dll.Lim_FileGetCoordsFromSeqIndex.argtypes = (
                ctypes.c_void_p,
                ctypes.c_uint,
            )
            self.__dll.Lim_FileGetCoordsFromSeqIndex.restype = ctypes.c_size_t
            self.__dll.Lim_FileGetImageData.argtypes = (
                ctypes.c_void_p,
                ctypes.c_uint,
                ctypes.c_void_p,
            )
            self.__dll.Lim_FileGetImageData.restype = ctypes.c_int

            self.__dll.Lim_FileClose.argtypes = (ctypes.c_void_p,)

    def _load_file(self, data_file_path: str) -> object:
        if self._use_nd2_package:
            # Use nd2 package
            self.__nd2_file = nd2.ND2File(data_file_path)
            return (self.__nd2_file,)
        else:
            # Use SDK
            handle = self.__dll.Lim_FileOpenForReadUtf8(data_file_path.encode("utf-8"))

            if handle is None:
                raise FileNotFoundError(f"Open Error: {data_file_path}")

            return (handle,)

    def _build_original_metadata_from_nd2(self, data_name: str, nd2_file) -> dict:
        """Build original metadata using nd2 package"""
        # Extract metadata from nd2 file
        meta = nd2_file.metadata

        # Build attributes dict compatible with SDK format
        attributes = {
            "widthPx": nd2_file.attributes.widthPx,
            "heightPx": nd2_file.attributes.heightPx,
            "widthBytes": nd2_file.attributes.widthBytes,
            "componentCount": nd2_file.attributes.componentCount,
            "bitsPerComponentInMemory": (nd2_file.attributes.bitsPerComponentInMemory),
            "bitsPerComponentSignificant": (
                nd2_file.attributes.bitsPerComponentSignificant
            ),
            "sequenceCount": nd2_file.attributes.sequenceCount,
        }

        # Build metadata dict compatible with SDK format
        channels_metadata = []
        for channel in meta.channels:
            volume_axes_calibrated = list(channel.volume.axesCalibrated[:2])
            volume_axes_calibration = list(channel.volume.axesCalibration[:2])

            channel_meta = {
                "volume": {
                    "axesCalibrated": volume_axes_calibrated,
                    "axesCalibration": volume_axes_calibration,
                },
                "microscope": {
                    "objectiveName": channel.microscope.objectiveName,
                    "objectiveMagnification": (
                        channel.microscope.objectiveMagnification
                    ),
                    "objectiveNumericalAperture": (
                        channel.microscope.objectiveNumericalAperture
                    ),
                    "zoomMagnification": (channel.microscope.zoomMagnification),
                },
            }
            channels_metadata.append(channel_meta)

        metadata = {"channels": channels_metadata}

        # Text info from nd2 file
        text_info = nd2_file.text_info if hasattr(nd2_file, "text_info") else {}
        textinfo = {
            "description": text_info.get("description", ""),
            "capturing": text_info.get("capturing", ""),
            "date": text_info.get("date", ""),
        }

        # Experiments (loop structure)
        experiments = None
        if nd2_file.experiment:
            exp_list = []
            for exp in nd2_file.experiment:
                exp_dict = {"type": exp.type, "count": exp.count, "parameters": {}}
                # Handle NETimeLoop parameters
                has_params = hasattr(exp, "parameters")
                has_periods = has_params and hasattr(exp.parameters, "periods")
                if has_periods:
                    periods = exp.parameters.periods
                    if periods and len(periods) > 0:
                        period = periods[0]
                        period_diff_avg = (
                            period.periodDiff.avg
                            if hasattr(period, "periodDiff")
                            else 0
                        )
                        exp_dict["parameters"]["periodDiff"] = {"avg": period_diff_avg}
                        exp_dict["parameters"]["periods"] = [
                            {
                                "periodDiff": {
                                    "avg": (
                                        p.periodDiff.avg
                                        if hasattr(p, "periodDiff")
                                        else 0
                                    )
                                }
                            }
                            for p in exp.parameters.periods
                        ]
                elif exp.type == "ZStackLoop" and has_params:
                    # Handle Z-stack parameters if needed
                    if hasattr(exp.parameters, "stepUm"):
                        exp_dict["parameters"]["stepUm"] = exp.parameters.stepUm

                exp_list.append(exp_dict)
            experiments = exp_list

        # Frame metadata (use first frame)
        frame_metadata_single = {"time": {"absoluteJulianDayNumber": 0}}
        try:
            frame_meta = nd2_file.frame_metadata(0)
            has_channels = (
                frame_meta and frame_meta.channels and len(frame_meta.channels) > 0
            )
            if has_channels:
                frame_metadata_single["time"][
                    "absoluteJulianDayNumber"
                ] = frame_meta.channels[0].time.absoluteJulianDayNumber
        except Exception:
            pass  # Use default value if frame metadata unavailable

        original_metadata = {
            "data_name": data_name,
            "attributes": attributes,
            "metadata": metadata,
            "textinfo": textinfo,
            "experiments": experiments,
            "frame_metadata": frame_metadata_single,
        }

        return original_metadata

    def _build_original_metadata(self, data_name: str) -> dict:
        if self._use_nd2_package:
            (nd2_file,) = self.resource_handles
            return self._build_original_metadata_from_nd2(data_name, nd2_file)
        else:
            (handle,) = self.resource_handles

            attributes = self.__dll.Lim_FileGetAttributes(handle)
            metadata = self.__dll.Lim_FileGetMetadata(handle)
            textinfo = self.__dll.Lim_FileGetTextinfo(handle)
            experiments = self.__dll.Lim_FileGetExperiment(handle)
            frame_metadata = self.__dll.Lim_FileGetFrameMetadata(
                handle, 0
            )  # get 1st frame info

            attributes = json.loads(attributes)
            metadata = json.loads(metadata)
            textinfo = json.loads(textinfo) if textinfo is not None else {}
            experiments = json.loads(experiments) if experiments is not None else None
            frame_metadata = json.loads(frame_metadata)

            # frame_metadata は、必要な項目のみに絞る
            frame_metadata_single = frame_metadata["channels"][0]

            original_metadata = {
                "data_name": data_name,
                "attributes": attributes,
                "metadata": metadata,
                "textinfo": textinfo,
                "experiments": experiments,
                "frame_metadata": frame_metadata_single,
            }

            return original_metadata

    def _build_ome_metadata(self, original_metadata: dict) -> OMEDataModel:
        """
        @link OME/NativeND2Reader
        """

        attributes = original_metadata["attributes"]
        metadata = original_metadata["metadata"]
        textinfo = original_metadata["textinfo"]
        experiments = original_metadata["experiments"]
        first_experiment_params = experiments[0]["parameters"] if experiments else {}
        metadata_ch0_volume = metadata["channels"][0]["volume"]
        metadata_ch0_microscope = (
            metadata["channels"][0]["microscope"] if experiments else {}
        )

        size_x = attributes["widthPx"]
        size_y = attributes["heightPx"]

        # get image physical size by from "axesCalibration"
        axesCalibrated = metadata_ch0_volume["axesCalibrated"]
        if axesCalibrated[0] and axesCalibrated[1]:
            axesCalibration = metadata_ch0_volume["axesCalibration"]
            physical_sizex = axesCalibration[0]
            physical_sizey = axesCalibration[1]
        else:
            physical_sizex = None
            physical_sizey = None

        # experiment, periods, の参照は先頭データの内容から取得
        if "periods" in first_experiment_params:
            interval = first_experiment_params["periods"][0]["periodDiff"]["avg"]
        elif "periodDiff" in first_experiment_params:
            interval = first_experiment_params["periodDiff"]["avg"]
        else:
            interval = 0

        imaging_rate = round(1000 / interval, 2) if interval > 0 else 0

        omeData = OMEDataModel(
            image_name=original_metadata["data_name"],
            size_x=size_x,
            size_y=size_y,
            size_t=0,  # size_t は後続処理で計算・設定する
            size_z=0,  # size_z は後続処理で計算・設定する
            size_c=len(metadata["channels"]),
            physical_sizex=physical_sizex,
            physical_sizey=physical_sizey,
            depth=attributes["bitsPerComponentInMemory"],
            significant_bits=attributes["bitsPerComponentSignificant"],
            acquisition_date=re.sub(" +", " ", textinfo.get("date", "")),
            objective_model=metadata_ch0_microscope.get("objectiveName", None),
            imaging_rate=imaging_rate,
        )

        return omeData

    def _build_lab_specific_metadata(self, original_metadata: dict) -> dict:
        """Build metadata in lab-specific format"""

        attributes = original_metadata["attributes"]
        metadata = original_metadata["metadata"]
        textinfo = original_metadata["textinfo"]
        experiments = original_metadata["experiments"]
        frame_metadata = original_metadata["frame_metadata"]

        # ----------------------------------------
        # データの次元タイプ別でのパラメータ構築
        # ----------------------------------------

        experiments_count = len(experiments) if experiments is not None else 0
        dimension_type = None
        loop_count = 0
        z_slicenum = 0
        z_interval = 0

        if experiments_count == 0:
            dimension_type = DimensionType.D_2D_SINGLE.value
        elif experiments_count == 2:
            dimension_type = DimensionType.D_3D_MULTI.value
            loop_count = experiments[0]["count"]
            z_slicenum = experiments[1]["count"]
            z_interval = experiments[1]["parameters"]["stepUm"]
        else:
            if experiments[0]["type"] == ExperimentLoopType.NETimeLoop.value:
                dimension_type = DimensionType.D_2D_MULTI.value
                loop_count = experiments[0]["count"]
            elif experiments[0]["type"] == ExperimentLoopType.ZStackLoop.value:
                dimension_type = DimensionType.D_3D_SINGLE.value
                z_slicenum = experiments[0]["count"]
                z_interval = experiments[0]["parameters"]["stepUm"]

        # ※ome_metadata の一部項目をアップデート
        self.ome_metadata.size_t = loop_count
        self.ome_metadata.size_z = z_slicenum

        # ----------------------------------------
        # Lab固有metadata変数構築
        # ----------------------------------------

        # ※一部のデータ項目は ch0 より取得
        metadata_ch0_microscope = metadata["channels"][0]["microscope"]
        metadata_ch0_volume = metadata["channels"][0]["volume"]
        axes_calibration_x = metadata_ch0_volume["axesCalibration"][0]
        axes_calibration_y = metadata_ch0_volume["axesCalibration"][1]

        lab_specific_metadata = {
            # /* 11 cinoibebts (From Lab MEX) */
            "uiWidth": attributes["widthPx"],
            "uiHeight": attributes["heightPx"],
            "uiWidthBytes": attributes["widthBytes"],
            "uiColor": attributes["componentCount"],
            "uiBpcInMemory": attributes["bitsPerComponentInMemory"],
            "uiBpcSignificant": attributes["bitsPerComponentSignificant"],
            "uiSequenceCount": attributes["sequenceCount"],
            # Note: There are minor differences in values between SDK versions.
            # (uiTileWidth)
            "uiTileWidth": attributes.get("tileWidthPx", None),  # Optional
            # Note: There are minor differences in values between SDK versions.
            # (uiTileHeight)
            "uiTileHeight": attributes.get("tileHeightPx", None),  # Optional
            # Note: There are minor differences in values between SDK versions.
            # (uiCompression)
            "uiCompression": attributes.get("compressionType", None),  # Optional
            # Note: There are minor differences in values between SDK versions.
            # (uiQuality)
            "uiQuality": attributes.get("compressionLevel", None),  # Optional
            # /* 4 components (From Lab MEX) */
            "Type": dimension_type,
            "Loops": loop_count,
            "ZSlicenum": z_slicenum,
            "ZInterval": z_interval,
            # /* 7 components (From Lab MEX) */
            "dTimeStart": frame_metadata["time"]["absoluteJulianDayNumber"],
            # Note: There are minor differences in values between SDK versions.
            # (MicroPerPixel)
            "MicroPerPixel": axes_calibration_x,
            "PixelAspect": axes_calibration_x / axes_calibration_y,
            "ObjectiveName": metadata_ch0_microscope.get(
                "objectiveName", None
            ),  # Optional, channels[0] からの取得
            # Note: There are minor differences in values between SDK versions.
            # (dObjectiveMag)
            "dObjectiveMag": metadata_ch0_microscope.get(
                "objectiveMagnification", None
            ),  # Optional, channels[0] からの取得
            "dObjectiveNA": metadata_ch0_microscope.get(
                "objectiveNumericalAperture", None
            ),  # Optional, channels[0] からの取得
            "dZoom": metadata_ch0_microscope.get(
                "zoomMagnification", None
            ),  # Optional, channels[0] からの取得
            # /* 3 components (From Lab MEX) */
            # Note: All elements of textinfo are optional.
            "wszDescription": textinfo.get("description", None),
            "wszCapturing": textinfo.get("capturing", None),
            "Date": textinfo.get("date", None),
        }

        return lab_specific_metadata

    def _release_resources(self) -> None:
        if self._use_nd2_package:
            if self.__nd2_file is not None:
                self.__nd2_file.close()
                self.__nd2_file = None
        else:
            (handle,) = self.resource_handles
            self.__dll.Lim_FileClose(handle)

    def _get_image_stacks_from_nd2(self, nd2_file) -> np.ndarray:
        """Return microscope image stacks using nd2 package

        Returns array in same format as SDK: (C, T, Y, X) or (C, T, Z, Y, X)
        """
        # Read the full array from nd2 file
        data = nd2_file.asarray()

        # Expected: (T, Y, X) for single channel 2D time series
        # Add channel dimension to match SDK format: (C, T, Y, X)
        if data.ndim == 3:
            result = data[np.newaxis, :, :, :]
        else:
            raise NotImplementedError(
                f"nd2 package backend only supports single-channel 2D time series. "
                f"Got data shape: {data.shape}. For multi-channel or Z-stack data, "
                f"use Windows/Linux with SDK backend."
            )

        # Apply same reshape logic as SDK for 4D data
        # If both Z and T dimensions exist, reshape to (C, T, Z, Y, X)
        if self.ome_metadata.size_z > 1 and self.ome_metadata.size_t > 1:
            result = result.reshape(
                self.ome_metadata.size_c,
                self.ome_metadata.size_t,
                self.ome_metadata.size_z,
                self.ome_metadata.size_y,
                self.ome_metadata.size_x,
            )

        return result

    def _get_image_stacks(self) -> list:
        """Return microscope image stacks"""

        if self._use_nd2_package:
            (nd2_file,) = self.resource_handles
            return self._get_image_stacks_from_nd2(nd2_file)

        (handle,) = self.resource_handles

        # initialization
        pic: LIMPICTURE = LIMPICTURE()
        seq_count = self.__dll.Lim_FileGetSeqCount(handle)

        # read image attributes
        attributes = self.__dll.Lim_FileGetAttributes(handle)
        attributes = json.loads(attributes)
        image_width = attributes["widthPx"]
        image_height = attributes["heightPx"]

        # Get the number of components in image
        # *In ND2, the number of components is almost the same
        #  as the number of channels.
        image_component_count = int(attributes["componentCount"])

        # allocate return value buffer (all channel's stack)
        # Note: For speed, the image processing results in the following sections
        #       will be set directly to this variable (numpy.ndarray).
        result_channels_stacks = np.empty(
            [image_component_count, seq_count, image_height, image_width],
            dtype=self.ome_metadata.pixel_np_dtype,
        )

        # loop for each sequence
        for seq_idx in range(seq_count):
            # read image attributes
            if LimCode.LIM_OK != self.__dll.Lim_FileGetImageData(
                handle, seq_idx, ctypes.byref(pic)
            ):
                break

            # calculate pixel byte size
            # Note: pixcel_bytes is assumed to be [1/2/4/6/8]
            pixcel_bytes = int(pic.uiComponents * int((pic.uiBitsPerComp + 7) / 8))
            if pixcel_bytes not in (1, 2, 4, 6, 8):
                raise AttributeError(f"Invalid pixcel_bytes: {pixcel_bytes}")

            # # debug print
            # print(
            #     f"Picture info: #{seq_idx + 1}",
            #     pic.uiWidth, pic.uiHeight, bytes, pic.uiComponents,
            #     pic.uiBitsPerComp, pixcel_bytes,
            # )

            # Calculate the number of bytes per line (ctypes._CData format)
            # * Probably the same value as pic.uiWidthBytes,
            #     but ported based on the logic of the SDK sample code.
            line_bytes = int(pixcel_bytes * pic.uiWidth / 2)
            line_ctypes_bytes = self.ome_metadata.pixel_ct_type * line_bytes

            # allocate image plane buffer
            single_plane_buffer = np.empty(
                [image_height, image_width, image_component_count],
                dtype=self.ome_metadata.pixel_np_dtype,
            )

            # scan image lines
            for line_idx in range(pic.uiHeight):
                # Data acquisition for line and conversion to np.ndarray format
                line_buffer = line_ctypes_bytes.from_address(
                    pic.pImageData + (line_idx * pic.uiWidthBytes)
                )
                line_buffer_array = np.ctypeslib.as_array(line_buffer)

                # mapping to plane buffer
                single_plane_buffer[line_idx] = line_buffer_array.reshape(
                    image_width, image_component_count
                )

            # extract image data for each channel(component)
            for component_idx in range(pic.uiComponents):
                channel_idx = component_idx

                # A frame image is cut out from a raw frame image
                #     in units of channel(component).
                # Note: The pixel values of each component are adjacent to each other,
                #     one pixel at a time.
                #   Image: [px1: [c1][c2]..[cN]]..[pxN: [c1][c2]..[cN]]
                channel_plane_buffer = single_plane_buffer[:, :, component_idx]

                # construct return value (each channel's stack)
                result_channels_stacks[channel_idx, seq_idx] = channel_plane_buffer

        # reshape operation.
        # Note: For 4D data(XYZT), reshape 3D format(XY(Z|T)) to 4D format(XYZT)
        if self.ome_metadata.size_z > 1 and self.ome_metadata.size_t > 1:
            raw_result_channels_stacks = result_channels_stacks
            result_channels_stacks = raw_result_channels_stacks.reshape(
                self.ome_metadata.size_c,
                self.ome_metadata.size_t,
                self.ome_metadata.size_z,
                self.ome_metadata.size_y,
                self.ome_metadata.size_x,
            )

        return result_channels_stacks
