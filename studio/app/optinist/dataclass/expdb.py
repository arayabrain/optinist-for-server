from studio.app.common.dataclass.base import BaseData
from studio.app.const import TC_SUFFIX, TS_SUFFIX
from studio.app.optinist.dataclass.tc import TcData
from studio.app.optinist.dataclass.ts import TsData


class ExpDbData(BaseData):
    def __init__(self, paths, params={}, file_name="expdb"):
        super().__init__(file_name)
        assert (
            isinstance(paths, list) and len(paths) == 2
        ), "ExpDb Data requires tc and ts paths"

        self.tc = None
        self.ts = None

        for path in paths:
            assert isinstance(path, str), "path should be str"
            if path.endswith(f"{TC_SUFFIX}.mat"):
                self.tc = TcData(path)
            elif path.endswith(f"{TS_SUFFIX}.mat"):
                self.ts = TsData(path)
        assert self.tc is not None and self.ts is not None, "tc and ts should be given"
