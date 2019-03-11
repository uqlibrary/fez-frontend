#!/bin/bash

# exit if command returns error (non-zero status)
set -e

printf "\n npm -v"
npm -v

printf "\n node -v"
node -v

printf "\n npm cache clear -f"
npm cache clear -f

printf "\n npm ci"
npm ci

printf "\n jest --version"
jest --version
