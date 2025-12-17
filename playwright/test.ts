import { test as base } from '@playwright/test';
import { collectCoverageAsync } from './lib/coverage/istanbul/collectCoverageAsync';
import { istanbulReportPartialsDir } from './lib/constants';

export * from '@playwright/test';

let test = base;

test = test.extend({
    // mock external API calls
    page: async ({ page }, use) => {
        await page.route('https://www.googletagmanager.com/**', route => {
            route.fulfill({
                status: 204,
                body: '',
            });
        });
        await page.route(' https://api.library.uq.edu.au/**', route => {
            route.fulfill({
                status: 200,
                body: '{}',
            });
        });
        await page.route('https://**.sentry.io/**', route => {
            route.fulfill({
                status: 200,
                body: '{}',
            });
        });
        // next
        await use(page);
    },
});

// enable istanbul coverage collecting
if (process?.env?.NODE_ENV === 'cc') {
    test = test.extend({
        context: async ({ context }, use) => {
            await collectCoverageAsync(context, use, istanbulReportPartialsDir);
        },
    });
}

export { test };
