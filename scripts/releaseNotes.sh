#!/bin/bash

# required environment variables:
# PT_TOKEN - pivotal tracker api token
# PT_PROJECT - pivotal tracker project id

if [[ "$PT_TOKEN" == "" || "$CI_BRANCH" == "" || "$PT_PROJECT" == "" ]]; then
  echo "Please set environmental variables to run the script...."
  exit 0
fi

# generage notes only for production/staging branches
if [[ "$CI_BRANCH" != "production" && "$CI_BRANCH" != "staging" ]]; then
  echo "release notes are generated only for production/staging branch"
  exit 0
fi

gitComment="into $CI_BRANCH"

# get all comments since previous merge with PT ids
lastMerge="$(git log -2 --grep "$gitComment" --pretty=format:'%h')"
IFS=$'\n' lastMerge=($lastMerge)

if [[ "$lastMerge" == "" || ${#lastMerge[@]} -ne 2 ]]; then
  echo "no merges to $CI_BRANCH found"
  exit 0
fi

# codeship grep (uses perl style regexp)
commentsWithPT="$(git log ${lastMerge[1]}..HEAD --pretty=format:"%s" | grep -Poe '\d{9}')"

# local dev
#commentsWithPT="$(git log ${lastMerge[1]}..HEAD --pretty=format:"%s" | grep -oe '\d\{9\}')"

if [[ "$commentsWithPT" == "" ]]; then
  echo "no PT stories attached to this release"
  exit 0
fi

# clean up tasks - get unique tasks only
IFS=$'\n' allTasksList=($commentsWithPT)
tasksList=($(printf "%s\n" "${allTasksList[@]}" | sort -u | tr '\n' ' '))
IFS=$' ' tasksList=($tasksList)

taskUrl="https://www.pivotaltracker.com/n/projects/$PT_PROJECT/stories/"
stories=()
bugCount=0
featuresCount=0

for task in ${tasksList[@]}; do
  # get PT story details
  ptStory=$(curl -X GET "https://www.pivotaltracker.com/services/v5/projects/$PT_PROJECT/stories/$task" -H "X-TrackerToken: $PT_TOKEN" -s)

  IFS=$',' attributes=($ptStory)
  storyType=''
  storyName=''
  for attribute in ${attributes[@]}; do
    if [[ "$attribute" =~ story_type ]]; then
      if [[ "$attribute" =~ bug ]]; then
        ((bugCount++))
      else
        ((featuresCount++))
      fi
      storyType=$attribute
    fi
    if [[ "$attribute" =~ name && "$storyName" == "" ]]; then
      storyName=$attribute
    fi
  done

  changeLogLine=" - ${storyName//\"name\":\"/} (${storyType//\"story_type\":\"/}) [#$task]($taskUrl$task)"
  changeLogLine=${changeLogLine//\"/}
  stories+=($changeLogLine)
done

NEWLINE=$'\n'
DATE=$(date +%d-%m-%Y" "%H:%M:%S);
releaseNotes="## **$CI_BRANCH** - RELEASE ON $DATE${NEWLINE}"
releaseNotes="$releaseNotes### Bugs: $bugCount${NEWLINE}"
releaseNotes="$releaseNotes### Features/Chores: $featuresCount${NEWLINE}"
releaseNotes="$releaseNotes### Stories:${NEWLINE}"

for story in ${stories[@]}; do
  releaseNotes="$releaseNotes$story${NEWLINE}"
done

echo $releaseNotes
