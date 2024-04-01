from studio.app.common.dataclass.base import BaseData


class MicroscopeData(BaseData):
    def __init__(self, path: str, file_name="microscope"):
        super().__init__(file_name)
        self.path = path
        self.json_path = None
        self.__data = None

    @property
    def data(self):
        return self.__data

    @data.setter
    def data(self, data):
        self.__data = data
