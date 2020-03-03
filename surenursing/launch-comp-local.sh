#!/bin/sh

cd /Users/aubreyford/workspace/brasch/comparison-suremeteor/suremeteor || return;

export MONGO_URL="mongodb://localhost:27017/local-suredb"
export METEOR_OFFLINE_CATALOG=1
#export METEOR_PROFILE=1

open "http://localhost:4000/login"
meteor --settings settings.json --no-release-check --no-lint --allow-incompatible-update --port 4000

