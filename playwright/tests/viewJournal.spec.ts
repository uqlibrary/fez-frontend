import { expect, test, Page } from '../test';
import { assertIsNotVisible, assertIsVisible } from '../lib/helpers';

test.describe('view Journal', () => {
    async function tabVisibleInWindow(page: Page, tabId: string, shouldBeVisible: boolean) {
        const selector = `button[data-testid="journal-details-tab-categories-${tabId}-heading"]`;
        if (shouldBeVisible) {
            await assertIsVisible(page.locator(selector));
            return;
        }
        await assertIsNotVisible(page.locator(selector));
    }

    test('should have appropriate scroll buttons', async ({ page }) => {
        await page.goto('/journal/view/8508?user=uqresearcher');
        // Scroll to journal quality by ranking section
        const rankingSection = page.getByTestId('journal-details-qualityByRanking');
        await rankingSection.scrollIntoViewIfNeeded();
        await tabVisibleInWindow(page, '0', true);
        await tabVisibleInWindow(page, '1', true);

        await tabVisibleInWindow(page, '5', false);
        await tabVisibleInWindow(page, '6', false);
        // Check that scroll buttons are not visible
        await expect(rankingSection.locator('div.MuiTabs-scrollButtons')).toHaveCount(2);

        // Click the right scroll button
        await rankingSection.locator('div.MuiTabs-scrollButtons').nth(1).click();
        await tabVisibleInWindow(page, '0', false);
        await tabVisibleInWindow(page, '5', true);
        await tabVisibleInWindow(page, '6', true);
    });

    test('should have an advisory statement', async ({ page }) => {
        await page.goto('/journal/view/12');
        await expect(page.getByTestId('alert')).toContainText('Advisory statement');
    });

    test.describe('admin', () => {
        test('should show a larger admin menu button in desktop view', async ({ page }) => {
            await page.setViewportSize({ width: 1200, height: 1000 });
            await page.goto('/journal/view/12?user=uqstaff');
            await expect(page.getByTestId('admin-actions-button')).toHaveClass(/MuiIconButton-sizeLarge/);
        });

        test('should show a small admin menu button in mobile view', async ({ page }) => {
            await page.setViewportSize({ width: 480, height: 1000 });
            await page.goto('/journal/view/12?user=uqstaff');
            await expect(page.getByTestId('admin-actions-button')).toHaveClass(/MuiIconButton-sizeSmall/);
        });

        test('should navigate to the edit admin journal page and use current page url as navigatedFrom value', async ({
            page,
        }) => {
            await page.goto('/journal/view/12?user=uqstaff');
            await page.getByTestId('admin-actions-button').click();
            await page.locator('[role="menuitem"]').click();
            await expect(page).toHaveURL(
                '/admin/journal/edit/12?navigatedFrom=%2Fjournal%2Fview%2F12%3Fuser%3Duqstaff',
            );
        });

        test('should navigate to the edit admin journal page and set navigatedFrom to the hash value (coverage)', async ({
            page,
        }) => {
            await page.goto('/journal/view/12?user=uqstaff#test');
            await page.getByTestId('admin-actions-button').click();
            await page.locator('[role="menuitem"]').click();
            await expect(page).toHaveURL('/admin/journal/edit/12?navigatedFrom=test');
        });

        test.describe('editing', () => {
            test('should handle disabling lock without losing record details', async ({ page }) => {
                await page.goto('/admin/journal/edit/12?user=uqstaff');

                const alert = page.getByTestId('alert');
                await expect(async () => expect(alert.getByText('THIS WORK IS LOCKED')).toBeVisible()).toPass();

                const fields = [
                    'jnl_title-input',
                    'jnl_abbrev_title-input',
                    'jnl_publisher-input',
                    'jnl_is_refereed-input',
                    'jnl_start_year-input',
                    'jnl_frequency-input',
                ];

                const fieldValues: Record<string, string> = {};
                for (const field of fields) {
                    fieldValues[field] = await page.getByTestId(field).inputValue();
                }

                const ckContent = await page.locator('.ck-content').innerText();
                await expect(page.getByTestId('jnl_issn_jid-list-row-0')).toContainText('0388-0001');
                await expect(page.getByTestId('jnl_issn_jid-list-row-1')).toContainText('2169-0375');
                await page.getByTestId('action-button').click();
                await expect(alert).toHaveCount(0);

                for (const field of fields) {
                    await expect(page.getByTestId(field)).toHaveValue(fieldValues[field]);
                }
                await expect(page.locator('.ck-content')).toHaveText(ckContent);
                await expect(page.getByTestId('jnl_issn_jid-list-row-0')).toContainText('0388-0001');
                await expect(page.getByTestId('jnl_issn_jid-list-row-1')).toContainText('2169-0375');
            });
        });
    });
});
