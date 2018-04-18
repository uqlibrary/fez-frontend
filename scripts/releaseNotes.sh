#!/bin/bash

export LAST_MERGE="$(git log -1 --grep 'into production' --pretty=format:'%h')"
export PT_LIST="$(git log $LAST_MERGE..HEAD --pretty=format:"%s" --date=short | grep -oe '\d\{9\}')"

IFS=$'\n' ptList=($PT_LIST)

uniquePtList=($(printf "%s\n" "${ptList[@]}" | sort -u | tr '\n' ' '))
IFS=$' ' uniquePtList=($uniquePtList)

export TOKEN='b8d72792a0de6ccbe17756ab5fb404d6'
export PROJECT_ID=1589667

url='https://www.pivotaltracker.com/n/projects/1589667/stories/'
stories=()
bugCount=0
featuresCount=0
for task in ${uniquePtList[@]}; do
  ptStory=$(curl -X GET "https://www.pivotaltracker.com/services/v5/projects/$PROJECT_ID/stories/$task" -H "X-TrackerToken: $TOKEN" -s)
  #echo $ptStory

  IFS=$',' attributes=($ptStory)
  storyType=''
  storyName=''
  for attribute in ${attributes[@]}; do
    #echo $attribute
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

  SUBSTRING=" - ${storyName//\"name\":\"/} (${storyType//\"story_type\":\"/}) [#$task]($url$task)"
  SUBSTRING=${SUBSTRING//\"/}
  stories+=($SUBSTRING)
done

DATE=$(date +%d-%m-%Y" "%H:%M:%S);
echo "# RELEASE ON $DATE" >> changelog.md
echo "## Bugs: $bugCount" >> changelog.md
echo "## Features: $featuresCount" >> changelog.md
echo "## Stories: " >> changelog.md
for story in ${stories[@]}; do
  echo $story >> changelog.md
done

git add .
git commit -m 'updated changelog [skip ci]'
git push
