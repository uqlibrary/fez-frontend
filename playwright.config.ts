import { defineConfig, devices } from '@playwright/test';
import { Config as IstanbulMergerConfig } from './playwright/lib/coverage/istanbul/ReportMerger';
import { baseURL, istanbulReportPartialsDir } from './playwright/lib/constants';
import * as process from 'node:process';

export default defineConfig({
    outputDir: `playwright/.results/${process.env.PW_SHARD_INDEX || ''}`,
    testDir: 'playwright/tests',
    timeout: 120_000,
    expect: {
        timeout: 20_000,
    },
    fullyParallel: true,
    failOnFlakyTests: !process.env.CI_BRANCH,
    forbidOnly: !!process.env.CI_BRANCH,
    retries: process.env.CI_BRANCH ? 2 : 0,
    workers: process.env.CI_BRANCH ? '100%' : '75%',
    reporter: [
        ['list'],
        [
            './playwright/lib/coverage/istanbul/ReportMerger.ts',
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
        bypassCSP: true,
        launchOptions: {
            args: ['--disable-web-security', '--disable-ipv6'],
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
