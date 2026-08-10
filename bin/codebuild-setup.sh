 #!/bin/bash

# exit if command returns error (non-zero status)
set -e

printf "Node "; node -v;
printf "(Codeship default) npm v"; npm -v

printf "\n\n--- GET LATEST VERSION OF NPM 11.12.1 ---\n"
echo "$ npm install -g npm@11.12.1"
npm install -g npm@11.12.1

printf "\nNow running npm v"; npm -v

printf "\n$ npm cache clear\n"
# npm cache verify
npm cache clear -f

printf "\n\n--- INSTALL DEPENDENCIES ---\n"
echo "$ npm ci"
npm ci
