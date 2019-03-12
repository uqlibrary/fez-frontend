#!/bin/bash

# exit if command returns error (non-zero status)
set -e

printf "\n npm -v\n"
npm -v

printf "\n node -v\n"
node -v

printf "\n npm cache clear -f\n"
npm cache clear -f

printf "\n npm ci\n"
npm ci

printf "\n jest --version\n"
jest --version
