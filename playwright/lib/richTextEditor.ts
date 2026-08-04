import { expect, Page } from '../test';

export const assertRichTextEditorEmpty = async (page: Page, elementDataTestId: string) => {
    const paragraph = page.locator(`.ProseMirror[data-testid="${elementDataTestId}"] > p`);

    await expect(paragraph).toHaveCount(1);
    await expect(paragraph).toHaveText('');
};

export const readRichTextEditor = async (page: Page, elementDataTestId: string) =>
    (await page.locator(`.ProseMirror[data-testid="${elementDataTestId}"]`).textContent()) ?? '';

export const typeRichTextEditor = async (page: Page, elementDataTestId: string, content: string) => {
    await page.locator(`.ProseMirror[data-testid="${elementDataTestId}"]`).fill(content);
};
