#!/bin/bash
#
# This script deploys each configuration file
#   for the production environment of optinist-for-server.

cd $(dirname $(dirname $0))

echo "# Deploy backend related production configs."
cp -pv studio/app/optinist/wrappers/caiman/params/caiman_cnmf_preprocessing.production.yaml studio/app/optinist/wrappers/caiman/params/caiman_cnmf_preprocessing.yaml
cp -pv studio/app/optinist/wrappers/suite2p/params/suite2p_preprocessing.production.yaml studio/app/optinist/wrappers/suite2p/params/suite2p_preprocessing.yaml

echo "# Deploy frontend related production configs."
cp -pv frontend/.env.production.example frontend/.env.production
