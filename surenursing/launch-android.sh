#!/bin/sh

cd /Users/aubreyford/workspace/brasch/suremeteor || return;

export MONGO_URL="mongodb://development-mongodb-replicaset-0.development-mongodb-replicaset.development-mongodb-replicaset.svc.cluster.local,development-mongodb-replicaset-1.development-mongodb-replicaset.development-mongodb-replicaset.svc.cluster.local,development-mongodb-replicaset-2.development-mongodb-replicaset.development-mongodb-replicaset.svc.cluster.local:27017/suredb?replicaSet=rs0&readPreference=primaryPreferred"
export MONGO_OPLOG_URL="mongodb://development-mongodb-replicaset-0.development-mongodb-replicaset.development-mongodb-replicaset.svc.cluster.local,development-mongodb-replicaset-1.development-mongodb-replicaset.development-mongodb-replicaset.svc.cluster.local,development-mongodb-replicaset-2.development-mongodb-replicaset.development-mongodb-replicaset.svc.cluster.local:27017/local?authSource=suredb&replicaSet=rs0&readPreference=primaryPreferred"

# Obtain IP address for local machine
IP_ADDR=`ifconfig | awk '/inet 192.168.1./{print substr($2,1)}' | head -n1`

# Replace Cordova plugin with newest version
rm -rf node_modules/cordova-plugin-surepush/
rm -rf .meteor/local/cordova-build
meteor npm install



# Launch Meteor with Android app support
echo "Launching Android Mobile for IP: $IP_ADDR"
meteor run android --mobile-server $IP_ADDR:3000 --settings settings.json