#!/bin/bash

#export CI_BRANCH="$CODEBUILD_SOURCE_VERSION"
#export CI_COMMIT_ID="$CODEBUILD_RESOLVED_SOURCE_VERSION"
#export CI_BUILD_NUMBER="$CODEBUILD_BUILD_ID"
export CI_NAME=CodeBuild
export COMMIT_INFO_AUTHOR=$(git show ${CI_COMMIT_ID} --no-patch --pretty=format:"%an")
export COMMIT_INFO_EMAIL=$(git show ${CI_COMMIT_ID} --no-patch --pretty=format:"%ae")
export COMMIT_INFO_MESSAGE=$(git show ${CI_COMMIT_ID} --no-patch --pretty=format:"%B")
export CI_BUILD_URL="https://ap-southeast-2.console.aws.amazon.com/codesuite/codepipeline/pipelines/fez-frontend/executions/${CI_BUILD_NUMBER}"

echo
echo "Commit Info:"
git show ${CI_COMMIT_ID} --no-patch
echo
echo

echo "COMMIT_INFO vars:"
set |grep COMMIT_INFO
echo

if [[ -z $CI_BUILD_NUMBER ]]; then
  printf "(CI_BUILD_NUMBER is not defined. Build stopped.)\n"
  exit 1
fi

if [[ -z $CI_BRANCH ]]; then
  CI_BRANCH=$(git rev-parse --abbrev-ref HEAD)
fi

# Not running code coverage check for feature branches.
# (Putting * around the test-string gives a test for inclusion of the substring rather than exact match)
CODE_COVERAGE_REQUIRED=false
if [[ ($CI_BRANCH == "master" || $CI_BRANCH == "staging" || $CI_BRANCH == "production" || $CI_BRANCH == "prodtest" || $CI_BRANCH == "codebuild" || $CI_BRANCH == *"coverage"*) ]]; then
    CODE_COVERAGE_REQUIRED=true
fi

export TZ='Australia/Brisbane'

# dont run cypress tests if the branch name includes 'nocypress'
CYPRESS_TESTS_REQUIRED=true
if [[ $CI_BRANCH == *"nocypress"* ]]; then
    CYPRESS_TESTS_REQUIRED=false
fi

if [[ -z $PIPE_NUM ]]; then
  PIPE_NUM=1
fi

function checkCoverage {
     npm run cc:reportAll

     # four instances of `<span class="strong">100% </span>` indicates 100% code coverage
     ls -la coverage/index.html

     grep -c class=\"strong\"\>100\% coverage/index.html

     NUM_FULL_COVERAGE=$(grep -c class=\"strong\"\>100\% coverage/index.html)
     echo "full coverage count = ${NUM_FULL_COVERAGE} (wanted: 4)"
     if [[ $NUM_FULL_COVERAGE == 4 ]]; then
         echo "Coverage 100%";
         echo ""
         echo '            ,-""-.'
         echo "           :======:"
         echo "           :======:"
         echo "            '-..-"
         echo "              ||"
         echo "            _,  --.    _____"
         echo "           \(/ __   '._|"
         echo "          ((_/_)\     |"
         echo "           (____)'.___|"
         echo "            (___)____.|_____"
         echo "Human, your code coverage was found to be satisfactory. Great job!"
     else
         echo "                     ____________________"
         echo "                    /                    \ "
         echo "                    |      Coverage       | "
         echo "                    |      NOT 100%       | "
         echo "                    \____________________/ "
         echo "                             !  !"
         echo "                             !  !"
         echo "                             L_ !"
         echo "                            / _)!"
         echo "                           / /__L"
         echo "                     _____/ (____)"
         echo "                            (____)"
         echo "                     _____  (____)"
         echo "                          \_(____)"
         echo "                             !  !"
         echo "                             !  !"
         echo "                             \__/"
         echo ""
         echo "            Human, your code coverage was found to be lacking... Do not commit again until it is fixed."
         # show actual coverage numbers
         grep -A 2 class=\"strong\"\> coverage/index.html
         echo "Run your tests locally with npm run test:cc then load coverage/index.html to determine where the coverage gaps are"
         exit 1;
     fi;
}

case "$PIPE_NUM" in
"1")
    set -e

    printf "\n--- \e[1mRUNNING UNIT TESTS\e[0m ---\n"
    printf "Jest v"; jest --version

    # Running in series with `runInBand` to avoid CodeShip VM running out of memory
    if [[ $CODE_COVERAGE_REQUIRED == true ]]; then
        printf "(Build of feature branch \"$CI_BRANCH\" INCLUDES code coverage check)\n"

        printf "\n--- \e[1mRUNNING JEST UNIT TESTS for code coverage\e[0m ---\n"
        npm run test:unit:ci

        printf "\n--- \e[1mRUNNING CYPRESS TESTS for code coverage check\e[0m ---\n"
        npm run test:e2e:cc

        checkCoverage
    else
        printf "(Build of feature branch \"$CI_BRANCH\" SKIPS code coverage check)\n"

        printf "\n--- \e[1mRUNNING JEST UNIT TESTS (pipeline 1, no code coverage)\e[0m ---\n"
        npm run test:unit:ci1:skipcoverage

        # Second runner for e2e. The first one is in the other pipeline.
        if [[ $CYPRESS_TESTS_REQUIRED == true ]]; then
          printf "\n--- \e[1mRUNNING CYPRESS TESTS (pipeline 1, no code coverage)\e[0m ---\n"
            npm run test:e2e:dashboard
        fi
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

    # Setting this after codestyle checks so that this script doesn't exit before list of failures can be printed above.
    set -e

    if [[ $CODE_COVERAGE_REQUIRED == true ]]; then
        printf "(Build of feature branch \"$CI_BRANCH\" INCLUDES code coverage check - at least for the moment, all tests run in other pipeline)\n"
    else
        printf "(Build of feature branch \"$CI_BRANCH\" SKIPS code coverage check)\n"

        printf "\n--- \e[1mRUNNING JEST UNIT TESTS (pipeline 2, no code coverage)\e[0m ---\n"
        printf "Jest v"; jest --version
        npm run test:unit:ci2:skipcoverage

        if [[ $CYPRESS_TESTS_REQUIRED == true ]]; then
            printf "\n--- \e[1mRUNNING CYPRESS TESTS (pipeline 2, no code coverage)\e[0m ---\n"
            # Use this variant to only run tests locally in Codeship.
            # Turn off the e2e tests in other pipeline(s) when using this.
            # npm run test:e2e

            # Use this variant to turn on the recording to Cypress dashboard and video of the tests:
            npm run test:e2e:dashboard
        fi
    fi
;;
*)
    set -e

    # Additional dynamic pipelines for e2e tests
    if [[ $CYPRESS_TESTS_REQUIRED == true ]]; then
        printf "\n--- \e[1mRUNNING E2E TESTS\e[0m ---\n"
        npm run test:e2e:dashboard
    fi
;;
esac
