#!/bin/bash

if [[ -z $CI_BRANCH ]]; then
  CI_BRANCH=$(git rev-parse --abbrev-ref HEAD)
fi

# Not running code coverage check for feature branches.
BRANCH_INCLUDES_CC=false
if [[ ($CI_BRANCH == "master" || $CI_BRANCH == "staging" || $CI_BRANCH == "production") ]]; then
    BRANCH_INCLUDES_CC=true
fi

export TZ='Australia/Brisbane'

# Run e2e tests if in master branch, or if the branch name includes 'cypress'
# Putting * around the test-string gives a test for inclusion of the substring rather than exact match
BRANCH_RUNS_E2E=false
if [[ $CI_BRANCH == "master" || $CI_BRANCH == "staging" || $CI_BRANCH == *"cypress"* ]]; then
    BRANCH_RUNS_E2E=true
fi

if [[ -z $PIPE_NUM ]]; then
  PIPE_NUM=1
fi

case "$PIPE_NUM" in
"1")
    set -e

    printf "\n--- \e[1mRUNNING UNIT TESTS\e[0m ---\n"
    printf "Jest v"; jest --version

    # Running in series with `runInBand` to avoid CodeShip VM running out of memory
    if [[ $BRANCH_INCLUDES_CC == true ]]; then
        printf "(\"$CI_BRANCH\" build INCLUDES code coverage check)\n"
        npm run test:unit:ci1
    else
        printf "(Build of feature branch \"$CI_BRANCH\" SKIPS code coverage check)\n"
        npm run test:unit:ci1:skipcoverage
    fi

    # Second runner for e2e. The first one is in the other pipeline.
    if [[ $BRANCH_RUNS_E2E == true ]]; then
        printf "\n--- \e[1mRUNNING E2E TESTS\e[0m ---\n"
        CYPRESS_RETRIES=5 npm run test:e2e:dashboard
    fi

;;
"2")
    printf "\n--- \e[1mRUNNING CODE STYLE CHECKS\e[0m ---\n"
    printf "\n$ npm run codestyles:files -s\n"
    FILES=$(npm run codestyles:files -s)

    if [[ "$?" == 0 ]]; then
        printf "\n\e[92mLooks good! Well done.\e[0m\n\n"
    else
        printf "\n\e[91mThese files should pass code style checks but do not:\e[0m\n\n"
        for FILE in $FILES
        do
            printf "\t\e[31m$FILE\e[0m\n"
        done
        printf "\n* Please fix code styles and try again. Running '\e[1m npm run codestyles:fix:all \e[0m' is a good start."
        printf "\n* You can run '\e[1m npm run eslint \e[0m' to view ESLint code quality issues, if any.\n\n"
        exit 1
    fi

    # Setting this after codestyle checks so that script doesn't exist before list of failures can be printed above.
    set -e

    printf "\n--- \e[1mRUNNING UNIT TESTS\e[0m ---\n"
    printf "Jest v"; jest --version

    if [[ $BRANCH_INCLUDES_CC == true ]]; then
        printf "(\"$CI_BRANCH\" build INCLUDES code coverage check)\n"
        npm run test:unit:ci2
    else
        printf "(Build of feature branch \"$CI_BRANCH\" SKIPS code coverage check)\n"
        npm run test:unit:ci2:skipcoverage
    fi

    if [[ $BRANCH_RUNS_E2E == true ]]; then
        printf "\n--- \e[1mRUNNING E2E TESTS\e[0m ---\n"
        # Use this variant to only run tests locally in Codeship.
        # Turn off the e2e tests in other pipeline(s) when using this.
        # npm run test:e2e

        # Use this variant to turn on the recording to Cypress dashboard and video of the tests:
        CYPRESS_RETRIES=5 npm run test:e2e:dashboard
    fi
;;
*)
    set -e

    # Additional dynamic pipelines for e2e tests
    if [[ $BRANCH_RUNS_E2E == true ]]; then
        printf "\n--- \e[1mRUNNING E2E TESTS\e[0m ---\n"
        CYPRESS_RETRIES=5 npm run test:e2e:dashboard
    fi
;;
esac
