#!/bin/zsh
set -e

AUBREY="aubreyford"
PATH+="/usr/local/mysql/bin"
JDK_HOME="jdk1.8.0_231.jdk"
METEOR_VERSION_DIR="1.8.3"

source "/Users/aubreyford/workspace/aubrey-snippetts/zshrc.sh";
daily_backup;
echo $(date) >> "/Users/aubreyford/workspace/aubrey-snippetts/backup-log.txt";
