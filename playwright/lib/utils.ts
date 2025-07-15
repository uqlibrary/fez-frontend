import { expect, Locator, Page } from '../lib/fixture';

export async function assertIsVisible(element: Locator): Promise<void> {
    await expect(element).toBeVisible();
}
export async function assertIsNotVisible(element: Locator): Promise<void> {
    await expect(element).not.toBeInViewport({ timeout: 0 });
}

export async function clickAutoSuggestion(page: Page, fieldName: string, ordinal: string): Promise<void> {
    await expect(page.locator(`[data-testid=${fieldName}-options]`)).toBeVisible();
    const menuItem = page.locator(`#${fieldName}-option-${ordinal}`);
    await expect(page.locator(`#${fieldName}-option-${ordinal}`)).toBeVisible();
    await menuItem.click();
}
