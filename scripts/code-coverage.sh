#!/bin/bash

cd coverage

PLAYWRIGHT_REPORT=playwright/${PW_CC_REPORT_FILENAME-coverage-final.json}
JEST_REPORT=jest/coverage-final.json
JEST_SERIAL_REPORT=jest-serial/coverage-final.json

if [ ! -f "$PLAYWRIGHT_REPORT" ]; then
    echo "Playwright test report not found! Merge aborted."
    exit 1
fi

if [ ! -f "$JEST_REPORT" ]; then
    echo "Jest test report not found! Merge aborted."
    exit 1
fi

# Clean processing directories
rm -rf all temp
mkdir all temp

# Copy test reports into common location
cp "$PLAYWRIGHT_REPORT" all/playwright.json
cp "$JEST_REPORT" all/jest.json
cp "$JEST_SERIAL_REPORT" all/jest-serial.json

# Combine reports into single json file
npm run cc:merge:all

# Report
cd ..
npm run cc:report:html