#!/bin/bash

export TZ='Australia/Brisbane'

echo "Running ESLint..."
npm run eslint

echo "Running Jest..."
# Not running code coverage check for feature branches.
# Running in series with `runInBand` to avoid CodeShip VM running out of memory
if [[ (${CI_BRANCH} == "master" || ${CI_BRANCH} == "staging" || ${CI_BRANCH} == "production") ]]; then
    echo "(Includes code coverage check)"
    npm test -- --ci --runInBand
else
    echo "(Skipping code coverage check)"
    npm test -- --ci --runInBand --no-coverage
fi

# Run integration tests
# Enable for master/staging
if [[ (${CI_BRANCH} === 'feature-integration-tests')]]; then
    echo "Running integration test..."
    npm run test:integration
fi
