import { test as base } from '@playwright/test';
import { collectCoverageAsync } from './coverage/istanbul/collectCoverageAsync';
import { istanbulReportPartialsDir } from '../support/constants';

export * from '@playwright/test';

export const test = base.extend({
    context: async ({ context }, use) => {
        await collectCoverageAsync(context, use, istanbulReportPartialsDir);
    },
});
