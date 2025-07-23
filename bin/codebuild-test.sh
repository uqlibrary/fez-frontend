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
if [[ ($CI_BRANCH == "master" || $CI_BRANCH == "staging" || $CI_BRANCH == "production" || $CI_BRANCH == "prodtest" || $CI_BRANCH == "codebuild" || $CI_BRANCH == "feature-react-18" || $CI_BRANCH == "feature-uqclien-1" || $CI_BRANCH == "feature-marcelopm-1" || $CI_BRANCH == *"coverage"*) ]]; then
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


function installPlaywrightDependencies {
    npx playwright install chromium-headless-shell
    npx playwright install-deps chromium-headless-shell
}

npm run pretest:unit:ci

case "$PIPE_NUM" in
"1")
    set -e
    installPlaywrightDependencies
    printf "\n--- \e[1mRUNNING E2E TESTS GROUP #1 [STARTING AT $(date)] 1\e[0m ---\n"
    if [[ $CODE_COVERAGE_REQUIRED == true ]]; then
        npm run test:e2e:pw:cc -- -- --shard=1/2
    else
        checkCodeStyle
        npm run test:e2e:cy
        npm run test:e2e:pw -- --shard=1/2
    fi
    printf "\n--- [ENDED AT $(date)] \n"

    if [[ $CODE_COVERAGE_REQUIRED == true ]]; then
        sed -i.bak 's,'"$CODEBUILD_SRC_DIR"',,g' coverage/playwright/coverage-final.json
    fi
;;
"2")
    set -e
    installPlaywrightDependencies
    printf "\n--- \e[1mRUNNING E2E TESTS GROUP #2 [STARTING AT $(date)] 2\e[0m ---\n"
    if [[ $CODE_COVERAGE_REQUIRED == true ]]; then
        npm run test:e2e:pw:cc -- -- --shard=2/2
    else
        npm run test:e2e:pw -- --shard=2/2
    fi
    printf "\n--- [ENDED AT $(date)] \n"

    if [[ $CODE_COVERAGE_REQUIRED == true ]]; then
        sed -i.bak 's,'"$CODEBUILD_SRC_DIR"',,g' coverage/playwright/coverage-final.json
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
