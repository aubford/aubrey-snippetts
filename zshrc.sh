#@IgnoreInspection BashAddShebang

########################################################################

#   What your ~/.zshrc file should look like, simply:

#>  #@IgnoreInspection BashAddShebang
#>  AUBREY="aubreyford"
#>  path+="/usr/local/mysql/bin"
#>  source "/Users/aubreyford/workspace/UTIL/aubrey-snippetts/zshrc.sh"
#>  JDK_HOME="WHATEVER_CURRENT_JDK_IS" (e.g.: JDK_HOME="jdk1.8.0_231.jdk")
#>  METEOR_VERSION_DIR="WHATEVER_CURRENT_METEOR_VERSION"
#>  METEOR_VERSION_DIR="WHATEVER_CURRENT_METEOR_VERSION"
#>  export BRASCH_LOCATION="location of brasch dir"

########################################################################

# --- Set Locations -------------------------------------------------------------------------

# set global bin locations
export PATH=$HOME/bin:/usr/local/bin:$PATH
# Set the Android home for the location they are found when SDK is installed using Android Studio
export ANDROID_HOME=$HOME/Library/Android/sdk
# Add Android tools locations to PATH
export PATH=$ANDROID_HOME/emulator:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools:$PATH
# set Java Developent Kit home
export JAVA_HOME=/Library/Java/JavaVirtualMachines/$JDK_HOME/Contents/Home
# Set location
#export METEOR_TOOLS_DIR=/Users/aubreyford/.meteor/packages/meteor-tool/$METEOR_VERSION_DIR/mt-os.osx.x86_64/tools/cli


# set mongo bin location
export PATH=/usr/local/opt/mongodb-community/bin:$PATH
# path to shell manual
export MANPATH=/usr/local/man:$MANPATH
# Path to your oh-my-zsh installation.
export ZSH=/Users/$AUBREY/.oh-my-zsh

# ---- Global settings ---------------------------------------------------------------------

# PUT PATH TO THIS FILE HERE; '-g' aliases can be used anywhere in the command, not just the beginning
alias -g zrc=~/workspace/UTIL/aubrey-snippetts/zshrc.sh

# on git push, set default remote tracking branch if none exists
git config --global push.default current

# I think this fixes some shit related to dumb alt key behavior
bindkey "\e\eOD" backward-word
bindkey "\e\eOC" forward-word
# faster key repeat for bad ADD
defaults write -g InitialKeyRepeat -int 8
defaults write -g KeyRepeat -int 1

# ------- Oh My Zsh Settings -----------------------------------------------------------------
# shellcheck disable=SC2034
# Set name of the theme to load --- if set to "random", it will
# load a random theme each time oh-my-zsh is loaded, in which case,
# to know which specific one was loaded, run: echo $RANDOM_THEME
# See https://github.com/robbyrussell/oh-my-zsh/wiki/Themes
ZSH_THEME="robbyrussell"

# Set list of themes to pick from when loading at random
# Setting this variable when ZSH_THEME=random will cause zsh to load
# a theme from this variable instead of looking in ~/.oh-my-zsh/themes/
# If set to an empty array, this variable will have no effect.
# ZSH_THEME_RANDOM_CANDIDATES=( "robbyrussell" "agnoster" )

# Uncomment the following line to display red dots whilst waiting for completion.
 COMPLETION_WAITING_DOTS="true"

# shellcheck disable=SC2034
# oh-my-zsh non-default settings
DISABLE_AUTO_TITLE="true"
# shellcheck disable=SC2034
COMPLETION_WAITING_DOTS="true"

# shellcheck disable=SC2034
plugins=(node z wd github npm osx zsh-nvm docker postgres)

# shellcheck source=/Users/$AUBREY/.oh-my-zsh/oh-my-zsh.sh
source "$ZSH/oh-my-zsh.sh"

# You may need to manually set your language environment
# export LANG=en_US.UTF-8

# Preferred editor for local and remote sessions
# if [[ -n $SSH_CONNECTION ]]; then
#   export EDITOR='vim'
# else
#   export EDITOR='mvim'
# fi

# Compilation flags
# export ARCHFLAGS="-arch x86_64"

# ------- Shell ---------------------------------------------------------------------------------------------------
# sed this file
alias alialist="tail -n +8 zrc"
# pbcopy pwd
alias cppwd="pwd | tr -d '\n' | pbcopy"
# open zsh config file
zzz(){
  (cd "/Users/aubreyford/workspace/UTIL/aubrey-snippetts" && idea .)
}

