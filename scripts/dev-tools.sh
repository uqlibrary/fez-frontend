#!/bin/bash

cd $(dirname "${BASH_SOURCE}")/..

usage () {
    echo
    echo "The following functions are available:"
    echo
    echo "  get-uql-x-token                         login into staging using a cypress tests script"
    echo "  start:staging-session [?host]           same as SESSION_COOKIE_NAME=\$TOKEN npm start:url, but with a login prompt"
    echo
}

get-uql-x-token () {
    cd scripts/dev-tools

    export CYPRESS_ESPACE_HOST="${1}"
    export CYPRESS_ESPACE_AUTH_ID="${2}"
    export CYPRESS_ESPACE_AUTH_PASSWORD="${3}"

    SILENT=$(../../node_modules/.bin/cypress run)
    # bail if it fails
    if [[ $? -ne 0 ]]; then
        echo -e "Wrong credentials"  && exit 1
    fi

    # print saved session token and delete it from disk
    cat cypress/fixtures/token
    rm cypress/fixtures/token
}

start:staging-session () {
    # include dev env if available
    source .env > /dev/null 2>&1

    # prompt for credentials
    echo -ne "Username: ${ESPACE_STAGING_USERNAME}\n"
    if [ -z "${ESPACE_STAGING_USERNAME}" ]; then
        read USERNAME
    fi
    echo -ne "Password: "
    read -s PASSWORD
    echo -e "\n"

    # login using provided credentials
    TOKEN=$(get-uql-x-token "${1:-$ESPACE_STAGING_HOST}" "${USERNAME:-$ESPACE_STAGING_USERNAME}" "$PASSWORD")
    # bail if it fails
    if [[ $? -ne 0 ]]; then
        echo -e "$TOKEN"  && exit 1
    fi

    SESSION_COOKIE_NAME="$TOKEN" npm run start:url
}

if declare -f "$1" > /dev/null; then
    "$@"
else
    usage
fi
