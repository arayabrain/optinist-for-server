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
fi

echo "Processing datasets by ROI method..."

# Function to extract roi_method from .proc file
get_roi_method() {
  local proc_file=$1
  # Use Python to parse YAML and extract roi_method
  python3 -c "
import yaml
import sys
try:
    with open('$proc_file') as f:
        config = yaml.safe_load(f)
        roi_method = config.get('roi_method', 'caiman')
        print(roi_method)
except Exception as e:
    print('caiman')  # Default to caiman on error
    sys.stderr.write(f'Warning: Could not parse $proc_file: {e}\n')
"
}

# Group proc files by roi_method
caiman_files=""
suite2p_files=""

for proc_file in $proc_files; do
  roi_method=$(get_roi_method "$proc_file")
  echo "File: $proc_file -> roi_method: $roi_method"

  if [ "$roi_method" = "suite2p" ]; then
    suite2p_files="$suite2p_files $proc_file"
  else
    caiman_files="$caiman_files $proc_file"
  fi
done

# Process CaImAn datasets
if [ -n "$caiman_files" ]; then
  echo "Processing CaImAn datasets: $caiman_files"
  conda activate expdb_batch_caiman && \
    python run_expdb_batch.py -o 1 -p 5 --filter-roi-method caiman
fi

# Process Suite2p datasets
if [ -n "$suite2p_files" ]; then
  echo "Processing Suite2p datasets: $suite2p_files"
  conda activate expdb_batch_suite2p && \
    python run_expdb_batch.py -o 1 -p 5 --filter-roi-method suite2p
fi
