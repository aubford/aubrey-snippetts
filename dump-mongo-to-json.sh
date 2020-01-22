#!/bin/bash
set -e

DUMP_LOCATION="/Users/aubreyford/workspace/TEST-SCRAP/suredb-export"

TMP_FILE="dump-mongo-to-json-temp_1.js" 
DB="mongodb://development-mongodb-replicaset-0.development-mongodb-replicaset.development-mongodb-replicaset.svc.cluster.local:27017,development-mongodb-replicaset-1.development-mongodb-replicaset.development-mongodb-replicaset.svc.cluster.local:27017,development-mongodb-replicaset-2.development-mongodb-replicaset.development-mongodb-replicaset.svc.cluster.local:27017/suredb?replicaSet=rs0&readPreference=primaryPreferred"

echo "print('_ ' + db.getCollectionNames())" > "$TMP_FILE"

COLS=`mongo ${DB} ${TMP_FILE} | grep '_' | awk '{print $2}' | tr ',' ' '`

DATE=`date +"%y-%m-%d"` # ex. 20-01-21
mkdir -p "$DUMP_LOCATION/$DATE"

for c in ${COLS}
do
  mongoexport --uri="$DB" -c "$c" -o "$DUMP_LOCATION/$DATE/$c.json" --jsonArray
done

rm "$TMP_FILE"
