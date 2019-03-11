#!/bin/bash

# exit if command returns error (non-zero status)
set -e

echo "npm -v"
npm -v

echo "node -v"
node -v

echo "jest --version"
jest --version

echo "npm cache clear -f"
npm cache clear -f

echo "npm ci"
npm ci

echo "jest --version"
jest --version
