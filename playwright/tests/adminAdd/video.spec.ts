import { test, expect } from '../../lib/fixture';
import { clickAutoSuggestion } from '../../support/commands';
import { typeCKEditor } from '../../support/ckeditor';
import { adminEditCheckTabErrorBadge, adminEditTabbedView, assertAffiliationsAllowed } from '../../support/adminEdit';

test.describe('As an admin,', () => {
    test('I can add a video', async ({ page }) => {
        await page.setViewportSize({ width: 1200, height: 1600 });
        await page.goto('/admin/add?user=uqstaff');

        // Choose a collection
        await page.getByTestId('rek-ismemberof-input').fill('a');
        await clickAutoSuggestion(page, 'rek-ismemberof', 0);

        // Choose display type
        await page.getByTestId('rek-display-type-select').click();
        await page
            .getByTestId('rek-display-type-options')
            .locator('li', { hasText: /Video/ })
            .first()
            .click();

        // Apply selections
        await expect(
            page
                .locator('button')
                .getByText(/Create work/)
                .first(),
        ).toBeVisible();
        await page
            .locator('button')
            .getByText(/Create work/)
            .first()
            .click();

        // Confirm that alert badges are present when in tabbed mode
        await adminEditTabbedView(page);
        await adminEditCheckTabErrorBadge(page, 'bibliographic', 3);
        await adminEditCheckTabErrorBadge(page, 'files');
        await adminEditTabbedView(page, false);

        // Fill required fields
        await typeCKEditor(page, 'rek-title', 'Test title');
        await page.getByTestId('rek-date-year-input').fill('2020');
        await page.getByTestId('rek-rights-input').fill('All rights reserved');
        await page.getByTestId('rek-author-add').click();
        await page.getByTestId('rek-author-input').fill('Test author');
        await page.getByTestId('rek-author-add-save').click();
        await page.getByTestId('rek-copyright-input').click();

        // Submit form
        await expect(page.locator('#admin-work-submit')).toHaveText(/Save/);
        await page.locator('#admin-work-submit').click();

        // Confirmation message
        await expect(page.locator('[role=dialog]')).toBeVisible();
        await expect(page.locator('[role=dialog]').locator('h2')).toHaveText(/Work has been added/);
    });
});

test.describe('Author affiliations', () => {
    test('should not be available for this work type', async ({ page }) => {
        await page.goto('/admin/add?user=uqstaff');

        // Choose a collection
        await page.getByTestId('rek-ismemberof-input').fill('a');
        await clickAutoSuggestion(page, 'rek-ismemberof', 0);

        // Choose display type
        await page.getByTestId('rek-display-type-select').click();
        await page
            .getByTestId('rek-display-type-options')
            .locator('li', { hasText: /Video/ })
            .first()
            .click();

        // Apply selections
        await page.waitForTimeout(200);
        await expect(
            page
                .locator('button')
                .getByText(/Create work/)
                .first(),
        ).toBeVisible();
        await page
            .locator('button')
            .getByText(/Create work/)
            .first()
            .click();
        await assertAffiliationsAllowed(page, {
            authorName: 'Steve Su (uqysu4)',
            orgName: 'The University of Queensland',
            rowId: 0,
        });
    });
});