alias nodem="node --max-old-space-size=4096"
# open multiple files; '-g' aliases can be used anywhere in the command, not just the beginning
alias -g openmulti='open -n'
# start npm http server
alias http='http-server -c-1'
# re-source zsh shell
alias rl='source ~/.zshrc'
# kill all node processes
alias genodecide='killall -9 node'
#get file size
alias size="du -hs"
# copy global npm packages from given package
alias nvm-cp="nvm copy-packages" #(e.g. 0.10.23)
# open npm package in node_modules
npmo(){
  npm explore "$1" -- open -a Terminal .;
}
#kill process on a given port
murder(){
  kill -9 "$(lsof -i :"$1" -t)";
}
# list all node TCP processes
node-ls(){
  lsof -Pc node
}
# list all TCP processes
tcp-ls(){
  lsof -Pi TCP -a
}
# list all node TCP processes
tcp-ls-node(){
  lsof -Pc node -i TCP -a
}
# what is going on on this port
chanps(){
  lsof -Pi :"$1";
}
# get ppid for name
alias name-chan="pgrep"
# find process by name
comm(){
  lsof -Pc "$1";
}
#get date string from milliseconds
when(){
  date -r "$1";
  if [[ -n $2 ]]
  then date -r "$2";
  fi;
}
#search for file by name starting at .
alias sch='find . -name'
# 'ls' after changing directory
chpwd(){
  lsa
}
# move to workspace trash with date
delt(){
    mv "$1" ~/workspace/OLD/TRASH/"$(date +"%m-%d-T-%T") -- $1";
}
mkk() {
  mkdir "$1"
  cd "$1" || exit
}
mk() {
  mkdir "$1"
  ls
}
# make dir only if none exists
alias mkp="mkdir -p"
#curl GET
alias get='curl -X GET -H "Content-Type: application/json"'
# get current user id
alias userid='id -u'
alias groupid='id -g'

# copy files from local machine to remote machine
cp-lr() {
  scp -r $2 $1:$3
}
# copy files from remote machine to local machine
cp-rl() {
  scp -r $1:$2 $3
}

echoerr(){
  echo "$@" 1>&2;
  return 1;
}

# ------- Javascript -------------------------------------------------------------------------------------------
# install everything you need for babel
alias install-babel='npm install --save-dev babel-core babel-loader babel-preset-react'
# list npm packages in node_modules
alias nl='npm list --depth=0'
# simple npm run
alias rn='npm run'
#open package.json
alias pac='idea package.json'
alias ww='wd 3'
alias snip='idea ~/workspace/aubrey-snippetts'

# ------- Java/Android/iPhone -----------------------------------------------------------------------------------------
# AVD: list installed emlators
alias avd-ls="emulator -list-avds"
# AVD: start and AVD
alias avd-start="emulator -avd" #[avd_version]#   
# list installed JDK versions
alias jdk='/usr/libexec/java_home -V'
# input text into Android emulator
apaste(){
  adb shell input text "$1"
}
alias simcr='~/workspace/RESOURCES/chromium-tools/chromium/src/out/Debug-iphonesimulator/iossim ~/workspace/RE`SOURCE`S/chromium-tools/chromium/src/out/Debug-iphonesimulator/Chromium.app'
jav(){
  javac *.java
  java "$1"
}

# ------- Run ---------------------------------------------------------------------------------------------------
alias ngrok='~/workspace/UTIL/ngrok'
grok(){
  ngrok http -subdomain rachio --host-header=rewrite "$1"
}

# ------- Mac --------------------------------------------------------------------------------------------------
# get machine model
alias getmodel="sysctl hw.model"
# retrieve password from keychain
alias key='security find-generic-password -w -ga'
# give file full permissions
alias -g permit='chmod 777'
# give file full permissions for owner
alias permit-owner='chmod 700'
# find all domains available for updating macOS preferences
alias defaults-domains="defaults domains | tr ',' '\n'"
# show hidden folders in Finder
unhide(){
  defaults write com.apple.finder AppleShowAllFiles -bool YES;
  killall Finder;
}
# hide hidden folders in Finder
hide(){
  defaults write com.apple.finder AppleShowAllFiles -bool NO
  killall Finder;
}
_backup_home_folder_item_tool(){
  BACKUP_LOCATION="$BACKUP_LOCATION_DIR/$1"
  BACKUP_SOURCE="$HOME/$1/"
  
  mkdir -p "$BACKUP_LOCATION"; 
  cp -r "$BACKUP_SOURCE" "$BACKUP_LOCATION";
}

