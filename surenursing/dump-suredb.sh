#!/bin/bash
set -e

################# create dated dump of suredb########################################################

SUREDUMP_DATE=`date "+%y-%m-%d_%H_%M"`;
mkdir "./$SUREDUMP_DATE";
cd "./$SUREDUMP_DATE"

SUREDUMP_URI="mongodb://development-mongodb-replicaset-0.development-mongodb-replicaset.development-mongodb-replicaset.svc.cluster.local:27017,development-mongodb-replicaset-1.development-mongodb-replicaset.development-mongodb-replicaset.svc.cluster.local:27017,development-mongodb-replicaset-2.development-mongodb-replicaset.development-mongodb-replicaset.svc.cluster.local:27017/suredb?replicaSet=rs0&readPreference=primaryPreferred";
mongodump --uri="$SUREDUMP_URI";

mongorestore "./suredb" -d "$SUREDUMP_DATE";
