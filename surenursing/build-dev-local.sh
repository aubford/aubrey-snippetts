#!/bin/bash
set -e

cd "$BRASCH_LOCATION/suremeteor" || return;

echo "Creating local Meteor build of: $(pwd) in /Users/aubreyford/workspace/TEST-SCRAP"

# Set environment variables
export NPM_CONFIG_PREFIX="/home/node/.npm-global"
export TOOL_NODE_FLAGS="--max-old-space-size=4096"
export METEOR_HEADLESS=true

meteor reset

MQTT_SERVER_NAME="tcp://mqtt.development.surenursing.com:1883"
SERVER_NAME="https://development.surenursing.com"

bash -c "meteor build /Users/aubreyford/workspace/TEST-SCRAP --debug --directory --server-only"
