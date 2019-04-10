#@IgnoreInspection BashAddShebang

bindkey "\e\eOD" backward-word
bindkey "\e\eOC" forward-word
plugins=(z wd github zsh-nvm npm node osx)
source $ZSH/oh-my-zsh.sh
# PUT PATH TO THIS FILE HERE; '-g' aliases can be used anywhere in the command, not just the beginning
alias -g zrc="~/workspace/aubrey-snippetts/zshrc.sh"

# ------- Shell ---------------------------------------------------------------------------------------------------
# sed this file
alias alialist="tail -n +8 zrc"
# open zsh config file
alias zzz='idea zrc'
# open multiple files; '-g' aliases can be used anywhere in the command, not just the beginning
alias -g openmulti='open -n'
# start npm http server
alias http='http-server -c-1'
# re-source zsh shell
alias rl='source ~/.zshrc'
# open jira
alias jira='open https://rachio.atlassian.net/secure/RapidBoard.jspa?projectKey=PM&rapidView=76'
# kill all node processes
alias genodecide='killall node'
#get file size
alias size="du -hs"
# find the origin of a given command
alias locate="which"
# copy global npm packages from given package
alias nvm-cp="nvm copy-packages" #(e.g. 0.10.23)
# open npm package in node_modules
npmo(){
  npm explore $1 -- open -a Terminal .;
}
#kill process on a given port
murder(){
  kill -9 $(lsof -i :$1 -t);
}
chanps(){
  lsof -i :$1;
}
#get date string from milliseconds
when(){
  date -r $1;
  if [[ ! -z $2 ]]
  then date -r $2;
  fi;
}
#search for file by name starting at .
alias sch='find . -name'
# 'ls' after changing directory
chpwd(){
  lsa
}
delt(){
    mv $1 ~/workspace/OLD/TRASH/$(date +"%m-%d-T-%T")"::"$1;
}
mkk() {
  mkdir $1
  cd $1 || exit
}
mk() {
  mkdir $1
  ls
}
#curl GET
alias get='curl -X GET -H "Content-Type: application/json"'
# ------- Rachio Webapp ----------------------------------------------------------------------------------------
# run my slim webpack config
alias rd='npm run dev'
# commitizen commit
alias cza='git add -A; npm run commit'
# commitizen commit retry
alias czr='git add -A; npm run commit -- --retry'
alias rt='npm run test:watch'
# build project
build(){
  if git symbolic-ref HEAD &>/dev/null; then
  branch=$(git symbolic-ref HEAD)
  else
  echo "You're not on a branch"
  return 1;
  fi

  if [[ ! -n `git branch -r | grep "$(git symbolic-ref --short HEAD 2>/dev/null)"` ]]
  then
  echo "Remote Doesn't Exist.  Push branch first.";
  return 1;
  fi

  branch=${branch##refs/heads/};
  url="http://jenkins.rachvpc.io/job/Rachio/job/rachio-webapp/job/";

  curl -X POST $url$branch/build --user aubrey@rach.io:093c8354b8c16914c3b8fab6cc4dd436;

  (sleep 125; open $url$branch)&
}
buildnew(){
  if git symbolic-ref HEAD &>/dev/null; then
  branch=$(git symbolic-ref HEAD)
  else
  echo "You're not on a branch"

  return 1;
  fi

  if [[ ! -n `git branch -r | grep "$(git symbolic-ref --short HEAD 2>/dev/null)"` ]]
  then
  echo "Remote Doesn't Exist.  Push branch first.";
  return 1;
  fi

  branch=${branch##refs/heads/};
  url="http://jenkins.rachvpc.io/job/Rachio/job/rachio-webapp/job/";

  gh;

  curl -X POST "http://jenkins.rachvpc.io/job/Rachio/job/rachio-webapp/build?delay=0" --user aubrey@rach.io:093c8354b8c16914c3b8fab6cc4dd436;
  (sleep 200; curl -X POST $url$branch/build --user aubrey@rach.io:093c8354b8c16914c3b8fab6cc4dd436; sleep 200; open $url$branch)&
}
# ------- Rachio Backend -------------------------------------------------------------------------------------
# elasticsearch for integration tests
alias elastic='mvn elasticsearch:runforked -Dwait=true'
# connections
alias db-prod-partner_portal_owner='psql -h core-aurora-postgresql-prod.cluster-c9ingygldflb.us-west-2.rds.amazonaws.com -U partner_portal_owner prod'
alias db-prod-readonly='psql -h core-aurora-postgresql-prod.cluster-c9ingygldflb.us-west-2.rds.amazonaws.com -U readonly prod'
alias db-dev-partner_portal_owner='psql -h core-aurora-postgresql-dev.cluster-c9ingygldflb.us-west-2.rds.amazonaws.com -U partner_portal_owner dev'
alias db-dev-db_owner='psql -h core-aurora-postgresql-dev-0.c9ingygldflb.us-west-2.rds.amazonaws.com -U db_owner dev'
alias db-local='psql -h localhost -d postgres -U'
# dump partner_portal schema from prod database to file
alias dump-portaldb='pg_dump -Fc -Ox -h core-aurora-postgresql-prod.cluster-c9ingygldflb.us-west-2.rds.amazonaws.com -U partner_portal_owner -n partner_portal prod > portal.dump'
# restore partner_portal schema from dump file
alias restore-portaldb='pg_restore --schema-only --verbose --clean --exit-on-error --no-privileges --no-owner -l -d postgres portal.dump'
# clear maven installed
clearmaven(){
    trash ~/.m2/repository/com/rachio
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
# ------- Run ---------------------------------------------------------------------------------------------------
alias ngrok='~/workspace/RESOURCES/UTILITIES/ngrok'
grok(){
  ngrok http -subdomain rachio --host-header=rewrite $1
}
alias simcr='~/workspace/RESOURCES/chromium-tools/chromium/src/out/Debug-iphonesimulator/iossim ~/workspace/RESOURCES/chromium-tools/chromium/src/out/Debug-iphonesimulator/Chromium.app'
# react native run ios emulator
alias ios='react-native run-ios'
# react native run android emulator
alias droid='react-native run-android'
jav(){
  javac *.java
  java $1
}
jenk(){
  if git symbolic-ref HEAD &>/dev/null; then
  branch=$(git symbolic-ref HEAD)
  else
  echo "You're not on a branch"
  return 1;
  fi

  if [[ ! -n `git branch -r | grep "$(git symbolic-ref --short HEAD 2>/dev/null)"` ]]
  then
  echo "Remote Doesn't Exist.  Push branch first.";
  return 1;
  fi

  branch=${branch##refs/heads/};
  url="http://jenkins.rachvpc.io/job/Rachio2/job/rachio-webapp/job/";
  open $url$branch;
}
# ------- Mac --------------------------------------------------------------------------------------------------
# retrieve password from keychain
alias key='security find-generic-password -w -ga'
# give file full permissions
alias permit='chmod 777'
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
# ------- Github -----------------------------------------------------------------------------------------------------
gh() {
  giturl=$(git config --get remote.origin.url)
  if [[ $giturl == "" ]]
  then
    echo 'Origin Not found.';
    return 1;
  fi

  giturl=${giturl/git@github.com\:/https://github.com/}

  open $giturl
}
ghb () {
  giturl=$(git config --get remote.origin.url)
  if [[ $giturl == "" ]]
  then
    echo 'Origin Not found.';
    return 1;
  fi

  if [[ ! -n `git branch -r | grep "$(git symbolic-ref --short HEAD 2 >/dev/null)"` ]]
  then
    echo "Remote Doesn't Exist.  Push branch first.";
    return 1;
  fi

  giturl=${giturl/git@github.com\:/https://github.com/}
  giturl=${giturl/\.git/\/tree}

  if git symbolic-ref HEAD & >/dev/null; then
    branch=$(git symbolic-ref HEAD)
  else
    echo "You're not on a branch"
    return 1;
  fi

  branch=${branch##refs/heads/}
  giturl=$giturl/$branch
  open $giturl
}
# ------- Git Logs -------------------------------------------------------------------------------------------------
# log entire repo pretty
alias megalog="git log --graph --decorate --pretty=format:'%Cred %h %Cgreen %s %Cblue %cd %Cgreen %an %Cred %C(auto) %d' --all"
# log this branch pretty
alias superlog="git log --graph --decorate --pretty=format:'%Cred %h %Cgreen %s %Cblue %cd %Cgreen %an %Cred %C(auto) %d'"
# simple git log
alias logg="git --no-pager log --pretty=tformat:'%Cred %h %Cgreen %s %Cblue %cd %Cgreen %an %Cred %C(auto) %d' --date=relative -n"
# log branches
alias gb="git for-each-ref --sort=committerdate refs/heads/ --format='%(color:magenta) %(committerdate:short) %(color:yellow) %(authorname) %09 %(color:red) %(refname:short) %(color:yellow) %(upstream:short) %(color:red) %(upstream:track)'"
# show changed files
alias changed="git diff --name-status"
# see all git remote paths
alias gr='git remote -v'
# logg a range
rangelog() {
  git log $2..$1 --graph --decorate --pretty=format:"%Cred %h %Cgreen %s %Cblue %cd %Cgreen %an %C(auto) %d"
}
# show remote of provided locl branch
show-remote() {
  git branch | grep $1*;
  echo
  echo '**************************'
  echo
  git branch -r | grep $1*;
  return 1;
}
# get history of a function ($1) in a file ($2)
hist() {
  git log -L :$1:$2
}
# ------- Git ----------------------------------------------------------
alias gp='git pull'
alias push='git push -u'
alias gs='git status'
alias gg='git checkout'
alias mg='git merge master'
alias amend='git add -A; git commit --amend'
alias g3='git checkout master'
admit() {
  git add -A
  git commit -m $1
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
    else git stash apply stash@{$1}
  fi
}
# checkout back in time
gbb() {
  git checkout @{-$1};
}
# checkout all from another branch
checkall() {
  git checkout $1 -- .;
}
# checkout all from common ancestor with master (for PRs)
checkpr(){
  branch=$(git symbolic-ref --short HEAD)
  git checkout head...master
  checkall ${branch}
}