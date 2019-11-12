#@IgnoreInspection BashAddShebang

########################################################################

#>  what your ~/.zshrc file should look like, simply:
#>  #@IgnoreInspection BashAddShebang
#>  AUBREY="aubreyford"
#>  path+="/usr/local/mysql/bin"
#>  source "/Users/aubreyford/workspace/UTIL/aubrey-snippetts/zshrc.sh"

########################################################################

# If you come from bash you might have to change your $PATH.
export PATH=$HOME/bin:/usr/local/bin:$PATH

# Path to your oh-my-zsh installation.
export ZSH=/Users/$AUBREY/.oh-my-zsh

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

# Uncomment the following line to use case-sensitive completion.
# CASE_SENSITIVE="true"

# Uncomment the following line to use hyphen-insensitive completion.
# Case-sensitive completion must be off. _ and - will be interchangeable.
# HYPHEN_INSENSITIVE="true"

# Uncomment the following line to disable bi-weekly auto-update checks.
# DISABLE_AUTO_UPDATE="true"

# Uncomment the following line to automatically update without prompting.
# DISABLE_UPDATE_PROMPT="true"

# Uncomment the following line to change how often to auto-update (in days).
# export UPDATE_ZSH_DAYS=13

# Uncomment the following line if pasting URLs and other text is messed up.
# DISABLE_MAGIC_FUNCTIONS=true

# Uncomment the following line to disable colors in ls.
# DISABLE_LS_COLORS="true"

# Uncomment the following line to disable auto-setting terminal title.
# DISABLE_AUTO_TITLE="true"

# Uncomment the following line to enable command auto-correction.
# ENABLE_CORRECTION="true"

# Uncomment the following line to display red dots whilst waiting for completion.
# COMPLETION_WAITING_DOTS="true"

# Uncomment the following line if you want to disable marking untracked files
# under VCS as dirty. This makes repository status check for large repositories
# much, much faster.
# DISABLE_UNTRACKED_FILES_DIRTY="true"

# Uncomment the following line if you want to change the command execution time
# stamp shown in the history command output.
# You can set one of the optional three formats:
# "mm/dd/yyyy"|"dd.mm.yyyy"|"yyyy-mm-dd"
# or set a custom format using the strftime function format specifications,
# see 'man strftime' for details.
# HIST_STAMPS="mm/dd/yyyy"

# Would you like to use another custom folder than $ZSH/custom?
# ZSH_CUSTOM=/path/to/new-custom-folder

#////////////////////////////////////////////////////////////////////////////////////
#////////////////////////////////////////////////////////////////////////////////////
#////////////////////////////////////////////////////////////////////////////////////

bindkey "\e\eOD" backward-word
bindkey "\e\eOC" forward-word
defaults write -g InitialKeyRepeat -int 8
defaults write -g KeyRepeat -int 1

# oh-my-zsh non-default settings
DISABLE_AUTO_TITLE="true"
COMPLETION_WAITING_DOTS="true"

plugins=(node z wd github npm osx zsh-nvm docker postgres)

source $ZSH/oh-my-zsh.sh

# User configuration

export MANPATH="/usr/local/man:$MANPATH"

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

export PATH="/usr/local/opt/mongodb-community/bin:$PATH"


# PUT PATH TO THIS FILE HERE; '-g' aliases can be used anywhere in the command, not just the beginning
alias -g zrc="~/workspace/UTIL/aubrey-snippetts/zshrc.sh"

# ------- Shell ---------------------------------------------------------------------------------------------------
# sed this file
alias alialist="tail -n +8 zrc"
# pbcopy pwd
alias cppwd="pwd | tr -d '\n' | pbcopy"
# open zsh config file
alias zzz='idea zrc'
# open multiple files; '-g' aliases can be used anywhere in the command, not just the beginning
alias -g openmulti='open -n'
# start npm http server
alias http='http-server -c-1'
# re-source zsh shell
alias rl='source ~/.zshrc'
# kill all node processes
alias genodecide='killall node'
#get file size
alias size="du -hs"
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
# list all node TCP processes
allnode(){
  lsof -Pc node
}
# list all node TCP processes
allnodetcp(){
  lsof -Pc node -i TCP -a
}
# what is going on on this port
chanps(){
  lsof -Pi :$1;
}
# find process by name
comm(){
  lsof -Pc $1;
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
# move to workspace trash with date
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
# get current user id
alias userid='id -u'
alias groupid='id -g'

# copy files from local machine to remote machine
cp-lr() {
  scp -r $2 $1:$3
}

cp-rl() {
  scp -r $1:$2 $3
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
alias simcr='~/workspace/RESOURCES/chromium-tools/chromium/src/out/Debug-iphonesimulator/iossim ~/workspace/RE`SOURCE`S/chromium-tools/chromium/src/out/Debug-iphonesimulator/Chromium.app'
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

#------ Apache ---------------------------------------------------
alias apache-start='apachectl start'
alias apache-restart='apachectl restart'
# php http config file
alias apache-config="idea /private/etc/apache2/httpd.conf"

#------ Docker ---------------------------------------------------
alias docker-killall="docker kill $(docker ps -q)"
alias docker-rmall="docker rm $(docker ps -a -q)"


#------- Heroku -----------------------------------------------------
alias heroku-config-to-env="heroku config | sed 's/:  */=/g; /^=/d' >> .env.heroku"
alias env-to-heroku-config="heroku-config-to-env; heroku config:set \$(cat .env | sed '/^$/d; /#[[:print:]]*$/d')"

