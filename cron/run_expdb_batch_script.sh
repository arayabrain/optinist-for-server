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

# Run expdb_batch
conda activate expdb_batch && \
  python run_expdb_batch.py -o 1 -p 5
