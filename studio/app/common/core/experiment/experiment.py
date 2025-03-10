import re
from dataclasses import dataclass
from typing import Dict, Optional

from studio.app.common.core.snakemake.smk import SmkParam
from studio.app.common.core.utils.config_handler import ConfigReader
from studio.app.common.core.workflow.workflow import OutputPath
from studio.app.dir_path import CORE_PARAM_PATH, DIRPATH
from studio.app.optinist.schemas.nwb import NWBParams


@dataclass
class ExptFunction:
    unique_id: str
    name: str
    success: str
    hasNWB: bool
    message: Optional[str] = None
    outputPaths: Optional[Dict[str, OutputPath]] = None
    started_at: Optional[str] = None
    finished_at: Optional[str] = None


@dataclass
class ExptConfig:
    workspace_id: str
    unique_id: str
    name: str
    started_at: str
    finished_at: Optional[str]
    success: Optional[str]
    hasNWB: bool
    function: Dict[str, ExptFunction]
    nwb: Optional[NWBParams] = NWBParams(**ConfigReader.read(CORE_PARAM_PATH.nwb.value))
    snakemake: Optional[SmkParam] = SmkParam(
        **ConfigReader.read(CORE_PARAM_PATH.snakemake.value)
    )


@dataclass
class ExptOutputPathIds:
    output_dir: Optional[str] = None
    workspace_id: Optional[str] = None
    unique_id: Optional[str] = None
    function_id: Optional[str] = None

    def __post_init__(self):
        """
        Extract each ID from output_path
        - output_dir format
          - {DIRPATH.OUTPUT_DIR}/{workspace_id}/{unique_id}/{function_id}
        """
        if self.output_dir:
            output_relative_dir = re.sub(f"^{DIRPATH.OUTPUT_DIR}/", "", self.output_dir)
            splitted_ids = output_relative_dir.split("/")
        else:
            splitted_ids = []

        ids_couont = len(splitted_ids)

        if ids_couont == 3:
            self.workspace_id, self.unique_id, self.function_id = splitted_ids
        elif ids_couont == 2:
            self.workspace_id, self.unique_id = splitted_ids
        else:
            assert False, f"Invalid path specified: {self.output_dir}"
