import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/dashboard');
    });

    test.describe('non mobile', () => {
        test.beforeEach(async ({ page }) => {
            await page.setViewportSize({ width: 600, height: 400 });
        });

        test('should display graphs', async ({ page }) => {
            await expect(page.locator('text=Professor J Researcher')).toBeVisible();

            await expect(page.getByTestId('standard-card-espace-works-per-year')).toBeVisible();
            await expect(page.getByTestId('standard-card-work-types-overview-content')).toBeVisible();
        });

        test('should display orcid sync drawer', async ({ page }) => {
            await page.getByTestId('help-icon-orcid').click();
            await page.getByTestId('orcid-upload-start-button').click();
            await expect(page.getByTestId('orcid-upload-start-button')).not.toBeVisible();
        });
    });

    test.describe('mobile', () => {
        test.beforeEach(async ({ page }) => {
            await page.setViewportSize({ width: 599, height: 400 });
        });

        test("shouldn't display graphs", async ({ page }) => {
            await expect(page.locator('text=Professor J Researcher')).toBeVisible();

            await expect(page.getByTestId('standard-card-espace-works-per-year')).toHaveCount(0);
            await expect(page.getByTestId('standard-card-work-types-overview-content')).toHaveCount(0);
        });
    });
});

test.describe('Dashboard with no OrcID', () => {
    test('should show the Link ORCID ID form in place of dashboard', async ({ page }) => {
        await page.goto('/dashboard?user=s4444444');

        await expect(page.getByTestId('orcid-required')).toBeVisible();
        await expect(page.getByTestId('standard-card-i-already-have-an-orcid-id')).toBeVisible();
        await expect(page.getByTestId('standard-card-i-need-an-orcid-id-content')).toBeVisible();
        await expect(page.getByTestId('standard-card-espace-works-per-year')).toHaveCount(0);
        await expect(page.getByTestId('standard-card-work-types-overview-content')).toHaveCount(0);
    });
});
