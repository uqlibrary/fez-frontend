import { expect, test } from '../test';

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

test.describe('Dashboard with open accessible work', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/dashboard');
    });

    test('should show alert at top of page', async ({ page }) => {
        await expect(page.locator('text=Professor J Researcher')).toBeVisible();
        await expect(
            page
                .locator('[data-testid=alert]')
                .getByText('We have found 3 work(s) that do not meet the funder(s) Open Access requirements.'),
        ).toBeVisible();
        await page.locator('[data-testid=alert]').getByRole('button', { name: 'View and Fix' }).click();
        await expect(page).toHaveURL(/records\/my-open-access/);
    });
    test('should show a "make open access" button that navs to the open-access work route', async ({ page }) => {
        await expect(page.locator('text=Professor J Researcher')).toBeVisible();
        await expect(page.getByRole('link', { name: 'Open Accessible test record' })).toBeVisible();
        await page.getByRole('button', { name: 'Make open access' }).click();
        await expect(page).toHaveURL(/records\/UQ:256099\/make-open-access/);
    });

    test.describe('has make open access button on the My Works page', () => {
        test('should be clickable', async ({ page }) => {
            await expect(page.locator('text=Professor J Researcher')).toBeVisible();

            await page.locator('button[aria-label="Click to open the main navigation"]').click();
            await page
                .locator('.menu-item-container')
                .getByText(/My works/)
                .click();

            await expect(page).toHaveURL('/records/mine');
            await expect(page.getByRole('link', { name: 'Open Accessible test record' })).toBeVisible();
            await page.locator('.publicationCitation').getByRole('button', { name: 'Make open access' }).click();
            await expect(page).toHaveURL(/records\/UQ:256099\/make-open-access/);
        });
    });
});
