import sys
from os.path import abspath, dirname

ROOT_DIRPATH = dirname(
    dirname(dirname(dirname(dirname(dirname(dirname(abspath(__file__)))))))
)
sys.path.append(ROOT_DIRPATH)

from studio.app.optinist.core.nwb.nwb_spec_utils import export_spec_files  # noqa: E402

if __name__ == "__main__":
    """
    Note: If NWB Spec files are added, add the export process below.
    """

    from studio.app.optinist.core.nwb.specs.device_metadata_spec import (
        GROUP_SPEC as DEVMETA_GROUP_SPEC,
    )
    from studio.app.optinist.core.nwb.specs.device_metadata_spec import (
        NAME as DEVMETA_NAME,
    )
    from studio.app.optinist.core.nwb.specs.lab_metadata_spec import (
        GROUP_SPEC as LABMETA_GROUP_SPEC,
    )
    from studio.app.optinist.core.nwb.specs.lab_metadata_spec import (
        NAME as LABMETA_NAME,
    )
    from studio.app.optinist.core.nwb.specs.marmoset_spec import (
        GROUP_SPEC as MARMOSET_GROUP_SPEC,
    )
    from studio.app.optinist.core.nwb.specs.marmoset_spec import NAME as MARMOSET_NAME
    from studio.app.optinist.core.nwb.specs.mouse_spec import (
        GROUP_SPEC as MOUSE_GROUP_SPEC,
    )
    from studio.app.optinist.core.nwb.specs.mouse_spec import NAME as MOUSE_NAME
    from studio.app.optinist.core.nwb.specs.optinist_spec import (
        GROUP_SPEC as OPTINIST_GROUP_SPEC,
    )
    from studio.app.optinist.core.nwb.specs.optinist_spec import NAME as OPTINIST_NAME
    from studio.app.optinist.core.nwb.specs.oristat_spec import (
        GROUP_SPEC as ORISTAT_GROUP_SPEC,
    )
    from studio.app.optinist.core.nwb.specs.oristat_spec import NAME as ORISTAT_NAME

    export_spec_files(DEVMETA_NAME, DEVMETA_GROUP_SPEC, 0)
    export_spec_files(LABMETA_NAME, LABMETA_GROUP_SPEC, 0)
    export_spec_files(MARMOSET_NAME, MARMOSET_GROUP_SPEC, 0)
    export_spec_files(MOUSE_NAME, MOUSE_GROUP_SPEC, 0)
    export_spec_files(OPTINIST_NAME, OPTINIST_GROUP_SPEC, 0)
    export_spec_files(ORISTAT_NAME, ORISTAT_GROUP_SPEC, 0)
