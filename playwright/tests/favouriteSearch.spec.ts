import { expect, test } from '../test';

test.describe('Favourite search bookmark', () => {
    test('should direct to advanced search page', async ({ page }) => {
        await page.goto('/published?user=uqstaff');
        await expect(page).toHaveURL(new RegExp('/records/search'));
    });
});

test.describe('Favourite searches', () => {
    test('should rename and delete a search item correctly', async ({ page }) => {
        await page.goto('/admin/favourite-search?user=uqstaff');
        // Rename first item
        await page.getByTestId('favourite-search-list-item-1-edit').click();
        const descInput = page.getByTestId('fvs-description-input');
        await descInput.fill('New value test');
        await page.getByTestId('favourite-search-list-item-1-save').click();
        await expect(page.getByTestId('fvs-description-1')).toContainText('New value test');
        // Delete that item
        await page.getByTestId('favourite-search-list-item-1-delete').click();
        await page.getByTestId('favourite-search-list-item-1-save').click();
        await expect(page.getByTestId('fvs-description-1')).toHaveCount(0);
    });
});
