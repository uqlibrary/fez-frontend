import { test, expect, Page } from '../test';

import { default as recordListBook } from 'mock/data/records/publicationTypeListBookEdited';
import { default as recordListImage } from 'mock/data/records/publicationTypeListImage';

const recordBook = recordListBook.data[0];
const recordImage = recordListImage.data[0];

test.describe('Change display type', () => {
    const selectItem = async (page: Page, field: string, firstChildLabel: string) => {
        await page.getByTestId(`${field}-select`).click();
        await page
            .getByTestId(`${field}-options`)
            .locator('li[role=option]')
            .getByText(firstChildLabel)
            .first()
            .click();
    };

    test('should work as expected when changing to a record type with subtypes', async ({ page }) => {
        const pid = 'UQ:603315';
        await page.goto(`/admin/change-display-type/${pid}?user=uqstaff`);
        await expect(page.locator('h2')).toHaveCount(1);
        await expect(page.locator('h2')).toContainText(/Change display type from /);
        await expect(page.locator('h2')).toContainText(recordBook.rek_display_type_lookup);
        await expect(page.locator('h2')).toContainText(recordBook.rek_subtype);
        await expect(page.locator('.publicationCitation .citationTitle')).toContainText(recordBook.rek_title);

        // select display type
        await selectItem(page, 'rek-display-type', 'Conference Paper');

        // select Conference Paper, as it has subtypes, so the second dropdown will appear
        await expect(page.getByTestId('change-display-type-submit')).toBeDisabled();

        // select subtype
        await selectItem(page, 'rek-subtype', 'Fully published paper');
        await expect(page.getByTestId('change-display-type-submit')).not.toBeDisabled();
        await expect(page.getByTestId('change-display-type-submit')).toHaveText('Change display type');
        await page.getByTestId('change-display-type-submit').click();

        // form submitted and the green 'all good' message appears, with 'view' and 'edit' buttons
        await expect(page.getByTestId('change-display-type-submit-status')).toHaveText(/Success/);
        await expect(page.getByTestId('change-display-type-submit-status')).toHaveText(
            /Display type has been changed successfully\./,
        );
        await expect(page.getByRole('dialog').locator('h2')).toHaveText(/Change Display type/);
        await expect(page.locator('button', { hasText: /View work/ })).toBeVisible();
        await page.locator('button', { hasText: /Edit full work/ }).click();
        await expect(async () => {
            const loc = new URL(page.url());
            expect(loc.pathname).toBe(`/admin/edit/${pid}`);
            // this loads a 404 page because the '?user=uqstaff' isn't in the url, but the url is fine
        }).toPass();
    });

    test('should work as expected when changing to a record type without subtypes', async ({ page }) => {
        const pid = 'UQ:134700';
        await page.goto(`/admin/change-display-type/${pid}?user=uqstaff`);
        await expect(page.locator('h2')).toHaveCount(1);
        await expect(page.locator('h2')).toContainText(/Change display type from /);
        await expect(page.locator('h2')).toContainText(recordImage.rek_display_type_lookup);
        await expect(page.locator('.publicationCitation .citationTitle')).toContainText(recordImage.rek_title);

        // select display type
        await selectItem(page, 'rek-display-type', 'Image');

        // The Image type does not have subtypes, so the second dropdown will not appear
        // and the submit button is enabled immediately
        await expect(page.getByTestId('change-display-type-submit')).not.toBeDisabled();
        await expect(page.getByTestId('change-display-type-submit')).toHaveText('Change display type');
        await page.getByTestId('change-display-type-submit').click();

        // form submitted and the green 'all good' message appears, with 'view' and 'edit' buttons
        await expect(page.getByTestId('change-display-type-submit-status')).toHaveText(/Success/);
        await expect(page.getByTestId('change-display-type-submit-status')).toHaveText(
            /Display type has been changed successfully\./,
        );
        await expect(page.getByRole('dialog').locator('h2')).toHaveText(/Change Display type/);
        await expect(page.locator('button', { hasText: /edit full work/i })).toBeVisible();
        await page
            .locator('button')
            .getByText(/view work/i)
            .click();
        await expect(page).toHaveURL(`/view/${pid}`);
    });
});
