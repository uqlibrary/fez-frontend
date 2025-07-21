import { test, expect } from '../../../test';
import { typeCKEditor } from '../../../lib/ckeditor';

test.describe('As an admin,', () => {
    test('I can edit a community', async ({ page }) => {
        await page.goto('/admin/edit/UQ:3883?user=uqstaff');
        await expect(
            page
                .locator('h2')
                .getByText(/Edit Community/)
                .first(),
        ).toBeVisible();

        // Wait for event handlers to attach
        await typeCKEditor(page, 'rek-title', 'The University of Queensland Library With Extra Data UPDATED');
        await typeCKEditor(page, 'rek-description', 'Test community description UPDATED');
        await page.getByTestId('rek-keywords-list-row-1-delete').click();
        await expect(page.locator('h2').getByText(/Delete keyword/)).toBeVisible();
        await page
            .locator('button')
            .getByText(/Yes/)
            .first()
            .click();
        await typeCKEditor(page, 'ain-notes', 'Test internal notes UPDATED');
        await page.getByTestId('reason-input').fill('Automated Update test for Community');
        await page
            .locator('button')
            .getByText(/Save/)
            .first()
            .click();
        await expect(page.locator('h2').getByText(/Work has been updated/)).toBeVisible();
    });
});
