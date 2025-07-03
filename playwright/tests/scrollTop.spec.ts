import { test, expect } from '@playwright/test';
import { assertIsVisible } from '../utils';

test.describe('Scroll to top module', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('Scroll to bottom then click scroll-to-top and verify button opacity and tabs visibility', async ({
        page,
    }) => {
        // Ensure initial sections exist
        await assertIsVisible(page.getByText('Peptide mimic').first());
        await assertIsVisible(page.locator('.StandardPage'));

        const scrollBtn = page.locator('#scrolltopbtn');
        // Initially hidden (opacity 0)
        await expect(scrollBtn).toHaveCSS('opacity', '0');
        // Scroll down to bottom section
        await page
            .getByText('Genome-wide association')
            .first()
            .scrollIntoViewIfNeeded();
        // After scroll, button becomes semi-visible (opacity 0.5)
        await expect(scrollBtn).toHaveCSS('opacity', '0.5');

        // Click the scroll-to-top button
        await scrollBtn.click();

        // Button hides again (opacity 0)
        await expect(scrollBtn).toHaveCSS('opacity', '0');

        // Optionally, verify that top-of-page content is visible again
        await assertIsVisible(page.getByText('Peptide mimic').first());
    });
});
