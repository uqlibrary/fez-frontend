#!/bin/bash

# exit if command returns error (non-zero status)
set -e

npm -v
node -v
jest --version

# v11.11.0 currently causing TypeError: Cannot assign to read only property 'Symbol(Symbol.toStringTag)' of object '#<process>' in tests
~/.nvm/nvm.sh install v11.10.1
node -v

npm cache clear -f
npm ci
