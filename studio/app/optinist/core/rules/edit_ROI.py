# flake8: noqa
# Exclude from lint for the following reason
# This file is executed by snakemake and cause the following lint errors
# - E402: sys.path.append is required to import optinist modules
# - F821: do not import snakemake
import sys
from os.path import abspath, dirname

ROOT_DIRPATH = dirname(dirname(dirname(dirname(dirname(dirname(abspath(__file__)))))))
sys.path.append(ROOT_DIRPATH)

from studio.app.common.core.logger import LOGGING_CLIENT_ID_KEY, AppLogger

logger = AppLogger.get_logger()


def main():
    try:
        from studio.app.optinist.core.edit_ROI import EditROI

        # Set client_id in logging context from snakemake config
        client_id = snakemake.config.get(LOGGING_CLIENT_ID_KEY)
        AppLogger.set_client_id(client_id)

        config = snakemake.config
        EditROI(file_path=config["file_path"]).commit()

    except Exception as e:
        logger.error(AppLogger.format_exc_traceback(e))


if __name__ == "__main__":
    main()
