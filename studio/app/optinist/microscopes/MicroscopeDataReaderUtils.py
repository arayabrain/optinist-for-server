import os

from studio.app.optinist.microscopes.IsxdReader import IsxdReader
from studio.app.optinist.microscopes.ND2Reader import ND2Reader
from studio.app.optinist.microscopes.OIRReader import OIRReader
from studio.app.optinist.microscopes.ThorlabsReader import ThorlabsReader


class MicroscopeDataReaderUtils:
    """Microscope data reader utilities class"""

    @staticmethod
    def get_reader(data_file_path: str):
        """
        Automatic generation of Reader from file type information
        """
        ext = os.path.splitext(data_file_path)[1]

        if ext == ".nd2":
            assert ND2Reader.is_available(), "ND2Reader is not available."
            reader = ND2Reader()
        elif ext == ".oir":
            assert OIRReader.is_available(), "OIRReader is not available."
            reader = OIRReader()
        elif ext == ".isxd":
            assert IsxdReader.is_available(), "IsxdReader is not available."
            reader = IsxdReader()
        elif ext == ".thor.zip":
            assert ThorlabsReader.is_available(), "ThorlabsReader is not available."
            reader = ThorlabsReader()
        else:
            raise Exception(f"Unsupported file type: {ext}")

        reader.load(data_file_path)

        return reader