_backup_what(){
  export BACKUP_LOCATION_DIR="$HOME/Google Drive/Backup/$BACKUP_DATE"
  _backup_home_folder_item_tool "Library/Group Containers/group.com.apple.notes";
  _backup_home_folder_item_tool "workspace/brasch/suremeteor/.idea";
  _backup_home_folder_item_tool "Library/Application Support/IntelliJIdea2019.3";
  _backup_home_folder_item_tool "Library/Preferences/IntelliJIdea2019.3";
  (cd "$HOME/Google Drive/Backup/" && zip -9rm "$BACKUP_DATE" "$BACKUP_DATE")
}

do_backup(){
  export BACKUP_DATE=$(date +"%y-%m-%d-T-%T");
  _backup_what;
}

# show cron jobs
alias cron-ls="crontab -l"
# edit cron jobs file
alias cron="export VISUAL=NANO; crontab -e"

# ------- Database -------------------------------------------------------------------------------------------------
# start postgres database
alias poststart="pg_ctl -D /usr/local/var/postgres -l /usr/local/var/postgres/server.log start"
# stop postgres database
alias poststop="pg_ctl -D /usr/local/var/postgres stop -s -m fast"
# postgres database logs
alias psqlog="cat /usr/local/var/postgres/server.log"
# knex query builder functionality
alias rollback='knex migrate:rollback --env development'
alias migrate='knex migrate:latest --env development'
alias seed='knex seed:run --env development'
# run mongo
alias mong='mongod --config /usr/local/etc/mongod.conf'
# list running mongos
mongotcp(){
  lsof -Pc mongo -i TCP -a
}
mongo-drop(){
  mongo "$1" --eval "db.dropDatabase()"
}
# ------- Github -----------------------------------------------------------------------------------------------------
# return github repo http addy
ghurl() {
  GITURL=$(git config --get remote.origin.url) || echoerr 'Origin Not Found...' || return 1;
  echo "${GITURL/git@github.com\:/https://github.com/}"
}

# return github branch http addy
ghburl () {
  GITURL=$(ghurl) || return 1
  BRANCH=$(branch-name) || return 1

  if git branch -r | grep -q "^  origin/$BRANCH$"
  then
    GITURL=${GITURL/\.git/\/tree}
    echo "$GITURL/$BRANCH"
  else
    echoerr "Remote Doesn't Exist.  Push branch first."
    return 1
  fi
}

# open current github repo
gh() {
  GITURL=$(ghurl) || return 1
  open "$GITURL"
}

# open current branch in github
ghb(){
  BRANCH_URL=$(ghburl) || return 1
  open "$BRANCH_URL"
}

# ------- Git Logs -------------------------------------------------------------------------------------------------
# log entire repo pretty
alias megalog="git log --graph --decorate --pretty=format:'%Cred %h %Cgreen %s %Cblue %cd %Cgreen %an %Cred %C(auto) %d' --all"
# log this branch pretty
alias superlog="git log --graph --decorate --pretty=format:'%Cred %h %Cgreen %s %Cblue %cd %Cgreen %an %Cred %C(auto) %d'"
# simple git log
alias logg="git --no-pager log --pretty=tformat:'%Cred%h %C(cyan bold)%s %Creset%Cblue%cd %C(magenta)%an %Cred%C(auto)%d' --date=relative -n"
# log branches
alias gb="git for-each-ref --sort=committerdate refs/heads/ --format='%(color:magenta) %(committerdate:short) %(color:yellow) %(authorname) %09 %(color:red) %(refname:short) %(color:yellow) %(upstream:short) %(color:red) %(upstream:track)'"
# show changed files
alias changed="git diff --name-status"
# see all git remote paths
alias gr='git remote -v'
# logg a range
rangelog() {
  LAST=$(($2 + 1))
  git log "HEAD~$LAST..HEAD~$1" --graph --decorate --pretty=format:"%Cred %h %Cgreen %s %Cblue %cd %Cgreen %an %C(auto) %d"
}

