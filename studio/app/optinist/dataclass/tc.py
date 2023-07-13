from studio.app.common.dataclass import MatlabData


class TcData(MatlabData):
    def __init__(self, data, params, file_name="tc"):
        params = {"fieldName": "AY", **params}

        super().__init__(data, params, file_name=file_name)

        assert self.data.ndim == 2, "TC Dimension Error"

        self.tc_length, self.n_cells = self.data.shape
