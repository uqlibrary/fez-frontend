#!/bin/bash

export TZ='Australia/Brisbane'

printf "\n---- RUNNING ESLint ---\n"
printf "\n$ npm run eslint\n"
npm run eslint

printf "\n--- RUNNING JEST ---\n"
# Not running code coverage check for feature branches.
# Running in series with `runInBand` to avoid CodeShip VM running out of memory
if [[ ($CI_BRANCH == "master" || $CI_BRANCH == "staging" || $CI_BRANCH == "production") ]]; then
    printf "(\"$CI_BRANCH\" build INCLUDES code coverage check)\n"
    printf "\n$ npm test -- --ci --runInBand\n"
    npm test -- --ci --runInBand
else
    printf "(Build of feature branch \"$CI_BRANCH\" SKIPS code coverage check)\n"
    printf "\n$ npm test -- --ci --runInBand --no-coverage\n"
    npm test -- --ci --runInBand --no-coverage
fi

# Run integration tests
# Enable for master/staging
if [[ (${CI_BRANCH} == 'feature-integration-tests')]]; then
    echo "Running integration test..."
    npm run test:integration
fi
