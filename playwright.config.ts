import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './playwright/tests',
    timeout: 30 * 1000, // cy alike
    expect: {
        timeout: 10000, // cy alike
    },
    fullyParallel: true,
    // Opt out of parallel tests on CI
    // workers: process.env.CI ? 1 : undefined,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    reporter: [
        [
            'monocart-reporter',
            {
                coverage: {
                    logging: 'debug',
                    name: 'Playwright Istanbul Coverage Report',
                    outputDir: 'coverage/playwright',
                    reports: ['cobertura', 'html', 'json'],
                    outputFile: null,
                },
            },
        ],
    ],
    use: {
        baseURL: 'http://localhost:3000',
        // Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer
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
            retries: 2,
            testDir: './playwright/tests',
            use: {
                ...devices['Desktop Chrome'],
            },
        },
    ],
    webServer: {
        command: 'npm run start:mock',
        url: 'http://localhost:3000',
        timeout: 120 * 1000,
        reuseExistingServer: !process.env.CI,
    },
});
