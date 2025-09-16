import { expect, test } from '../test';
import { apiMockIsPaused, apiMockResponseShouldFail } from '../lib/helpers';

test.describe('ORCiD Upload button', () => {
    test.beforeEach(async ({ page }) => {
        await page.clock.install();
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

    test('should close drawer and show progress icon when updating preferences', async ({ page }) => {
        await apiMockIsPaused(page, true);
        const helpIcon = page.getByTestId('help-icon-orcid');
        const drawerMessage = page.getByTestId('help-drawer-message');
        const progress = page.getByTestId('dashboard-orcid-sync-progress-icon');
        const savingHelpText = page.getByText('Saving ORCID sync preferences.');

        await expect(drawerMessage).toBeHidden();
        await helpIcon.click();
        await expect(drawerMessage).toBeVisible();
        await expect(progress).toBeHidden();

        await page.getByTestId('orcid-sync-preferences-switch-input').locator('input').click();
        await expect(drawerMessage).toBeHidden();
        await expect(progress).toBeVisible();

        // should not allow to open drawer until saving req. is processed
        await expect(savingHelpText).toBeHidden();
        await progress.click();
        await expect(drawerMessage).toBeHidden();

        // should give used feedback of what's happening
        await progress.hover();
        await expect(savingHelpText).toBeVisible();

        await page.clock.fastForward(3000);
        await apiMockIsPaused(page, false);
        await expect(progress).toBeHidden();
        await expect(helpIcon).toBeVisible();
    });

    test('should close drawer and show error icon when fail to update preferences', async ({ page }) => {
        await apiMockIsPaused(page, true);
        await apiMockResponseShouldFail(page, true);

        const helpIcon = page.getByTestId('help-icon-orcid');
        const drawerMessage = page.getByTestId('help-drawer-message');
        const progress = page.getByTestId('dashboard-orcid-sync-progress-icon');
        const errorIcon = page.getByTestId('dashboard-orcid-sync-error-icon');

        await expect(drawerMessage).toBeHidden();
        await helpIcon.click();
        await expect(drawerMessage).toBeVisible();
        await expect(progress).toBeHidden();

        await page.getByTestId('orcid-sync-preferences-switch-input').locator('input').click();
        await expect(drawerMessage).toBeHidden();
        await expect(errorIcon).toBeHidden();
        await expect(progress).toBeVisible();

        await page.clock.fastForward(3000);
        await apiMockIsPaused(page, false);
        await expect(progress).toBeHidden();
        // should give used feedback of what's happening
        const tooltip = page.getByText('Error while saving ORCID sync preferences.');
        await expect(tooltip).toBeHidden();
        await errorIcon.hover();
        await expect(tooltip).toBeVisible();
    });
});
