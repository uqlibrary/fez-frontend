import { test as testBase, expect } from '@playwright/test';
import { addCoverageReport } from 'monocart-reporter';

const test = testBase.extend({
    context: async ({ context }, use) => {
        await context.addInitScript(() =>
            window.addEventListener('beforeunload', () => window.collectIstanbulCoverage(window.__coverage__)),
        );
        await context.exposeFunction('collectIstanbulCoverage', coverage => {
            if (coverage) {
                addCoverageReport(coverage, test.info());
            }
        });
        await use(context);
        for (const page of context.pages()) {
            await page.evaluate(() => window.collectIstanbulCoverage(window.__coverage__));
        }
    },
});

export { test, expect };
