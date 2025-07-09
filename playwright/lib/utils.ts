import { expect, Locator } from '@playwright/test';

export async function assertIsVisible(element: Locator): Promise<void> {
    await expect(element).toBeVisible();
}
export async function assertIsNotVisible(element: Locator): Promise<void> {
    await expect(element).not.toBeInViewport({ timeout: 0 });
}
