import { test, expect } from '../test';

test.describe('Add missing record', () => {
    test.describe('add new', () => {
        test.beforeEach(async ({ page }) => await page.goto('/records/add/new'));

        test('should enable the submit button on form render only', async ({ page }) => {
            // Journal article requires subtype selection
            await page.getByTestId('rek-display-type-select').click();
            await expect(page.locator('#submit-work')).not.toBeVisible();
            await page
                .getByTestId('rek-display-type-options')
                .locator('li[role=option]')
                .getByText(/Journal Article/)
                .first()
                .click();
            await expect(page.locator('#submit-work')).not.toBeVisible();
            await page.getByTestId('rek-subtype-select').click();
            await page
                .getByTestId('rek-subtype-options')
                .locator('li[role=option]')
                .getByText(/Editorial/)
                .click();
            await expect(page.locator('#submit-work')).toBeDisabled();

            // Start over
            await page.reload();

            // Dept. Tech. report has no subtypes
            await page.getByTestId('rek-display-type-select').click();
            await page
                .getByTestId('rek-display-type-options')
                .locator('li[role=option]')
                .getByText(/Department Technical Report/)
                .click();
            await expect(page.locator('#submit-work')).toBeVisible();
            await expect(page.locator('#submit-work')).toBeDisabled();
        });

        test('should show and hide an Author selection error', async ({ page }) => {
            // Journal article requires subtype selection
            await expect(page.getByTestId('rek-display-type-select')).toBeVisible();
            await page.getByTestId('rek-display-type-select').click();

            await expect(page.locator('#submit-work')).not.toBeVisible();

            await page
                .getByTestId('rek-display-type-options')
                .locator('li[role=option]')
                .getByText(/Journal Article/)
                .first()
                .click();

            await expect(page.locator('#submit-work')).not.toBeVisible();
            await expect(page.getByTestId('rek-subtype-select')).toBeVisible();
            await page.getByTestId('rek-subtype-select').click();
            await page
                .getByTestId('rek-subtype-options')
                .locator('li[role=option]', { hasText: 'Article (original research)' })
                .click();

            await expect(page.locator('#submit-work')).toBeDisabled();
            await page.getByTestId('authors-input').fill('New Author');
            await page.getByTestId('authors-add').click();
            await expect(page.getByTestId('authors-error')).toContainText(
                'Please provide a list as described and select one as you',
            );
            await page.getByText('New Author').click();
            await expect(page.getByTestId('authors-error')).not.toBeVisible();
            await page.getByText('New Author').click();
            await expect(page.getByTestId('authors-error')).toContainText(
                'Please provide a list as described and select one as you',
            );
        });

        test('should validate form as expected', async ({ page }) => {
            // Choose Book > Textbook
            await page.getByTestId('rek-display-type-select').click();
            await page
                .getByTestId('rek-display-type-options')
                .locator('li[role=option]')
                .getByText(/Book/)
                .nth(0)
                .click();
            await page.getByTestId('rek-subtype-select').click();
            await page
                .getByTestId('rek-subtype-options')
                .locator('li[role=option]')
                .getByText(/Textbook/)
                .click();

            // Verify cards
            const cards = [
                'Work type',
                'Book information',
                'Authors',
                'Editors',
                'ISBN',
                'ISSN',
                'Optional details',
                'Optional: Content Indicators',
                'Upload files',
            ];

            for (const [index, cardHeading] of cards.entries()) {
                await expect(
                    page
                        .locator('h3')
                        .nth(index)
                        .getByText(cardHeading),
                ).toBeVisible();
            }

            // Submit button
            await expect(page.locator('#submit-work')).toBeDisabled();

            // Validation errors
            const invalidFieldNames = [
                'Author/creator names',
                'Editor/contributor names',
                'Title',
                'Place of publication',
                'Publisher',
                'Publication date',
            ];
            const validationErrors = page.locator('[data-testid=alert] li');
            await expect(page.locator('[data-testid=alert] li')).toHaveCount(invalidFieldNames.length);
            for (const invalidFieldName of invalidFieldNames) {
                await expect(validationErrors.getByText(invalidFieldName)).toBeVisible();
            }
            await page.getByTestId('rek-title-input').fill('book title');
            await page.getByTestId('rek-place-of-publication-input').fill('test place of publication');
            await page.getByTestId('rek-publisher-input').fill('test publisher');
            await page.getByTestId('rek-date-year-input').fill('2020');
            await expect(validationErrors).toHaveCount(2);
            await page.getByTestId('rek-author-input').fill('New Author');
            await page.getByTestId('rek-author-add').click();
            await page.getByText(/New Author/).click();
            await expect(page.locator('#submit-work')).toBeEnabled();
            await page.locator('#rek-author-list-row-delete-0').click();
            await page
                .locator('button')
                .getByText(/Yes/)
                .click();
            await expect(page.locator('#submit-work')).toBeDisabled();
            await expect(validationErrors).toHaveCount(2);
            await page.locator('#rek-contributor-input').fill('New Editor');
            await page.getByTestId('rek-contributor-add').click();
            await page.getByText(/New Editor/).click();
            await expect(page.locator('#submit-work')).toBeEnabled();
        });

        test('should display doi existed error', async ({ page }) => {
            // Choose Book > Textbook
            await page.getByTestId('rek-display-type-select').click();
            await page
                .getByTestId('rek-display-type-options')
                .locator('li[role=option]')
                .getByText(/Book/)
                .nth(0)
                .click();
            await page.getByTestId('rek-subtype-select').click();
            await page
                .getByTestId('rek-subtype-options')
                .locator('li[role=option]')
                .getByText(/Textbook/)
                .click();

            // Submit button
            await expect(page.locator('#submit-work')).toBeDisabled();

            // Validation errors
            const invalidFieldNames = [
                'Author/creator names',
                'Editor/contributor names',
                'Title',
                'Place of publication',
                'Publisher',
                'Publication date',
            ];
            const validationErrors = page.locator('[data-testid=alert] li');
            await expect(page.locator('[data-testid=alert] li')).toHaveCount(invalidFieldNames.length);
            for (const invalidFieldName of invalidFieldNames) {
                await expect(validationErrors.getByText(invalidFieldName)).toBeVisible();
            }
            await page.getByTestId('rek-title-input').fill('book title');
            await page.getByTestId('rek-place-of-publication-input').fill('test place of publication');
            await page.getByTestId('rek-publisher-input').fill('test publisher');
            await page.getByTestId('rek-date-year-input').fill('2020');
            await expect(validationErrors).toHaveCount(2);
            await page.getByTestId('rek-author-input').fill('New Author');
            await page.getByTestId('rek-author-add').click();
            await page.getByText(/New Author/).click();
            await page.getByTestId('rek-doi-input').fill('10.1426/12345');
            await expect(page.locator('#submit-work')).toBeEnabled();
            await page.locator('#submit-work').click();
            await expect(
                page.getByTestId('rek-doi-helper-text').getByText(/DOI is assigned to another work/),
            ).toBeVisible();
            await expect(validationErrors).toHaveCount(1);
            await expect(page.locator('#submit-work')).toBeDisabled();
        });
    });

    // a NON RHD student is prompted in case they have a student account
    test.describe('Non RHD adding a Thesis', () => {
        test('is prompted that theses could be added elsewhere', async ({ page }, baseURL) => {
            await page.goto('/records/add/new?user=uqstaff');
            await page.getByTestId('rek-display-type-select').click();
            await page
                .getByTestId('rek-display-type-options')
                .locator('li[role=option]')
                .getByText(/Thesis/)
                .first()
                .nth(0)
                .click();
            await expect(
                page.getByTestId('standard-card-thesis-information-content').getByTestId('alert-warning-rdm-redirect'),
            ).toBeVisible();
            await expect(
                page.getByTestId('standard-card-thesis-information-content').getByTestId('alert-warning-rdm-redirect'),
            ).toBeVisible();
        });
    });

    test.describe('Reorder and edit Contributor(s)', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('/records/add/new');
        });

        test('contributors can be reordered and edited', async ({ page }) => {
            await page.getByTestId('rek-display-type-select').click();
            await page
                .getByTestId('rek-display-type-options')
                .locator('li[role=option]')
                .getByText(/Book/)
                .nth(0)
                .click();
            await page.getByTestId('rek-subtype-select').click();
            await page
                .getByTestId('rek-subtype-options')
                .locator('li[role=option]')
                .getByText(/Textbook/)
                .click();

            // Validation error checks
            const invalidFieldNames = [
                'Author/creator names',
                'Editor/contributor names',
                'Title',
                'Place of publication',
                'Publisher',
                'Publication date',
            ];
            const validationErrors = page.locator('[data-testid=alert] li');
            await expect(page.locator('[data-testid=alert] li')).toHaveCount(invalidFieldNames.length);
            for (const invalidFieldName of invalidFieldNames) {
                await expect(validationErrors.getByText(invalidFieldName)).toBeVisible();
            }
            await page.getByTestId('rek-title-input').fill('book title');
            await page.getByTestId('rek-place-of-publication-input').fill('test place of publication');
            await page.getByTestId('rek-publisher-input').fill('test publisher');
            await page.getByTestId('rek-date-year-input').fill('2020');
            await expect(validationErrors).toHaveCount(2);
            await page.getByTestId('rek-author-input').fill('First');
            await page.getByTestId('rek-author-add').click();
            await page.getByTestId('rek-author-input').fill('Second');
            await page.getByTestId('rek-author-add').click();
            // Check the movement arrows
            await expect(page.getByTestId('rek-author-list-row-0-move-down')).toBeVisible();
            await expect(page.getByTestId('rek-author-list-row-0-move-up')).not.toBeVisible();
            await expect(page.getByTestId('rek-author-list-row-1-move-up')).toBeVisible();
            await expect(page.getByTestId('rek-author-list-row-1-move-down')).not.toBeVisible();
            await expect(page.getByTestId('rek-author-list-row-0-name-as-published')).toHaveText(/First/);
            await expect(page.getByTestId('rek-author-list-row-1-name-as-published')).toHaveText(/Second/);
            // switch the order.
            await page.getByTestId('rek-author-list-row-1-move-up').click();
            // check the data.
            await expect(page.getByTestId('rek-author-list-row-1-name-as-published')).toHaveText(/First/);
            await expect(page.getByTestId('rek-author-list-row-0-name-as-published')).toHaveText(/Second/);
            // Edit the data.
            await page.getByTestId('rek-author-list-row-0-edit').click();
            await expect(page.getByTestId('rek-author-input')).toHaveValue('Second');
            await page.getByTestId('rek-author-input').clear();
            await page.getByTestId('rek-author-input').fill('Second Edited');
            await page.getByTestId('rek-author-add').click();
            // Change reflected in the list.
            await expect(page.getByTestId('rek-author-list-row-0-name-as-published')).toHaveText(/Second Edited/);
            // Select "First" as yourself.
            await page.getByTestId('rek-author-list-row-1-name-as-published').click();
            // is selected.
            await expect(
                page.locator('[data-testid="rek-author-list-row-1"] [data-testid="PersonIcon"]'),
            ).toBeVisible();
            await expect(
                page.locator('[data-testid="rek-author-list-row-0"] [data-testid="PersonIcon"]'),
            ).not.toBeVisible();
            // switch selected.
            await page.getByTestId('rek-author-list-row-0-name-as-published').click();
            // is selected.
            await expect(
                page.locator('[data-testid="rek-author-list-row-0"] [data-testid="PersonIcon"]'),
            ).toBeVisible();
            await expect(
                page.locator('[data-testid="rek-author-list-row-1"] [data-testid="PersonIcon"]'),
            ).not.toBeVisible();
        });

        test('NTRO can be reordered and edited', async ({ page }) => {
            await page.getByTestId('rek-display-type-select').click();
            await page
                .getByTestId('rek-display-type-options')
                .locator('li[role=option]')
                .getByText(/Book/)
                .nth(0)
                .click();
            await page.getByTestId('rek-subtype-select').click();
            await page
                .getByTestId('rek-subtype-options')
                .locator('li[role=option]')
                .getByText(/Creative Work - Textual/)
                .click();
            await page.getByTestId('rek-title-input').fill('book title');
            await page.getByTestId('rek-place-of-publication-input').fill('test place of publication');
            await page.getByTestId('rek-publisher-input').fill('test publisher');
            await page.getByTestId('rek-date-year-input').fill('2020');

            // Grant information.
            await page.getByTestId('rek-grant-agency-input').fill('First Grant');
            await page.getByTestId('rek-grant-id-input').fill('12345');
            await page.getByTestId('rek-grant-type-select').click();
            await page
                .getByTestId('rek-grant-type-options')
                .locator('li[role=option]')
                .getByText(/NGO/)
                .click();
            await page.getByTestId('rek-grant-add').click();
            await page.getByTestId('rek-grant-agency-input').fill('Second Grant');
            await page.getByTestId('rek-grant-id-input').fill('23456');
            await page.getByTestId('rek-grant-type-select').click();
            await page
                .getByTestId('rek-grant-type-options')
                .locator('li[role=option]')
                .getByText(/NGO/)
                .click();
            await page.getByTestId('rek-grant-add').click();
            await expect(page.getByTestId('grant-list-move-up=0')).toHaveAttribute('disabled', /.*/);
            await expect(page.getByTestId('grant-list-move-down=1')).toHaveAttribute('disabled', /.*/);
            await expect(page.getByTestId('grant-list-row-0')).toHaveText(/First Grant/);
            await expect(page.getByTestId('grant-list-row-1')).toHaveText(/Second Grant/);
            await page.getByTestId('grant-list-move-down=0').click();
            await expect(page.getByTestId('grant-list-row-1')).toHaveText(/First Grant/);
            await expect(page.getByTestId('grant-list-row-0')).toHaveText(/Second Grant/);
            await page.locator('#edit-grant-info-0').click();
            await expect(page.getByTestId('rek-grant-agency-input')).toHaveValue('Second Grant');
            await page.getByTestId('rek-grant-agency-input').clear();
            await page.getByTestId('rek-grant-agency-input').fill('Edited Grant');
            await page.getByTestId('rek-grant-update').click();
            await expect(page.getByTestId('grant-list-row-0')).toHaveText(/Edited Grant/);
        });
    });
});
