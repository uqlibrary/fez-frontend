import { test, expect } from '@playwright/test';
import { assertAccessibility } from '../../support/axe';
import { testIdStartsWith, getOpenedLink, loadAdminDashboard } from '../../support/commands';

test.describe('Admin Dashboard - Today tab', () => {
    test.beforeEach(async ({ page }) => await loadAdminDashboard(page));

    test('renders tabs as expected', async ({ page }) => {
        const tabs = page.locator('[role=tab]');
        await expect(tabs).toHaveCount(3);

        await expect(tabs.first()).toContainText('TODAY');
        await expect(tabs.first()).toHaveAttribute('aria-selected', 'true');

        await expect(tabs.nth(1)).toContainText('SYSTEM ALERTS');
        await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'false');
        await expect(testIdStartsWith(tabs.nth(1), 'tab-counter').getByText('8')).toBeVisible();

        await expect(tabs.last()).toContainText('REPORTS');
        await expect(tabs.last()).toHaveAttribute('aria-selected', 'false');

        await tabs.nth(1).click();
        await expect(page.getByTestId('standard-card-content')).toContainText('system alerts');

        await tabs.last().click();
        await expect(page.getByTestId('standard-card-content').getByText('Export-only reports')).toBeVisible();

        await tabs.first().click();
        await expect(page.getByTestId('standard-card-content')).toContainText('System Alerts');

        await assertAccessibility(page, 'div.StandardPage', { disabledRules: ['color-contrast'] });
    });

    test('renders charts and quick links as expected', async ({ page }) => {
        // a more verbose test than usual, due to being
        // unable to test charts in jest unit tests
        await expect(page.getByTestId('system-alerts-title')).toContainText('System Alerts');

        // Charts
        const systemAlertsChart = page.getByTestId('chart-container-system-alerts');
        await expect(systemAlertsChart.locator('svg')).toBeVisible();
        await expect(systemAlertsChart.locator('svg > rect')).toHaveCount(2);

        const systemAlertsTable = page.getByTestId('system-alerts-table');
        await expect(systemAlertsTable.locator('td').nth(1)).toContainText('150');
        await expect(systemAlertsTable.locator('td').nth(2)).toContainText('25');
        await expect(systemAlertsTable.locator('td').nth(3)).toContainText('15 (10%)');
        await expect(systemAlertsTable.locator('td').nth(4)).toContainText('135 (90%)');

        await expect(page.getByTestId('unprocessed-works-title')).toContainText('Unprocessed Works');

        const unprocessedWorksSubtitle = page.getByTestId('unprocessed-works-subtitle');
        await expect(unprocessedWorksSubtitle.getByTestId('unprocessed-link')).toBeVisible();

        const unprocessedWorksChart = page.getByTestId('chart-container-unprocessed-works');
        await expect(unprocessedWorksChart.locator('svg > text')).toContainText('15');
        await expect(unprocessedWorksChart.locator('svg path')).toHaveCount(1);

        await expect(page.getByTestId('processed-works-title')).toContainText('Processed Works');
        await expect(page.getByTestId('processed-works-subtitle')).toContainText('this iteration');

        await expect(page.getByRole('tooltip')).not.toBeVisible();
        await page
            .getByTestId('processed-works-subtitle')
            .getByTestId('HelpIcon')
            .hover();
        await expect(page.locator('[role=tooltip]')).toContainText(
            '23rd September 2024 00:00:00 to 25th September 2024 23:59:59',
        );

        const processedWorksChart = page.getByTestId('chart-container-processed-works');
        await expect(processedWorksChart.locator('svg > text')).toContainText('82');
        await expect(processedWorksChart.locator('svg path')).toHaveCount(1);

        const openAccessChart = page.getByTestId('chart-container-open-access');
        await expect(openAccessChart.locator('svg text').getByText('256 (20%)')).toBeVisible();
        await expect(openAccessChart.locator('svg text').getByText('of 1256 records')).toBeVisible();
        await expect(openAccessChart.locator('svg path')).toHaveCount(3);
        await expect(openAccessChart.locator('svg circle')).toHaveCount(1);

        // Quicklinks
        const quickLinksList = page.getByRole('list');
        await expect(quickLinksList.getByRole('listitem')).toHaveCount(7);
    });

    test('follows unprocessed works link', async ({ page, context }) => {
        await expect(page.getByTestId('system-alerts-title')).toContainText('System Alerts');
        await expect(await getOpenedLink(context, page.getByTestId('unprocessed-link'))).toHaveURL(
            /https:\/\/fez-staging.library.uq.edu.au\/records\/search/,
        );
    });

    test.describe('Quick links', () => {
        test('follows internal links when clicked', async ({ page, context }) => {
            await expect(page.getByTestId('standard-card')).toContainText('Quick Links');
            const listItem = page.getByRole('listitem').first();
            await expect(await getOpenedLink(context, listItem.locator('a'))).toHaveURL(
                /https:\/\/espace.library.uq.edu.au\/records\/search/,
            );
        });

        test('follows external links when clicked', async ({ page, context }) => {
            await expect(page.getByTestId('standard-card')).toContainText('Quick Links');
            await expect(await getOpenedLink(context, page.getByRole('listitem').getByText('UQ Library'))).toHaveURL(
                /https:\/\/www.library.uq.edu.au\//,
            );
        });

        test('handles reordering correctly', async ({ page }) => {
            await expect(page.getByTestId('standard-card')).toContainText('Quick Links');
            const listItems = page.getByRole('listitem');

            await expect(listItems.nth(0)).toContainText(
                '2021+ Imported Records with an Author ID and Research Subtypes Only',
            );

            await page.getByTestId('admin-actions-button-1').click();
            await testIdStartsWith(page, 'admin-actions-menu-option-')
                .getByText('Move up')
                .click();
            await expect(listItems.nth(1)).toContainText(
                '2021+ Imported Records with an Author ID and Research Subtypes Only',
            );
            await expect(listItems.nth(0)).toContainText(
                '2020 - 2023 Imported Records with an Author ID and Research Subtypes Only',
            );

            await page.getByTestId('admin-actions-button-0').click();
            await testIdStartsWith(page, 'admin-actions-menu-option-')
                .getByText('Move down')
                .click();
            await expect(listItems.nth(1)).toContainText(
                '2020 - 2023 Imported Records with an Author ID and Research Subtypes Only',
            );

            await page.getByTestId('admin-actions-button-1').click();
            await testIdStartsWith(page, 'admin-actions-menu-option-')
                .getByText('Move to bottom')
                .click();
            await expect(listItems.last()).toContainText(
                '2020 - 2023 Imported Records with an Author ID and Research Subtypes Only',
            );

            await page.getByTestId('admin-actions-button-6').click();
            await testIdStartsWith(page, 'admin-actions-menu-option-')
                .getByText('Move to top')
                .click();
            await expect(listItems.nth(0)).toContainText(
                '2020 - 2023 Imported Records with an Author ID and Research Subtypes Only',
            );
        });

        test('handles deletion', async ({ page }) => {
            await expect(page.getByTestId('standard-card')).toContainText('Quick Links');
            await expect(page.getByRole('listitem').nth(1)).toContainText(
                '2020 - 2023 Imported Records with an Author ID and Research Subtypes Only',
            );

            await page.getByTestId('admin-actions-button-1').click();
            await testIdStartsWith(page, 'admin-actions-menu-option-')
                .getByText('Delete')
                .click();
            await expect(page.getByTestId('standard-card-content')).toContainText(
                'DELETE 2020 - 2023 Imported Records with an Author ID and Research Subtypes Only',
            );
            await assertAccessibility(page, 'div.StandardPage', { disabledRules: ['color-contrast'] });

            const qlkTitleInput = page.getByTestId('qlk_title-input');
            await expect(qlkTitleInput).toHaveValue(
                '2020 - 2023 Imported Records with an Author ID and Research Subtypes Only',
            );
            await expect(qlkTitleInput).toBeDisabled();

            const qlkLinkInput = page.getByTestId('qlk_link-input');
            await expect(qlkLinkInput).toContainText('https://espace.library.uq.edu.au/records/search?');
            await expect(qlkLinkInput).toBeDisabled();

            await page
                .locator('button')
                .getByText('Delete')
                .click();
            await expect(page.getByTestId('standard-card-content')).not.toContainText(
                'DELETE 2020 - 2023 Imported Records with an Author ID and Research Subtypes Only',
            );
        });

        test('handles editing', async ({ page }) => {
            await expect(page.getByTestId('standard-card')).toContainText('Quick Links');
            await expect(page.getByRole('listitem').nth(1)).toContainText(
                '2020 - 2023 Imported Records with an Author ID and Research Subtypes Only',
            );

            await page.getByTestId('admin-actions-button-1').click();
            await testIdStartsWith(page, 'admin-actions-menu-option-')
                .getByText('Edit')
                .click();

            await expect(page.getByTestId('standard-card-content')).toContainText(
                'Edit 2020 - 2023 Imported Records with an Author ID and Research Subtypes Only',
            );
            await assertAccessibility(page, 'div.StandardPage', { disabledRules: ['color-contrast'] });

            const qlkTitleInput = page.getByTestId('qlk_title-input');
            const value = '2020 - 2023 Imported Records with an Author ID and Research Subtypes Only';
            await expect(qlkTitleInput).toHaveValue(value);
            await expect(qlkTitleInput).not.toBeDisabled();
            await qlkTitleInput.fill(`${value} updated`);
            await expect(qlkTitleInput).toHaveValue(
                '2020 - 2023 Imported Records with an Author ID and Research Subtypes Only updated',
            );

            const qlkLinkInput = page.getByTestId('qlk_link-input');
            await expect(qlkLinkInput).toContainText('https://espace.library.uq.edu.au/records/search?');
            await expect(qlkLinkInput).not.toBeDisabled();
            await qlkLinkInput.fill(' updated');
            await expect(qlkLinkInput).toContainText(' updated'); // Use toContainText for partial matches

            await qlkTitleInput.clear();
            await expect(qlkTitleInput.locator('..')).toHaveClass(/Mui-error/); // Find parent with Mui-error class

            await page.getByRole('button', { name: 'Save' }).click();

            await qlkLinkInput.clear();
            await expect(qlkLinkInput.locator('..')).toHaveClass(/Mui-error/);
            await expect(page.getByTestId('qlk_title')).toContainText('Required');
            await expect(page.getByTestId('qlk_link')).toContainText('Required');

            await qlkTitleInput.fill('Test title');
            await qlkLinkInput.fill('Test link');
            await expect(qlkTitleInput.locator('..')).not.toHaveClass(/Mui-error/);
            await expect(qlkLinkInput.locator('..')).not.toHaveClass(/Mui-error/);

            await page.getByRole('button', { name: 'Save' }).click();
            await expect(page.getByTestId('standard-card-content')).not.toContainText(
                'Edit 2020 - 2023 Imported Records with an Author ID and Research Subtypes Only',
            );
        });

        test('handles adding', async ({ page }) => {
            await expect(page.getByTestId('standard-card')).toContainText('Quick Links');

            await page.getByTestId('add-quick-link').click();

            await expect(page.getByTestId('standard-card-content')).toContainText('Add new quick link');

            const qlkTitleInput = page.getByTestId('qlk_title-input');
            const qlkLinkInput = page.getByTestId('qlk_link-input');

            await expect(qlkTitleInput.locator('..')).toHaveClass(/Mui-error/);
            await expect(qlkLinkInput.locator('..')).toHaveClass(/Mui-error/);

            await page.getByRole('button', { name: 'Save' }).click();

            await expect(page.getByTestId('qlk_title')).toContainText('Required');
            await expect(page.getByTestId('qlk_link')).toContainText('Required');
            await assertAccessibility(page, 'div.StandardPage', { disabledRules: ['color-contrast'] });

            await expect(qlkTitleInput).toHaveValue('');
            await expect(qlkTitleInput).not.toBeDisabled();

            await qlkTitleInput.fill('New title');
            await expect(qlkTitleInput).toHaveValue('New title');

            await expect(qlkLinkInput).toHaveValue('');
            await expect(qlkLinkInput).not.toBeDisabled();
            await qlkLinkInput.fill('New link');
            await expect(qlkLinkInput).toHaveValue('New link');

            await expect(qlkTitleInput.locator('..')).not.toHaveClass(/Mui-error/);
            await expect(qlkLinkInput.locator('..')).not.toHaveClass(/Mui-error/);
            await expect(page.getByTestId('qlk_title')).not.toContainText('Required');
            await expect(page.getByTestId('qlk_link')).not.toContainText('Required');

            await page.getByRole('button', { name: 'Save' }).click();

            await expect(page.getByTestId('standard-card-content')).not.toContainText(
                'Edit 2020 - 2023 Imported Records with an Author ID and Research Subtypes Only',
            );
        });
    });
});
