#!/bin/sh

. ~/.bashrc
cd $(cd $(dirname $0); pwd)/../

conda activate expdb_batch_caiman &&
  python studio/scripts/run_refresh_experiment_catalogs.py
