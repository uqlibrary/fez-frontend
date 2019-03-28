#!/bin/bash

export TZ='Australia/Brisbane'

printf "\n---- RUNNING ESLint ---\n"
printf "\n$ npm run eslint\n"
npm run eslint

printf "\n--- RUNNING UNIT TESTS ---\n"
# Not running code coverage check for feature branches.
# Running in series with `runInBand` to avoid CodeShip VM running out of memory
if [[ ($CI_BRANCH == "master" || $CI_BRANCH == "staging" || $CI_BRANCH == "production") ]]; then
    printf "(\"$CI_BRANCH\" build INCLUDES code coverage check)\n"
    printf "\n$ npm run test:unit -- --ci --runInBand\n"
    npm run test:unit -- --ci --runInBand
else
    printf "(Build of feature branch \"$CI_BRANCH\" SKIPS code coverage check)\n"
    printf "\n$ npm run test:unit -- --ci --runInBand --no-coverage\n"
    npm run test:unit -- --ci --runInBand --no-coverage
fi

# Run integration tests
printf "\n--- RUNNING INTEGRATION TESTS ---\n"
printf "\n$ npm run test:integration\n"
npm run test:integration
