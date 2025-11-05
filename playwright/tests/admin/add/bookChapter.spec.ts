import { test, expect } from '../../../test';
import { clickAutoSuggestion } from '../../../lib/helpers';

test.describe('As an admin, I can', () => {
    test('see language related fields', async ({ page }) => {
        await page.goto('/admin/add?user=uqstaff');

        // Choose a collection
        await page.getByTestId('rek-ismemberof-input').type('a');
        await clickAutoSuggestion(page, 'rek-ismemberof', 0);

        // Choose display type
        await page.getByTestId('rek-display-type-select').click();
        await page.getByTestId('rek-display-type-options').locator('li', { hasText: 'Book Chapter' }).click();

        // Choose sub type
        await page.getByTestId('rek-subtype-select').click();
        await page
            .getByTestId('rek-subtype-options')
            .locator('li', { hasText: 'Research book chapter (original research)' })
            .click();

        // Apply selections
        await page.getByRole('button', { name: 'Create work' }).click();

        // Language related fields should not show when language is english
        await expect(page.getByTestId('rek-language-of-title-select')).not.toBeVisible();
        await expect(page.getByTestId('rek-native-script-title-input')).not.toBeVisible();
        await expect(page.getByTestId('rek-roman-script-title-input')).not.toBeVisible();
        await expect(page.getByTestId('rek-translated-title-input')).not.toBeVisible();

        // Select German
        await page.getByTestId('rek-language-select').click();
        await page.getByTestId('rek-language-options').getByText('German', { exact: true }).click();

        await expect(page.getByTestId('rek-language-of-title-select')).toBeVisible();
        await expect(page.getByTestId('rek-native-script-title-input')).toBeVisible();
        await expect(page.getByTestId('rek-roman-script-title-input')).toBeVisible();
        await expect(page.getByTestId('rek-translated-title-input')).toBeVisible();
    });
});
