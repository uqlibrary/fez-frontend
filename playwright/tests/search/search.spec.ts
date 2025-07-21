import { test, expect, Page, Locator } from '../../test';

import records from 'mock/data/records/internalTitleSearchList';

test.describe('Search', () => {
    const cleanExtraSpaces = (value: string) => value.replace(/\s+/g, ' ').trim();
    const xs = 320;
    const sm = 600;
    const md = 960;
    const xl = 1600;

    test.beforeEach(async ({ page }) => {
        await page.goto('/records/search');
        await expect(
            page
                .getByTestId('simple-search-input')
                .locator('../..', { has: page.locator('label', { hasText: 'Search eSpace' }) }),
        ).toBeVisible();
    });

    test('Doing a basic search to advanced search', async ({ page }) => {
        // Perform a basic search
        await expect(page.getByTestId('simple-search-input')).toHaveAttribute(
            'aria-label',
            'Enter your search query to search eSpace and then press Enter',
        );

        await page.getByTestId('simple-search-input').fill('cats and dogs');
        await page.getByTestId('simple-search-input').press('Enter');
        await expect(page.getByTestId('search-records-results')).toHaveText(
            /Displaying works 1 to 7 of 7 total works\./,
        );
        await expect(page.getByTestId('refine-results-facets').locator('div.StandardRighthandCard-title')).toHaveText(
            /Refine results/,
        );

        // Click through to advanced search UI
        await expect(page.getByTestId('show-advanced-search')).toHaveText(/Advanced search/);
        await expect(page.getByTestId('show-advanced-search')).toHaveAttribute(
            'aria-label',
            'Click to switch to Advanced search',
        );
        await page.getByTestId('show-advanced-search').click();
        await expect(page.locator('#advancedSearchForm h5')).toHaveText(/Advanced search/);
        await expect(page.getByTestId('any-field-input')).toHaveValue('cats and dogs');
        await page.getByTestId('any-field-input').press('Home');
        await page.getByTestId('any-field-input').pressSequentially("it's raining ");
        await expect(page.locator('#advanced-search-open-access')).toHaveAttribute(
            'aria-label',
            'Check to search for open access / full text works',
        );
        await page.getByText(/^Open access$/).click();
        const addAnotherFieldButton = page.getByTestId('advanced-search-row-add');
        await expect(addAnotherFieldButton).toContainText('Add another field');
        await expect(addAnotherFieldButton).toHaveAttribute('aria-label', 'Click to add another advanced search field');
        await addAnotherFieldButton.click();
        await page.locator('.content-container').scrollIntoViewIfNeeded();

        // Locating the select field and its sibling error message
        const selectFieldLocator = page.getByText(/Select a field/).first();
        await expect(
            selectFieldLocator.locator('xpath=ancestor::*[contains(@class, "MuiInput-root")]'),
        ).toHaveAttribute(
            'aria-label',
            'Click to select a field to search from the list - Select a field currently selected',
        );
        await expect(
            selectFieldLocator
                .locator(
                    'xpath=ancestor::*[contains(@class, "MuiInput-root")]/following-sibling::p[contains(@class, "MuiFormHelperText-root")]',
                )
                .getByText(/Please select a field to search/),
        ).toBeVisible();
        await selectFieldLocator.click();

        // Select author from the field dropdown
        await page
            .locator('#field-type-options li', { hasText: /Author Name/ })
            .first()
            .click();
        await expect(page.getByTestId('advanced-search')).toBeDisabled();
        await expect(page.getByTestId('advanced-search')).toHaveText('Search');
        await page.getByTestId('rek-author-input').fill('Ky Lane');
        await page.getByTestId('rek-author-input').press('Enter'); // Pressing Enter on an input might not trigger a search automatically
        await expect(page.getByTestId('advanced-search')).not.toBeDisabled();

        // Add a set of collections to search from
        await addAnotherFieldButton.click();
        await page
            .getByText(/Select a field/)
            .first()
            .click();
        await page
            .locator('#field-type-options li', { hasText: /Collection/ })
            .first()
            .click();
        await expect(page.getByTestId('advanced-search')).toBeDisabled();
        await page.getByTestId('rek-ismemberof-input').click();
        await page
            .locator('[data-testid=rek-ismemberof-options] li', {
                hasText: /16th Australasian Fluid Mechanics Conference/,
            })
            .first()
            .click();
        await page.getByTestId('rek-ismemberof-input').click(); // Click again to open dropdown after first selection
        await page
            .locator('[data-testid=rek-ismemberof-options] li', {
                hasText: /2004 Higher Education Research Data Collection/,
            })
            .first()
            .click();
        await expect(async () => {
            const caption = (await page.getByTestId('advanced-search-caption-container').textContent()) as string;
            expect(cleanExtraSpaces(caption)).toBe(
                "Any fieldcontainsit's raining cats and dogsANDAuthor NamecontainsKy LaneANDCollectionis one ofUQ:120743 or UQ:217410ANDisopen access/full text",
            );
        }).toPass();
        await expect(page.getByTestId('advanced-search')).not.toBeDisabled();
        await page.getByTestId('advanced-search').click();
        await expect(page.getByTestId('search-records-loading')).toHaveText(/Searching for works/);
        await expect(
            page
                .getByTestId('search-records-results')
                .getByText(/Displaying works 1 to 7 of 7 total works\./)
                .first(),
        ).toBeVisible();
    });

    test.describe('Simple search with back and forward buttons pressed', () => {
        test('should update the queryString and make API call when going back and forward on a search', async ({
            page,
        }) => {
            const catSearchString =
                '?searchQueryParams%5Ball%5D=cat&page=1&pageSize=20&sortBy=score&sortDirection=Desc';
            const dogSearchString =
                '?searchQueryParams%5Ball%5D=dog&page=1&pageSize=20&sortBy=score&sortDirection=Desc';

            await page.getByTestId('simple-search-input').fill('cat');
            await page.getByTestId('simple-search-input').press('Enter');
            await expect(page).toHaveURL(new RegExp(catSearchString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))); // Use regex for URL matching, escape special chars
            await page.getByTestId('simple-search-input').clear();
            await page.getByTestId('simple-search-input').fill('dog');
            await page.getByTestId('simple-search-input').press('Enter');
            await expect(page).toHaveURL(new RegExp(dogSearchString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));

            await page.goBack();
            await expect(page.getByTestId('simple-search-input')).toHaveValue('cat');
            await expect(page).toHaveURL(new RegExp(catSearchString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));

            await page.goForward();
            await expect(page.getByTestId('simple-search-input')).toHaveValue('dog');
            await expect(page).toHaveURL(new RegExp(dogSearchString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
        });
    });

    test.describe('facets', () => {
        test('should have facets that can be selected', async ({ page }) => {
            await expect(page.getByTestId('simple-search-input')).toHaveAttribute(
                'aria-label',
                'Enter your search query to search eSpace and then press Enter',
            );

            await page.getByTestId('simple-search-input').fill('Test');
            await page.getByTestId('simple-search-input').press('Enter');
            await expect(page.getByTestId('search-records-results')).toHaveText(
                /Displaying works 1 to 7 of 7 total works\./,
            );
            await expect(
                page.getByTestId('refine-results-facets').locator('[data-testid="facets-filter"] nav > div'),
            ).toHaveCount(8);
            await page.getByTestId('clickable-facet-category-display-type').click();
            await expect(
                page.getByTestId('clear-facet-filter-nested-item-display-type-journal-article'),
            ).not.toBeVisible();
            await page.getByTestId('facet-filter-nested-item-display-type-journal-article').click();
            await page.getByTestId('clear-facet-filter-nested-item-display-type-journal-article').click();
            await expect(
                page.getByTestId('clear-facet-filter-nested-item-display-type-journal-article'),
            ).not.toBeVisible();
        });
    });

    test.describe('Search results in Image Gallery', () => {
        test('has Display As drop down with expected values', async ({ page }) => {
            await page.setViewportSize({ width: xl, height: 1600 });
            await expect(page.getByTestId('simple-search-input')).toHaveAttribute(
                'aria-label',
                'Enter your search query to search eSpace and then press Enter',
            );

            await page.getByTestId('simple-search-input').fill('Test');
            await page.getByTestId('simple-search-input').press('Enter');
            await expect(page.getByTestId('search-records-results')).toHaveText(
                /Displaying works 1 to 7 of 7 total works\./,
            );
            const option = page.getByTestId('publication-list-display-records-as').getByRole('combobox');
            await expect(option.getByText(/Auto/)).toBeVisible();
            await option.click();
            await expect(page.getByRole('listbox').getByText(/Auto/)).toBeVisible();
            await expect(page.getByRole('listbox').getByText(/Standard/)).toBeVisible();
            await page
                .getByRole('listbox')
                .getByText(/Image Gallery/)
                .click();
            await expect(
                page
                    .getByTestId('publication-list-display-records-as')
                    .getByRole('combobox')
                    .getByText(/Image Gallery/),
            ).toBeVisible();
            await expect(page.locator('img[data-testid^=imageGalleryItemImage-]')).toHaveCount(8);

            // Using expect.poll for robust checking of content warning across sibling divs
            const firstImageItem = page.locator('li[data-testid^=image-gallery-item-]').first();
            await expect(firstImageItem.locator('div[data-testid$="-alert"]')).toBeVisible(); // Make sure alert is visible first
            await expect(firstImageItem).toContainText('Content warning');

            // Correctly iterate and assert for each item
            const imageGalleryItems = page.locator('li[data-testid^=image-gallery-item-]');
            const count = await imageGalleryItems.count();
            for (let i = 0; i < count; ++i) {
                const item = imageGalleryItems.nth(i);
                await expect(item.locator('div[data-testid$="-title"]')).toContainText(records.data[i].rek_title);
                if (i > 0) {
                    await expect(item.locator('div[data-testid$="-alert"]')).toContainText('Image not available');
                }
            }
        });

        test('should preserve users displayAs choice across searches', async ({ page }) => {
            await expect(page.getByTestId('simple-search-input')).toHaveAttribute(
                'aria-label',
                'Enter your search query to search eSpace and then press Enter',
            );
            await page.getByTestId('simple-search-input').fill('Brisbane');
            await page.getByTestId('simple-search-input').press('Enter');
            await expect(page.getByTestId('search-records-results')).toHaveText(
                /Displaying works 1 to 7 of 7 total works\./,
            );
            const option = page.getByTestId('publication-list-display-records-as').getByRole('combobox');
            await expect(option.getByText(/Auto/)).toBeVisible();
            await option.click();
            await expect(page.getByRole('listbox').getByText(/Auto/)).toBeVisible();
            await expect(page.getByRole('listbox').getByText(/Standard/)).toBeVisible();
            await page
                .getByRole('listbox')
                .getByText(/Image Gallery/)
                .click();
            await expect(
                page
                    .getByTestId('publication-list-display-records-as')
                    .getByRole('combobox')
                    .getByText(/Image Gallery/),
            ).toBeVisible();
            await page.getByTestId('simple-search-input').clear();
            await page.getByTestId('simple-search-input').fill('Queensland');
            await page.getByTestId('simple-search-input').press('Enter');
            await expect(page.getByTestId('search-records-results')).toHaveText(
                /Displaying works 1 to 7 of 7 total works\./,
            );
            await expect(
                page
                    .getByTestId('publication-list-display-records-as')
                    .getByRole('combobox')
                    .getByText(/Image Gallery/),
            ).toBeVisible();
            await expect(async () => {
                const location = new URL(page.url());
                expect(location.search).toContain('image-gallery');
            }).toPass();
        });

        // Reimplementing the breakpoint tests using getBoundingBox and checking Y positions
        const checkImageGalleryRowCount = async (page: Page, expectedCount: number) => {
            const items = await page.locator('li[data-testid^=image-gallery-item-]').all();
            if (items.length === 0) {
                expect(expectedCount).toBe(0);
                return;
            }

            const firstRowTops: number[] = [];
            const tolerance = 5; // Pixels for vertical alignment check

            for (const item of items) {
                const box = await item.boundingBox();
                if (box) {
                    // Check if this item is vertically aligned with an existing 'first row'
                    let foundRow = false;
                    for (const top of firstRowTops) {
                        if (Math.abs(box.y - top) <= tolerance) {
                            foundRow = true;
                            break;
                        }
                    }
                    if (!foundRow) {
                        firstRowTops.push(box.y);
                    }
                }
            }

            // Group items by row
            const rows: Locator[][] = Array.from({ length: firstRowTops.length }, () => []);
            for (const item of items) {
                const box = await item.boundingBox();
                if (box) {
                    for (let i = 0; i < firstRowTops.length; i++) {
                        if (Math.abs(box.y - firstRowTops[i]) <= tolerance) {
                            rows[i].push(item);
                            break;
                        }
                    }
                }
            }

            // Find the row with the smallest Y-coordinate (the top-most row)
            let topMostRow: Locator[] = [];
            let minTopY = Infinity;

            for (let i = 0; i < rows.length; i++) {
                if (rows[i].length > 0) {
                    const firstItemBox = await rows[i][0].boundingBox();
                    if (firstItemBox && firstItemBox.y < minTopY) {
                        minTopY = firstItemBox.y;
                        topMostRow = rows[i];
                    }
                }
            }
            expect(topMostRow).toHaveLength(expectedCount);
        };

        test('should show 4 items in the first row at >=medium breakpoint', async ({ page }) => {
            await page.setViewportSize({ width: md, height: 768 });
            await expect(page.getByTestId('simple-search-input')).toHaveAttribute(
                'aria-label',
                'Enter your search query to search eSpace and then press Enter',
            );

            await page.getByTestId('simple-search-input').fill('Test');
            await page.getByTestId('simple-search-input').press('Enter');
            await expect(page.getByTestId('search-records-results')).toHaveText(
                /Displaying works 1 to 7 of 7 total works\./,
            );
            const option = page.getByTestId('publication-list-display-records-as').getByRole('combobox');
            await expect(option.getByText(/Auto/)).toBeVisible();
            await option.click();
            await expect(page.getByRole('listbox').getByText(/Auto/)).toBeVisible();
            await expect(page.getByRole('listbox').getByText(/Standard/)).toBeVisible();
            await page
                .getByRole('listbox')
                .getByText(/Image Gallery/)
                .click();
            await expect(
                page
                    .getByTestId('publication-list-display-records-as')
                    .getByRole('combobox')
                    .getByText(/Image Gallery/),
            ).toBeVisible();
            await expect(page.locator('li[data-testid^=image-gallery-item-]')).toHaveCount(8);

            await checkImageGalleryRowCount(page, 4);
        });

        test('should show 3 items in the first row at >=small & <medium breakpoint', async ({ page }) => {
            await page.setViewportSize({ width: sm, height: 768 });
            await expect(page.getByTestId('simple-search-input')).toHaveAttribute(
                'aria-label',
                'Enter your search query to search eSpace and then press Enter',
            );

            await page.getByTestId('simple-search-input').fill('Test');
            await page.getByTestId('simple-search-input').press('Enter');
            await expect(page.getByTestId('search-records-results')).toHaveText(
                /Displaying works 1 to 7 of 7 total works\./,
            );
            const option = page.getByTestId('publication-list-display-records-as').getByRole('combobox');
            await expect(option.getByText(/Auto/)).toBeVisible();
            await option.click();
            await expect(page.getByRole('listbox').getByText(/Auto/)).toBeVisible();
            await expect(page.getByRole('listbox').getByText(/Standard/)).toBeVisible();
            await page
                .getByRole('listbox')
                .getByText(/Image Gallery/)
                .click();
            await expect(
                page
                    .getByTestId('publication-list-display-records-as')
                    .getByRole('combobox')
                    .getByText(/Image Gallery/),
            ).toBeVisible();
            await expect(page.locator('li[data-testid^=image-gallery-item-]')).toHaveCount(8);

            await checkImageGalleryRowCount(page, 3);
        });

        test('should show 2 items in the first row at >=xs & <small breakpoint', async ({ page }) => {
            await page.setViewportSize({ width: xs, height: 768 });
            await expect(page.getByTestId('simple-search-input')).toHaveAttribute(
                'aria-label',
                'Enter your search query to search eSpace and then press Enter',
            );

            await page.getByTestId('simple-search-input').fill('Test');
            await page.getByTestId('simple-search-input').press('Enter');
            await expect(page.getByTestId('search-records-results')).toHaveText(
                /Displaying works 1 to 7 of 7 total works\./,
            );
            const option = page.getByTestId('publication-list-display-records-as').getByRole('combobox');
            await expect(option.getByText(/Auto/)).toBeVisible();
            await option.click();
            await expect(page.getByRole('listbox').getByText(/Auto/)).toBeVisible();
            await expect(page.getByRole('listbox').getByText(/Standard/)).toBeVisible();
            await page
                .getByRole('listbox')
                .getByText(/Image Gallery/)
                .click();
            await expect(
                page
                    .getByTestId('publication-list-display-records-as')
                    .getByRole('combobox')
                    .getByText(/Image Gallery/),
            ).toBeVisible();
            await expect(page.locator('li[data-testid^=image-gallery-item-]')).toHaveCount(8);

            await checkImageGalleryRowCount(page, 2);
        });
    });
});
