#!/bin/bash

printf "\n--- \e[1mRUNNING CODE STYLE CHECKS\e[0m ---\n"
printf "\n$ prettier-eslint '**/*.js' --list-different -l silent\n"
FILES=$(prettier-eslint '**/*.js' --list-different -l silent)

if [[ "$?" == 0 ]]; then
    printf "\n\e[92mLooks good! Well done.\e[0m\n\n"
else
    printf "\n\e[91mThese files should pass code style checks but do not:\e[0m\n\n"
    for FILE in $FILES
    do
        printf "\t\e[31m$FILE\e[0m\n"
    done
    printf "\n* Please fix code styles and try again. Running '\e[1mnpm run codestyles:fix:all\e[0m' is a good start."
    printf "\n* You can run '\e[1mnpm run eslint\e[0m' to view ESLint code quality issues, if any.\n\n"
    exit 1
fi

set -e

export TZ='Australia/Brisbane'

printf "\n--- \e[1mRUNNING UNIT TESTS\e[0m ---\n"
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
printf "\n--- \e[1mRUNNING INTEGRATION TESTS\e[0m ---\n"
printf "\n$ npm run test:integration\n"
npm run test:integration
