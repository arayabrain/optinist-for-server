#!/bin/sh

. ~/.bashrc
cd $(cd $(dirname $0); pwd)/../

# Set environments
if [ -z "${OPTINIST_DIR}" ] && [ -d "/app" ]; then
 export OPTINIST_DIR="/app/studio_data"
fi

# Check expdb_batch .proc files
DATASET_DIR="experiments_datasets"
PROC_FILE_PATTERN="*.proc"
proc_files=$(find "$DATASET_DIR" -maxdepth 2 -name "$PROC_FILE_PATTERN" -type f)
if [ -z "$proc_files" ]; then
  echo "No proc files found."
  exit
else
  echo "Proc files found. [$proc_files]"
fi

# ------------------------------------------------------------
# Start batch process
#
# NOTE:
# - If .proc files exist, launch batch runs for all roi methods (caiman, suite2p, ...).
# - The batch run module automatically determines
#   which roi method each proc file corresponds to based on the conda environment.
# ------------------------------------------------------------

# Process CaImAn datasets
echo "Processing CaImAn datasets"
conda activate expdb_batch_caiman && \
  python run_expdb_batch.py -o 1 -p 5
conda deactivate

# Process Suite2p datasets
echo "Processing Suite2p datasets"
conda activate expdb_batch_suite2p && \
  python run_expdb_batch.py -o 1 -p 5
conda deactivate
