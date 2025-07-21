import { test, expect } from '../../test';
import { assertAccessibility } from '../../lib/axe';

test.describe('Strategic Publishing - Comparison', () => {
    test('Should render', async ({ page }) => {
        await page.goto('/journals/compare/');
        await expect(page.getByText(/No journals were selected for comparison/).first()).toBeVisible();
        await assertAccessibility(page, 'div.StandardPage');
    });

    test('Should navigate to search', async ({ page }) => {
        await page.goto('/journals/compare/');
        await expect(page.getByText(/No journals were selected for comparison/).first()).toBeVisible();
        await page.getByTestId('return-to-search-results-button').click();
        await expect(page).toHaveURL('/journals/search/');
    });

    test('Compare journals and go back to search results', async ({ page }) => {
        await page.setViewportSize({ width: 1200, height: 1600 });

        // steps required to get to the comparison page with journals
        const uri = '/journals/search/';
        const query =
            '?keywords%5BTitle-Microbiology%5D%5Btype%5D=Title&keywords%5BTitle-Microbiology%5D%5Btext%5D=Microbiology&keywords%5BTitle-Microbiology%5D%5Bid%5D=Title-Microbiology';
        await page.goto(`${uri}${query}`);

        // wait until the progress spinner is no longer in the document
        await expect(page.locator('[role="progressbar"]')).toHaveCount(0);
        await expect(page.getByTestId('journal-list-data-col-1-checkbox-0')).toBeVisible();
        // make sure 3rd journal is present
        await expect(page.getByTestId('journal-list-data-col-1-title-2')).toBeVisible();
        // select journals for comparison
        await expect(page.getByTestId('journal-comparison-button')).toBeDisabled();
        await page.getByTestId('journal-list-data-col-1-checkbox-0').click();
        await expect(page.getByTestId('journal-comparison-button')).toBeDisabled();
        await page.getByTestId('journal-list-data-col-1-checkbox-1').click();
        await expect(page.getByTestId('journal-comparison-button')).not.toBeDisabled();
        await page.getByTestId('journal-comparison-button').click();
        await expect(page).toHaveURL('/journals/compare/');
        // make sure the selected journal are present
        await expect(page.getByTestId('journal-list-data-col-1-title-0').first()).toBeVisible();
        await expect(page.getByTestId('journal-list-data-col-1-title-1').first()).toBeVisible();
        // make sure 3rd journal is not present
        await expect(page.getByTestId('journal-list-data-col-1-title-2')).not.toBeVisible();
        await assertAccessibility(page, 'div.StandardPage');
        await page.getByTestId('return-to-search-results-button').click();
        // go back to search results
        await expect(async () => {
            const loc = new URL(page.url());
            expect(loc.pathname).toBe(uri);
            expect(loc.search).toBe(query);
        }).toPass();
    });
});
