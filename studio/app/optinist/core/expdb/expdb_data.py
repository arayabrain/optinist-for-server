import os
from dataclasses import dataclass
from typing import Optional

from studio.app.expdb_dir_path import EXPDB_DIRPATH


@dataclass
class ExpDbPathIds:
    ID_DELIMITER = "_"

    expdb_path: Optional[str] = None
    exp_id: Optional[str] = None
    subject_id: Optional[str] = None
    exp_sub_number: Optional[str] = None

    def __post_init__(self):
        """
        Extract each ID from expdb data_path
        - data_path format
          - {EXPDB_DIRPATH.EXPDB_DIR}/{subject_id}/{exp_id}
        - exp_id format
          - {subject_id}/{exp_sub_number}
        """

        # Parse data_path
        if self.expdb_path:
            data_relative_dir = os.path.relpath(
                self.expdb_path.replace("\\", "/"),
                EXPDB_DIRPATH.EXPDB_DIR.replace("\\", "/"),
            ).replace("\\", "/")
            splitted_ids = data_relative_dir.split("/")

            ids_count = len(splitted_ids)

            if ids_count == 2:
                self.subject_id, self.exp_id = splitted_ids
            elif ids_count == 3:
                self.subject_id, self.exp_id, _ = splitted_ids
            else:
                assert False, (
                    "Invalid expdb path specified: "
                    f"[ids_count: {ids_count}] [path: {data_relative_dir}]"
                )

        # Parse exp_id
        if self.subject_id is None or self.exp_sub_number is None and self.exp_id:
            exp_id_elements = self.exp_id.split(__class__.ID_DELIMITER)
            if len(exp_id_elements) != 2:
                assert False, f"Invalid exp_id format: [exp_id: {self.exp_id}]"

            self.subject_id, self.exp_sub_number = exp_id_elements


class ExpDbPathIdsUtil:
    @staticmethod
    def parse_ids_from_workflow_output_path(output_path: str) -> ExpDbPathIds:
        """
        A utility to extract exp_ids from the output of a workflow
          that uses expdb as input data.

        - Workflow output path example
          - {DIRPATH.OUTPUT_DIR}/1/xxxxxxxx/preprocessing_yyyyyyyyyy/tiff \
            /M000000_ori001_avg_ch1/M000000_ori001_avg_ch1.tif"
        """
        exp_id = ExpDbPathIds.ID_DELIMITER.join(
            os.path.basename(output_path).split(ExpDbPathIds.ID_DELIMITER)[:2]
        )
        return ExpDbPathIds(exp_id=exp_id)
