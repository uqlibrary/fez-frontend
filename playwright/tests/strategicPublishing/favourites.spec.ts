import { test, expect } from '../../test';
import { Locator, Page } from '@playwright/test';
import { assertAccessibility } from '../../lib/axe';

test.describe('Favourite Journals', () => {
    test.describe('lists', () => {
        const assertRowCount = async (page: Page, expected: number) => {
            await expect(page.locator('[data-rowindex]')).toHaveCount(expected);
        };

        const assertIsPublic = async (locator: Locator) => await expect(locator.getByTestId('DoneIcon')).toBeVisible();

        const assertIsNotPublic = async (locator: Locator) => await expect(locator).toHaveText('-');

        const assertInitialRowState = async (page: Page) => {
            await expect(page.getByTestId('fjl-label-1')).toHaveText('List one');
            await expect(page.getByTestId('fjl-label-2')).toHaveText('List two');
            await assertIsPublic(page.getByTestId('fjl-is-public-1'));
            await assertIsNotPublic(page.getByTestId('fjl-is-public-2'));
        };

        // Note: the remaining test assertions are performed by Jest tests
        test('should allow managing favourite lists', async ({ page, context }) => {
            await page.goto('/journals/userLists/');
            await assertRowCount(page, 2);
            await assertInitialRowState(page);

            // should allow adding a new row
            await page.getByTestId('journal-user-lists-add').click();
            await page.keyboard.type('New list');
            await page.keyboard.press('Enter');
            await assertRowCount(page, 3);
            await assertInitialRowState(page);
            await expect(page.getByTestId('fjl-label-3')).toHaveText('New list');
            await assertIsNotPublic(page.getByTestId('fjl-is-public-3'));

            // should allow editing a row
            await page.getByTestId('journal-user-lists-item-0-edit').click();
            await page.keyboard.type(' updated');
            await page.getByTestId('fjl-is-public-3-input').click();
            await page.keyboard.press('Enter');
            await assertRowCount(page, 3);
            await assertInitialRowState(page);
            await expect(page.getByTestId('fjl-label-3')).toHaveText('New list updated');
            await assertIsPublic(page.getByTestId('fjl-is-public-3'));

            // should allow removing a row
            await page.getByTestId('journal-user-lists-item-0-delete').click();
            await page.getByTestId('journal-user-lists-item-0-save').click();
            await assertRowCount(page, 2);
            await assertInitialRowState(page);

            // test share link
            await context.grantPermissions(['clipboard-read', 'clipboard-write']);
            await page.getByTestId('fjl-sharable-link-1').click();
            await page.getByTestId('copy-to-clipboard-dialog-copy=button').click();
            expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
                'http://localhost:3000/journals/search/?activeFacets%5Bfilters%5D%5BShowFavouritedOnly%5D=1&keywords%5BKeyword-all-journals%5D%5Btype%5D=Keyword&keywords%5BKeyword-all-journals%5D%5Btext%5D=all+journals&keywords%5BKeyword-all-journals%5D%5Bid%5D=Keyword-all-journals&keywords%5BKeyword-all-journals%5D%5Boperand%5D=AND#/journals/search/?activeFacets%5Bfilters%5D%5BShowFavouritedOnly%5D=true&page=1&keywords%5BKeyword-all-journals%5D%5Btype%5D=Keyword&keywords%5BKeyword-all-journals%5D%5Btext%5D=all+journals&keywords%5BKeyword-all-journals%5D%5Bid%5D=Keyword-all-journals&keywords%5BKeyword-all-journals%5D%5Boperand%5D=AND',
            );

            await assertAccessibility(page, 'div.StandardPage');

            // test view link
            await page.getByTestId('fjl-view-link-1').click();
            await expect(page).toHaveURL(
                '/journals/search/?activeFacets%5Bfilters%5D%5BShowFavouritedOnly%5D=1&keywords%5BKeyword-all-journals%5D%5Btype%5D=Keyword&keywords%5BKeyword-all-journals%5D%5Btext%5D=all+journals&keywords%5BKeyword-all-journals%5D%5Bid%5D=Keyword-all-journals&keywords%5BKeyword-all-journals%5D%5Boperand%5D=AND',
            );
        });
    });

    test.describe('list items', () => {
        test('Should toggle select all', async ({ page }) => {
            await page.goto('/journals/favourites/1');
            await expect(page.locator('#journal-list-header-col-1-select-all')).not.toBeChecked();
            await expect(page.locator('#journal-list-data-col-1-checkbox-0')).not.toBeChecked();
            await expect(page.locator('#journal-list-data-col-1-checkbox-1')).not.toBeChecked();

            // select all
            await page.locator('#journal-list-header-col-1-select-all').click();
            await expect(page.locator('#journal-list-header-col-1-select-all')).toBeChecked();
            await expect(page.locator('#journal-list-data-col-1-checkbox-0')).toBeChecked();
            await expect(page.locator('#journal-list-data-col-1-checkbox-1')).toBeChecked();
            // unselect first record
            await page.locator('#journal-list-data-col-1-checkbox-0').click();
            await expect(page.locator('#journal-list-header-col-1-select-all')).not.toBeChecked();
            await expect(page.locator('#journal-list-data-col-1-checkbox-0')).not.toBeChecked();
            await expect(page.locator('#journal-list-data-col-1-checkbox-1')).toBeChecked();
            // select first record
            await page.locator('#journal-list-data-col-1-checkbox-0').click();
            await expect(page.locator('#journal-list-header-col-1-select-all')).toBeChecked();
            await expect(page.locator('#journal-list-data-col-1-checkbox-0')).toBeChecked();
            await expect(page.locator('#journal-list-data-col-1-checkbox-1')).toBeChecked();
            // unselect all
            await page.locator('#journal-list-header-col-1-select-all').click();
            await expect(page.locator('#journal-list-header-col-1-select-all')).not.toBeChecked();
            await expect(page.locator('#journal-list-data-col-1-checkbox-0')).not.toBeChecked();
            await expect(page.locator('#journal-list-data-col-1-checkbox-1')).not.toBeChecked();
            // select all
            await page.locator('#journal-list-header-col-1-select-all').click();
            await expect(page.locator('#journal-list-header-col-1-select-all')).toBeChecked();
            await expect(page.locator('#journal-list-data-col-1-checkbox-0')).toBeChecked();
            await expect(page.locator('#journal-list-data-col-1-checkbox-1')).toBeChecked();
            // change results sorting
            await page.getByTestId('publication-list-sorting-sort-order').click();
            await page.getByTestId('publication-list-sorting-sort-order-option-1').click();
            // make sure selection was cleared
            await expect(page.locator('#journal-list-header-col-1-select-all')).not.toBeChecked();

            await expect(page.locator('#journal-list-data-col-1-checkbox-0')).not.toBeChecked();
            await expect(page.locator('#journal-list-data-col-1-checkbox-1')).not.toBeChecked();

            await assertAccessibility(page, 'div.StandardPage');
        });

        test('Should remove a favourite journal and navigate back to search results', async ({ page }) => {
            const uri = '/journals/search/';
            const query =
                '?keywords%5BTitle-Microbiology%5D%5Btype%5D=Title&keywords%5BTitle-Microbiology%5D%5Btext%5D=Microbiology&keywords%5BTitle-Microbiology%5D%5Bid%5D=Title-Microbiology&keywords%5BTitle-Microbiology%5D%5Boperand%5D=OR';
            await page.goto(`${uri}${query}`);
            await page.getByTestId('journal-search-favourite-journals-button').click();
            await page.getByTestId('journal-user-lists-item-0-items').click();
            await expect(page).toHaveURL(/.*\/journals\/favourites\/1/);

            // change results sorting
            await page.getByTestId('publication-list-sorting-sort-order').click();
            await page.getByTestId('publication-list-sorting-sort-order-option-1').click();
            // remove a fav
            await expect(page.getByTestId('remove-from-favourites-button')).toBeDisabled();
            await page.getByTestId('journal-list-data-col-1-checkbox-1').click();
            await expect(page.getByTestId('remove-from-favourites-button')).not.toBeDisabled();
            await page.getByTestId('remove-from-favourites-button').click();

            // API should refetch the favourite journal list after removal
            await expect(page.locator('[data-testid="journal-list-data-col-1-checkbox-1"] input')).not.toBeChecked();
            await page.getByTestId('return-to-search-results-button').click();
            // go back to search results
            await expect(page).toHaveURL(`${uri}`);
        });
    });
});
