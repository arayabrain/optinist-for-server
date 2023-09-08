import json
import logging

import pyrebase

from studio.app.dir_path import DIRPATH

try:
    pyrebase_app = pyrebase.initialize_app(
        json.load(open(DIRPATH.FIREBASE_CONFIG_PATH))
    )

    if pyrebase_app is None:
        logging.getLogger().error(
            "Invalid pyrebase_app: config_path: %s", DIRPATH.FIREBASE_CONFIG_PATH)
    else:
        logging.getLogger().info("Init pyrebase_app success.")

except Exception as e:
    logging.getLogger().error(e)
    pyrebase_app = None
