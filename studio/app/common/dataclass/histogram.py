import numpy as np
import pandas as pd

from studio.app.common.core.utils.filepath_creater import join_filepath
from studio.app.common.core.utils.json_writer import JsonWriter
from studio.app.common.core.workflow.workflow import OutputPath, OutputType
from studio.app.common.dataclass.base import BaseData


class HistogramData(BaseData):
    def __init__(self, data, file_name="histogram"):
        super().__init__(file_name)

        if type(data) == list:
            data = np.array(data)
        assert type(data) == np.ndarray, "Histogram Type Error"
        assert data.ndim == 1, "Histogram Dimension Error"
        self.data = pd.DataFrame(data.reshape(1, -1))

    def save_json(self, json_dir):
        self.json_path = join_filepath([json_dir, f"{self.file_name}.json"])
        JsonWriter.write_as_split(self.json_path, self.data)

    @property
    def output_path(self) -> OutputPath:
        return OutputPath(path=self.json_path, type=OutputType.HISTOGRAM)
