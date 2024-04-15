#!/bin/sh

. ~/.bashrc

cd $(cd $(dirname $0); pwd)/../

conda activate expdb_batch && \
  python run_expdb_batch.py -o 1
