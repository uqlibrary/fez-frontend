 #!/bin/bash

# exit if command returns error (non-zero status)
set -e

printf "Node "; node -v;
printf "(Codeship default) npm v"; npm -v

printf "\n\n--- GET LATEST VERSION OF NPM 10.8.2 ---\n"
echo "$ npm install -g pnpm"
npm install -g pnpm

printf "\nNow running pnpm v"; pnpm -v

printf "\n\n--- INSTALL DEPENDENCIES ---\n"
echo "$ pnpm ci"
pnpm ci
