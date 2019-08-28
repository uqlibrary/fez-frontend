#!/bin/bash

# exit if command returns error (non-zero status)
set -e

printf "Node "; node -v;
printf "(Codeship default) npm v"; npm -v

echo "--- GET LATEST VERSION OF NPM 6 ---"
echo "$ npm install -g npm@6"
npm install -g npm@6

printf "Now running npm v"; npm -v

echo "$ npm cache verify"
npm cache verify

echo "--- INSTALL DEPENDENCIES ---"
echo "$ npm ci"
npm ci
