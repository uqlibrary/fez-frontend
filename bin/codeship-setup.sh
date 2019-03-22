#!/bin/bash

# exit if command returns error (non-zero status)
set -e

printf "\nA. --- DISPLAY VERSIONS FOR POSSIBLE DEBUG ---\n"
printf "\n$ npm -v\n"
npm -v

printf "\n$ node -v\n"
node -v

printf "\nB. --- CLEAR NPM CACHE ---\n"
printf "\n$ npm cache clear -f\n"
npm cache clear -f

printf "\nC. --- INSTALL NPM ---\n"
printf "\n$ npm ci\n"
npm ci

printf "\nD. --- DISPLAY JEST VERSION FOR POSSIBLE DEBUG ---\n"
printf "\n$ jest --version\n"
jest --version
