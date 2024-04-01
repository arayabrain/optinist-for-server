import os

from studio.app.common.dataclass.base import BaseData
from studio.app.optinist.microscopes.IsxdReader import IsxdReader
from studio.app.optinist.microscopes.ND2Reader import ND2Reader
from studio.app.optinist.microscopes.OIRReader import OIRReader
from studio.app.optinist.microscopes.ThorlabsReader import ThorlabsReader


class MicroscopeData(BaseData):
    def __init__(self, path: str, file_name="microscope"):
        super().__init__(file_name)
        self.path = path
        self.json_path = None
        self.__reader = None
        self.__data = None

    def initialize(self):
        """
        Since ctypes-using objects cannot be pikle-ized (in this case, reader),
          the initialization process is separated from __init__().
        """
        if self.__reader is not None:
            return self.__reader

        ext = os.path.splitext(self.path)[1]
        if ext == ".nd2":
            reader = ND2Reader()
        elif ext == ".oir":
            assert OIRReader.is_available(), "OIRReader is not available."
            reader = OIRReader()
        elif ext == ".isxd":
            reader = IsxdReader()
        elif ext == ".thor.zip":
            self.path = os.path.dirname(self.path)
            reader = ThorlabsReader()
        else:
            raise Exception(f"Unsupported file type: {ext}")

        reader.load(self.path)
        self.__reader = reader

        return reader

    def load_data(self):
        self.__data = self.__reader.get_image_stacks()
        return self.__data

    def release(self):
        """
        Since ctypes use objects cannot be pikle-ized (in this case, reader),
          an explicit release process is provided.
        """
        self.__reader = None
        self.__data = None

    @property
    def reader(self):
        return self.__reader

    @property
    def data(self):
        return self.__data
