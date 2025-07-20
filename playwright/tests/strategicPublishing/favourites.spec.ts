import { test, expect } from '../../lib/fixture';
import { assertAccessibility } from '../../support/axe';

test.describe('Strategic Publishing - Favourite Journals', () => {
    test('Should render', async ({ page }) => {
        await page.goto('/journals/favourites/');
        await expect(page.locator('#journal-list-data-col-1-checkbox-1')).toBeVisible();
        await assertAccessibility(page, 'div.StandardPage');
    });

    test('Should toggle select all', async ({ page }) => {
        await page.goto('/journals/favourites/');
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
        // refresh page
        await page.getByTestId('publication-list-sorting-sort-order').click();
        await page.getByTestId('publication-list-sorting-sort-order-option-1').click();
        // make sure selection was cleared
        await expect(page.locator('#journal-list-header-col-1-select-all')).not.toBeChecked({ timeout: 1000 });

        await expect(page.locator('#journal-list-data-col-1-checkbox-0')).not.toBeChecked();
        await expect(page.locator('#journal-list-data-col-1-checkbox-1')).not.toBeChecked();

        await assertAccessibility(page, 'div.StandardPage');
    });

    test('Should navigate to search', async ({ page }) => {
        await page.goto('/journals/favourites/');
        await page.getByTestId('return-to-search-results-button').click();
        await expect(page).toHaveURL(/.*\/journals\/search\//);
    });

    test('Should remove a favourite journal and navigate back to search results', async ({ page }) => {
        const uri = '/journals/search/';
        const query =
            '?keywords%5BTitle-Microbiology%5D%5Btype%5D=Title&keywords%5BTitle-Microbiology%5D%5Btext%5D=Microbiology&keywords%5BTitle-Microbiology%5D%5Bid%5D=Title-Microbiology';
        await page.goto(`${uri}${query}`);
        await page.getByTestId('journal-search-favourite-journals-button').click();
        await expect(page).toHaveURL(/.*\/journals\/favourites\//);

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
        await expect(page).toHaveURL(`${uri}${query}`);
    });
});
