import { test, expect } from '../../../test';

test.describe('As an admin,', () => {
    test('I can create a collection', async ({ page }) => {
        await page.goto('/admin/collection?user=uqstaff');
        await expect(page.locator('h3').getByText(/Add a missing collection/)).toBeVisible();
        await expect(page.getByText(/Select a community/)).toBeVisible();
        await page.getByTestId('rek-ismemberof-select').click();
        await page
            .getByTestId('rek-ismemberof-options')
            .locator('li', { hasText: /Advanced Computational/ })
            .first()
            .click();
        await expect(
            page
                .locator('h3')
                .getByText(/Collection details/)
                .first(),
        ).toBeVisible();
        await page.getByTestId('rek-title-input').fill('E2E Testing Collection');
        await page.getByTestId('rek-description-input').fill('This collection is created through automated testing.');
        await page.getByTestId('rek-keywords-input').fill('testing');
        await page.getByTestId('rek-keywords-add').click();
        await expect(
            page
                .getByTestId('rek-keywords-list')
                .locator('p', { hasText: /testing/ })
                .first(),
        ).toBeVisible();
        await page
            .locator('button')
            .getByText(/Add collection/)
            .first()
            .click();
        await expect(page.locator('h3').getByText(/Collection added successfully/)).toBeVisible();
        await page
            .locator('button')
            .getByText(/Add another collection/)
            .first()
            .click();
        await expect(page.locator('h3').getByText(/Add a missing collection/)).toBeVisible();
    });
});
