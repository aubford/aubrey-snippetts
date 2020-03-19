#!/bin/sh

avd-start Nexus_6_API_29 &
cd $BRASCH_LOCATION/suremeteor || return;

yes '' | sed 5q
clear
echo
echo '******************************'
echo Starting Android Mobile Launch

export MONGO_URL="mongodb://localhost:27017/20-01-17_17_23"

echo
echo ANDROID_HOME=$ANDROID_HOME
echo ANDROID_SDK=$ANDROID_SDK
echo MONGO_URL=$MONGO_URL
echo MONGO_OPLOG_URL=$MONGO_OPLOG_URL
echo

# Obtain IP address for local machine
IP_ADDR=`ipconfig getifaddr en0`

# Replace Cordova plugin with newest version
rm -rf node_modules/cordova-plugin-surepush/
rm -rf .meteor/local/cordova-build
meteor npm install

# Launch Meteor with Android app support
echo "Launching Android Mobile for IP: $IP_ADDR"
meteor run android --mobile-server $IP_ADDR:3000 --settings settings.json
