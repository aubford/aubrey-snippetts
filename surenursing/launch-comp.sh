#!/bin/sh

cd "$BRASCH_LOCATION/suremeteor-compare/suremeteor" || exit;

export MONGO_URL="mongodb://development-mongodb-replicaset-0.development-mongodb-replicaset.development-mongodb-replicaset.svc.cluster.local,development-mongodb-replicaset-1.development-mongodb-replicaset.development-mongodb-replicaset.svc.cluster.local,development-mongodb-replicaset-2.development-mongodb-replicaset.development-mongodb-replicaset.svc.cluster.local:27017/suredb?replicaSet=rs0&readPreference=primaryPreferred"
export MONGO_OPLOG_URL="mongodb://development-mongodb-replicaset-0.development-mongodb-replicaset.development-mongodb-replicaset.svc.cluster.local,development-mongodb-replicaset-1.development-mongodb-replicaset.development-mongodb-replicaset.svc.cluster.local,development-mongodb-replicaset-2.development-mongodb-replicaset.development-mongodb-replicaset.svc.cluster.local:27017/local?authSource=suredb&replicaSet=rs0&readPreference=primaryPreferred"
export METEOR_OFFLINE_CATALOG=1
#export METEOR_PROFILE=1

open "http://localhost:4000/login"
meteor --settings settings.json --no-release-check --no-lint --allow-incompatible-update --port 4000

