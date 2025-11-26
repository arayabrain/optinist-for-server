import json
import os
from typing import Tuple

from studio.app.optinist.core.nwb.specs.lab_metadata_spec import (
    MODALITY_IMAGING_KEY,
    SPECIMEN_KEY,
)


class ExppDbMetadataReader:
    """
    Reader class of expdb metadata
    """

    @staticmethod
    def load_exp_metadata(metadata_path: str) -> Tuple[dict, dict]:
        if not os.path.exists(metadata_path):
            return (None, None)
        else:
            with open(metadata_path) as f:
                attributes = json.load(f)
                view_attributes = (
                    ExppDbMetadataReader.extract_experiment_view_attributes(attributes)
                )

                if not view_attributes:
                    raise KeyError("Invalid metadata format")

        return (attributes, view_attributes)

    @staticmethod
    def extract_experiment_view_attributes(attributes: dict) -> dict:
        try:
            attributes_metadata_attr = attributes["metadata"]["metadata"]
            modality_imaging = attributes_metadata_attr[MODALITY_IMAGING_KEY]

            specimen_type_brain_region = attributes_metadata_attr[SPECIMEN_KEY]
            if "Brain region Marmoset" in specimen_type_brain_region:
                brain_region = specimen_type_brain_region["Brain region Marmoset"]
            elif "Brain region Mouse" in specimen_type_brain_region:
                brain_region = specimen_type_brain_region["Brain region Mouse"]
            else:
                raise KeyError()

            view_attributes = {
                "brain_area": brain_region[-1]["label"],
                "imaging_depth": modality_imaging["Ca Imaging>Depth"],
                "promoter": modality_imaging["Ca Imaging>Promoter"],
                "indicator": modality_imaging["Ca Imaging>Indicator"],
            }

            return view_attributes

        except KeyError:
            return None
