import { test, expect } from '../../../test';
import { clickAutoSuggestion } from '../../../lib/helpers';
import { selectUQAuthor } from '../helpers';

test.describe('As an admin,', () => {
    test('I can add authors/contributors with different external identifiers', async ({ page }) => {
        await page.setViewportSize({ width: 1200, height: 1600 });
        await page.goto('/admin/add?user=uqstaff');

        // Choose a collection
        await page.getByTestId('rek-ismemberof-input').fill('a');
        await clickAutoSuggestion(page, 'rek-ismemberof', 0);

        // Choose display type
        await page.getByTestId('rek-display-type-select').click();
        await page
            .getByTestId('rek-display-type-options')
            .locator('li', { hasText: /Instrument/ })
            .first()
            .click();

        // Apply selections
        await page.getByRole('button', { name: 'Create work' }).click();

        // add author
        await page.getByTestId('rek-author-add').click();
        await page.getByTestId('rek-author-input').fill('Author');
        await page.getByTestId('rek-author-add-save').click();
        await expect(page.getByTestId('rek-author-list-row-0-external-identifier')).toHaveText('');
        await expect(page.getByTestId('rek-author-list-row-0-external-identifier-type')).toHaveText('');

        // add author with ORCID
        await page.getByTestId('rek-author-add').click();
        await page.getByTestId('rek-author-input').fill('Author with ORCID');
        await expect(page.getByTestId('rek-author-external-identifier-type-select')).not.toBeDisabled();
        await page.getByTestId('rek-author-external-identifier-type-select').click();
        await page.getByRole('option', { name: 'Orcid' }).click();
        await page.getByTestId('rek-author-external-identifier-input').fill('0000-0000-0000-1111');
        await page.getByTestId('rek-author-add-save').click();

        await expect(page.getByTestId('rek-author-list-row-1-external-identifier')).toHaveText('0000-0000-0000-1111');
        await expect(page.getByTestId('rek-author-list-row-1-external-identifier-type')).toHaveText('Orcid');

        // add author with ROR
        await page.getByTestId('rek-author-add').click();
        await page.getByTestId('rek-author-input').fill('Author with ROR');
        await expect(page.getByTestId('rek-author-external-identifier-type-select')).not.toBeDisabled();
        await page.getByTestId('rek-author-external-identifier-type-select').click();
        await expect(page.getByRole('option', { name: 'Orcid' })).not.toBeDisabled();
        await expect(page.getByRole('option', { name: 'Ror' })).not.toBeDisabled();
        await page.getByRole('option', { name: 'Ror' }).click();
        await page.getByTestId('rek-author-external-identifier-input').fill('02mhbdp94');
        await page.getByTestId('rek-author-add-save').click();

        await expect(page.getByTestId('rek-author-list-row-2-external-identifier')).toHaveText('02mhbdp94');
        await expect(page.getByTestId('rek-author-list-row-2-external-identifier-type')).toHaveText('ROR');

        // test autopopulating ORCID when selecting an UQ author
        await selectUQAuthor(page, 'Steve Su');
        await expect(page.getByTestId('rek-author-external-identifier-input')).toHaveValue('0000-0000-0000-1234');
        await expect(page.getByTestId('rek-author-external-identifier-input')).toBeDisabled();
        await expect(page.getByTestId('rek-author-external-identifier-type-select')).toContainText('Orcid');
        await expect(page.getByTestId('rek-author-external-identifier-type-input')).toBeDisabled();
        await page.getByTestId('rek-author-add-save').click();
        await expect(page.getByTestId('rek-author-list-row-3-external-identifier')).toHaveText('0000-0000-0000-1234');
        await expect(page.getByTestId('rek-author-list-row-3-external-identifier-type')).toHaveText('Orcid');

        // test adding UQ author with new ORCID
        await selectUQAuthor(page, 'Steven Platz');
        await expect(page.getByTestId('rek-author-external-identifier-input')).toHaveValue('');
        await expect(page.getByTestId('rek-author-external-identifier-input')).toBeEnabled();
        await page.getByTestId('rek-author-external-identifier-type-select').click();
        await page.getByRole('option', { name: 'Orcid' }).click();
        await page.getByTestId('rek-author-external-identifier-input').fill('0000-0000-0000-2222');
        await page.getByTestId('rek-author-add-save').click();

        await expect(page.getByTestId('rek-author-list-row-4-external-identifier')).toHaveText('0000-0000-0000-2222');
        await expect(page.getByTestId('rek-author-list-row-4-external-identifier-type')).toHaveText('Orcid');
    });
});
