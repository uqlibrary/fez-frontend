import { test, expect } from '../../../test';
import {
    addAffiliationAndAssert,
    addAuthorAndAssert,
    adminEditCheckTabErrorBadge,
    adminEditTabbedView,
    editAffiliationAndAssert,
} from '../helpers';
import { clickAutoSuggestion, testIdStartsWith } from '../../../lib/helpers';
import { typeCKEditor } from '../../../lib/ckeditor';

test.describe('As an admin,', () => {
    test('I can add a journal article', async ({ page }) => {
        await page.goto('/admin/add?user=uqstaff');

        // Choose a collection
        await page.getByTestId('rek-ismemberof-input').fill('a');
        await clickAutoSuggestion(page, 'rek-ismemberof', 0);

        // Choose display type
        await page.getByTestId('rek-display-type-select').click();
        await page
            .getByTestId('rek-display-type-options')
            .locator('li', { hasText: /Journal Article/ })
            .first()
            .click();

        // Choose sub type
        await page.getByTestId('rek-subtype-select').click();
        await page
            .getByTestId('rek-subtype-options')
            .locator('li', { hasText: /Article \(original research\)/ })
            .first()
            .click();

        // Apply selections
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
        await page.getByTestId('rek-author-add').click();
        await page.getByTestId('rek-author-input').fill('Test author');
        await page.getByTestId('rek-author-add-save').click();
        await page.getByTestId('rek-copyright-input').click();

        // Lookup journal
        await page.getByTestId('fez-matched-journals-input').fill('acta');
        await clickAutoSuggestion(page, 'fez-matched-journals', 0);

        // Submit form
        await expect(page.locator('#admin-work-submit')).toHaveText(/Save/);
        await page.locator('#admin-work-submit').click();

        // Confirmation message
        await expect(page.getByRole('dialog').locator('h2')).toHaveText(/Work has been added/);
    });
    test.describe('Author Affiliations', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('/admin/add?user=uqstaff');

            // Choose a collection
            await page.getByTestId('rek-ismemberof-input').fill('a');
            await clickAutoSuggestion(page, 'rek-ismemberof', 0);

            // Choose display type
            await page.getByTestId('rek-display-type-select').click();
            await page
                .getByTestId('rek-display-type-options')
                .locator('li', { hasText: /Journal Article/ })
                .first()
                .click();

            // Choose sub type
            await page.getByTestId('rek-subtype-select').click();
            await page
                .getByTestId('rek-subtype-options')
                .locator('li', { hasText: /Article \(original research\)/ })
                .first()
                .click();

            // Apply selections
            await page
                .locator('button')
                .getByText(/Create work/)
                .first()
                .click();

            // Confirm that alert badges are present when in tabbed mode
            await adminEditTabbedView(page);
            await adminEditCheckTabErrorBadge(page, 'bibliographic', 3);
            await adminEditCheckTabErrorBadge(page, 'authors');
            await adminEditCheckTabErrorBadge(page, 'files');
            await adminEditTabbedView(page, false);

            // Fill required fields
            await typeCKEditor(page, 'rek-title', 'Test title with affiliations');
            await page.getByTestId('rek-date-year-input').fill('2020');
        });

        test.afterEach(async ({ page }) => {
            await page.getByTestId('rek-copyright-input').click();

            // Lookup journal
            await page.getByTestId('fez-matched-journals-input').fill('acta');
            await clickAutoSuggestion(page, 'fez-matched-journals', 0);

            // Submit form
            await expect(page.locator('#admin-work-submit')).toHaveText(/Save/);
            await page.locator('#admin-work-submit').click();

            // Confirmation message
            await expect(page.getByRole('dialog')).toBeVisible();
            await expect(page.getByRole('dialog').locator('h2')).toHaveText(/Work has been added/);
        });

        test('is only used for linked authors', async ({ page }) => {
            await page.getByTestId('rek-author-add').click();
            await page.getByTestId('rek-author-input').fill('User, Test');
            await page.getByTestId('rek-author-add-save').click();
            await expect(page.locator('[data-testid^="contributor-errorIcon-"]')).not.toBeVisible();
        });

        test('can be added and edited', async ({ page }) => {
            await addAuthorAndAssert(page, 'Steve Su (uqysu4)', 85004);
            await addAffiliationAndAssert(page, 'Aboriginal and Torres Strait Islander Studies Unit', 877, '100%');
            await editAffiliationAndAssert(page, 877, 973, 'Academic Administration', '100%');
            await expect(page.getByTestId('affiliationSaveBtn')).not.toBeDisabled();
            await expect(page.getByTestId('deleteOrgBtn-973')).toBeVisible();
            await page.getByTestId('deleteOrgBtn-973').click();
            await expect(page.getByTestId('affiliationSaveBtn')).toBeDisabled();
            await expect(page.getByTestId('orgSelect-877-input')).not.toBeVisible();
            await expect(page.getByTestId('orgChip-877')).not.toBeVisible();
            await expect(page.getByTestId('orgSelect-973-input')).not.toBeVisible();
            await expect(page.getByTestId('orgChip-973')).not.toBeVisible();
            await addAffiliationAndAssert(page, 'Aboriginal and Torres Strait Islander Studies Unit', 877, '100%');
            await expect(page.getByTestId('affiliationSaveBtn')).not.toBeDisabled();
            await page.getByTestId('affiliationSaveBtn').click();
            await expect(
                page
                    .getByTestId('detailPanel-85004')
                    .locator('[data-testid=orgChip-877]', { hasText: /100%/ })
                    .first(),
            ).toBeVisible();
            await expect(
                page
                    .getByTestId('detailPanel-85004')
                    .getByText(/Aboriginal and Torres Strait Islander Studies Unit/)
                    .first(),
            ).toBeVisible();
            await expect(page.getByTestId('affiliationCancelBtn')).not.toBeVisible();
            await expect(page.getByTestId('affiliationSaveBtn')).not.toBeVisible();
            await expect(page.getByTestId('orgChip-error')).not.toBeVisible();
            await expect(page.getByTestId('expandPanelIcon-85004')).toBeVisible();
            await page.getByTestId('expandPanelIcon-85004').click();

            await addAuthorAndAssert(page, "O'Donoghue, Steven (uqsodono)", 75121);
            await addAffiliationAndAssert(page, 'Aboriginal and Torres Strait Islander Studies Unit', 877, '100%');
            await expect(page.getByTestId('affiliationSaveBtn')).not.toBeDisabled();

            // add suggested org (coverage)
            await addAffiliationAndAssert(
                page,
                'Suggested: Information Systems and Resource Services (University of Queensland Library)',
                1248,
                '50%',
                true,
            );
            await expect(page.getByTestId('orgChip-877')).toBeVisible();
            await expect(
                page
                    .getByTestId('orgChip-877')
                    .getByText(/50%/)
                    .first(),
            ).toBeVisible();
            await addAffiliationAndAssert(page, 'Academic Administration Directorate', 1113, '33.333%');
            await expect(page.getByTestId('orgChip-877')).toBeVisible();
            await expect(
                page
                    .getByTestId('orgChip-877')
                    .getByText(/33\.334%/)
                    .first(),
            ).toBeVisible();
            await expect(page.getByTestId('orgChip-1248')).toBeVisible();
            await expect(
                page
                    .getByTestId('orgChip-1248')
                    .getByText(/33\.333%/)
                    .first(),
            ).toBeVisible();
            await expect(page.getByTestId('affiliationSaveBtn')).not.toBeDisabled();
            await page.getByTestId('affiliationSaveBtn').click();
            await expect(page.getByTestId('detailPanel-75121').locator('[data-testid=orgChip-877]')).toContainText(
                /33\.334%/,
            );
            await expect(
                page
                    .getByTestId('detailPanel-75121')
                    .getByText(/Aboriginal and Torres Strait Islander Studies Unit/)
                    .first(),
            ).toBeVisible();
            await expect(
                page
                    .getByTestId('detailPanel-75121')
                    .getByText(/Information Systems and Resource Services \(University of Queensland Library\)/)
                    .first(),
            ).toBeVisible();
            await expect(
                page
                    .getByTestId('detailPanel-75121')
                    .locator('[data-testid=orgChip-1113]', { hasText: /33\.333%/ })
                    .first(),
            ).toBeVisible();
            await expect(
                page
                    .getByTestId('detailPanel-75121')
                    .getByText(/Academic Administration Directorate/)
                    .first(),
            ).toBeVisible();
            await expect(page.getByTestId('affiliationCancelBtn')).not.toBeVisible();
            await expect(page.getByTestId('affiliationSaveBtn')).not.toBeVisible();
            await expect(page.getByTestId('orgChip-error')).not.toBeVisible();
            await expect(page.getByTestId('expandPanelIcon-75121')).toBeVisible();
            await page.getByTestId('expandPanelIcon-75121').click();

            await addAuthorAndAssert(page, 'Kisely, Steve (uqskisely)', 78152);
            await addAffiliationAndAssert(page, 'Aboriginal and Torres Strait Islander Studies Unit', 877, '100%');
            await expect(page.getByTestId('affiliationSaveBtn')).not.toBeDisabled();
            await addAffiliationAndAssert(page, 'Academic Administration', 973, '50%');
            await expect(page.getByTestId('orgChip-877')).toBeVisible();
            await expect(
                page
                    .getByTestId('orgChip-877')
                    .getByText(/50%/)
                    .first(),
            ).toBeVisible();
            await addAffiliationAndAssert(page, 'Academic Administration Directorate', 1113, '33.333%');
            await expect(page.getByTestId('orgChip-877')).toBeVisible();
            await expect(
                page
                    .getByTestId('orgChip-877')
                    .getByText(/33\.334%/)
                    .first(),
            ).toBeVisible();
            await expect(page.getByTestId('orgChip-973')).toBeVisible();
            await expect(
                page
                    .getByTestId('orgChip-973')
                    .getByText(/33\.333%/)
                    .first(),
            ).toBeVisible();

            // now test resetting to non-herdc, which should clear the above
            await addAffiliationAndAssert(page, '!NON-HERDC', 1062, '100%');
            await expect(page.getByTestId('orgChip-877')).not.toBeVisible();
            await expect(page.getByTestId('orgChip-973')).not.toBeVisible();
            await expect(page.getByTestId('orgChip-1113')).not.toBeVisible();
            // auto adds suggestion
            await expect(page.getByTestId('orgChip-1248')).toBeVisible();
            await expect(
                page
                    .getByTestId('orgChip-1248')
                    .getByText(/0%/)
                    .first(),
            ).toBeVisible();
            await expect(page.getByTestId('orgSelect-1248-input')).toHaveValue(
                'Information Systems and Resource Services (University of Queensland Library)',
            );
            // hides the add autocomplete element
            await expect(page.getByTestId('orgSelect-add-input')).not.toBeVisible();
            await expect(page.getByTestId('affiliationSaveBtn')).not.toBeDisabled();
            await page.getByTestId('affiliationSaveBtn').click();
            await expect(
                page
                    .getByTestId('detailPanel-78152')
                    .locator('[data-testid=orgChip-1062]', { hasText: /100%/ })
                    .first(),
            ).toBeVisible();
            await expect(
                page
                    .getByTestId('detailPanel-78152')
                    .getByText(/!NON-HERDC/)
                    .first(),
            ).toBeVisible();
            await expect(
                page
                    .getByTestId('detailPanel-78152')
                    .locator('[data-testid=orgChip-1248]', { hasText: /0%/ })
                    .first(),
            ).toBeVisible();
            await expect(
                page
                    .getByTestId('detailPanel-78152')
                    .getByText(/Information Systems and Resource Services \(University of Queensland Library\)/)
                    .first(),
            ).toBeVisible();
            await expect(page.getByTestId('affiliationCancelBtn')).not.toBeVisible();
            await expect(page.getByTestId('affiliationSaveBtn')).not.toBeVisible();
            await expect(page.getByTestId('orgChip-error')).not.toBeVisible();

            // Now edit non-herdc to remove that option
            await page.getByTestId('affiliationEditBtn-78152').click();
            await expect(page.getByTestId('orgSelect-1062-input')).toHaveValue('!NON-HERDC');
            await expect(page.getByTestId('orgChip-1062')).toBeVisible();
            await expect(
                page
                    .getByTestId('orgChip-1062')
                    .getByText(/100%/)
                    .first(),
            ).toBeVisible();
            await expect(page.getByTestId('orgSelect-1248-input')).toHaveValue(
                'Information Systems and Resource Services (University of Queensland Library)',
            );
            await expect(page.getByTestId('orgChip-1248')).toBeVisible();
            await expect(
                page
                    .getByTestId('orgChip-1248')
                    .getByText(/0%/)
                    .first(),
            ).toBeVisible();
            await expect(page.getByTestId('deleteOrgBtn-1062')).toBeVisible();
            await page.getByTestId('deleteOrgBtn-1062').click();
            await expect(page.getByTestId('orgSelect-1062-input')).not.toBeVisible();
            await expect(page.getByTestId('orgChip-1062')).not.toBeVisible();
            await expect(page.getByTestId('orgChip-1248')).toBeVisible();
            await expect(
                page
                    .getByTestId('orgChip-1248')
                    .getByText(/100%/)
                    .first(),
            ).toBeVisible();

            // shows the add autocomplete element
            await expect(page.getByTestId('orgSelect-add-input')).toBeVisible();
            await expect(page.getByTestId('affiliationSaveBtn')).not.toBeDisabled();
            await page.getByTestId('affiliationSaveBtn').click();
            await expect(
                page
                    .getByTestId('detailPanel-78152')
                    .locator('[data-testid=orgChip-1248]', { hasText: /100%/ })
                    .first(),
            ).toBeVisible();
            await expect(
                page
                    .getByTestId('detailPanel-78152')
                    .getByText(/Information Systems and Resource Services \(University of Queensland Library\)/)
                    .first(),
            ).toBeVisible();

            // currentOrgId, nextOrgId, nextOrgName, expectedPercent) =
            await testIdStartsWith(page, 'affiliationEditBtn-').click();
            await editAffiliationAndAssert(page, 1248, 1062, '!NON-HERDC', '100%');
            // double check the suggested org has been re-added
            await expect(page.getByTestId('orgSelect-1248-input')).toBeVisible();
            await expect(page.getByTestId('orgSelect-1248-input')).toHaveValue(
                'Information Systems and Resource Services (University of Queensland Library)',
            );
            await expect(page.getByTestId('orgChip-1248')).toBeVisible();
            await expect(
                page
                    .getByTestId('orgChip-1248')
                    .getByText(/0%/)
                    .first(),
            ).toBeVisible();

            // hides the add autocomplete element
            await expect(page.getByTestId('orgSelect-add-input')).not.toBeVisible();
            await expect(page.getByTestId('affiliationSaveBtn')).not.toBeDisabled();
            await page.getByTestId('affiliationSaveBtn').click();
            await expect(
                page
                    .getByTestId('detailPanel-78152')
                    .locator('[data-testid=orgChip-1062]', { hasText: /100%/ })
                    .first(),
            ).toBeVisible();
            await expect(
                page
                    .getByTestId('detailPanel-78152')
                    .getByText(/!NON-HERDC/)
                    .first(),
            ).toBeVisible();
            await expect(
                page
                    .getByTestId('detailPanel-78152')
                    .locator('[data-testid=orgChip-1248]', { hasText: /0%/ })
                    .first(),
            ).toBeVisible();
            await expect(
                page
                    .getByTestId('detailPanel-78152')
                    .getByText(/Information Systems and Resource Services \(University of Queensland Library\)/)
                    .first(),
            ).toBeVisible();
            await expect(page.getByTestId('affiliationCancelBtn')).not.toBeVisible();
            await expect(page.getByTestId('affiliationSaveBtn')).not.toBeVisible();
            await expect(page.getByTestId('orgChip-error')).not.toBeVisible();
            await expect(page.getByTestId('expandPanelIcon-78152')).toBeVisible();
            await page.getByTestId('expandPanelIcon-78152').click();
        });
    });

    test.describe('Changing the display type', () => {
        test('does not force a subtype error', async ({ page }) => {
            await page.goto('/admin/add?user=uqstaff');

            // Choose a collection
            await page.getByTestId('rek-ismemberof-input').fill('a');
            await clickAutoSuggestion(page, 'rek-ismemberof', 0);

            // Choose display type
            await page.getByTestId('rek-display-type-select').click();
            await page
                .getByTestId('rek-display-type-options')
                .getByText('Journal Article')
                .click();

            await page.getByTestId('rek-display-type-select').click();
            await page
                .getByTestId('rek-display-type-options')
                .getByText('Working Paper')
                .click();

            await page.getByRole('button', { name: 'Create work' }).click();

            // Assert that the subtype error message is NOT present
            await expect(
                page.getByTestId('alert-message').locator('li', { hasText: 'Work subtype is required' }),
            ).not.toBeVisible();
        });
    });
});
