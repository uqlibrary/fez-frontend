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

    test('pages have their own browser title', async ({ page }) => {
        for (const [url, title] of [
            ['/about', /^About/],
            ['/records/incomplete?user=uqresearcher', /^My incomplete works/],
            ['/records/my-open-access?user=uqresearcher', /^My open access/],
            ['/tool/lookup?user=uqstaff', /^Lookup Tools/],
        ] as const) {
            await page.goto(url);
            await expect(page).toHaveTitle(title);
        }
    });

    test('a redirect while the page loads leaves focus at the start, so the skip link is first', async ({ page }) => {
        // Without a search, the results step redirects to the find step during load.
        await page.goto('/records/add/results?user=uqresearcher');
        await expect(page).toHaveURL(/\/records\/add\/find/);
        await expect(page.getByRole('heading', { level: 2 }).first()).toBeVisible();
        await page.keyboard.press('Tab');
        await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
    });

    test('pages with a search box do not take focus away from the skip link on load', async ({ page }) => {
        for (const url of ['/journals/search/?user=uqresearcher', '/records/add/find?user=uqresearcher']) {
            await page.goto(url);
            await expect(page.locator('main input').first()).toBeVisible();
            await page.keyboard.press('Tab');
            await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
        }
    });
});
