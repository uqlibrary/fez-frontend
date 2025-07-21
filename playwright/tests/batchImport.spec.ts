import { test, expect } from '../test';

import validationErrorsLocale from 'locale/validationErrors';
import { navToHomeFromMenu } from '../lib/helpers';

test.describe('Batch import', () => {
    const validationErrors = validationErrorsLocale.validationErrorsSummary;
    const initialFieldIDs = ['community-pid', 'doc-type-id', 'directory'];

    test.afterEach(async ({ page }) => {
        await navToHomeFromMenu(page);
    });

    test('should work as expected', async ({ page }) => {
        const confirmInitialValidations = async () => {
            const scope = page.getByTestId('batch-import-validation').locator('.alert-text', { hasText: /Validation/ });
            await expect(scope.getByTestId('validation-warning-0')).toHaveText(validationErrors.communityID);
            await expect(scope.getByTestId('validation-warning-1')).toHaveText(validationErrors.doc_type_id);
            await expect(scope.getByTestId('validation-warning-2')).toHaveText(validationErrors.directory);
            await expect(
                page.getByTestId('batch-import-validation').locator('[data-testid*=validation-warning-]'),
            ).toHaveCount(3);
        };

        const selectItem = async (field: string, option: number, validationMessage: string | null = null) => {
            await page.getByTestId(`${field}-select`).click();
            await page.getByTestId(`${field}-option-${option}`).click();

            if (validationMessage) {
                await expect(page.getByTestId('batch-import-validation')).not.toHaveText(validationMessage);
            }
        };
        await page.goto('/batch-import?user=digiteamMember');
        // Check for expected elements
        await expect(page.locator('h2')).toHaveCount(1);
        await expect(page.locator('h2')).toHaveText(/CSV ingest/);

        for (const fieldID of initialFieldIDs) {
            await expect(page.getByTestId(`${fieldID}-select`)).toBeVisible();
        }
        await expect(page.getByTestId('community-pid-label')).toHaveText(/Select a community/);
        await expect(page.getByTestId('doc-type-id-label')).toHaveText(/Select a document type/);
        await expect(page.getByTestId('directory-label')).toHaveText(
            /Select folder where CSV and datastream files are located/,
        );

        confirmInitialValidations();
        await expect(page.getByTestId('batch-import-cancel')).toHaveText(/Cancel and return to the homepage/);
        await expect(page.getByTestId('batch-import-submit')).toHaveText(/Ingest now/);
        await expect(page.getByTestId('batch-import-submit')).toBeDisabled();

        // Select community
        await selectItem('community-pid', 1, validationErrors.communityID);

        // Make sure collection dropdown appears
        await expect(page.getByTestId('collection-pid-select')).toBeVisible();
        await expect(page.getByTestId('collection-pid-label')).toHaveText(/Select a collection/);
        await expect(page.getByTestId('batch-import-validation')).toContainText(validationErrors.collection_pid);

        // Select collection
        await selectItem('collection-pid', 1, validationErrors.collection_pid);

        // Select doctype
        await selectItem('doc-type-id', 1, validationErrors.doc_type_id);

        // Select directory
        await selectItem('directory', 1);
        await expect(page.getByTestId('batch-import-validation')).not.toBeVisible();
        await expect(page.getByTestId('batch-import-submit')).not.toBeDisabled();
        await expect(page.getByTestId('batch-import-submit')).toHaveText('Ingest now');
        await page.getByTestId('batch-import-submit').click();

        // form submitted and the green 'all good' message appears, with 'start another' button
        await expect(page.getByTestId('alert-done-batch-import')).toHaveText(/Success/);
        await expect(page.getByTestId('alert-done-batch-import')).toHaveText(
            /The request to batch-import has been submitted successfully\./,
        );
        await page
            .getByTestId('alert-done-batch-import')
            .locator('button', { hasText: /Start another ingest/ })
            .click();

        // form is ready to go again and the validation errors re-appear
        confirmInitialValidations();
        await expect(page.getByTestId('batch-import-submit')).toBeDisabled();
    });
});
