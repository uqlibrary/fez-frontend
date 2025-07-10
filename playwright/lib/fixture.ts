import { test as base } from '@playwright/test';
import { collectCoverageAsync } from './coverage/istanbul/collectCoverageAsync';
import { istanbulReportPartialsDir } from '../support/constants';

export * from '@playwright/test';

let test = base;
// enable istanbul coverage collecting
if (process?.env?.NODE_ENV === 'cc') {
    test = base.extend({
        context: async ({ context }, use) => {
            await collectCoverageAsync(context, use, istanbulReportPartialsDir);
        },
    });
}
export { test };
