import numpy as np
import pandas as pd

from studio.app.common.core.utils.filepath_creater import join_filepath
from studio.app.common.core.utils.json_writer import JsonWriter
from studio.app.common.core.workflow.workflow import OutputPath, OutputType
from studio.app.common.dataclass.base import BaseData


class PieData(BaseData):
    def __init__(self, data, labels: list, file_name="pie"):
        super().__init__(file_name)

        if type(data) == list:
            data = np.array(data)
        assert type(data) == np.ndarray, "Pie Type Error"
        assert data.ndim == 1, "Pie Dimension Error"
        assert data.shape[0] == len(
            labels
        ), f"labels length is not same as data shape {data.shape}"
        self.data = pd.DataFrame(data=data.reshape(1, -1), columns=labels)

    def save_json(self, json_dir):
        self.json_path = join_filepath([json_dir, f"{self.file_name}.json"])
        JsonWriter.write_as_split(self.json_path, self.data)

    @property
    def output_path(self) -> OutputPath:
        return OutputPath(path=self.json_path, type=OutputType.PIE)