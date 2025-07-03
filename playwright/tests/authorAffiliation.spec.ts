import { expect, test } from '../fixture';

test.describe('Record with invalid affiliation', () => {
    test('should show correct indicators for orphaned affiliations, and provide navigation', async ({ page }) => {
        // Navigate to the record view as staff
        await page.goto('/view/UQ:871c1f8?user=uqstaff');

        // Open the affiliation error drawer
        const toggleIcon = page.locator('[data-testid="error-affiliation-toggle-icon"]');
        await expect(toggleIcon).toHaveCount(1);
        await toggleIcon.click();

        // Verify the affiliation error indicator exists
        const drawerIndicator = page.locator(
            '#adminViewRecordDrawerDesktop [data-testid="affiliation_error_drawer_indicator"]',
        );
        await expect(drawerIndicator).toBeVisible();

        // Check specific affiliation error messages
        const incompleteAffil = page.locator('#adminViewRecordDrawerDesktop [data-testid="affil_error_88844"]');
        await expect(incompleteAffil).toContainText('Robertson, Avril A. B. not 100%');
        await expect(incompleteAffil).toContainText('has incomplete author affiliation information');

        const orphanedAffil = page.locator('#adminViewRecordDrawerDesktop [data-testid="affil_error_7624840"]');
        await expect(orphanedAffil).toContainText('Affiliate, Orphaned');
        await expect(orphanedAffil).toContainText('has orphaned author information');

        // Click the 'Fix Affiliations' button
        await page.locator('#adminViewRecordDrawerDesktop [data-testid="btnFixAffiliations"]').click();

        // Cancel the fix workflow and verify return to page title
        const cancelTop = page.locator('#admin-work-cancel-top');
        await expect(cancelTop).toHaveCount(1);
        await cancelTop.click();

        // Verify page-title reads 'Chick'
        const pageTitle = page.locator('[data-testid="page-title"]');
        await expect(pageTitle).toContainText('Chick');
    });
});
