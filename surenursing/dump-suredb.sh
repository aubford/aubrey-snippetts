#!/bin/bash
set -e

################# create dated dump of suredb########################################################

#DUMP_DATE=`date "+%y-%m-%d"`
DUMP_URI="mongodb://development-mongodb-replicaset-0.development-mongodb-replicaset.development-mongodb-replicaset.svc.cluster.local:27017,development-mongodb-replicaset-1.development-mongodb-replicaset.development-mongodb-replicaset.svc.cluster.local:27017,development-mongodb-replicaset-2.development-mongodb-replicaset.development-mongodb-replicaset.svc.cluster.local:27017/suredb?replicaSet=rs0&readPreference=primaryPreferred"

cd "$HOME/workspace/aubrey-snippetts/surenursing" &&
mongodump --uri="$DUMP_URI" --excludeCollection="frames" --excludeCollection="ocr_frames_subset" &&
mongorestore "./dump/suredb" -d "local-suredb" &&
trash "./dump"

