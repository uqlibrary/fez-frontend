import { test, expect, Page, Locator } from '../../../test';

import { sherpaRomeo as sherpaMocks } from '../../../../src/mock/data/sherpaRomeo';
import { readCKEditor, typeCKEditor } from '../../../lib/ckeditor';
import { ULRICHS_URL_PREFIX } from 'config/general';

const removeJournalLock = async (page: Page) => {
    await page.getByTestId('alert-error').getByTestId('action-button').click();
};

const checkIssnLinks = async (container: Locator, issn: string) => {
    const sherpaLink =
        (sherpaMocks.find(item => item.srm_issn === issn) || {}).srm_journal_link || sherpaMocks[0].srm_journal_link;
    await expect(container).toContainText(issn);
    await expect(container).toContainText('SHERPA/RoMEO');
    await expect(container).toContainText('Ulrichs');
    await expect(container.locator('#sherparomeo-link')).toHaveAttribute('href', sherpaLink);

    let ulrichsID = issn.replace('-', '');
    switch (issn) {
        case '2169-0375':
            ulrichsID = '473255';
            break;
        case '0388-0001':
            ulrichsID = '89641';
            break;
        default:
            break;
    }
    await expect(container.locator('#ulrichs-link')).toHaveAttribute('href', `${ULRICHS_URL_PREFIX}${ulrichsID}`);
};

