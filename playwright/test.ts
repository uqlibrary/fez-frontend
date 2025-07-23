import { test as base } from '@playwright/test';
import { collectCoverageAsync } from './lib/coverage/istanbul/collectCoverageAsync';
import { istanbulReportPartialsDir } from './lib/constants';
import { PRODUCTION_API_URL } from 'config/general';

export * from '@playwright/test';

let test = base;

test = test.extend({
    // mock external API calls
    page: async ({ page }, use) => {
        await page.route('https://www.googletagmanager.com/gtm.js?id=*', route => {
            route.fulfill({
                status: 204,
                body: '',
            });
        });
        await page.route(`${PRODUCTION_API_URL}alerts/current**`, route => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([]),
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
