#!/bin/bash

export CI_NAME=CodeBuild
export COMMIT_INFO_AUTHOR=$(git show ${CI_COMMIT_ID} --no-patch --pretty=format:"%an")
export COMMIT_INFO_EMAIL=$(git show ${CI_COMMIT_ID} --no-patch --pretty=format:"%ae")
export COMMIT_INFO_MESSAGE=$(git show ${CI_COMMIT_ID} --no-patch --pretty=format:"%B")
export CI_BUILD_URL="https://ap-southeast-2.console.aws.amazon.com/codesuite/codepipeline/pipelines/fez-frontend/executions/${CI_BUILD_NUMBER}"
export TZ='Australia/Brisbane'

# Run CC only on these branches
# NB: These branches will require 3 pipelines to run all tests, branches not in this list require only 2.
CODE_COVERAGE_REQUIRED=false
if [[ ($CI_BRANCH == "master" || $CI_BRANCH == "staging" || $CI_BRANCH == "production" || $CI_BRANCH == "prodtest" || $CI_BRANCH == "codebuild" || $CI_BRANCH == "feature-react-18" || $CI_BRANCH == *"coverage"*) ]]; then
    CODE_COVERAGE_REQUIRED=true
fi

# Run CC check only (this occurs after test pipelines have finished and output test coverage artifacts)
if [[ $TEST_COVERAGE == 1 ]]; then
    source bin/codebuild-coverage.sh
fi

echo
echo "Commit Info:"
git show ${CI_COMMIT_ID} --no-patch
echo
echo

echo "COMMIT_INFO vars:"
set | grep COMMIT_INFO
echo

if [[ -z $CI_BUILD_NUMBER ]]; then
    printf "(CI_BUILD_NUMBER is not defined. Build stopped.)\n"
    exit 1
fi

if [[ -z $CI_BRANCH ]]; then
    CI_BRANCH=$(git rev-parse --abbrev-ref HEAD)
fi

printf "(Build of branch \"$CI_BRANCH\")\n"

function checkCodeStyle {
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
}

# required for Ubuntu 22.04 https://docs.cypress.io/guides/continuous-integration/introduction#Dependencies
function installCypressDependencies {
    apt-get update && apt-get -y install libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libnss3 libxss1 libasound2 libxtst6 xauth xvfb
}

if [[ $CODE_COVERAGE_REQUIRED == true ]]; then
  installCypressDependencies
fi

npm run pretest:unit:ci

case "$PIPE_NUM" in
"1")
    if [[ $CODE_COVERAGE_REQUIRED == true ]]; then
        set -e
        printf "\n--- \e[1mRUNNING E2E TESTS GROUP 1\e[0m ---\n"
        # Split the Cypress E2E tests into two groups and in this pipeline run only the ones in the first group
        source bin/codebuild-parallel.sh
        npm run test:e2e:ci1
        sed -i.bak 's,'"$CODEBUILD_SRC_DIR"',,g' coverage/cypress/coverage-final.json
    else
        printf "\n--- \e[1mRUNNING CODE STYLE CHECKS\e[0m ---\n"
        checkCodeStyle
        set -e
        printf "\n--- \e[1mRUNNING UNIT TESTS 1\e[0m ---\n"
        npm run test:unit:ci1:nocoverage
    fi
;;
"2")
    set -e

    if [[ $CODE_COVERAGE_REQUIRED == true ]]; then
        # Split the Cypress E2E tests into two groups and in this pipeline run only the ones in the second group
        source bin/codebuild-parallel.sh
        printf "\n--- \e[1mRUNNING E2E TESTS GROUP 2\e[0m ---\n"
        npm run test:e2e:ci2
        sed -i.bak 's,'"$CODEBUILD_SRC_DIR"',,g' coverage/cypress/coverage-final.json
    else
        printf "\n--- \e[1mRUNNING SERIAL UNIT TESTS\e[0m ---\n"
        npm run test:unit:ci:serial:nocoverage
        printf "\n--- \e[1mRUNNING UNIT TESTS 2\e[0m ---\n"
        npm run test:unit:ci2:nocoverage
    fi
;;
"3")
    export JEST_HTML_REPORTER_OUTPUT_PATH=coverage/jest-serial/jest-html-report.html
    if [[ $CODE_COVERAGE_REQUIRED == true ]]; then
        printf "\n--- \e[1mRUNNING CODE STYLE CHECKS\e[0m ---\n"
        checkCodeStyle
        set -e
        printf "\n--- \e[1mRUNNING UNIT TESTS\e[0m ---\n"
        # Unit tests which require --runInBand
        npm run test:unit:ci:serial
        # Replace codebuild source path as we'll compile multiple of these together to get the final code coverage
        sed -i.bak 's,'"$CODEBUILD_SRC_DIR"',,g' coverage/jest/coverage-final.json
        mv coverage/jest/coverage-final.json coverage-final.json

        # All other unit tests
        export JEST_HTML_REPORTER_OUTPUT_PATH=coverage/jest/jest-html-report.html
        npm run test:unit:ci
        sed -i.bak 's,'"$CODEBUILD_SRC_DIR"',,g' coverage/jest/coverage-final.json

        mkdir -p coverage/jest-serial && mv coverage-final.json coverage/jest-serial/coverage-final.json
    fi
;;
*)
;;
esac

# Copy empty file to prevent a build failure as we only report on combined cobertura coverage when $TEST_COVERAGE=1
mkdir -p coverage && cp cobertura-sample-coverage.xml coverage/cobertura-coverage.xml
