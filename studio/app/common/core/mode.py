from pydantic import BaseSettings, Field

from studio.app.dir_path import DIRPATH


class Mode(BaseSettings):
    IS_STANDALONE: bool = Field(default=False, env="IS_STANDALONE")

    class Config:
        env_file = f"{DIRPATH.CONFIG_DIR}/.env"
        env_file_encoding = "utf-8"


MODE = Mode()
