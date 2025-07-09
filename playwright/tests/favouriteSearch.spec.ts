import { expect, test } from '../lib/fixture';

// Base URL from environment or test config
const baseUrl = process.env.BASE_URL || '';

test.describe('Favourite search bookmark', () => {
    test('should direct to advanced search page', async ({ page }) => {
        await page.goto('/published?user=uqstaff');
        await expect(page).toHaveURL(new RegExp(`${baseUrl}/records/search`));
    });
});

test.describe('Favourite searches', () => {
    test('should rename and delete a search item correctly', async ({ page }) => {
        await page.goto('/admin/favourite-search?user=uqstaff');

        // Rename first item
        await page.locator('[data-testid="favourite-search-list-item-1-edit"]').click();
        const descInput = page.locator('[data-testid="fvs-description-input"]');
        await descInput.fill('New value test');
        await page.locator('[data-testid="favourite-search-list-item-1-save"]').click();
        await expect(page.locator('[data-testid="fvs-description-1"]')).toContainText('New value test');

        // Delete that item
        await page.locator('[data-testid="favourite-search-list-item-1-delete"]').click();
        await page.locator('[data-testid="favourite-search-list-item-1-save"]').click();
        await expect(page.locator('[data-testid="fvs-description-1"]')).toHaveCount(0);
    });
});