# ------- Git ----------------------------------------------------------
alias gp='git pull'
alias push='git push -u'
alias gs='git status'
alias gg='git checkout'
alias mg='git merge master'
alias ginit='git init && echo ".idea" >> .gitignore && git add -A && git commit -m "init"'
alias abort-='git merge --abort'
alias amend='git add -A; git commit --amend'
alias g3='git checkout dev'
# ignore changes to files
alias ignore="git update-index --skip-worktree" #... $filename
# ignore changes to all files in dir /// note: must cd into dir first
ignoreall(){
  git ls-files -z | xargs -0 git update-index --skip-worktree;
}
# un-ignore changes to all files in dir /// note: must cd into dir first
unignoreall(){
  git ls-files -z | xargs -0 git update-index --no-skip-worktree;
}
# update an ignored file manually (e.g. if there are changes from the cloud)
alias update-ignored="git update-index" #... $filename
# un-ignore an ignored file
alias unignore="git update-index --no-skip-worktree" #... $filename
# show all ignored files
alias ignore-ls="git ls-files -v|grep '^S'"

branch-name(){
  BRANCH_NAME=$(git symbolic-ref -q --short HEAD) || echoerr "You're not on a branch" || return 1
  echo "$BRANCH_NAME"
}

admit() {
  git add -A
  git commit -m "$1"
}
# stashing
alias stash='git add -A; git stash save'
alias gl='git stash list --pretty=format:"%Cblue %cr %Cred %gd %Cgreen %s"'
# wipe branch
alias res='git reset --hard head'
# rename a branch
alias rename='git branch -m'
# untrack a file
alias untrack='git rm -r --cached'
# git stash apply
apply() {
  if [[ $# -eq 0 ]]
    then git stash apply
    else git stash apply "stash@{$1}"
  fi
}
# checkout back in time
gbb() {
  git checkout "@{-$1}";
}
# checkout all from another branch
checkall() {
  git checkout "$1" -- .;
}
# checkout all from common ancestor with master (for PRs)
checkpr(){
  BRANCH=$(branch-name) || return 1
  git checkout head...dev
  checkall "$BRANCH"
}

#------ Apache ---------------------------------------------------
alias apache-start='apachectl start'
alias apache-restart='apachectl restart'
# php http config file
alias apache-config="idea /private/etc/apache2/httpd.conf"

#------ Docker ---------------------------------------------------
alias docker-killall='docker kill $(docker ps -q)'
alias docker-rmall='docker rm $(docker ps -a -q)'


#------- Heroku -----------------------------------------------------
alias heroku-config-to-env="heroku config | sed 's/:  */=/g; /^=/d' >> .env.heroku"
alias env-to-heroku-config="heroku-config-to-env; heroku config:set \$(cat .env | sed '/^$/d; /#[[:print:]]*$/d')"

# -------- Current Job -------------------------------------------------------------------------------------------
alias gogo="open http://localhost:5000/login"
alias launch='$HOME/workspace/UTIL/aubrey-snippetts/surenursing/launch-development.sh'
alias launch-compare='$HOME/workspace/UTIL/aubrey-snippetts/surenursing/launch-comp.sh'
alias launch-compare-local='$HOME/workspace/UTIL/aubrey-snippetts/surenursing/launch-comp-local.sh'
alias launch-local='$HOME/workspace/UTIL/aubrey-snippetts/surenursing/launch-local.sh'
alias launch-android='$HOME/workspace/UTIL/aubrey-snippetts/surenursing/launch-android.sh'
alias launch-android-device='$HOME/workspace/UTIL/aubrey-snippetts/surenursing/launch-android-device.sh'
alias launch-android-local='$HOME/workspace/UTIL/aubrey-snippetts/surenursing/launch-android-local.sh'
alias dump-suredb='$HOME/workspace/UTIL/aubrey-snippetts/surenursing/dump-suredb.sh'
alias build='$HOME/workspace/UTIL/aubrey-snippetts/surenursing/build-dev-local.sh'
kill-meteor-debug-break(){
 cd "$HOME/.meteor/packages/meteor-tool" || exit;
 find . -name boot.js | xargs sed -i '' -e "/maybeWaitForDebuggerToAttach();/d"
}

# stash and switch to dev and mateor npm i
alias cdev="stash && g3 && meteor npm i"
alias cback="gg - && apply && meteor npm i"
