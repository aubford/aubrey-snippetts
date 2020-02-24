#!/bin/bash
set -e

################# create dated dump of suredb########################################################

DUMP_DATE=`date "+%y-%m-%d_%H_%M"`;
mk "$HOME/workspace/brasch/suremeteor/server-tezts/testData/$DUMP_DATE";
cd "$HOME/workspace/brasch/suremeteor/server-tezts/testData/$DUMP_DATE"


DUMP_URI="mongodb://development-mongodb-replicaset-0.development-mongodb-replicaset.development-mongodb-replicaset.svc.cluster.local:27017,development-mongodb-replicaset-1.development-mongodb-replicaset.development-mongodb-replicaset.svc.cluster.local:27017,development-mongodb-replicaset-2.development-mongodb-replicaset.development-mongodb-replicaset.svc.cluster.local:27017/suredb?replicaSet=rs0&readPreference=primaryPreferred";
mongodump --uri="$DUMP_URI";

mongorestore "./suredb" -d "$DUMP_DATE";
