import { test, expect, Page } from '../../lib/fixture';
import { assertCKEditorEmpty, typeCKEditor } from '../../support/ckeditor';

test.describe('Advanced Search', () => {
    // a particular search key can be updated for bulk records
    async function assertSearchKeyUpdates(page: Page, optionId: number, frskName: string) {
        await expect(page.getByTestId('select-all-publications-input')).toBeVisible();
        await page.getByTestId('select-all-publications-input').click();
        // bulk updates drop down appears - open it
        await expect(page.getByTestId('bulk-updates-actions-select')).toBeVisible();
        await page.getByTestId('bulk-updates-actions-select').click();
        await expect(page.getByTestId('bulk-updates-actions-option-5')).toBeVisible();
        // choose "change search key value"
        await page.getByTestId('bulk-updates-actions-option-5').click();
        // open selector and choose provided type
        await expect(page.getByTestId('search-key-select')).toBeVisible();
        await page.getByTestId('search-key-select').click();
        await expect(page.getByTestId(`search-key-option-${optionId}`)).toBeVisible();
        await page.getByTestId(`search-key-option-${optionId}`).click();
        // enter some words in the rich editor
        await expect(page.getByTestId(frskName)).toBeVisible();

        await expect(page.getByTestId('change-search-key-value-submit')).toBeDisabled();
        await assertCKEditorEmpty(page, frskName);
        await typeCKEditor(page, frskName, 'some words');
        await expect(page.getByTestId('change-search-key-value-submit')).not.toBeDisabled();
        // save & see success
        await page.getByTestId('change-search-key-value-submit').click();
        await expect(page.getByTestId('alert').locator('.alert-text')).toBeVisible();
        await expect(page.getByTestId('alert').locator('.alert-text')).toHaveText(
            /Bulk update job created successfully/,
        );
    }

    test.beforeEach(async ({ page }) => {
        // visit advanced search page as an admin
        await page.goto(
            '/records/search?user=uqstaff&searchQueryParams%5Ball%5D=test&page=1&pageSize=20&sortBy=score&sortDirection=Desc',
        );
        await page.setViewportSize({ width: 960, height: 768 });
    });

    test('should search records when advanced search options are updated', async ({ page }) => {
        await expect(page.getByTestId('search-records-loading')).not.toBeVisible();
        await page.getByTestId('show-advanced-search').click();
        await page.getByTestId('from').fill('2005');
        await page.getByTestId('to').fill('2018');
        await page.getByTestId('advanced-search').click();
        // Using expect(page).toHaveURL with a regex for robustness
        await expect(page).toHaveURL(
            /activeFacets%5Branges%5D%5BYear\+published%5D%5Bfrom%5D=2005&activeFacets%5Branges%5D%5BYear\+published%5D%5Bto%5D=2018/,
        );
        await expect(page.getByTestId('facet-year-range-caption')).toBeVisible();
        await expect(page.getByTestId('search-records-loading')).toBeVisible();
        await expect(page.getByTestId('search-records-loading')).toHaveText(/Searching for works/);
    });

    test('can bulk edit Advisory statement', async ({ page }) => {
        const advisoryStatementOptionId = 8;
        await assertSearchKeyUpdates(page, advisoryStatementOptionId, 'rek-advisory-statement');
    });

    test('can bulk edit Additional notes', async ({ page }) => {
        const additionalNotesOptionId = 5;
        await assertSearchKeyUpdates(page, additionalNotesOptionId, 'rek-notes');
    });
});
