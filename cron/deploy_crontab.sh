#!/bin/sh

cd $(cd $(dirname $0); pwd)

# Note: The crontab file to be stored under /etc/cron.d is "." is not allowed, so rename is applied.
sudo cp ./optinist_expdb_batch.crontab /etc/cron.d/optinist_expdb_batch
