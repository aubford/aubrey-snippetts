#!/bin/sh

cd /Users/aubreyford/workspace/brasch/suremeteor || return;

export MONGO_URL="mongodb://localhost:27017/suredump_20-01-17_17_23"
export METEOR_OFFLINE_CATALOG=1
#export METEOR_PROFILE=1

meteor --settings settings.json --no-release-check --no-lint --allow-incompatible-update --port 5001

