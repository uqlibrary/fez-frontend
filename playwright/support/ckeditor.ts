import { expect, Page } from '../lib/fixture';

export const typeCKEditor = async (page: Page, elementDataTestId: string, content: string) => {
    const locator = page.locator(`[data-testid="${elementDataTestId}"] [contenteditable]`);
    await locator.waitFor({ state: 'visible' });
    await locator.fill(content);
};

export const assertCKEditorEmpty = async (page: Page, elementDataTestId: string) => {
    const container = page.locator(`[data-testid="${elementDataTestId}"] .ck-editor__main p`);
    await expect(container).toBeVisible();
    await expect(container.locator('[data-cke-filler="true"]')).toHaveCount(1);
};
