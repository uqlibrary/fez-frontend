import { test, expect, Page } from '../test';

test.describe('Homepage', () => {
    const checkMenuItemCount = async (page: Page, expectedCount: number) => {
        await page.locator('button[aria-label="Click to open the main navigation"]').click();
        await expect
            .poll(async () => (await page.locator('nav#mainMenu div[role="button"]').all()).length)
            .toBe(expectedCount);
    };

    test('Renders the tabbed panes as expected', async ({ page }) => {
        await page.goto('/');
        await page
            .locator('button[role="tab"]')
            .getByText(/Trending on Scopus/)
            .first()
            .click();
        await expect(page.locator('h6').getByText(/Scopus citation count/)).toBeVisible();
        await expect(page.locator('h6').getByText(/Web of Science citation count/)).not.toBeVisible();
        await expect(page.locator('h6').getByText(/Altmetric score/)).not.toBeVisible();
        await page
            .locator('button[role="tab"]')
            .getByText(/Trending on Web of science/)
            .first()
            .click();
        await expect(page.locator('h6').getByText(/Scopus citation count/)).not.toBeVisible();
        await expect(page.locator('h6').getByText(/Web of Science citation count/)).toBeVisible();
        await expect(page.locator('h6').getByText(/Altmetric score/)).not.toBeVisible();
        await page
            .locator('button[role="tab"]')
            .getByText(/Trending on Altmetric/)
            .first()
            .click();
        await expect(page.locator('h6').getByText(/Scopus citation count/)).not.toBeVisible();
        await expect(page.locator('h6').getByText(/Web of Science citation count/)).not.toBeVisible();
        await expect(page.locator('h6').getByText(/Altmetric score/)).toBeVisible();
        await expect(page.locator('h3', { hasText: /Acknowledgement of Country/ }).first()).toBeVisible();
        await expect(page.locator('h3', { hasText: /Cultural advice/ }).first()).toBeVisible();
    });

    test('Has expected menu items for a public user', async ({ page }) => {
        await page.goto('/?user=uqexpired');
        await checkMenuItemCount(page, 6);
    });

    test('Has expected menu items for a researcher', async ({ page }) => {
        await page.goto('/?user=uqresearcher');
        await checkMenuItemCount(page, 17);
    });

    test('Has expected menu items for an admin with full masquerade', async ({ page }) => {
        await page.goto('/?user=uqstaff');
        await checkMenuItemCount(page, 30);
    });

    test('Redirects to admin dashboard for admin with full masquerade and URL switch present', async ({ page }) => {
        await page.goto('/?user=uqstaff&adrd=1');
        await expect(page).toHaveURL('/admin/dashboard');
    });

    test('Should not redirect for readonly masquerade user even if URL switch present', async ({ page }) => {
        await page.goto('/?user=uqmasquerade&adrd=1');
        await checkMenuItemCount(page, 18);
        await expect(page).not.toHaveURL('/admin/dashboard');
    });

    test('Has expected menu items for a student without an author account', async ({ page }) => {
        await page.goto('/?user=s3333333');
        await checkMenuItemCount(page, 7);
    });

    test('Has expected menu items for a RHD student', async ({ page }) => {
        await page.goto('/?user=s2222222');
        await checkMenuItemCount(page, 17);
    });

    test('Has expected menu items for a Masqueradable staff member', async ({ page }) => {
        await page.goto('/?user=uqmasquerade');
        await checkMenuItemCount(page, 18);
        await expect(
            page
                .locator('#mainMenu .menu-item-container p')
                .getByText(/uq\.masquerader@example\.uq\.edu\.au/)
                .first(),
        ).toBeVisible();
    });

    test('Shows help panel as expected', async ({ page }) => {
        await page.goto('/?user=uqresearcher');
        await page.locator('button#help-icon').click();
        await expect(
            page
                .getByTestId('help-drawer-title')
                .getByText(/About these metrics/)
                .first(),
        ).toBeVisible();
        await page.getByTestId('help-drawer-close').getByText(/CLOSE/).first().click();
        await expect(page.getByTestId('help-drawer-title')).not.toBeVisible();
    });
});
