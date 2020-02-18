#!/bin/bash
set -e

EXPORT_OUT_DIR="/Users/aubreyford/workspace/TEST-SCRAP/suredb-local-export"

TMP_FILE="dump-local-mongo-to-json-temp_1.js"
DB="suredb" 

echo "print('_ ' + db.getCollectionNames())" > "$TMP_FILE"

COLS=`mongo ${DB} ${TMP_FILE} | grep '_' | awk '{print $2}' | tr ',' ' '`

DATE=`date "+%y-%m-%d_%H_%M"`
mkdir -p "$EXPORT_OUT_DIR/$DATE"

for c in ${COLS}
do
  mongoexport --db="$DB" -c "$c" -o "$EXPORT_OUT_DIR/$DATE/$c.json" --jsonArray
done

rm "$TMP_FILE"
