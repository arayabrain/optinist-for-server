import sys
from os.path import abspath, dirname

ROOT_DIRPATH = dirname(dirname((dirname(abspath(__file__)))))
sys.path.append(ROOT_DIRPATH)


from studio.app.optinist.core.expdb.experiment_catalog_service import (  # noqa: E402
    ExperimentCatalogService,
)

organization_id = 1  # Currently, a fixed value is specified.
ExperimentCatalogService.refresh_experiment_catalogs_dataset(organization_id)
