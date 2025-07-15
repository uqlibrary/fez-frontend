import { defineConfig, devices } from '@playwright/test';
import { Config as IstanbulMergerConfig } from './playwright/lib/coverage/istanbul/Reporter';
import { baseURL, istanbulReportPartialsDir } from './playwright/support/constants';

export default defineConfig({
    outputDir: 'playwright/.results',
    testDir: 'playwright/tests',
    timeout: 30 * 1000, // cy alike
    expect: {
        timeout: 10000, // cy alike
    },
    fullyParallel: process.env.PW_SERIAL === 'true' ? false : true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? '100%' : '75%',
    reporter: [
        ['list'],
        [
            './playwright/lib/coverage/istanbul/Reporter.ts',
            {
                outputDir: 'coverage/playwright',
                jsonPartialsDir: istanbulReportPartialsDir,
            } as IstanbulMergerConfig,
        ],
    ],
    use: {
        baseURL,
        // collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer
        // trace: 'on-first-retry',
        headless: process.env.PW_HEADED === 'true' ? false : true,
        ignoreHTTPSErrors: true,
        video: 'retain-on-failure',
        launchOptions: {
            args: [
                '--disable-web-security', // cy alike chromeWebSecurity: false
            ],
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
        reuseExistingServer: !process.env.CI,
    },
});
