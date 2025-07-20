import { test, expect } from '../../../lib/fixture';

test.describe('As an admin,', () => {
    test('I can create a community', async ({ page }) => {
        await page.goto('/admin/community?user=uqstaff');
        await expect(page.locator('h2')).toHaveText(/Add a missing community/);
        await expect(page.locator('h3')).toHaveText(/Community details/);
        await page.getByTestId('rek-title-input').fill('Fez E2E Test Community');
        await page.getByTestId('rek-description-input').fill('Fez E2E Test Community description');
        await page.getByTestId('rek-keywords-input').fill('testing');
        await page.getByTestId('rek-keywords-add').click();
        await page.getByTestId('submit-community').click();
        await expect(page.locator('h3')).toHaveText(/Community added successfully/);
        await page
            .locator('button')
            .getByText(/Add another community/)
            .first()
            .click();
        await expect(
            page
                .locator('h3')
                .getByText(/Community details/)
                .first(),
        ).toBeVisible();
    });
});
