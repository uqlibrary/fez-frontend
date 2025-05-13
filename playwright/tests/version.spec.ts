import { test, expect } from '@playwright/test';
import recordVersion from 'src/mock/data/records/recordVersion';
import recordVersionLegacy from 'src/mock/data/records/recordVersionLegacy';

test.describe('Record version view', () => {
    test('should load record version', async ({ page }) => {
        await page.goto(`/view/${recordVersion.rek_pid}/${recordVersion.rek_version}?user=uqstaff`);
        const alertInfo = page.locator('#alert-info');
        await expect(alertInfo).toContainText(recordVersion.rek_pid);
        await expect(alertInfo).toContainText(recordVersion.rek_version);
    });

    test('should load record with legacy version', async ({ page }) => {
        await page.goto(`/view/${recordVersionLegacy.rek_pid}/${recordVersionLegacy.rek_version}?user=uqstaff`);
        const alertInfo = page.locator('#alert-info');
        await expect(alertInfo).toContainText(recordVersionLegacy.rek_pid);
        await expect(alertInfo).toContainText(recordVersionLegacy.rek_version);
    });

    test('should not allow record version to be rendered to non admins', async ({ page }) => {
        await page.goto(`/view/${recordVersion.rek_pid}/${recordVersion.rek_version}`);
        const pageTitle = page.locator('#page-title');
        await expect(pageTitle).toContainText('Page not found');
    });

    test('should not allow record legacy version to be rendered to non admins', async ({ page }) => {
        await page.goto(`/view/${recordVersionLegacy.rek_pid}/${recordVersionLegacy.rek_version}`);
        const pageTitle = page.locator('#page-title');
        await expect(pageTitle).toContainText('Page not found');
    });
});
