# flake8: noqa
# Exclude from lint for the following reason
# This file is executed by snakemake and cause the following lint errors
# - E402: sys.path.append is required to import optinist modules
# - F821: do not import snakemake
import sys
from os.path import abspath, dirname

ROOT_DIRPATH = dirname(dirname(dirname(dirname(dirname(dirname(abspath(__file__)))))))

sys.path.append(ROOT_DIRPATH)

from studio.app.common.core.rules.runner import Runner
from studio.app.common.core.snakemake.snakemake_reader import RuleConfigReader
from studio.app.common.core.utils.filepath_creater import join_filepath
from studio.app.dir_path import DIRPATH

if __name__ == "__main__":
    last_output = [
        join_filepath([DIRPATH.OUTPUT_DIR, x]) for x in snakemake.config["last_output"]
    ]

    rule_config = RuleConfigReader.read(snakemake.params.name)

    rule_config.input = snakemake.input
    rule_config.output = snakemake.output[0]
    run_script_path = sys.argv[0]

    Runner.run(rule_config, last_output, run_script_path)
