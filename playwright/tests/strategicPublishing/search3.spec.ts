import { test, expect, Page } from '../../test';
import { assertAccessibility } from '../../lib/axe';
import { assertNotSearchParams } from '../../lib/url';
import { assertInitialViewVisible, setupInitialSearchAndAssert } from './helpers';

export async function assertCollapsiblePanel(page: Page, index: number) {
    await expect(page.getByTestId(`journal-list-collapse-panel-${index}`)).not.toBeVisible();
    await page.getByTestId(`journal-list-expander-btn-${index}`).click();
    await expect(page.getByTestId(`journal-list-collapse-panel-${index}`)).toBeVisible();

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
        const locator = page.getByTestId(`${metric.testid}-${index}`);
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

    test('Selecting keyword should not change scroll position', async ({ page }) => {
        await page.getByTestId('journal-search-keywords-input').fill('bio');
        await page.getByTestId('journal-search-item-addable-keyword-bioe-27').click();
        await expect(page.getByTestId('journal-search-chip-keyword-bioe')).toBeVisible();
    });

    test('Renders journal search result table in collapsed view by default for mobile', async ({ page }) => {
        await page.setViewportSize({ width: 599, height: 1000 });
        await page.getByTestId('journal-search-keywords-input').fill('bio');
        await page.getByTestId('journal-search-item-addable-title-microbiology-0').click();
        await page.getByTestId('journal-search-button').click();
        await expect(page.getByTestId('journal-list')).toBeVisible();

        // Mobile specific checks
        await expect(page.getByTestId('journal-list-header-jnl-title')).toContainText('Journal title');
        await expect(page.getByTestId('journal-list-header-open-access-0')).toContainText('Open access');
        await expect(page.getByTestId('journal-list-header-highest-quartile-0')).toContainText('Highest quartile');
        await expect(page.getByTestId('journal-list-header-open-access-9')).toContainText('Open access');
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
        await page.getByRole('button').getByText('Journal search').click();

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
