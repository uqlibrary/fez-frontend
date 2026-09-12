import { defineConfig, devices } from '@playwright/test';
import { Config as IstanbulMergerConfig } from './playwright/lib/coverage/istanbul/ReportMerger';
import { baseURL, istanbulReportPartialsDir, istanbulStructureDir } from './playwright/lib/constants';
import * as process from 'node:process';
import * as os from 'node:os';

// CI runs at '50%' (2 workers on the 4-vCPU pipe). Local dev is capped at 4 workers (the lesser of the
// machine's 50% and 4) to limit local memory and CPU use.
const localWorkers = Math.min(4, Math.max(1, Math.floor(os.cpus().length / 2)));

export default defineConfig({
    outputDir: `playwright/.results/${process.env.PW_SHARD_INDEX || ''}`,
    testDir: 'playwright/tests',
    timeout: 120_000,
    expect: {
        timeout: 20_000,
    },
    fullyParallel: !process.env.CI_BRANCH,
    failOnFlakyTests: !process.env.CI_BRANCH,
    forbidOnly: !!process.env.CI_BRANCH,
    retries: process.env.CI_BRANCH ? 2 : 0,
    workers: process.env.CI_BRANCH ? '50%' : localWorkers,
    // e2e istanbul coverage: the collector (playwright/test.ts, NODE_ENV=cc) writes per-test counts
    // partials + write-once structures; this reporter rejoins and merges them into coverage/playwright.
    reporter: [
        ['list'],
        [
            './playwright/lib/coverage/istanbul/ReportMerger.ts',
            {
                outputDir: 'coverage/playwright',
                jsonPartialsDir: istanbulReportPartialsDir,
                structureDir: istanbulStructureDir,
                jsonReportFilename: process.env.PW_CC_REPORT_FILENAME,
            } as IstanbulMergerConfig,
        ],
    ],
    use: {
        baseURL,
        trace: 'on-first-retry',
        headless: process.env.PW_HEADED === 'true' ? false : true,
        ignoreHTTPSErrors: true,
        bypassCSP: true,
        launchOptions: {
            args: ['--disable-web-security', '--disable-ipv6', '--disable-dev-shm-usage'],
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
