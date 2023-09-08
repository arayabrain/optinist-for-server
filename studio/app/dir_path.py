import os
from enum import Enum

from dotenv import load_dotenv

_DEFAULT_DIR = "/tmp/studio"
_ENV_DIR = os.environ.get("OPTINIST_DIR")


class DIRPATH:
    DATA_DIR = _DEFAULT_DIR if _ENV_DIR is None else _ENV_DIR

    INPUT_DIR = f"{DATA_DIR}/input"
    OUTPUT_DIR = f"{DATA_DIR}/output"

    if not os.path.exists(INPUT_DIR):
        os.makedirs(INPUT_DIR)
    assert os.path.exists(INPUT_DIR)

    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
    assert os.path.exists(OUTPUT_DIR)

    ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    STUDIO_DIR = os.path.dirname(os.path.dirname(__file__))
    APP_DIR = os.path.dirname(__file__)
    CONFIG_DIR = f"{STUDIO_DIR}/config"

    load_dotenv(f"{CONFIG_DIR}/.env")
    EXPDB_DIR = os.environ.get("EXPDB_DIR")
    assert EXPDB_DIR is not None, "EXPDB_DIR must be set"
    assert os.path.exists(EXPDB_DIR), f"{EXPDB_DIR} does not exist"

    PUBLIC_EXPDB_DIR = os.environ.get("PUBLIC_EXPDB_DIR")
    assert PUBLIC_EXPDB_DIR is not None, "PUBLIC_EXPDB_DIR must be set"
    assert os.path.exists(PUBLIC_EXPDB_DIR), f"{PUBLIC_EXPDB_DIR} does not exist"

    assert (
        EXPDB_DIR != PUBLIC_EXPDB_DIR
    ), "EXPDB_DIR and PUBLIC_EXPDB_DIR must be different"

    GRAPH_HOST = os.environ.get("GRAPH_HOST")

    CONDAENV_DIR = (
        f"{os.path.dirname(os.path.dirname(os.path.dirname(__file__)))}/conda"
    )

    SNAKEMAKE_FILEPATH = f"{APP_DIR}/Snakefile"
    EXPERIMENT_YML = "experiment.yaml"
    SNAKEMAKE_CONFIG_YML = "config.yaml"

    FIREBASE_PRIVATE_PATH = f"{CONFIG_DIR}/auth/firebase_private.json"
    FIREBASE_CONFIG_PATH = f"{CONFIG_DIR}/auth/firebase_config.json"


class CORE_PARAM_PATH(Enum):
    nwb = f"{DIRPATH.APP_DIR}/optinist/core/nwb/nwb.yaml"
    snakemake = f"{DIRPATH.APP_DIR}/common/core/snakemake/snakemake.yaml"
