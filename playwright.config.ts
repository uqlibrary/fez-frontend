import { defineConfig, devices } from '@playwright/test';
import { Config as IstanbulMergerConfig } from './playwright/lib/coverage/istanbul/Reporter';
import { baseURL, istanbulReportPartialsDir } from './playwright/lib/constants';

export default defineConfig({
    outputDir: 'playwright/.results',
    testDir: 'playwright/tests',
    timeout: process.env.CI_BRANCH ? 120_000 : 90_000,
    expect: {
        timeout: process.env.CI_BRANCH ? 60_000 : 10_000,
    },
    fullyParallel: true,
    failOnFlakyTests: !process.env.CI_BRANCH,
    forbidOnly: !!process.env.CI_BRANCH,
    retries: process.env.CI_BRANCH ? 2 : 0,
    workers: process.env.CI_BRANCH ? '100%' : '75%',
    reporter: [
        ['list'],
        [
            './playwright/lib/coverage/istanbul/Reporter.ts',
            {
                outputDir: 'coverage/playwright',
                jsonPartialsDir: istanbulReportPartialsDir,
                jsonReportFilename: process.env.PW_CC_REPORT_FILENAME,
            } as IstanbulMergerConfig,
        ],
    ],
    use: {
        baseURL,
        trace: 'retain-on-failure',
        headless: process.env.PW_HEADED === 'true' ? false : true,
        ignoreHTTPSErrors: true,
        launchOptions: {
            args: ['--disable-web-security'],
        },
    },
    projects: [
        {
            name: 'chromium-headless-shell',
            use: {
                ...devices['Desktop Chrome'],
                viewport: {
                    width: 1000,
                    height: 660,
                },
            },
        },
    ],
    webServer: {
        command: 'npm run start:mock',
        url: baseURL,
        timeout: 5 * 60 * 1000,
        reuseExistingServer: true,
    },
});
