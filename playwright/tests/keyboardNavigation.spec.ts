import { test, expect } from '../test';

test.describe('Keyboard and screen reader navigation', () => {
    test.use({ viewport: { width: 1280, height: 900 } });

    test('the first tab stop is a skip link that moves focus to the main content', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('.StandardPage')).toBeVisible();
        await expect(page.locator('#simple-search-input')).not.toBeFocused();

        await page.keyboard.press('Tab');
        const skipLink = page.getByRole('link', { name: 'Skip to main content' });
        await expect(skipLink).toBeFocused();
        await expect(skipLink).toBeInViewport();

        await page.keyboard.press('Enter');
        await expect(page.getByRole('main')).toBeFocused();
    });

    test('an external menu item is a single tab stop', async ({ page }) => {
        await page.goto('/');
        const copyright = page.getByRole('button', { name: 'Copyright Information (opens in a new window)' });
        await copyright.focus();
        await page.keyboard.press('Tab');
        await expect(page.locator('#cricos-link')).toBeFocused();
    });

    test('the hidden scroll to top button is not a tab stop', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('.StandardPage')).toBeVisible();
        await page.locator('#cricos-link').focus();
        await page.keyboard.press('Tab');
        await expect(page.locator('#scrolltopbtn')).not.toBeFocused();
        await expect(page.locator('#scrolltopbtn')).toHaveCSS('visibility', 'hidden');
    });

    test('choosing a menu item moves focus to the new page heading', async ({ page }) => {
        await page.goto('/?user=uqresearcher');
        await page.getByRole('button', { name: 'My works' }).focus();
        await page.keyboard.press('Enter');
        await expect(page.getByRole('heading', { level: 2, name: 'My works' })).toBeFocused();
        await expect(page).toHaveTitle(/^My works/);
    });
});
