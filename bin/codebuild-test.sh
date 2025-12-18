#!/bin/bash

export CI_NAME=CodeBuild
export COMMIT_INFO_AUTHOR=$(git show ${CI_COMMIT_ID} --no-patch --pretty=format:"%an")
export COMMIT_INFO_EMAIL=$(git show ${CI_COMMIT_ID} --no-patch --pretty=format:"%ae")
export COMMIT_INFO_MESSAGE=$(git show ${CI_COMMIT_ID} --no-patch --pretty=format:"%B")
export CI_BUILD_URL="https://ap-southeast-2.console.aws.amazon.com/codesuite/codepipeline/pipelines/fez-frontend/executions/${CI_BUILD_NUMBER}"
export TZ='Australia/Brisbane'
export PW_CC_REPORT_FILENAME="coverage-final-${PIPE_NUM}.json"
export PW_SHARD_COUNT=20

# Run CC only on these branches
# NB: These branches will require 3 pipelines to run all tests, branches not in this list require only 2.
CODE_COVERAGE_REQUIRED=false
if [[ ($CI_BRANCH == "master" || $CI_BRANCH == "staging" || $CI_BRANCH == "production" || $CI_BRANCH == "prodtest" || $CI_BRANCH == "codebuild" || $CI_BRANCH == "feature-uqlsibba-1" || $CI_BRANCH == "feature-uqclien-1" || $CI_BRANCH == "feature-marcelopm-1" || $CI_BRANCH == *"coverage"*) ]]; then
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

function check_code_style() {
    printf "\n--- \e[1mRUNNING CODE STYLE CHECKS\e[0m ---\n"
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

function fix_coverage_report_paths() {
    if [[ ! -f "$1" ]]; then
        return 0
    fi

    sed -i.bak 's,'"$CODEBUILD_SRC_DIR"',,g' "$1"
}

function install_pw_deps() {
    printf "\n--- \e[INSTALLING PW DEPS [STARTING AT $(date)] 1\e[0m ---\n"
    sed -i 's|http://archive.ubuntu.com/ubuntu|http://ap-southeast-2.ec2.archive.ubuntu.com/ubuntu|g' /etc/apt/sources.list
    sed -i 's|http://security.ubuntu.com/ubuntu|http://ap-southeast-2.ec2.archive.ubuntu.com/ubuntu|g' /etc/apt/sources.list
    apt-get clean
    apt-get update
    npx playwright install chromium-headless-shell
    npx playwright install-deps chromium-headless-shell
    printf "\n--- \e[ENDED INSTALLING PW DEPS AT $(date)] 1\e[0m ---\n"
}

function run_pw_tests() {
    set -e
    export PW_SHARD_INDEX="$1"
    local LIMIT="$2"

    printf "\n--- \e[1mRUNNING E2E TESTS GROUP #$PIPE_NUM [STARTING AT $(date)] 2\e[0m ---\n"

    while (( PW_SHARD_INDEX <= LIMIT ))
    do
        if (( PW_SHARD_INDEX == LIMIT )); then
            export PW_IS_LAST_SHARD=true
        fi

        run_pw_test_shard "${PW_SHARD_INDEX}"
        fix_coverage_report_paths "coverage/playwright/coverage-final.json"

        ((PW_SHARD_INDEX++))
    done

    printf "\n--- [ENDED RUNNING E2E TESTS GROUP #$PIPE_NUM AT $(date)] \n"
}

function run_pw_test_shard() {
    local SHARD_INDEX="${1-PW_SHARD_INDEX}"
    if [[ $CODE_COVERAGE_REQUIRED != true ]]; then
        npm run test:e2e -- --shard="${SHARD_INDEX}/${PW_SHARD_COUNT}"
        return 0
    fi

    npm run test:e2e:cc -- -- --shard="${SHARD_INDEX}/${PW_SHARD_COUNT}"
}

check_code_style

case "$PIPE_NUM" in
"1")
    npm run start:mock &
    install_pw_deps
    run_pw_tests 1 7
;;
"2")
    npm run start:mock &
    install_pw_deps
    run_pw_tests 8 20
;;
"3")
    set -e
    printf "\n\n--- INSTALL JEST ---\n"
    npm install -g jest nyc
    printf "\n--- \e[1mRUNNING UNIT TESTS\e[0m ---\n"
    if [[ $CODE_COVERAGE_REQUIRED == true ]]; then
        export JEST_HTML_REPORTER_OUTPUT_PATH=coverage/jest-serial/jest-html-report.html
        # Jest tests which are required to run in serial
        npm run test:unit:ci:serial
        fix_coverage_report_paths coverage/jest-serial/coverage-final.json
        # All other jest tests
        export JEST_HTML_REPORTER_OUTPUT_PATH=coverage/jest/jest-html-report.html
        npm run test:unit:ci
        fix_coverage_report_paths coverage/jest/coverage-final.json
    else
        npm run test:unit:ci:serial:nocoverage
        npm run test:unit:ci:nocoverage
    fi
;;
*)
;;
esac

# Copy empty file to prevent a build failure as we only report on combined cobertura coverage when $TEST_COVERAGE=1
mkdir -p coverage && cp cobertura-sample-coverage.xml coverage/cobertura-coverage.xml