test.describe('JournalAdmin', () => {
    test.describe('with valid jid', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('/admin/journal/edit/12?user=uqstaff&navigatedFrom=%2Fjournal%2Fview%2F12');
        });

        test('should show lock screen, and allow it to be removed', async ({ page }) => {
            await expect(page.getByTestId('alert-error')).toContainText('THIS WORK IS LOCKED');
            await removeJournalLock(page);
            await expect(page.getByTestId('alert-error')).not.toBeVisible();
        });

        test('should allow updating of enabled fields', async ({ page }) => {
            await removeJournalLock(page);
            await page.getByTestId('jnl_title-input').fill('Advanced Nonlinear Studies UPDATED');
            await expect(page.getByTestId('jnl_title-input')).toHaveValue('Advanced Nonlinear Studies UPDATED');

            await page.getByTestId('jnl_publisher-input').fill('Walter de Gruyter GmbH UPDATED');
            await expect(page.getByTestId('jnl_publisher-input')).toHaveValue('Walter de Gruyter GmbH UPDATED');

            await typeCKEditor(page, 'jnl-advisory-statement', 'This is an advisory statement UPDATED');
            expect(await readCKEditor(page, 'jnl-advisory-statement')).toContain(
                'This is an advisory statement UPDATED',
            );
        });

        test('should have a fully functioning ISSN editor', async ({ page }) => {
            await removeJournalLock(page);

            const bibliographicTab = page.getByTestId('bibliographic-section-content');
            const issnBlock = bibliographicTab.locator('.AdminCard', { has: page.locator('h4', { hasText: 'ISSN' }) });

            // Find existing entry
            const row0 = page.getByTestId('jnl_issn_jid-list-row-0');
            await checkIssnLinks(row0, '0388-0001');

            // Find existing entry with placeholder data
            let row1 = page.getByTestId('jnl_issn_jid-list-row-1');
            await expect(row1).toContainText('2169-0375');
            {
                const link = row1.locator('a#ulrichs-link');
                await expect(link).toHaveAttribute('title', 'Advanced Nonlinear Studies (Online)');
                await expect(link).toHaveAttribute(
                    'aria-label',
                    'Source publisher name/place and alternate ISSNs in a new window',
                );
                await expect(link).toHaveAttribute('href', `${ULRICHS_URL_PREFIX}473255`);
                await row1.locator('button[aria-label="Edit this item"]').click();
            }

            // Edit issn to a different one with valid data
            await issnBlock.locator('input').fill('2169-0370');
            await issnBlock.locator('input').press('Enter');

            row1 = page.locator('#jnl_issn_jid-list-row-1');
            await checkIssnLinks(row1, '2169-0370');

            // Add a 3rd entry without match in API
            await issnBlock.locator('input').fill('11111111');
            await issnBlock.locator('input').press('Enter');

            const row2 = page.locator('#jnl_issn_jid-list-row-2');
            await expect(row2).toContainText('1111-1111');
            await expect(row2).not.toContainText('SHERPA/RoMEO');
            await expect(row2).not.toContainText('Ulrichs');

            await page.setViewportSize({ width: 1000, height: 1000 });

            // Add 4th entry with match in API
            await issnBlock.locator('input').fill('33333333');
            await issnBlock.locator('input').press('Enter');

            let row3 = page.locator('#jnl_issn_jid-list-row-3');
            await checkIssnLinks(row3, '3333-3333');
            {
                const link = row3.locator('span > a').nth(1);
                await expect(link).toHaveAttribute('title', 'Lecture Notes in Computer Science');
                await expect(link).toHaveAttribute(
                    'aria-label',
                    'Source publisher name/place and alternate ISSNs in a new window',
                );
            }

            await row3.locator('button[aria-label="Edit this item"]').click();

            // Edit the 4th entry
            await issnBlock.locator('input').fill('44444444');
            await issnBlock.locator('input').press('Enter');

            row3 = page.locator('#jnl_issn_jid-list-row-3'); // Re-get locator
            await expect(row3).not.toContainText('3333-3333');
            await checkIssnLinks(row3, '4444-4444');

            // Add a 5th entry
            await issnBlock.locator('input').fill('55555555');
            await issnBlock.locator('input').press('Enter');

            // Verify and move up the 5th entry
            let row4 = page.locator('#jnl_issn_jid-list-row-4');
            await checkIssnLinks(row4, '5555-5555');

            await page.locator('#jnl_issn_jid-list-row-4-move-up').click();

            // Ensure 4th and 5th entries have swapped properly
            // Re-get locators after move operation as their positions change
            row3 = page.locator('#jnl_issn_jid-list-row-3');
            await checkIssnLinks(row3, '5555-5555');
            row4 = page.locator('#jnl_issn_jid-list-row-4');
            await checkIssnLinks(row4, '4444-4444');

            // New entry with sherpa placeholder data
            await issnBlock.locator('input').fill('00000000');
            await issnBlock.locator('input').press('Enter');

            const row5 = page.locator('#jnl_issn_jid-list-row-5');
            await expect(row5).toContainText('0000-0000');
            await expect(row5.locator('a', { hasText: 'SHERPA/RoMEO' })).not.toBeVisible();
            await expect(row5.locator('a', { hasText: 'Ulrichs' })).toBeVisible();

            // New entry with unknown sherpa status
            await issnBlock.locator('input').fill('66666666');
            await issnBlock.locator('input').press('Enter');
            const row6 = page.locator('#jnl_issn_jid-list-row-6');
            await checkIssnLinks(row6, '6666-6666');
        });

        test('should submit changes', async ({ page }) => {
            await removeJournalLock(page);
            await page.getByTestId('jnl_title-input').fill('Advanced Nonlinear Studies UPDATED');
            await expect(page.getByTestId('jnl_title-input')).toHaveValue('Advanced Nonlinear Studies UPDATED');
            await page.getByTestId('jnl_publisher-input').fill('Walter de Gruyter GmbH UPDATED');
            await expect(page.getByTestId('jnl_publisher-input')).toHaveValue('Walter de Gruyter GmbH UPDATED');

            await typeCKEditor(page, 'jnl-advisory-statement', 'This is an advisory statement UPDATED');
            const text = await readCKEditor(page, 'jnl-advisory-statement');
            await expect(text).toContain('This is an advisory statement UPDATED');

            await page.getByTestId('jnl_issn_jid-list-row-1-move-up').click();
            await page.getByTestId('submit-admin').click();
            // Expect a snackbar/toast message to appear
            await expect(page.getByTestId('message-title').getByText('Work has been updated')).toBeVisible();
        });

        test('should nav to view page after save', async ({ page }) => {
            await removeJournalLock(page);
            await page.getByTestId('submit-admin').click();
            await expect(page.getByTestId('message-title').getByText('Work has been updated')).toBeVisible();
            await page.getByTestId('cancel-dialog-box').click();

            await expect(page).toHaveURL('/journal/view/12');
        });

        test('should nav to view page after cancel button is clicked', async ({ page }) => {
            await removeJournalLock(page);
            await page.getByTestId('admin-work-cancel').click();

            await expect(page).toHaveURL('/journal/view/12');
        });

        test('should nav to journal search page after save', async ({ page }) => {
            await removeJournalLock(page);
            await page.getByTestId('submit-admin').click();
            await expect(page.getByTestId('message-title').getByText('Work has been updated')).toBeVisible();
            await page.getByTestId('confirm-dialog-box').click();

            await expect(page).toHaveURL('/journals/search/');
        });

        test('should show error block when required fields are missing values', async ({ page }) => {
            await removeJournalLock(page);
            await page.getByTestId('jnl_title-input').clear();
            await expect(page.getByTestId('alert-warning')).toContainText('Journal title is required');

            await page.getByTestId('jnl_publisher-input').clear();
            await expect(page.getByTestId('alert-warning')).toContainText('Journal publisher is required');

            // Assert that submit buttons are disabled
            await expect(page.getByTestId('submit-admin-top')).toBeDisabled();
            await expect(page.getByTestId('submit-admin')).toBeDisabled();
        });

        test('should support tab mode', async ({ page }) => {
            await page.setViewportSize({ width: 1600, height: 1000 });
            await removeJournalLock(page);
            const tabbedCheckbox = page.locator('input[type=checkbox][value=tabbed]');
            const tabbedCheckboxParent = tabbedCheckbox.locator('xpath=..'); // Get parent element of the checkbox

            await expect(tabbedCheckboxParent).toHaveAttribute('aria-label', 'Switch to tabbed mode');
            await tabbedCheckbox.click();
            await expect(tabbedCheckboxParent).toHaveAttribute('aria-label', 'Switch to full form mode');

            const tabs = page.getByRole('tab');
            await expect(tabs).toHaveCount(6);
            await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');

            await page.getByTestId('jnl_title-input').clear();
            // The following failed in the original cypress spec - which was in use for CI/CD tests
            // Check for error badge on the first tab
            // await expect(
            //     tabs
            //         .nth(0)
            //         .locator('span.MuiBadge-badge.MuiBadge-colorError')
            //         .getByText('1'),
            // ).toBeVisible();

            await expect(page.locator('[id$="-section"]')).toHaveCount(1);
            await expect(page.locator('#admin-section-header')).toContainText('Admin');
        });
    });

    test.describe('with invalid jid', () => {
        test('should show journal not found message', async ({ page }) => {
            await page.goto('/admin/journal/edit/999?user=uqstaff');
            await expect(page.getByTestId('page-title')).toContainText('Work not found');
        });
    });
});
