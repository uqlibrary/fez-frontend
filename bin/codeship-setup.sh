#!/bin/bash

# exit if command returns error (non-zero status)
set -e

echo "npm version"
npm -v

echo "node version"
node -v

echo "jest version"
jest --version

#ls -ls ~/.nvm/

#chmod a+x ~/.nvm/

# v11.11.0 currently causing TypeError: Cannot assign to read only property 'Symbol(Symbol.toStringTag)' of object '#<process>' in tests
#~/.nvm/nvm.sh install v11.10.1
#node -v

npm cache clear -f
npm ci

echo "jest version"
jest --version
