#!/bin/zsh

cd /Users/aubreyford/workspace/Celerity/strapi/testApp && yarn build && echo "build done" && pkill -f yarn; echo killed && yarn develop && echo finito;