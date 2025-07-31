import { test, expect } from '../../../test';
import { assertAccessibility } from '../../../lib/axe';

test.describe('Navigating to Admin Dashboard - System Alerts tab', () => {
    test('should be reachable via the menu link for users with masquerade=full', async ({ page }) => {
        await page.setViewportSize({ width: 1300, height: 1000 });
        await page.goto('/?user=uqstaff');
        await expect(page.locator('#menudrawer')).toBeAttached();
        await page.locator('[role=button]', { hasText: 'Admin dashboard' }).click();
        await expect(page).toHaveURL(/admin\/dashboard/);
        await expect(page.getByTestId('page-title')).toContainText('Admin dashboard');
        await assertAccessibility(page, 'div.StandardPage', { disabledRules: ['aria-progressbar-name'] });
    });

    test('should not reachable via the menu link for users with masquerade=readonly or below', async ({ page }) => {
        await page.setViewportSize({ width: 1300, height: 1000 });
        await page.goto('/?user=uqresearcher');
        await expect(page.locator('#menudrawer')).toBeAttached();
        await expect(page.locator('[role=button]', { hasText: 'Admin dashboard' })).not.toBeAttached();

        await page.goto('/admin/dashboard?user=uqresearcher');
        await expect(page).toHaveURL(/admin\/dashboard/);
        await expect(page.getByTestId('page-title')).toContainText('Page not found');
    });
});
