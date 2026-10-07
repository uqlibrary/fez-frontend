import { expect, Page } from '../test';

export const assertRichTextEditorEmpty = async (page: Page, elementDataTestId: string) => {
    const paragraph = page.locator(`.ProseMirror[data-testid="${elementDataTestId}"] > p`);

    await expect(paragraph).toHaveCount(1);
    await expect(paragraph).toHaveText('');
};

export const assertRichTextEditorValue = async (page: Page, elementDataTestId: string, expectedText: string) => {
    const editor = page.locator(`.ProseMirror[data-testid="${elementDataTestId}"]`);

    await expect(editor).toContainText(expectedText);
};

export const readRichTextEditor = async (page: Page, elementDataTestId: string) =>
    (await page.locator(`.ProseMirror[data-testid="${elementDataTestId}"]`).textContent()) ?? '';

export const typeRichTextEditor = async (page: Page, elementDataTestId: string, content: string) => {
    await page.locator(`.ProseMirror[data-testid="${elementDataTestId}"]`).fill(content);
};

/**
 * Open the "Insert special character" picker for a rich text editor, robustly.
 * The toolbar button is disabled until the Tiptap editor is editable, and its click handler sets
 * the picker's open state via a DOM ref that can race with editor re-renders under CI load - so
 * wait for the button to be enabled, then retry the click until the picker actually opens.
 */
export const openSpecialCharacters = async (page: Page, containerDataTestId: string) => {
    const button = page.getByTestId(containerDataTestId).getByRole('button', { name: 'Insert special character' });
    await expect(button).toBeEnabled();
    await expect(async () => {
        await button.click();
        await expect(page.getByTestId('special-character-close-button')).toBeVisible({ timeout: 2000 });
    }).toPass({ timeout: 20_000 });
};
