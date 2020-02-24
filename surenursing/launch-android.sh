#!/bin/sh

avd-start Nexus_6_API_29 &
cd "$HOME/workspace/brasch/suremeteor" || return;
./android-launch.sh;