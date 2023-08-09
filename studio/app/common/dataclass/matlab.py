import scipy.io as sio

from studio.app.common.dataclass.base import BaseData


class MatlabData(BaseData):
    def __init__(self, data, params, file_name="matlab"):
        super().__init__(file_name)
        self.json_path = None

        if isinstance(data, str):
            self.data = sio.loadmat(data, squeeze_me=True)

            if params.get("fieldName"):
                self.data = self.data[params["fieldName"]]
