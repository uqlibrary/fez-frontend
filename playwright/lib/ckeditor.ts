import { expect, Page } from '../test';

export const assertCKEditorEmpty = async (page: Page, elementDataTestId: string) => {
    await expect(
        page.locator(`[data-testid="${elementDataTestId}"] .ck-editor__main p [data-cke-filler="true"]`),
    ).toHaveCount(1);
};

export const readCKEditor = async (page: Page, testId: string) =>
    (await page.locator(`[data-testid="${testId}"] .ck-editor__main p`).textContent()) ?? '';

export const typeCKEditor = async (page: Page, elementDataTestId: string, content: string) =>
    await page.locator(`[data-testid="${elementDataTestId}"] [contenteditable]`).fill(content);
