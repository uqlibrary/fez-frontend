import { test, expect } from '../../test';
import { assertAccessibility } from '../../lib/axe';
import { setupInitialSearchAndAssert } from './helpers';

test.describe('Strategic Publishing - Search', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/journals/search/');
    });

    test('Renders the search page as expected', async ({ page }) => {
        await expect(page.locator('h2[data-testid="page-title"]')).toContainText('Journal search');
        await expect(page.locator('div[data-testid="journal-search-card"]')).toContainText('Step 1.');
        await expect(page.locator('div[data-testid="journal-search-card"]')).toContainText(
            'Enter a journal title, ISSN, keyword, subject or field of research code',
        );
        await expect(page.getByTestId('journal-search-card')).toBeVisible();
        await expect(page.getByTestId('journal-search-keywords-voice-record-start-button')).toBeVisible();
        await expect(page.getByTestId('clear-journal-search-keywords')).toBeVisible();
        await expect(page.getByTestId('journal-search-button')).toBeDisabled();
        await expect(page.getByTestId('journal-search-browse-all-button')).toBeEnabled();
        await expect(page.getByTestId('journal-search-favourite-journals-button')).toBeEnabled();

        await assertAccessibility(page, 'div.StandardPage');
    });

    test('Renders no search results', async ({ page }) => {
        await page.getByTestId('journal-search-keywords-input').fill('no result');
        await expect(page.getByTestId('journal-search-card')).toContainText('Titles containing');
        await expect(page.getByTestId('journal-search-card')).toContainText('Keyword matches');
        await expect(page.getByTestId('journal-search-card')).toContainText('Subjects & Field of research');
        await expect(page.getByTestId('journal-search-keyword-list-titles-containing-no-matches')).toBeVisible();
        await expect(page.getByTestId('journal-search-keyword-list-keyword-matches-no-matches')).toBeVisible();
        await expect(
            page.getByTestId('journal-search-keyword-list-subjects-field-of-research-no-matches'),
        ).toBeVisible();

        await assertAccessibility(page, 'div.StandardPage');
    });

    test('Renders search input', async ({ page }) => {
        await expect(page.getByTestId('clear-journal-search-keywords')).toHaveAttribute('aria-disabled', 'true');
        await page.getByTestId('journal-search-keywords-input').fill('t');
        await expect(page.getByTestId('clear-journal-search-keywords')).not.toHaveAttribute('aria-disabled', 'true');
        await page.getByTestId('clear-journal-search-keywords').click();
        await expect(page.getByTestId('journal-search-keywords-input')).toHaveValue('');

        await assertAccessibility(page, 'div.StandardPage');
    });

    test('Renders search results', async ({ page }) => {
        await page.getByTestId('journal-search-keywords-input').fill('tech');
        await expect(page.getByTestId('journal-search-card')).toContainText('Titles containing');
        await expect(page.getByTestId('journal-search-card')).toContainText('Keyword matches');
        await expect(page.getByTestId('journal-search-card')).toContainText('Subjects & Field of research');
        await expect(page.getByTestId('journal-search-card')).not.toContainText('No matches found.');

        await expect(page.locator('div[data-testid="journal-search-keyword-list-titles-containing"] span')).toHaveCount(
            3,
        );
        await expect(page.locator('div[data-testid="journal-search-keyword-list-keyword-matches"] span')).toHaveCount(
            6,
        );
        await expect(
            page.locator('div[data-testid="journal-search-keyword-list-subjects-field-of-research"] span'),
        ).toHaveCount(30);

        await assertAccessibility(page, 'div.StandardPage');

        await page.getByTestId('clear-journal-search-keywords').click();
        await expect(page.getByTestId('journal-search-card')).not.toContainText('Titles containing');
        await expect(page.getByTestId('journal-search-card')).not.toContainText('Keyword matches');
        await expect(page.getByTestId('journal-search-card')).not.toContainText('Subjects & Field of research');
    });

    test('Renders search chips', async ({ page }) => {
        await page.getByTestId('journal-search-keywords-input').fill('bio');
        await expect(page.getByTestId('journal-search-card')).toContainText('Titles containing');
        await expect(page.getByTestId('journal-search-card')).toContainText('Keyword matches');
        await expect(page.getByTestId('journal-search-card')).toContainText('Subjects & Field of research');
        await expect(page.getByTestId('journal-search-card')).not.toContainText('No matches found.');

        await expect(page.locator('div[data-testid="journal-search-keyword-list-titles-containing"] span')).toHaveCount(
            6,
        );
        await expect(page.locator('div[data-testid="journal-search-keyword-list-keyword-matches"] span')).toHaveCount(
            28,
        );
        await expect(
            page.locator('div[data-testid="journal-search-keyword-list-subjects-field-of-research"] span'),
        ).toHaveCount(32);

        await expect(page.getByTestId('journal-search-button')).toBeDisabled();
        await page.getByTestId('journal-search-item-addable-title-microbiology-0').click();
        await expect(page.getByTestId('journal-search-chip-title-microbiology')).toBeVisible();
        await expect(page.getByTestId('journal-search-button')).toBeEnabled();

        await page.getByTestId('journal-search-chip-title-microbiology').getByTestId('CancelIcon').click();
        await expect(page.getByTestId('journal-search-button')).toBeDisabled();

        await assertAccessibility(page, 'div.StandardPage');
    });

    test.describe('Handling when the back button is clicked', () => {
        test.beforeEach(async ({ page }) => await setupInitialSearchAndAssert(page));

        test('restores results and keyword state after a keyword has been deleted', async ({ page }) => {
            const resultsLengthWithOneKeyword = 8;
            const resultsLengthWithTwoKeywords = 4;
            const ResultTitles = page.locator('[id^="journal-list-data-col-1-title"]');

            await expect(ResultTitles).toHaveCount(resultsLengthWithTwoKeywords);
            // Click the SVG inside the chip to remove it
            await page.getByTestId('journal-search-chip-title-glycobiology').locator('svg').click();

            await expect(page.getByTestId('journal-search-chip-title-glycobiology')).not.toBeVisible();
            await expect(page).not.toHaveURL(/keywords%5BTitle-glycobiology/); // Negative URL assertion

            await expect(ResultTitles).toHaveCount(resultsLengthWithOneKeyword);

            await page.goBack();

            await expect(page).toHaveURL(/keywords%5BTitle-glycobiology/);
            await expect(page).toHaveURL(/keywords%5BTitle-biological/);

            await expect(page.getByTestId('journal-search-chip-title-glycobiology')).toBeVisible();
            await expect(page.getByTestId('journal-search-chip-title-biological')).toBeVisible();

            await expect(ResultTitles).toHaveCount(resultsLengthWithTwoKeywords);

            await assertAccessibility(page, 'div.StandardPage', {
                disabledRules: ['color-contrast'],
            });
        });

        test('restores results and facet state after a keyword has been deleted', async ({ page }) => {
            const resultsLengthWithKeywordOnly = 8;
            const resultsLengthWithKeywordAndFacets = 4;
            const ResultTitles = page.locator('[id^="journal-list-data-col-1-title"]');

            await expect(
                page.getByTestId('journal-search-facets').locator('[data-testid="facets-filter"] nav > div'),
            ).toHaveCount(9);

            // Select facets
            await page.locator('[id="clickable-facet-category-listed-in"]').click();
            const facetItemCwts = page.locator('[id="facet-filter-nested-item-listed-in-cwts"]');
            await facetItemCwts.click();
            await expect(facetItemCwts.locator('svg#clear-facet-filter-nested-item-listed-in-cwts')).toBeVisible();

            await page.locator('[id="clickable-facet-category-indexed-in"]').click();
            const facetItemScopus = page.locator('[id="facet-filter-nested-item-indexed-in-scopus"]');
            await facetItemScopus.click();
            await expect(facetItemScopus.locator('svg#clear-facet-filter-nested-item-indexed-in-scopus')).toBeVisible();

            await expect(page).toHaveURL(/CWTS/);
            await expect(page).toHaveURL(/Scopus/);

            await expect(ResultTitles).toHaveCount(resultsLengthWithKeywordAndFacets);

            // Remove a keyword - this should unselect the active facets and update the URL
            await page.getByTestId('journal-search-chip-title-glycobiology').locator('svg').click();

            await expect(page).not.toHaveURL(/CWTS/);
            await expect(page).not.toHaveURL(/Scopus/);

            await expect(facetItemCwts.locator('svg#clear-facet-filter-nested-item-listed-in-cwts')).not.toBeVisible();
            await expect(
                facetItemScopus.locator('svg#clear-facet-filter-nested-item-indexed-in-scopus'),
            ).not.toBeVisible();

            await expect(ResultTitles).toHaveCount(resultsLengthWithKeywordOnly);

            await page.goBack();

            await expect(page).toHaveURL(/CWTS/);
            await expect(page).toHaveURL(/Scopus/);

            await expect(facetItemCwts.locator('svg#clear-facet-filter-nested-item-listed-in-cwts')).toBeVisible();
            await expect(facetItemScopus.locator('svg#clear-facet-filter-nested-item-indexed-in-scopus')).toBeVisible();

            await expect(ResultTitles).toHaveCount(resultsLengthWithKeywordAndFacets);

            await assertAccessibility(page, 'div.StandardPage', {
                disabledRules: ['color-contrast'],
            });
        });

        test('should handle invalid keywords when browser history changes', async ({ page }) => {
            await page.goto('/journals/search/?keywords=invalid-keyword');
            await page.getByTestId('journal-search-keywords-input').fill('bio');
            await page.getByTestId('journal-search-item-addable-subject-06-biological-sciences-1').click();
            await page.getByTestId('journal-search-button').click();
            await expect(page.getByTestId('journal-list')).toBeVisible();
            await page.goBack();
            await page.goBack();
            await expect(page.getByTestId('journal-search-chip-title-glycobiology')).toBeVisible();
            await expect(page.getByTestId('journal-search-chip-title-biological')).toBeVisible();
        });
    });
});
