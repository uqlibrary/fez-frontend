import { expect, test } from '../test';

test.describe('viewRecord', () => {
    test('Renders the Work not found message for a 404', async ({ page }) => {
        await page.goto('/view/UQ:abc123');
        await expect(page.locator('h2')).toContainText('Work not found');
        await expect(page.getByText('404')).toHaveCount(1);
    });

    test('Renders the Work not found message for a 404 for a record with lower case uq', async ({ page }) => {
        await page.goto('/view/uq:abc123');
        await expect(page.locator('h2')).toContainText('Work not found');
        await expect(page.getByText('404')).toHaveCount(1);
    });
});
