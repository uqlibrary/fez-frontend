import { defineConfig, devices } from '@playwright/test';
import { Config as IstanbulMergerConfig } from './playwright/lib/coverage/IstanbulReporter';

export const istanbulReportPartialsDir = 'coverage/playwright/partials';

export default defineConfig({
    testDir: 'playwright/tests',
    timeout: 30 * 1000, // cy alike
    expect: {
        timeout: 10000, // cy alike
    },
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
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
        baseURL: 'http://localhost:3000',
        // collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer
        // trace: 'on-first-retry',
        headless: true,
        viewport: { width: 1280, height: 720 },
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
            },
        },
    ],
    webServer: {
        command: 'npm run start:mock',
        url: 'http://localhost:3000',
        timeout: 5 * 60 * 1000,
        reuseExistingServer: !process.env.CI,
    },
});
