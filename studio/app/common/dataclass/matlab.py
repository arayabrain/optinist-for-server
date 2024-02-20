import os

import scipy.io as sio

from studio.app.common.dataclass.base import BaseData


class MatlabData(BaseData):
    def __init__(self, data, params, file_name="matlab"):
        super().__init__(file_name)
        self.json_path = None

        if isinstance(data, str):
            self.data = sio.loadmat(data, squeeze_me=True)

            field_name = params.get("fieldName")
            if field_name:
                self.data = self.data.get(field_name)
                assert (
                    self.data is not None
                ), "Expected field name '{}' was not found in {}".format(
                    field_name, os.path.basename(data)
                )
