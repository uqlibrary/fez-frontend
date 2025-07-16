import { test, expect, Page } from '../../lib/fixture';

async function scrollToBottom(page: Page) {
    const container = page.locator('#content-container');
    await container.evaluate(el => (el.scrollTop = el.scrollHeight));
    const scrollTop = await container.evaluate(el => el.scrollTop);
    expect(scrollTop).toBeGreaterThan(0);
    return scrollTop;
}

async function assertScrollIsNotOnTop(page: Page) {
    const container = page.locator('#content-container');
    const scrollTop = await container.evaluate(el => el.scrollTop);
    expect(scrollTop).toBeGreaterThan(0);
}

async function assertScrollIsOnTop(page: Page) {
    const container = page.locator('#content-container');
    const scrollTop = await container.evaluate(el => el.scrollTop);
    expect(scrollTop).toBe(0);
}

async function captureBeforeContent(page: Page, selector: string) {
    return await page.evaluate(selector => {
        const el = document.querySelector(selector);
        return window.getComputedStyle(el, '::before').content;
    }, selector);
}

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

    // Collapse panel
    await page.locator(`[data-testid="journal-list-expander-btn-${index}"]`).click();
    await expect(page.locator(`[data-testid="journal-list-collapse-panel-${index}"]`)).not.toBeVisible();
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
    });

    test('Renders search input', async ({ page }) => {
        await expect(page.getByTestId('clear-journal-search-keywords')).toHaveAttribute('aria-disabled', 'true');
        await page.getByTestId('journal-search-keywords-input').fill('t');
        await expect(page.getByTestId('clear-journal-search-keywords')).not.toHaveAttribute('aria-disabled', 'true');
        await page.getByTestId('clear-journal-search-keywords').click();
        await expect(page.getByTestId('journal-search-keywords-input')).toHaveValue('');
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
    });

    test('Selecting keyword should not change scroll position', async ({ page }) => {
        await page.getByTestId('journal-search-keywords-input').fill('bio');
        await scrollToBottom(page);
        await page.getByTestId('journal-search-item-addable-keyword-bioe-27').click();
        await expect(page.getByTestId('journal-search-chip-keyword-bioe')).toBeVisible();
        await assertScrollIsNotOnTop(page);
    });

    test('Removing keyword should not change scroll position', async ({ page }) => {
        await page.getByTestId('journal-search-keywords-input').fill('bio');
        await scrollToBottom(page);
        await page.getByTestId('journal-search-item-addable-keyword-bioe-27').click();
        await page
            .getByTestId('journal-search-chip-keyword-bioe')
            .getByTestId('CancelIcon')
            .click();
        await expect(page.getByTestId('journal-search-chip-keyword-bioe')).not.toBeVisible();
        await assertScrollIsNotOnTop(page);
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
        await expect(page.locator('[data-testid="journal-list-header-open-access-0"]')).toBeVisible();
        await expect(page.locator('[data-testid="journal-list-header-open-access-0"]')).toContainText('Open access');
        await expect(page.locator('[data-testid="journal-list-header-highest-quartile-0"]')).toBeVisible();
        await expect(page.locator('[data-testid="journal-list-header-highest-quartile-0"]')).toContainText(
            'Highest quartile',
        );
        await expect(page.locator('[data-testid="journal-list-header-open-access-9"]')).toBeVisible();
        await expect(page.locator('[data-testid="journal-list-header-open-access-9"]')).toContainText('Open access');
        await expect(page.locator('[data-testid="journal-list-header-highest-quartile-9"]')).toBeVisible();
        await expect(page.locator('[data-testid="journal-list-header-highest-quartile-9"]')).toContainText(
            'Highest quartile',
        );
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

    test.describe('Handling when the back button is clicked', () => {
        test.beforeEach(async ({ page }) => {
            // Setup initial search
            await page.getByTestId('journal-search-keywords-input').fill('bio');
            await page.getByTestId('journal-search-item-addable-title-glycobiology-3').click();
            await page.getByTestId('journal-search-item-addable-title-biological-4').click();
            await page.getByTestId('journal-search-button').click();
            await expect(page.getByTestId('journal-list')).toBeVisible();
        });

        test('restores results and keyword state after a keyword has been deleted', async ({ page }) => {
            const ResultTitles = page.locator('[id^="journal-list-data-col-1-title"]');

            // Initial state
            await expect(ResultTitles).toHaveCount(4);
            await page
                .getByTestId('journal-search-chip-title-glycobiology')
                .getByTestId('CancelIcon')
                .click();
            await expect(page.getByTestId('journal-search-chip-title-glycobiology')).not.toBeVisible();
            await expect(ResultTitles).toHaveCount(8);

            // Navigate back
            await page.goBack();
            await expect(page.getByTestId('journal-search-chip-title-glycobiology')).toBeVisible();
            await expect(ResultTitles).toHaveCount(4);
        });

        test('restores results and facet state after a keyword has been deleted', async ({ page }) => {
            const ResultTitles = page.locator('[id^="journal-list-data-col-1-title"]');

            // Apply facets
            await page.getByRole('button', { name: 'Listed in' }).click();
            await page.getByText(/CWTS \(\d+\)/).click();
            await page.getByRole('button', { name: 'Indexed in' }).click();
            await page.getByText(/Scopus \(\d+\)/).click();
            await expect(ResultTitles).toHaveCount(4);

            // Remove keyword
            await page
                .getByTestId('journal-search-chip-title-glycobiology')
                .getByTestId('CancelIcon')
                .click();
            await expect(ResultTitles).toHaveCount(8);

            // Navigate back
            await page.goBack();
            await expect(page.getByText(/CWTS \(\d+\)/)).toBeVisible();
            await expect(page.getByText(/Scopus \(\d+\)/)).toBeVisible();
            await expect(ResultTitles).toHaveCount(4);
        });

        test('should handle invalid keywords when browser history changes', async ({ page }) => {
            await page.goto('/journals/search/?keywords=invalid-keyword');
            await page.getByTestId('journal-search-keywords-input').fill('bio');
            await page.getByTestId('journal-search-item-addable-subject-06-biological-sciences-1').click();
            await page.getByTestId('journal-search-button').click();
            await page.goBack();
            await page.goBack();
            await expect(page.getByTestId('journal-search-chip-title-glycobiology')).toBeVisible();
            await expect(page.getByTestId('journal-search-chip-title-biological')).toBeVisible();
        });
    });

    test.describe('Handling the Clear functionality', () => {
        test.beforeEach(async ({ page }) => {
            // Setup initial search
            await page.getByTestId('journal-search-keywords-input').fill('bio');
            await page.getByTestId('journal-search-item-addable-title-glycobiology-3').click();
            await page.getByTestId('journal-search-item-addable-title-biological-4').click();
            await page.getByTestId('journal-search-button').click();
        });

        test('resets the search functionality and clears results when the clear button is clicked', async ({
            page,
        }) => {
            // Apply facets and settings
            await page.getByRole('button', { name: 'Listed in' }).click();
            await page.getByText(/CWTS \(\d+\)/).click();
            await page.getByRole('button', { name: 'Indexed in' }).click();
            await page.getByText(/Scopus \(\d+\)/).click();

            // Change sorting
            await page.getByTestId('publication-list-sorting-sort-by').click();
            await page.locator('li[role="option"]:has-text("Search relevance")').click();
            await page.getByTestId('publication-list-sorting-sort-order').click();
            await page.locator('li[role="option"]:has-text("Desc")').click();
            await page.getByTestId('publication-list-sorting-page-size').click();
            await page.locator('li[role="option"]:has-text("20")').click();

            // Clear search
            await page.getByTestId('journal-search-clear-keywords-button').click();
            await expect(page.getByTestId('journal-search-card')).toBeVisible();
            await expect(page.getByTestId('journal-search-button')).toBeDisabled();
            await expect(page.getByTestId('journal-search-browse-all-button')).toBeEnabled();

            // Perform new search
            await page.getByTestId('journal-search-keywords-input').fill('bio');
            await page.getByTestId('journal-search-item-addable-title-biology-1').click();
            await page.getByTestId('journal-search-button').click();

            // Verify reset state
            await expect(page.getByTestId('journal-search-chip-title-biology')).toBeVisible();
            await expect(page.getByTestId('publication-list-sorting-sort-by')).toContainText('Highest quartile');
            await expect(page.getByTestId('publication-list-sorting-sort-order')).toContainText('Asc');
            await expect(page.getByTestId('publication-list-sorting-page-size')).toContainText('10');
        });

        test('resets the search functionality and clears results when the last keyword is deleted', async ({
            page,
        }) => {
            await page
                .getByTestId('journal-search-chip-title-glycobiology')
                .getByTestId('CancelIcon')
                .click();
            await page
                .getByTestId('journal-search-chip-title-biological')
                .getByTestId('CancelIcon')
                .click();
            await expect(page.getByTestId('journal-search-card')).toBeVisible();
            await expect(page.getByTestId('journal-search-button')).toBeDisabled();
        });
    });

    test.describe('Handles Browse All Journals functionality', () => {
        test('shows All Journals when the Browse All Journals button is clicked in Search Results', async ({
            page,
        }) => {
            // Setup search
            await page.getByTestId('journal-search-keywords-input').fill('bio');
            await page.getByTestId('journal-search-item-addable-title-glycobiology-3').click();
            await page.getByTestId('journal-search-item-addable-title-biological-4').click();
            await page.getByTestId('journal-search-button').click();

            const ResultTitles = page.locator('[id^="journal-list-data-col-1-title"]');
            await expect(ResultTitles).toHaveCount(4);

            // Browse all
            await page.getByTestId('journal-search-browse-all-button').click();
            await expect(page.getByTestId('journal-search-chip-keyword-all-journals')).toBeVisible();
            await expect(ResultTitles).toHaveCount(10);
        });

        test('shows All Journals when the Browse All Journals button is clicked from the initial Journal Search page', async ({
            page,
        }) => {
            const ResultTitles = page.locator('[id^="journal-list-data-col-1-title"]');

            // Browse all from initial state
            await page.getByTestId('journal-search-browse-all-button').click();
            await expect(page.getByTestId('journal-search-chip-keyword-all-journals')).toBeVisible();
            await expect(ResultTitles).toHaveCount(10);

            // Clear and perform new search
            await page.getByTestId('journal-search-clear-keywords-button').click();
            await page.getByTestId('journal-search-keywords-input').fill('bio');
            await page.getByTestId('journal-search-item-addable-title-biological-4').click();
            await page.getByTestId('journal-search-button').click();
            await expect(ResultTitles).toHaveCount(8);

            // Browse all again
            await page.getByTestId('journal-search-browse-all-button').click();
            await expect(ResultTitles).toHaveCount(10);
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
