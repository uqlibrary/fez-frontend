import { test, expect } from '../../../test';
import { typeCKEditor } from '../../../lib/ckeditor';

test.describe('As an admin,', () => {
    test('I can edit a collection', async ({ page }) => {
        await page.goto('/admin/edit/UQ:11399?user=uqstaff');
        await expect(
            page
                .locator('h2')
                .getByText(/Edit Collection/)
                .first(),
        ).toBeVisible();

        // Wait for event handlers to attach
        await page
            .getByTestId('rek-ismemberof-1')
            .locator('svg')
            .click();

        // cycle through the known default view types and ensure
        // each option is displayed after being selected
        const defaultViewSelector = page.locator('[data-testid=collection-view-type-select]');
        await page.locator('[data-testid=collection-view-type-select]').click();
        const defaultViewOptions = page.locator('[data-testid=collection-view-type-options]');
        await page
            .locator('[data-testid=collection-view-type-options]')
            .locator('li', { hasText: /Auto/ })
            .first()
            .click();
        await expect(defaultViewSelector.getByText(/Auto/).first()).toBeVisible();
        await defaultViewSelector.click();
        await defaultViewOptions
            .locator('li', { hasText: /Standard/ })
            .first()
            .click();
        await expect(defaultViewSelector.getByText(/Standard/).first()).toBeVisible();
        await defaultViewSelector.click();
        await defaultViewOptions
            .locator('li', { hasText: /Image Gallery/ })
            .first()
            .click();
        await expect(defaultViewSelector.getByText(/Image Gallery/).first()).toBeVisible();
        await typeCKEditor(
            page,
            'rek-title',
            'Aboriginal and Torres Strait Islander Studies Unit Publications With Extra Data UPDATED',
        );
        await typeCKEditor(page, 'rek-description', 'Test collection description UPDATED');
        await page.locator('[data-testid=rek-keywords-list-row-2-delete]').click();
        await expect(page.locator('h2').getByText(/Delete keyword/)).toBeVisible();
        await page
            .locator('button')
            .getByText(/Yes/)
            .first()
            .click();
        await typeCKEditor(page, 'ain-notes', 'Test internal notes UPDATED');
        await page.locator('[data-testid=reason-input]').fill('Automated Update test for Collection');
        await page
            .locator('button')
            .getByText(/Save/)
            .first()
            .click();
        await expect(page.locator('h2').getByText(/Work has been updated/)).toBeVisible();
    });
});
