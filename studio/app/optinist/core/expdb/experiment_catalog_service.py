import glob
from typing import List

from sqlmodel import Session

from studio.app.common.core.logger import AppLogger
from studio.app.common.core.utils.filepath_creater import join_filepath
from studio.app.common.db.database import session_scope
from studio.app.const import EXP_METADATA_SUFFIX
from studio.app.expdb_dir_path import EXPDB_DIRPATH
from studio.app.optinist.core.expdb.expdb_data import ExpDbPathIds
from studio.app.optinist.core.expdb.expdb_metadata_reader import ExppDbMetadataReader
from studio.app.optinist.models.expdb.experiment import ExperimentCatalog
from studio.app.optinist.schemas.expdb.experiment import (
    ExpDbExperimentCatalog,
    ExpDbExperimentCatalogCreate,
)

logger = AppLogger.get_logger()


class ExperimentCatalogService:
    @classmethod
    def refresh_experiment_catalogs_dataset(cls, organization_id: int):
        """
        Refresh the registration data in the experiments_catalogs table
        """

        # ----------------------------------------
        # Search for the dataset to be processed
        # ----------------------------------------

        # Search for data to be registered in experiment_catalogs
        # *Judge data based on the metadata file of the dataset
        metadata_paths = cls.find_metadata_files()

        if not metadata_paths:
            logger.info("No data to be registered in experiment_catalogs")
            return

        logger.info(
            f"Number of experiment_catalogs registered data: {len(metadata_paths)}"
        )

        # ----------------------------------------
        # Data registration
        # ----------------------------------------

        # Prepare experiment catalog data
        experiment_catalogs_data = []
        prepare_error_count = 0

        # Process metadata files
        for path in metadata_paths:
            try:
                # Parse metadata file
                exp_ids = ExpDbPathIds(expdb_path=path)
                (attributes, view_attributes) = ExppDbMetadataReader.load_exp_metadata(
                    path
                )
                experiment_catalog = ExpDbExperimentCatalogCreate(
                    experiment_id=exp_ids.exp_id,
                    organization_id=organization_id,
                    attributes=attributes,
                    view_attributes=view_attributes,
                )

                # TODO:
                # The following columns will also be added:
                # - proc file information (reserve/done/error)
                #   (process_logs column, etc.)

                experiment_catalogs_data.append(experiment_catalog)

            except Exception as e:
                prepare_error_count += 1
                logger.error(f"Error preparing experiment_catalog from {path}: {e}")

        if prepare_error_count > 0:
            logger.warning(
                f"Failed to prepare {prepare_error_count} registration records"
            )

        # Bulk insert
        with session_scope() as session:
            # First, clear all existing records.
            cls.delete_all_experiment_catalogs(session)

            # Bulk insert experiment_catalog records
            if experiment_catalogs_data:
                try:
                    inserted_count = cls.bulk_create_experiment_catalogs(
                        session, experiment_catalogs_data
                    )
                    logger.info(
                        f"Successfully registered {inserted_count} experiment_catalogs"
                    )

                except Exception as e:
                    logger.error(f"Error during bulk insert experiment_catalogs: {e}")
                    raise e

    @classmethod
    def find_metadata_files(cls) -> List[str]:
        path_pattern = join_filepath(
            [EXPDB_DIRPATH.EXPDB_DIR, "*", "*", f"*_{EXP_METADATA_SUFFIX}.json"]
        )
        paths = sorted(glob.glob(path_pattern))
        return paths

    @classmethod
    def create_experiment_catalog(
        cls, db: Session, data: ExpDbExperimentCatalogCreate
    ) -> ExpDbExperimentCatalog:
        experiment_catalog = ExperimentCatalog(
            experiment_id=data.experiment_id,
            organization_id=data.organization_id,
            attributes=data.attributes,
            view_attributes=data.view_attributes,
        )

        db.add(experiment_catalog)
        db.flush()
        db.refresh(experiment_catalog)

        return ExpDbExperimentCatalog.from_orm(experiment_catalog)

    @classmethod
    def bulk_create_experiment_catalogs(
        cls, db: Session, data_list: List[ExpDbExperimentCatalogCreate]
    ) -> int:
        """
        Bulk insert multiple experiment catalogs for better performance.
        """
        if not data_list:
            return 0

        experiment_catalogs = []
        for data in data_list:
            experiment_catalog = ExperimentCatalog(
                experiment_id=data.experiment_id,
                organization_id=data.organization_id,
                attributes=data.attributes,
                view_attributes=data.view_attributes,
            )
            experiment_catalogs.append(experiment_catalog)

        db.add_all(experiment_catalogs)
        db.flush()

        return len(experiment_catalogs)

    @classmethod
    def delete_all_experiment_catalogs(cls, db: Session) -> int:
        count = db.query(ExperimentCatalog).delete()
        db.flush()

        return count
