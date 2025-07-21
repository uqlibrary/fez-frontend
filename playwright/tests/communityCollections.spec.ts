import { test, expect, Page } from '../test';

test.describe('Communities and Collections', () => {
    const dismissPopover = async (page: Page) => await page.locator('body').click({ position: { x: 0, y: 0 } });

    test.beforeEach(async ({ page }) => {
        await page.goto('/communities');
    });

    test('Renders the default community and collections screen', async ({ page }) => {
        await expect(page.getByTestId('page-title')).toHaveText(/Communities/);
        await expect(page.getByTestId('total-communities')).toHaveText(
            /Displaying communities 1 to 10 of 20 total communities/,
        );
        await expect(page.getByTestId('community-title-UQ:12096')).toHaveText(
            /Aboriginal and Torres Strait Islander Studies Unit/,
        );
        await expect(page.getByTestId('community-collections-paging-top-select-page-1')).toBeVisible();
        await expect(page.getByTestId('community-collections-paging-top-select-page-2')).toBeVisible();
        await expect(page.getByTestId('community-collections-paging-top-select-page-3')).not.toBeVisible();

        // export format
        await page.getByTestId('export-publications-format').click();
        await expect(page.locator('[role="listbox"]')).toHaveText(/Excel File/);
        await dismissPopover(page);
    });
    test('correctly expands and contracts collections within community', async ({ page }) => {
        await page.setViewportSize({ width: 1200, height: 1000 });
        await page.getByTestId('expand-row-UQ:12096').click();
        await expect(page.getByTestId('total-collections-UQ:12096')).toHaveText(
            /Displaying 1 to 3 of 3 collections for 'Aboriginal and Torres Strait Islander Studies Unit'/,
        );

        // export format
        const exportCollection1 = page.getByTestId('export-publications-format');
        await expect(page.getByTestId('export-publications-format')).toHaveCount(2);
        await exportCollection1.nth(1).click();
        await expect(page.locator('[role="listbox"]')).toHaveText(/Excel File/);
        await dismissPopover(page);
        await page.getByTestId('expand-row-UQ:7556').click();
        await expect(page.getByTestId('total-collections-UQ:7556')).toBeVisible();
        await expect(page.getByTestId('total-collections-UQ:7556')).toHaveText(
            /Displaying 1 to 3 of 3 collections for 'Advanced Computational Modelling Centre'/,
        );

        // export format
        const exportCollection2 = page.getByTestId('export-publications-format');
        await expect(page.getByTestId('export-publications-format')).toHaveCount(3);
        await exportCollection2.nth(2).click();
        await expect(page.locator('[role="listbox"]')).toHaveText(/Excel File/);
        await dismissPopover(page);
        await page.getByTestId('expand-row-UQ:12096').click();
        await expect(page.getByTestId('total-collections-UQ:12096')).not.toBeVisible();
        await page.getByTestId('expand-row-UQ:7556').click();
        await expect(page.getByTestId('total-collections-UQ:7556')).not.toBeVisible();
    });
    test('correctly links to relevant community record', async ({ page }) => {
        await page.getByTestId('community-title-UQ:12096').click();
        await expect(page).toHaveURL(/\/view\/UQ:12096/);
        await expect(page.getByTestId('page-title')).toHaveText(/Aboriginal and Torres Strait Islander Studies Unit/);
        await page.goBack();
        await page.getByTestId('community-title-UQ:7556').click();
        await expect(page).toHaveURL(/\/view\/UQ:7556/);
        await expect(page.getByTestId('page-title')).toHaveText(/Advanced Computational Modelling Centre/);
    });
    test('correctly links to relevant collection record', async ({ page }) => {
        await page.getByTestId('expand-row-UQ:12096').click();
        await expect(page.getByTestId('total-collections-UQ:12096')).toBeVisible();
        await page.getByTestId('collection-title-UQ:3586').click();
        await expect(page).toHaveURL(/\/view\/UQ:3586/);
        await expect(page.getByTestId('page-title')).toHaveText(/Mill Point Archaeological Project/);
        await page.goBack();
        await expect(page.getByTestId('total-collections-UQ:12096')).toBeVisible();
        await page.getByTestId('collection-title-UQ:3585').click();
        await expect(page).toHaveURL(/\/view\/UQ:3585/);
        await expect(page.getByTestId('page-title')).toHaveText(/Gooreng Gooreng Cultural Heritage Project/);
    });
    test('correctly opens collections in advanced search view', async ({ page }) => {
        await page.getByTestId('expand-row-UQ:12096').click();
        await expect(page.getByTestId('total-collections-UQ:12096')).toBeVisible();
        await page.locator('[data-testid="row-UQ:11398"] > :nth-child(2) > a').click();
        await expect(page.locator('[data-testid="rek-ismemberof-0"] > span')).toHaveText(
            /Aboriginal and Torres Strait Islander Studies Unit Publications/,
        );
        await page.goBack();
        await page.locator('[data-testid="row-UQ:3586"] > :nth-child(2) > a').click();
        await expect(page.locator('[data-testid="rek-ismemberof-0"] > span')).toHaveText(
            /Mill Point Archaeological Project/,
        );
    });
});
test.describe('Responsiveness (coverage)', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/communities');
    });
    test('shows reduced pagination controls at mobile breakpoints', async ({ page }) => {
        await page.setViewportSize({ width: 320, height: 580 });
        await expect(page.getByTestId('community-collections-paging-top-mobile-controls')).toBeVisible();
        await expect(page.getByTestId('community-collections-paging-top-desktop-controls')).not.toBeVisible();
    });
    test('shows expanded pagination controls at desktop breakpoints', async ({ page }) => {
        await page.setViewportSize({ width: 1024, height: 768 });
        await expect(page.getByTestId('community-collections-paging-top-mobile-controls')).not.toBeVisible();
        await expect(page.getByTestId('community-collections-paging-top-desktop-controls')).toBeVisible();
    });
});
test.describe('Communities and Collections - Admin', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/communities?user=uqstaff');
    });

    test('Renders the default community and collections screen', async ({ page }) => {
        await expect(page.getByTestId('page-title').getByText(/Communities/)).toBeVisible();
        await expect(page.getByTestId('total-communities')).toHaveText(
            /Displaying communities 1 to 10 of 20 total communities/,
        );
        await expect(page.getByTestId('community-title-UQ:12096')).toHaveText(
            /Aboriginal and Torres Strait Islander Studies Unit/,
        );
        await expect(page.getByTestId('community-collections-paging-top-select-page-1')).toBeVisible();
        await expect(page.getByTestId('community-collections-paging-top-select-page-2')).toBeVisible();
        await expect(page.getByTestId('community-collections-paging-top-select-page-3')).not.toBeVisible();
        await expect(page.getByTestId('admin-actions-button-UQ:12096')).toBeVisible();
        await page.getByTestId('admin-actions-button-UQ:12096').click();
        await expect(page.getByTestId('admin-actions-menu-UQ:12096')).toBeVisible();
        await expect(page.locator('[data-testid="admin-actions-menu-UQ:12096"] ul li[tabindex="0"]')).toBeVisible();
    });
    test('Renders result rows correctly at smaller screen resolutions', async ({ page }) => {
        await page.setViewportSize({ width: 320, height: 480 });
        await expect(
            page
                .locator('[data-testid="row-UQ:12096"] > div')
                .locator(':scope > *')
                .locator(':visible:scope'),
        ).toHaveCount(2);
        await page.setViewportSize({ width: 640, height: 480 });
        await expect(
            page
                .locator('[data-testid="row-UQ:12096"] > div')
                .locator(':scope > *')
                .locator(':visible:scope'),
        ).toHaveCount(2);
        await page.setViewportSize({ width: 800, height: 600 });
        await expect(
            page
                .locator('[data-testid="row-UQ:12096"] > div')
                .locator(':scope > *')
                .locator(':visible:scope'),
        ).toHaveCount(2);
        await page.setViewportSize({ width: 1024, height: 768 });
        await expect(
            page
                .locator('[data-testid="row-UQ:12096"] > div')
                .locator(':scope > *')
                .locator(':visible:scope'),
        ).toHaveCount(4);
    });
});
