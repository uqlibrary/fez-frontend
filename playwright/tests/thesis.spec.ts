import { test, expect, Page } from '../lib/fixture';
import { typeCKEditor } from '../support/ckeditor';
import { clickAutoSuggestion } from '../support/commands';
import path from 'path';

test.describe('Thesis', () => {
    const ensureErrorCount = async (page: Page, count: number) => {
        await expect(page.locator('[data-testid="thesis-submission-validation"] li')).toHaveCount(count);
    };

    const uploadFile = async (page: Page, fileName: string) =>
        await page.getByTestId('fez-datastream-info-input').setInputFiles(path.join(__dirname, `fixtures/${fileName}`));

    test.describe('HDR submission', () => {
        test('shows rdm redirect message to non-whitelisted users', async ({ page }) => {
            await page.goto('rhdsubmission?user=s3333333');
            await expect(page.getByTestId('alert-info-rdm-redirect')).toBeVisible();
            await expect(page.getByTestId('alert-info-rdm-redirect')).toBeVisible();
        });

        test('is denied access if they have logged in with a non-student account', async ({ page }) => {
            await page.goto('rhdsubmission?user=uqstaff');
            await expect(page.getByText(/Thesis deposit access denied/).first()).toBeVisible();
        });

        test('should allow form to be completed', async ({ page }) => {
            await page.goto('rhdsubmission?user=s2222222');
            await expect(page.locator('button#submit-thesis')).toBeDisabled();

            await ensureErrorCount(page, 8);

            // Title
            await typeCKEditor(page, 'rek-title', '<p>This is a thesis title</p>');
            await ensureErrorCount(page, 7);
            // Abstract
            await typeCKEditor(page, 'rek-description', '<p>This is the thesis abstract</p>');
            await ensureErrorCount(page, 6);

            // Thesis subtype
            await page.getByTestId('rek-genre-type-select').click();
            await page.locator('li[data-value="MPhil Thesis"]').click();
            await ensureErrorCount(page, 5);
            await expect(page.locator('button#submit-thesis')).toBeDisabled();

            // Enrolling unit
            await page.getByTestId('rek-org-unit-name-input').fill('a');
            await clickAutoSuggestion(page, 'rek-org-unit-name', 0);
            await ensureErrorCount(page, 4);
            await expect(page.locator('button#submit-thesis')).toBeDisabled();

            // Supervisors
            await page.getByTestId('rek-supervisor-input').type('Ky Lane', { delay: 30 });
            await ensureErrorCount(page, 4);
            await expect(page.locator('button#submit-thesis')).toBeDisabled();
            await page.getByTestId('rek-supervisor-input').press('Enter');
            await ensureErrorCount(page, 3);
            await expect(page.locator('button#submit-thesis')).toBeDisabled();
            await page.locator('button[aria-label="Remove this item"]').click();
            await page
                .locator('button')
                .getByText(/Yes/)
                .first()
                .click();

            await ensureErrorCount(page, 4);
            await expect(page.locator('button#submit-thesis')).toBeDisabled();
            await page.getByTestId('rek-supervisor-input').type('Vishal Asai', { delay: 30 });
            await page.getByTestId('rek-supervisor-input').press('Enter');
            await ensureErrorCount(page, 3);
            await expect(page.locator('button#submit-thesis')).toBeDisabled();
            await page.getByTestId('rek-supervisor-input').type('Ky Lane', { delay: 30 });
            await page.getByTestId('rek-supervisor-input').press('Enter');
            await expect(page.locator('ul.ContributorList').locator(':scope > *')).toHaveCount(2);
            await expect(
                page
                    .locator('ul.ContributorList')
                    .locator(':scope > *')
                    .first(),
            ).toHaveText(/Vishal Asai/);
            await expect(
                page
                    .locator('ul.ContributorList')
                    .locator(':scope > *')
                    .last(),
            ).toHaveText(/Ky Lane/);
            await page.locator('button[aria-label="Move item up the order"]').click();
            await expect(
                page
                    .locator('ul.ContributorList')
                    .locator(':scope > *')
                    .last(),
            ).toHaveText(/Vishal Asai/);
            await expect(
                page
                    .locator('ul.ContributorList')
                    .locator(':scope > *')
                    .first(),
            ).toHaveText(/Ky Lane/);
            await page.locator('button[aria-label="Remove all items"]').click();
            await page
                .locator('button')
                .getByText(/Yes/)
                .first()
                .click();

            await ensureErrorCount(page, 4);
            await page.getByTestId('rek-supervisor-input').type('Ky Lane', { delay: 30 });
            await page.getByTestId('rek-supervisor-input').press('Enter');
            await ensureErrorCount(page, 3);

            // Field of Research
            await page.getByTestId('rek-subject-input').fill('a');
            await clickAutoSuggestion(page, 'rek-subject', 0);
            await ensureErrorCount(page, 2);
            await expect(page.locator('button#submit-thesis')).toBeDisabled();
            await expect(page.locator('#rek-subject-list-row-0')).toContainText('0101 Pure Mathematics');
            await page.locator('#rek-subject-list-row-0-delete').click();
            await page
                .locator('button')
                .getByText(/Yes/)
                .first()
                .click();

            await ensureErrorCount(page, 3);
            await page.getByTestId('rek-subject-input').fill('b');
            await clickAutoSuggestion(page, 'rek-subject', 0);
            await ensureErrorCount(page, 2);
            await page.locator('#delete-all-rek-subject').click();
            await page
                .locator('button')
                .getByText(/Yes/)
                .first()
                .click();

            await ensureErrorCount(page, 3);
            await expect(page.locator('button#submit-thesis')).toBeDisabled();
            await page.getByTestId('rek-subject-input').fill('a');
            await clickAutoSuggestion(page, 'rek-subject', 0);
            await ensureErrorCount(page, 2);
            await expect(page.locator('button#submit-thesis')).toBeDisabled();

            // Keywords
            await page.getByTestId('rek-keywords-input').type('First Keyword', {
                delay: 30,
            });
            await page.getByTestId('rek-keywords-input').press('Enter');

            await ensureErrorCount(page, 1);
            await expect(page.locator('button#submit-thesis')).toBeDisabled();
            await page.locator('#rek-keywords-list-row-0-delete').click();
            await page
                .locator('button')
                .getByText(/Yes/)
                .first()
                .click();

            await ensureErrorCount(page, 2);
            await page.getByTestId('rek-keywords-input').type('Second Keyword', {
                delay: 30,
            });
            await page.getByTestId('rek-keywords-input').press('Enter');

            await ensureErrorCount(page, 1);
            await page.locator('#delete-all-rek-keywords').click();
            await page
                .locator('button')
                .getByText(/Yes/)
                .first()
                .click();

            await ensureErrorCount(page, 2);
            await page.getByTestId('rek-keywords-input').type('Third Keyword', {
                delay: 30,
            });
            await page.getByTestId('rek-keywords-input').press('Enter');
            await expect(page.locator('#rek-keywords-list')).toHaveCount(1);
            await ensureErrorCount(page, 1);
            await page.getByTestId('rek-keywords-input').fill('Fourth Keyword|Fifth Keyword|Sixth Keyword');
            await page.getByTestId('rek-keywords-input').press('Enter');
            await expect(page.locator('#rek-keywords-list').locator(':scope > *')).toHaveCount(4);

            // Files?
            await uploadFile(page, 'test.jpg');
            await page.getByTestId('dsi-dsid-0-delete').click();
            await page
                .locator('button')
                .getByText(/Yes/)
                .first()
                .click();

            await ensureErrorCount(page, 1);

            await uploadFile(page, 'test_two.jpg');
            await page.locator('[id="delete-all-files"]').click();
            await page
                .locator('button')
                .getByText(/Yes/)
                .first()
                .click();

            await ensureErrorCount(page, 1);

            await uploadFile(page, 'test three.jpg');
            await expect(page.getByTestId('alert')).toHaveCount(2);

            await uploadFile(page, 'test.jpg');
            await uploadFile(page, 'test_two.jpg');

            // Ready to submit
            await expect(page.locator('button#submit-thesis')).not.toHaveAttribute('disabled', /.*/);
        });

        // this can't be simply tested via a jest test, as the session expired dialog is
        // controlled up higher in the component tree
        test('should display session expired dialog', async ({ page }) => {
            await page.goto('rhdsubmission?user=s5555555');

            // Title
            await typeCKEditor(page, 'rek-title', 'a');
            // subtype
            await page.getByTestId('rek-genre-type-select').click();
            await page.locator('li[data-value="MPhil Thesis"]').click();
            // Abstract
            await typeCKEditor(page, 'rek-description', 'a');
            // unit
            await page.getByTestId('rek-org-unit-name-input').fill('a');
            await clickAutoSuggestion(page, 'rek-org-unit-name', 0);
            // filling this field once doesn't always clear validation errors in this context
            await typeCKEditor(page, 'rek-title', 'ab');
            // supervisors
            await page.getByTestId('rek-supervisor-input').type('a', { delay: 30 });
            await page.getByTestId('rek-supervisor-input').press('Enter');
            // FoR
            await page.getByTestId('rek-subject-input').fill('a');
            await clickAutoSuggestion(page, 'rek-subject', 0);
            // keywords
            await page.getByTestId('rek-keywords-input').type('a', {
                delay: 30,
            });
            await page.getByTestId('rek-keywords-input').press('Enter');
            await typeCKEditor(page, 'rek-description', 'ab');
            // files
            await uploadFile(page, 'test.jpg');
            await uploadFile(page, 'test_two.jpg');
            await expect(page.getByTestId('thesis-submission-validation')).not.toBeVisible();
            await page.getByTestId('deposit-thesis').click();
            await expect(
                page
                    .locator('H2')
                    .getByText(/Session Expired/)
                    .first(),
            ).toBeVisible();
        });
    });

    test.describe('SBS submission', () => {
        test('should allow form to be completed', async ({ page }) => {
            await page.goto('habslodge?user=s2222222');
            await expect(page.locator('button#submit-thesis')).toBeDisabled();
            const validationAlerts = page.locator('[data-testid="thesis-submission-validation"] li');

            await ensureErrorCount(page, 6);

            // Title
            await typeCKEditor(page, 'rek-title', '<p>This is a thesis title</p>');
            await ensureErrorCount(page, 5);
            // Abstract
            await typeCKEditor(page, 'rek-description', '<p>This is the thesis abstract</p>');
            await ensureErrorCount(page, 4);
            // Enrolling unit
            await page.getByTestId('rek-org-unit-name-input').fill('a');
            await clickAutoSuggestion(page, 'rek-org-unit-name', 0);
            await ensureErrorCount(page, 3);
            // Supervisors
            await page.getByTestId('rek-supervisor-input').type('Ky Lane', { delay: 30 });
            await page.getByTestId('rek-supervisor-input').press('Enter');
            await ensureErrorCount(page, 2);
            // Field of Research
            await page.getByTestId('rek-subject-input').fill('a');
            await clickAutoSuggestion(page, 'rek-subject', 0);
            await ensureErrorCount(page, 1);
            // Keywords
            await page.getByTestId('rek-keywords-input').type('First Keyword', {
                delay: 30,
            });
            await page.getByTestId('rek-keywords-input').press('Enter');

            // Keywords
            await page.getByTestId('comments-input').type('comments', {
                delay: 30,
            });

            // Files
            await uploadFile(page, 'test.jpg');
            await ensureErrorCount(page, 0);
            // Ready to submit
            await expect(page.locator('button#submit-thesis')).not.toHaveAttribute('disabled', /.*/);
        });

        test('should display session expired dialog', async ({ page }) => {
            await page.goto('habslodge?user=s5555555');

            // Title
            await typeCKEditor(page, 'rek-title', 'a');
            // Abstract
            await typeCKEditor(page, 'rek-description', 'a');
            // Enrolling unit
            await page.getByTestId('rek-org-unit-name-input').fill('a');
            await clickAutoSuggestion(page, 'rek-org-unit-name', 0);
            // filling this field once doesn't always clear validation errors in this context
            await typeCKEditor(page, 'rek-title', 'ab');
            // Supervisors
            await page.getByTestId('rek-supervisor-input').type('Ky Lane', { delay: 30 });
            await page.getByTestId('rek-supervisor-input').press('Enter');
            // Field of Research
            await page.getByTestId('rek-subject-input').fill('a');
            await clickAutoSuggestion(page, 'rek-subject', 0);
            await typeCKEditor(page, 'rek-description', 'ab');
            // Files
            await uploadFile(page, 'test.jpg');
            await uploadFile(page, 'test_two.jpg');
            await expect(page.getByTestId('thesis-submission-validation')).not.toBeVisible();
            await page.getByTestId('deposit-thesis').click();
            await expect(
                page
                    .locator('H2')
                    .getByText(/Session Expired/)
                    .first(),
            ).toBeVisible();
        });
    });
});
