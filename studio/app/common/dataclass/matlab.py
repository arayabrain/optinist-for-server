import scipy.io as sio

from studio.app.common.dataclass.base import BaseData


class MatlabData(BaseData):
    def __init__(self, data, params, file_name="matlab"):
        super().__init__(file_name)
        self.json_path = None

        if isinstance(data, str):
            self.data = sio.loadmat(data)

            if params.get("fieldName"):
                self.data = self.data[params["fieldName"]]

            if params.get("index"):
                fieldIndex = params["index"]
                assert isinstance(fieldIndex, list), "index must be list"
                self.data = self.data[tuple(fieldIndex)]
