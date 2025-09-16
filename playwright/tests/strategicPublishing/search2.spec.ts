import { test, expect, Page } from '../../test';
import { assertAccessibility } from '../../lib/axe';
import { assertNotSearchParams } from '../../lib/url';
import { assertInitialViewVisible, setupInitialSearchAndAssert } from './helpers';

export const captureBeforeContent = async (page: Page, selector: string) =>
    await page.evaluate(
        selector => window.getComputedStyle(document.querySelector(selector), '::before').content,
        selector,
    );
test.describe('Strategic Publishing - Search', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/journals/search/');
    });

    test('Removing keyword should not change scroll position', async ({ page }) => {
        await page.getByTestId('journal-search-keywords-input').fill('bio');
        await page.getByTestId('journal-search-item-addable-keyword-bioe-27').click();
        await page.getByTestId('journal-search-chip-keyword-bioe').getByTestId('CancelIcon').click();
        await expect(page.getByTestId('journal-search-chip-keyword-bioe')).not.toBeVisible();
    });

    test('Selecting keyword should indicate change on keyword icon when added', async ({ page }) => {
        await page.getByTestId('journal-search-keywords-input').fill('bio');

        // Add keyword
        await page.getByTestId('journal-search-item-addable-keyword-bioe-27').click();
        await expect(page.getByTestId('journal-search-chip-keyword-bioe')).toBeVisible();
        let content = await captureBeforeContent(page, '[data-testid="journal-search-item-addable-keyword-bioe-27"]');
        expect(content).toEqual('"‒"');

        // Remove keyword
        await page.getByTestId('journal-search-item-addable-keyword-bioe-27').click();
        await expect(page.getByTestId('journal-search-chip-keyword-bioe')).not.toBeVisible();
        content = await captureBeforeContent(page, '[data-testid="journal-search-item-addable-keyword-bioe-27"]');
        expect(content).toEqual('"+"');

        // Add title
        await page.getByTestId('journal-search-item-addable-title-biomedicine-5').click();
        await expect(page.getByTestId('journal-search-chip-title-biomedicine')).toBeVisible();
        content = await captureBeforeContent(page, '[data-testid="journal-search-item-addable-title-biomedicine-5"]');
        expect(content).toEqual('"‒"');

        // Remove title
        await page.getByTestId('journal-search-item-addable-title-biomedicine-5').click();
        await expect(page.getByTestId('journal-search-chip-title-biomedicine')).not.toBeVisible();
        content = await captureBeforeContent(page, '[data-testid="journal-search-item-addable-title-biomedicine-5"]');
        expect(content).toEqual('"+"');
    });

    test('FAQ', async ({ page }) => {
        await page.getByTestId('journal-search-keywords-input').fill('bio');
        await page.getByTestId('journal-search-item-addable-title-microbiology-0').click();
        await page.getByTestId('journal-search-button').click();
        await expect(page.getByTestId('search-journals-faq')).toBeVisible();
        await page.getByTestId('faq-summary-0').click();

        await assertAccessibility(page, '[data-testid="search-journals-faq"]', {
            disabledRules: ['color-contrast'],
        });
    });

    test('Renders journal search result facets', async ({ page }) => {
        await page.getByTestId('journal-search-keywords-input').fill('bio');
        await page.getByTestId('journal-search-item-addable-title-microbiology-0').click();
        await page.getByTestId('journal-search-button').click();
        await expect(page.getByTestId('journal-search-facets')).toBeVisible();
        await expect(
            page.getByTestId('journal-search-facets').locator('[data-testid="facets-filter"] nav > div'),
        ).toHaveCount(9);
        await expect(page.getByTestId('help-icon-journal-search-facets')).toBeVisible();

        await assertAccessibility(page, '[data-testid="journal-search-facets"]', {
            disabledRules: ['color-contrast'],
        });
    });

    test('Renders journal search result sorting and pagination', async ({ page }) => {
        await page.getByTestId('journal-search-keywords-input').fill('bio');
        await page.getByTestId('journal-search-item-addable-title-microbiology-0').click();
        await page.getByTestId('journal-search-button').click();

        // Pagination
        await expect(page.getByTestId('search-journals-paging-top')).toBeVisible();
        await expect(page.getByTestId('search-journals-paging-bottom')).toBeVisible();

        // Sort by
        await expect(page.getByTestId('publication-list-sorting-sort-by')).toContainText('Highest quartile');
        await page.getByTestId('publication-list-sorting-sort-by').click();
        await page.locator('li[role="option"]:has-text("CiteScore")').click();
        await expect(page.getByTestId('publication-list-sorting-sort-by')).toContainText('CiteScore');

        // Sort order
        await expect(page.getByTestId('publication-list-sorting-sort-order')).toContainText('Asc');
        await page.getByTestId('publication-list-sorting-sort-order').click();
        await page.locator('li[role="option"]:has-text("Desc")').click();
        await expect(page.getByTestId('publication-list-sorting-sort-order')).toContainText('Desc');

        // Page size
        await expect(page.getByTestId('publication-list-sorting-page-size')).toContainText('10');
        await page.getByTestId('publication-list-sorting-page-size').click();
        await page.locator('li[role="option"]:has-text("20")').click();
        await expect(page.getByTestId('publication-list-sorting-page-size')).toContainText('20');

        // Export format
        const option = page.getByText('Excel File');
        await expect(option).not.toBeVisible();
        await page.getByTestId('export-publications-format').click();
        await expect(option).toBeVisible();
    });

    test('Renders journal search result table in collapsed view by default for desktop', async ({ page }) => {
        await page.getByTestId('journal-search-keywords-input').fill('bio');
        await page.getByTestId('journal-search-item-addable-title-microbiology-0').click();
        await page.getByTestId('journal-search-button').click();
        await expect(page.getByTestId('journal-list')).toBeVisible();

        // Desktop specific checks
        await expect(page.getByTestId('journal-list-header-jnl-title')).toContainText('Journal title');
        await expect(page.getByTestId('journal-list-header-open-access')).toContainText('Open access');
        await expect(page.getByTestId('journal-list-header-highest-quartile')).toContainText('Highest quartile');

        await assertAccessibility(page, '[data-testid="journal-list"]', {
            disabledRules: ['color-contrast'],
        });
    });

    test.describe('Handling the Clear functionality', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('/journals/search'); // Ensure starting from a clean state
            await setupInitialSearchAndAssert(page);
        });

        test('resets the search functionality and clears results when the clear button is clicked', async ({
            page,
        }) => {
            const resultsLengthWithKeywordAndFacets = 4;
            const resultsLengthFullDefaultPage = 10;
            const ResultTitles = page.locator('[id^="journal-list-data-col-1-title"]');

            await expect(page.getByTestId('journal-search-clear-keywords-button')).toBeVisible();

            await expect(
                page.getByTestId('journal-search-facets').locator('[data-testid="facets-filter"] nav > div'),
            ).toHaveCount(9);

            // select facets
            await page.locator('[id="clickable-facet-category-listed-in"]').click();
            const facetItemCwts = page.locator('[id="facet-filter-nested-item-listed-in-cwts"]');
            await facetItemCwts.click();
            await expect(facetItemCwts.locator('svg#clear-facet-filter-nested-item-listed-in-cwts')).toBeVisible();

            await page.locator('[id="clickable-facet-category-indexed-in"]').click();
            const facetItemScopus = page.locator('[id="facet-filter-nested-item-indexed-in-scopus"]');
            await facetItemScopus.click();
            await expect(facetItemScopus.locator('svg#clear-facet-filter-nested-item-indexed-in-scopus')).toBeVisible();

            // confirm two facets visible selected in the UI
            await expect(page.locator('[id^="clear-facet-filter-nested-item"]')).toHaveCount(2);
            await expect(ResultTitles).toHaveCount(resultsLengthWithKeywordAndFacets);

            // Change sorting
            await page.getByTestId('publication-list-sorting-sort-by').click();
            await page.locator('li[role="option"]:has-text("Search relevance")').click();
            await page.getByTestId('publication-list-sorting-sort-order').click();
            await page.locator('li[role="option"]:has-text("Desc")').click();
            await page.getByTestId('publication-list-sorting-page-size').click();
            await page.locator('li[role="option"]:has-text("20")').click();

            // assert everything selected is in the URL
            await page.waitForTimeout(6000);
            await expect(page).toHaveURL(/keywords%5BTitle-glycobiology/);
            await expect(page).toHaveURL(/keywords%5BTitle-biological/);
            await expect(page).toHaveURL(/CWTS/);
            await expect(page).toHaveURL(/Scopus/);
            await expect(page).toHaveURL(/sortBy=score/);
            await expect(page).toHaveURL(/sortDirection=Desc/);
            await expect(page).toHaveURL(/pageSize=20/);

            // clear the search
            await page.getByTestId('journal-search-clear-keywords-button').click();
            await expect(page.getByTestId('journal-search-card')).toBeVisible();
            await assertNotSearchParams(page);

            // assert broadly that step 1 is visible and in default state
            await assertInitialViewVisible(page);

            // as a final check, perform a new search and confirm previous search terms/facets/sorting are not present
            await page.getByTestId('journal-search-keywords-input').fill('bio');
            await page.getByTestId('journal-search-item-addable-title-biology-1').click();
            await page.getByTestId('journal-search-button').click();
            await expect(page.getByTestId('journal-list')).toBeVisible();

            await expect(page.getByTestId('journal-search-chip-title-biology')).toBeVisible();
            await expect(ResultTitles).toHaveCount(resultsLengthFullDefaultPage);

            // default sorting
            await expect(page.getByTestId('publication-list-sorting-sort-by')).toContainText('Highest quartile');
            await expect(page.getByTestId('publication-list-sorting-sort-order')).toContainText('Asc');
            await expect(page.getByTestId('publication-list-sorting-page-size')).toContainText('10');

            // no facets visible selected in the UI (here we check for any svg 'delete' button next to a selected facet)
            await expect(page.locator('[id^="clear-facet-filter-nested-item"]')).toHaveCount(0);

            // nothing in the URL from the previous search
            await expect(page).not.toHaveURL(/keywords%5BTitle-glycobiology/);
            await expect(page).not.toHaveURL(/keywords%5BTitle-biological/);
            await expect(page).not.toHaveURL(/CWTS/);
            await expect(page).not.toHaveURL(/Scopus/);
            await expect(page).not.toHaveURL(/sortBy=score/);
            await expect(page).not.toHaveURL(/sortDirection=Desc/);
            await expect(page).not.toHaveURL(/pageSize=20/);

            await assertAccessibility(page, 'div.StandardPage', {
                disabledRules: ['color-contrast'],
            });
        });

        test('resets the search functionality and clears results when the last keyword is deleted', async ({
            page,
        }) => {
            const resultsLengthWithOneKeyword = 8;
            const resultsLengthWithTwoKeywords = 4;
            const ResultTitles = page.locator('[id^="journal-list-data-col-1-title"]');

            await expect(ResultTitles).toHaveCount(resultsLengthWithTwoKeywords);

            await page.getByTestId('journal-search-chip-title-glycobiology').locator('svg').click();

            await expect(page.getByTestId('journal-search-chip-title-glycobiology')).not.toBeVisible();
            await expect(page).not.toHaveURL(/keywords%5BTitle-glycobiology/);

            await expect(ResultTitles).toHaveCount(resultsLengthWithOneKeyword);

            await page.getByTestId('journal-search-chip-title-biological').locator('svg').click();

            await assertNotSearchParams(page);
            await expect(page.getByTestId('journal-search-card')).toBeVisible();
            await assertInitialViewVisible(page);
            await assertAccessibility(page, 'div.StandardPage', {
                disabledRules: ['color-contrast'],
            });
        });
    });
});
