import { test, expect } from '@playwright/test';

test.describe('ORCiD Upload button', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/dashboard');
    });

    test('should appear and open panel on click; panel can close', async ({ page }) => {
        // Click the ORCID help icon
        const helpIcon = page.locator('[data-testid="help-icon-orcid"]');
        await expect(helpIcon).toHaveCount(1);
        await helpIcon.click();

        // Drawer message appears and title contains 'ORCID'
        const drawerMessage = page.locator('[data-testid="help-drawer-message"]');
        await expect(drawerMessage).toBeVisible();
        await expect(page.locator('[data-testid="help-drawer-title"]')).toContainText('ORCID');

        // Upload and view buttons enabled
        await expect(page.locator('[data-testid="orcid-upload-start-button"]')).toBeEnabled();
        await expect(page.locator('[data-testid="orcid-view-works-button"]')).toBeEnabled();

        // Close the drawer
        await page.locator('[data-testid="help-drawer-close"]').click();
        await expect(drawerMessage).toBeHidden();
    });

    test('should open panel which closes on requesting ORCID upload', async ({ page }) => {
        // Open the ORCID drawer
        await page.locator('[data-testid="help-icon-orcid"]').click();
        const drawerMessage = page.locator('[data-testid="help-drawer-message"]');
        await expect(drawerMessage).toBeVisible();

        // Click upload start closes the drawer
        await page.locator('[data-testid="orcid-upload-start-button"]').click();
        await expect(drawerMessage).toBeHidden();
    });
});
