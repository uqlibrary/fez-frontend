import { Page } from '../lib/fixture';

export const typeCKEditor = async (page: Page, elementDataTestId: string, content: string) => {
    const locator = page.locator(`[data-testid="${elementDataTestId}"] [contenteditable]`);
    await locator.waitFor({ state: 'visible' });
    await locator.fill(content);
};
