import { test, expect } from '../../../test';

test.describe('Thesis admin add', () => {
    test('should correctly set the Bibliographic sub-type when the display type is Thesis', async ({ page }) => {
        await page.goto('/admin/add?user=uqstaff');

        await expect(page.locator('h2')).toContainText('Add a new work');
        await page.getByTestId('rek-ismemberof-input').click();

        await page
            .locator('li[role="option"]')
            .first()
            .click();

        // Choose display type
        await page.getByTestId('rek-display-type-select').click();
        await page
            .getByTestId('rek-display-type-options')
            .locator('li', { hasText: 'Thesis' })
            .click();

        // Choose subtype
        await page.getByTestId('rek-subtype-select').click();
        await page
            .getByTestId('rek-subtype-options')
            .locator('li', { hasText: 'Honours Thesis' })
            .click();

        // Apply selections
        await page.getByRole('button', { name: 'Create work' }).click();
        await expect(page.locator('h2')).toContainText('Add a new Thesis');
        await expect(page.getByTestId('rek-genre-type-input')).toHaveValue('Honours Thesis');
    });
});
