import { expect, test } from '../lib/fixture';

test.describe('Masquerade', () => {
    test("unprivileged users can't masquerade", async ({ page }) => {
        await page.goto('/admin/masquerade');
        // Expect the access denied message
        await expect(page.locator('body')).toContainText('The requested page is available to authorised users only.');
    });

    test('privileged users can masquerade', async ({ page }) => {
        // Intercept calls to the auth endpoint
        await page.route('**/auth.library.uq.edu.au/**', async route => {
            if (route.request().method() !== 'GET') {
                return route.fallback();
            }
            await route.fulfill({
                status: 200,
                contentType: 'text/plain',
                body: 'user has navigated to auth',
            });
        });

        // Navigate as a privileged user
        await page.goto('/admin/masquerade/?user=uqmasquerade');
        // Enter target user and trigger masquerade
        await page.locator('#userName').fill('s1111111');
        await page.locator('button:has-text("Masquerade")').click();

        // Verify navigation to auth
        await expect(page.locator('body')).toContainText('user has navigated to auth');
    });
});
