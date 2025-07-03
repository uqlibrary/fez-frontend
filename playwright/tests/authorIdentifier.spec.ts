import { test, expect } from '@playwright/test';

test.describe('Author Identifier Orcid Link', () => {
    test('should show linking buttons for authors with no linked orcid id', async ({ page }) => {
        await page.goto('/author-identifiers/orcid/link');

        // Wait until the URL contains '/dashboard'
        await expect(page).toHaveURL(/.*\/dashboard/);
    });

    test('should redirect to dashboard for authors with linked orcid id', async ({ page }) => {
        await page.goto('/author-identifiers/orcid/link?user=s4444444');

        await expect(page.getByTestId('page-title')).toContainText('Link ORCID ID to UQ eSpace');

        await expect(
            page
                .getByTestId('standard-card-i-already-have-an-orcid-id-content')
                .getByRole('button', { name: 'Link your existing ORCID iD' }),
        ).toBeVisible();

        await expect(
            page
                .getByTestId('standard-card-i-need-an-orcid-id-content')
                .getByRole('button', { name: 'Create a new ORCID iD' }),
        ).toBeVisible();
    });
});
