#!/bin/bash
set -e

DB_NAME=$(basename $(pwd))
mongo "$DB_NAME" --eval "db.dropDatabase()";
mongorestore "./suredb" -d "$DB_NAME";
