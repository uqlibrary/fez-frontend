import { test, expect, Page } from '../../lib/fixture';
import { assertAccessibility } from '../../support/axe';
import { assertNotSearchParams } from '../../support/url';

const captureBeforeContent = async (page: Page, selector: string) =>
    await page.evaluate(selector => {
        const el = document.querySelector(selector);
        return window.getComputedStyle(el, '::before').content;
    }, selector);

async function assertCollapsiblePanel(page: Page, index: number) {
    await expect(page.locator(`[data-testid="journal-list-collapse-panel-${index}"]`)).not.toBeVisible();
    await page.locator(`[data-testid="journal-list-expander-btn-${index}"]`).click();
    await expect(page.locator(`[data-testid="journal-list-collapse-panel-${index}"]`)).toBeVisible();

    // Verify all metrics are visible
    const metrics = [
        { testid: 'journal-list-header-jnl-cite-score', text: 'CiteScore' },
        { testid: 'journal-list-header-fez-journal-cite-score', text: 'CiteScore percentile' },
        { testid: 'journal-list-header-jnl-jcr-scie-impact-factor', text: 'Impact factor' },
        { testid: 'journal-list-header-jnl-jcr-scie-category-jif-percentile', text: 'Impact factor percentile' },
        { testid: 'journal-list-header-jnl-cite-score-snip', text: 'SNIP' },
        { testid: 'journal-list-header-jnl-cite-score-sjr', text: 'SJR' },
    ];

    for (const metric of metrics) {
        const locator = page.locator(`[data-testid="${metric.testid}-${index}"]`);
        await expect(locator).toBeVisible();
        await expect(locator).toContainText(metric.text);
    }

    await assertAccessibility(page, `[data-testid="journal-list-collapse-panel-${index}"]`, {
        disabledRules: ['color-contrast'],
    });
    // Collapse panel
    await page.getByTestId(`journal-list-expander-btn-${index}`).click();
    await expect(page.getByTestId(`journal-list-collapse-panel-${index}`)).not.toBeVisible();
}

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
        ).toHaveCount(31);

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
        ).toHaveCount(33);

        await expect(page.getByTestId('journal-search-button')).toBeDisabled();
        await page.getByTestId('journal-search-item-addable-title-microbiology-0').click();
        await expect(page.getByTestId('journal-search-chip-title-microbiology')).toBeVisible();
        await expect(page.getByTestId('journal-search-button')).toBeEnabled();

        await page
            .getByTestId('journal-search-chip-title-microbiology')
            .getByTestId('CancelIcon')
            .click();
        await expect(page.getByTestId('journal-search-button')).toBeDisabled();

        await assertAccessibility(page, 'div.StandardPage');
    });

    test('Selecting keyword should not change scroll position', async ({ page }) => {
        await page.getByTestId('journal-search-keywords-input').fill('bio');
        // await scrollToBottom(page);
        await page.getByTestId('journal-search-item-addable-keyword-bioe-27').click();
        await expect(page.getByTestId('journal-search-chip-keyword-bioe')).toBeVisible();
        // await assertScrollIsNotOnTop(page);
    });

    test('Removing keyword should not change scroll position', async ({ page }) => {
        await page.getByTestId('journal-search-keywords-input').fill('bio');
        // await scrollToBottom(page);
        await page.getByTestId('journal-search-item-addable-keyword-bioe-27').click();
        await page
            .getByTestId('journal-search-chip-keyword-bioe')
            .getByTestId('CancelIcon')
            .click();
        await expect(page.getByTestId('journal-search-chip-keyword-bioe')).not.toBeVisible();
        // await assertScrollIsNotOnTop(page);
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
        await expect(page.getByTestId('publication-list-sorting-sort-by')).toBeVisible();
        await expect(page.getByTestId('publication-list-sorting-sort-by')).toContainText('Highest quartile');
        await page.getByTestId('publication-list-sorting-sort-by').click();
        await page.locator('li[role="option"]:has-text("CiteScore")').click();
        await expect(page.getByTestId('publication-list-sorting-sort-by')).toContainText('CiteScore');

        // Sort order
        await expect(page.getByTestId('publication-list-sorting-sort-order')).toBeVisible();
        await expect(page.getByTestId('publication-list-sorting-sort-order')).toContainText('Asc');
        await page.getByTestId('publication-list-sorting-sort-order').click();
        await page.locator('li[role="option"]:has-text("Desc")').click();
        await expect(page.getByTestId('publication-list-sorting-sort-order')).toContainText('Desc');

        // Page size
        await expect(page.getByTestId('publication-list-sorting-page-size')).toBeVisible();
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
        await expect(page.getByTestId('journal-list-header-jnl-title')).toBeVisible();
        await expect(page.getByTestId('journal-list-header-jnl-title')).toContainText('Journal title');
        await expect(page.getByTestId('journal-list-header-open-access')).toBeVisible();
        await expect(page.getByTestId('journal-list-header-open-access')).toContainText('Open access');
        await expect(page.getByTestId('journal-list-header-highest-quartile')).toBeVisible();
        await expect(page.getByTestId('journal-list-header-highest-quartile')).toContainText('Highest quartile');

        await assertAccessibility(page, '[data-testid="journal-list"]', {
            disabledRules: ['color-contrast'],
        });
    });

    test('Renders journal search result table in collapsed view by default for mobile', async ({ page }) => {
        await page.setViewportSize({ width: 599, height: 1000 });
        await page.getByTestId('journal-search-keywords-input').fill('bio');
        await page.getByTestId('journal-search-item-addable-title-microbiology-0').click();
        await page.getByTestId('journal-search-button').click();
        await expect(page.getByTestId('journal-list')).toBeVisible();

        // Mobile specific checks
        await expect(page.getByTestId('journal-list-header-jnl-title')).toBeVisible();
        await expect(page.getByTestId('journal-list-header-jnl-title')).toContainText('Journal title');
        await expect(page.getByTestId('journal-list-header-open-access-0')).toBeVisible();
        await expect(page.getByTestId('journal-list-header-open-access-0')).toContainText('Open access');
        await expect(page.getByTestId('journal-list-header-highest-quartile-0')).toBeVisible();
        await expect(page.getByTestId('journal-list-header-highest-quartile-0')).toContainText('Highest quartile');
        await expect(page.getByTestId('journal-list-header-open-access-9')).toBeVisible();
        await expect(page.getByTestId('journal-list-header-open-access-9')).toContainText('Open access');
        await expect(page.getByTestId('journal-list-header-highest-quartile-9')).toBeVisible();
        await expect(page.getByTestId('journal-list-header-highest-quartile-9')).toContainText('Highest quartile');

        await assertAccessibility(page, '[data-testid="journal-list"]', {
            disabledRules: ['color-contrast'],
        });
    });

    test('Should not keep any previous search history when navigating from another page', async ({ page }) => {
        await page.getByTestId('journal-search-keywords-input').fill('bio');
        await page.getByTestId('journal-search-item-addable-title-microbiology-0').click();
        await page.getByTestId('journal-search-button').click();
        await page.getByTestId('MenuIcon').click();
        await page
            .getByRole('button')
            .getByText('Journal search')
            .click();

        await expect(page.getByText('Step 2.')).not.toBeVisible();
        await expect(page.getByTestId('journal-search-keyword-list-titles-containing')).not.toBeVisible();
        await expect(page.getByTestId('journal-search-keyword-list-keyword-matches')).not.toBeVisible();
        await expect(page.getByTestId('journal-search-keyword-list-subjects-field-of-research')).not.toBeVisible();
        await expect(page.getByText('Searching for journals containing')).not.toBeVisible();
        await expect(page.getByTestId('journal-search-results-container')).not.toBeVisible();
    });

    test('Renders journal search result table in expanded desktop view', async ({ page }) => {
        await page.getByTestId('journal-search-keywords-input').fill('bio');
        await page.getByTestId('journal-search-item-addable-title-microbiology-0').click();
        await page.getByTestId('journal-search-button').click();

        await assertCollapsiblePanel(page, 0);
        await assertCollapsiblePanel(page, 9);
    });

    test('Renders journal search result table in expanded mobile view', async ({ page }) => {
        await page.setViewportSize({ width: 599, height: 1000 });
        await page.getByTestId('journal-search-keywords-input').fill('bio');
        await page.getByTestId('journal-search-item-addable-title-microbiology-0').click();
        await page.getByTestId('journal-search-button').click();

        await assertCollapsiblePanel(page, 0);
        await assertCollapsiblePanel(page, 9);
    });

    const setupInitialSearchAndAssert = async (page: Page) => {
        await page.getByTestId('journal-search-keywords-input').fill('bio');
        await page.getByTestId('journal-search-item-addable-title-glycobiology-3').click();
        await page.getByTestId('journal-search-item-addable-title-biological-4').click();
        await page.getByTestId('journal-search-button').click();
        await expect(page.getByTestId('journal-list')).toBeVisible();

        await expect(page.getByTestId('journal-search-chip-title-glycobiology')).toBeVisible();
        await expect(page.getByTestId('journal-search-chip-title-biological')).toBeVisible();

        await expect(page).toHaveURL(/keywords%5BTitle-glycobiology/);
        await expect(page).toHaveURL(/keywords%5BTitle-biological/);
    };

    const assertInitialViewVisible = async (page: Page) => {
        await expect(page.getByTestId('journal-search-button')).toBeDisabled();
        await expect(page.getByTestId('journal-search-browse-all-button')).toBeEnabled();
        await expect(page.getByTestId('journal-search-favourite-journals-button')).toBeEnabled();
        await expect(page.getByTestId('journal-search-keywords-input')).toHaveValue('');
    };

    test.describe('Handling when the back button is clicked', () => {
        test.beforeEach(async ({ page }) => await setupInitialSearchAndAssert(page));

        test('restores results and keyword state after a keyword has been deleted', async ({ page }) => {
            const resultsLengthWithOneKeyword = 8;
            const resultsLengthWithTwoKeywords = 4;
            const ResultTitles = page.locator('[id^="journal-list-data-col-1-title"]');

            await expect(ResultTitles).toHaveCount(resultsLengthWithTwoKeywords);
            // Click the SVG inside the chip to remove it
            await page
                .getByTestId('journal-search-chip-title-glycobiology')
                .locator('svg')
                .click();

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
            await page
                .getByTestId('journal-search-chip-title-glycobiology')
                .locator('svg')
                .click();

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

            await page
                .getByTestId('journal-search-chip-title-glycobiology')
                .locator('svg')
                .click();

            await expect(page.getByTestId('journal-search-chip-title-glycobiology')).not.toBeVisible();
            await expect(page).not.toHaveURL(/keywords%5BTitle-glycobiology/);

            await expect(ResultTitles).toHaveCount(resultsLengthWithOneKeyword);

            await page
                .getByTestId('journal-search-chip-title-biological')
                .locator('svg')
                .click();
            await assertNotSearchParams(page);

            await expect(page.getByTestId('journal-search-card')).toBeVisible();

            await assertInitialViewVisible(page);

            await assertAccessibility(page, 'div.StandardPage', {
                disabledRules: ['color-contrast'],
            });
        });
    });

    test.describe('Handles Browse All Journals functionality', () => {
        test('shows All Journals when the Browse All Journals button is clicked in Search Results', async ({
            page,
        }) => {
            const resultsLengthWithAllResults = 10;
            const resultsLengthWithTwoKeywords = 4;
            const ResultTitles = page.locator('[id^="journal-list-data-col-1-title"]');

            await setupInitialSearchAndAssert(page);

            await expect(ResultTitles).toHaveCount(resultsLengthWithTwoKeywords);

            await expect(page.getByTestId('journal-search-chip-title-glycobiology')).toBeVisible();
            await expect(page.getByTestId('journal-search-chip-title-biological')).toBeVisible();

            await expect(page).toHaveURL(/keywords%5BTitle-glycobiology/);
            await expect(page).toHaveURL(/keywords%5BTitle-biological/);
            await expect(page).not.toHaveURL(/keywords%5BKeyword-all-journals/);

            await expect(page.getByTestId('journal-search-browse-all-button')).toBeVisible();
            await page.getByTestId('journal-search-browse-all-button').click();

            await expect(page.getByTestId('journal-search-chip-title-glycobiology')).not.toBeVisible();
            await expect(page.getByTestId('journal-search-chip-title-biological')).not.toBeVisible();

            await expect(page).not.toHaveURL(/keywords%5BTitle-glycobiology/);
            await expect(page).not.toHaveURL(/keywords%5BTitle-biological/);
            await expect(page).toHaveURL(/keywords%5BKeyword-all-journals/);

            await expect(page.getByTestId('journal-search-browse-all-button')).not.toBeVisible();

            await expect(page.getByTestId('journal-search-chip-keyword-all-journals')).toBeVisible();

            await expect(ResultTitles).toHaveCount(resultsLengthWithAllResults);

            await assertAccessibility(page, 'div.StandardPage', {
                disabledRules: ['color-contrast'],
            });
        });

        test('shows All Journals when the Browse All Journals button is clicked from the initial Journal Search page', async ({
            page,
        }) => {
            const resultsLengthWithAllResults = 10;
            const resultsLengthWithOneKeyword = 8;
            const ResultTitles = page.locator('[id^="journal-list-data-col-1-title"]');

            await assertInitialViewVisible(page);

            // Browse all from initial state
            await expect(page.getByTestId('journal-search-browse-all-button')).toBeVisible();
            await page.getByTestId('journal-search-browse-all-button').click();

            await expect(page).toHaveURL(/keywords%5BKeyword-all-journals/);

            await expect(page.getByTestId('journal-search-browse-all-button')).not.toBeVisible();

            await expect(page.getByTestId('journal-search-chip-keyword-all-journals')).toBeVisible();

            await expect(ResultTitles).toHaveCount(resultsLengthWithAllResults);

            // clear the search
            await page.getByTestId('journal-search-clear-keywords-button').click();
            await expect(page.getByTestId('journal-search-card')).toBeVisible();
            await assertNotSearchParams(page);

            // perform a normal search
            await page.getByTestId('journal-search-keywords-input').fill('bio');
            await page.getByTestId('journal-search-item-addable-title-biological-4').click();
            await page.getByTestId('journal-search-button').click();
            await expect(page.getByTestId('journal-list')).toBeVisible();

            await expect(page.getByTestId('journal-search-chip-title-biological')).toBeVisible();
            await expect(page.getByTestId('journal-search-chip-keyword-all-journals')).not.toBeVisible();

            await expect(page).toHaveURL(/keywords%5BTitle-biological/);
            await expect(page).not.toHaveURL(/keywords%5BKeyword-all-journals/);

            await expect(ResultTitles).toHaveCount(resultsLengthWithOneKeyword);

            await expect(page.getByTestId('journal-search-browse-all-button')).toBeVisible();
            await page.getByTestId('journal-search-browse-all-button').click();

            await expect(page.getByTestId('journal-search-chip-title-biological')).not.toBeVisible();
            await expect(page.getByTestId('journal-search-chip-keyword-all-journals')).toBeVisible();

            await expect(page).not.toHaveURL(/keywords%5BTitle-biological/);
            await expect(page).toHaveURL(/keywords%5BKeyword-all-journals/);

            await expect(page.getByTestId('journal-search-browse-all-button')).not.toBeVisible();

            await expect(ResultTitles).toHaveCount(resultsLengthWithAllResults);

            await assertAccessibility(page, 'div.StandardPage', {
                disabledRules: ['color-contrast'],
            });
        });

        test('should clear error alert from a previous api error', async ({ page }) => {
            await page.getByTestId('journal-search-keywords-input').fill('api-500-error');
            await expect(page.getByTestId('alert').first()).toContainText('Unexpected error');
            await page.getByTestId('clear-journal-search-keywords').click();
            await page.getByTestId('journal-search-keywords-input').fill('tech');
            await expect(page.getByTestId('alert')).not.toBeVisible();
        });
    });
});
