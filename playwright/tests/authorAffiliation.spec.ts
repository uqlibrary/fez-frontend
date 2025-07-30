import { expect, test } from '../test';

test.describe('Record with invalid affiliation', () => {
    test('should show correct indicators for orphaned affiliations, and provide navigation', async ({ page }) => {
        // Navigate to the record view as staff
        await page.goto('/view/UQ:871c1f8?user=uqstaff');

        // Open the affiliation error drawer
        const toggleIcon = page.getByTestId('error-affiliation-toggle-icon');
        await toggleIcon.waitFor({ state: 'visible' });
        await toggleIcon.click();

        // Verify the affiliation error indicator exists
        await expect(
            page.locator('#adminViewRecordDrawerDesktop [data-testid="affiliation_error_drawer_indicator"]'),
        ).toBeVisible();

        // Check specific affiliation error messages
        const incompleteAffiliation = page.locator('#adminViewRecordDrawerDesktop [data-testid="affil_error_88844"]');
        await expect(incompleteAffiliation).toContainText('Robertson, Avril A. B. not 100%');
        await expect(incompleteAffiliation).toContainText('has incomplete author affiliation information');

        const orphanedAffiliation = page.locator('#adminViewRecordDrawerDesktop [data-testid="affil_error_7624840"]');
        await expect(orphanedAffiliation).toContainText('Affiliate, Orphaned');
        await expect(orphanedAffiliation).toContainText('has orphaned author information');

        // Click the 'Fix Affiliations' button
        await page.locator('#adminViewRecordDrawerDesktop [data-testid="btnFixAffiliations"]').click();

        // Cancel the fix workflow and verify return to page title
        const cancelTop = page.locator('#admin-work-cancel-top');
        await cancelTop.waitFor({ state: 'visible' });
        await cancelTop.click();

        // Verify page-title reads 'Chick'
        const pageTitle = page.getByTestId('page-title');
        await expect(pageTitle).toContainText('Chick');
    });
});
