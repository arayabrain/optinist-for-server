from studio.app.common.dataclass import MatlabData
from studio.app.const import TC_FIELDNAME


class TcData(MatlabData):
    def __init__(self, data, params={}, file_name="tc"):
        params = {"fieldName": TC_FIELDNAME, **params}

        super().__init__(data, params, file_name=file_name)

        assert self.data.ndim == 2, "TC Dimension Error"

        self.tc_length, self.n_cells = self.data.shape
