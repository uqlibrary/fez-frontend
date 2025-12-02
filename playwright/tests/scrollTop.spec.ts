import { expect, test } from '../test';
import { assertIsVisible } from '../lib/helpers';

test.describe('Scroll to top module', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('Scroll to bottom then click scroll-to-top and verify button opacity and tabs visibility', async ({
        page,
    }) => {
        await assertIsVisible(page.getByText('Peptide mimic').first());
        await assertIsVisible(page.locator('.StandardPage'));
        const scrollBtn = page.locator('#scrolltopbtn');
        await expect(scrollBtn).toHaveCSS('opacity', '0');
        await page.getByText('Genome-wide association').first().scrollIntoViewIfNeeded();
        await expect(scrollBtn).toHaveCSS('opacity', '0.5');
        await scrollBtn.click();
        await expect(scrollBtn).toHaveCSS('opacity', '0');
        await assertIsVisible(page.getByText('Peptide mimic').first());
    });
});
