import { expect, test } from '../test';

test.describe('ORCiD Upload button', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/dashboard');
    });

    test('should appear and open panel on click; panel can close', async ({ page }) => {
        await page.getByTestId('help-icon-orcid').click();
        const drawerMessage = page.getByTestId('help-drawer-message');
        await expect(drawerMessage).toBeVisible();
        await expect(page.getByTestId('help-drawer-title')).toContainText('ORCID');
        await expect(page.getByTestId('orcid-upload-start-button')).toBeEnabled();
        await expect(page.getByTestId('orcid-view-works-button')).toBeEnabled();
        await page.getByTestId('help-drawer-close').click();
        await expect(drawerMessage).toBeHidden();
    });

    test('should open panel which closes on requesting ORCID upload', async ({ page }) => {
        await page.getByTestId('help-icon-orcid').click();
        const drawerMessage = page.getByTestId('help-drawer-message');
        await expect(drawerMessage).toBeVisible();
        await page.getByTestId('orcid-upload-start-button').click();
        await expect(drawerMessage).toBeHidden();
    });
});
