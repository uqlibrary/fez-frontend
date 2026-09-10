 #!/bin/bash

# exit if command returns error (non-zero status)
set -e

printf "Node "; node -v;
printf "NPM "; npm -v

printf "\n$ npm cache clear\n"
# npm cache verify
npm cache clear -f

echo "$ npm ci"
npm ci
