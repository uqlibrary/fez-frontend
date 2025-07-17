import { Page, expect, Locator } from '../lib/fixture';
import { baseURL } from './constants';

export const assertEnabled = async (page: Page, selector: string) => expect(page.locator(selector)).toBeEnabled();

export const assertDisabled = async (page: Page, selector: string) => expect(page.locator(selector)).toBeDisabled();

export const assertTriggersDisabled = async (page: Page, selector: string, callback: any) => {
    await assertEnabled(page, selector);
    await callback();
    await assertDisabled(page, selector);
};

export const navToHomeFromMenu = async (
    page: Page,
    locale?: { confirmationTitle: string; confirmButtonLabel: string },
) => {
    const menuButton = page.locator('button#main-menu-button');
    await menuButton.waitFor({ state: 'visible' });
    await menuButton.click();

    const menuItem0 = page.locator('#menu-item-0');
    await menuItem0.waitFor({ state: 'visible' });
    await menuItem0.click();

    if (locale && page.url() !== `${baseURL}/`) {
        const dialog = page.locator('[role="dialog"]').filter({ hasText: locale.confirmationTitle });
        await dialog.waitFor({ state: 'visible' });
        await dialog.getByRole('button', { name: locale.confirmButtonLabel }).click();
    }
};

export const fillInput = async (page: Page, selector: string, value: any, times: number = 1) => {
    await page.fill(selector, String(value).repeat(times));
};

export async function assertIsVisible(element: Locator): Promise<void> {
    await expect(element).toBeVisible();
}
export async function assertIsNotVisible(element: Locator): Promise<void> {
    await expect(element).not.toBeInViewport({ timeout: 0 });
}

export async function clickAutoSuggestion(page: Page, fieldName: string, ordinal: string | number): Promise<void> {
    await expect(page.locator(`[data-testid=${fieldName}-options]`)).toBeVisible();
    const menuItem = page.locator(`#${fieldName}-option-${ordinal}`);
    await expect(page.locator(`#${fieldName}-option-${ordinal}`)).toBeVisible();
    await menuItem.click();
}
