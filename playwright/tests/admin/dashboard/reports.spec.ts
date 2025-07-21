import { test, expect, Page } from '../../../test';
import moment from 'moment';
import { assertAccessibility } from '../../../lib/axe';
import { loadAdminDashboard } from '../../../lib/helpers';

const assertFileDownload = async (page: Page, callbacks: Promise<void>[]) => {
    const [download] = await Promise.all([page.waitForEvent('download'), ...callbacks]);
    expect(download).toBeDefined();
};
test.describe('Admin Dashboard - Reports tab', () => {
    const clearField = async (page: Page, fieldTestId: string) => {
        const fieldLocator = page.getByTestId(fieldTestId);
        await fieldLocator.locator('..').click();
        await fieldLocator
            .locator('..')
            .locator('button[title="Clear"]')
            .click();
    };

    test.beforeEach(async ({ page }) => {
        await loadAdminDashboard(page);
        const reportsTab = page.locator('[role=tab]', { hasText: 'REPORTS' });
        await reportsTab.click();
        await expect(reportsTab).toHaveAttribute('aria-selected', 'true');
        await expect(page.getByTestId('standard-card-content').getByText('Export-only reports')).toBeVisible();
    });

    test('renders page as expected', async ({ page }) => {
        await expect(page.getByTestId('report-export-button')).toBeDisabled();
        await assertAccessibility(page, 'div.StandardPage', {
            disabledRules: ['color-contrast'],
        });

        await expect(page.getByTestId('report-export-only-input')).toHaveValue('');
        await page.getByTestId('report-export-only-input').click();
        await expect(page.locator('[role=option]')).toHaveCount(6);
        await page.locator('[role=option]', { hasText: 'Wok ID dups' }).click();
        await expect(page.getByTestId('report-export-only-input')).toHaveValue('Wok ID dups');

        await expect(page.getByTestId('standard-card-content').getByText('Display reports')).toBeVisible();
        await expect(page.getByTestId('report-display-export-button')).toBeDisabled();
        await expect(page.getByTestId('report-display-export-export-button')).toBeDisabled();
        await expect(page.getByTestId('report-display-export-input')).toHaveValue('');
        await expect(page.getByTestId('report-display-export-date-from-input')).toHaveValue('');
        await expect(page.getByTestId('report-display-export-date-from-input')).toBeDisabled();
        await expect(page.getByTestId('report-display-export-date-to-input')).toHaveValue('');
        await expect(page.getByTestId('report-display-export-date-to-input')).toBeDisabled();

        await expect(page.getByTestId('report-display-export-system-alert-id-input')).not.toBeAttached();
        await page.getByTestId('report-display-export-input').click();
        await expect(page.locator('[role=option]')).toHaveCount(2);
        await page.locator('[role=option]', { hasText: 'Works history' }).click();
        await expect(page.getByTestId('report-display-export-input')).toHaveValue('Works history');
        await expect(page.getByTestId('report-display-export-date-from-input')).toHaveValue('');
        await expect(page.getByTestId('report-display-export-date-from-input')).not.toBeDisabled();
        await expect(page.getByTestId('report-display-export-date-to-input')).toHaveValue('');
        await expect(page.getByTestId('report-display-export-date-to-input')).not.toBeDisabled();

        await expect(page.getByTestId('report-display-export-button')).toBeDisabled(); // dates are required

        await page.getByTestId('report-display-export-input').click();
        await expect(page.locator('[role=option]')).toHaveCount(2);
        await page.locator('[role=option]', { hasText: 'System alert log' }).click();
        await expect(page.getByTestId('report-display-export-input')).toHaveValue('System alert log');

        await expect(page.getByTestId('report-display-export-system-alert-id-input')).toHaveValue('');
        await expect(page.getByTestId('report-display-export-button')).not.toBeDisabled();
    });

    test('downloads a legacy report', async ({ page }) => {
        await expect(page.getByTestId('report-export-button')).toBeDisabled();
        await expect(page.getByTestId('report-export-only-input')).toHaveValue('');
        await page.getByTestId('report-export-only-input').click();
        await assertAccessibility(page, 'div.StandardPage', {
            disabledRules: ['color-contrast'],
        });

        await page.locator('[role=option]', { hasText: 'Wok ID dups' }).click();
        await expect(page.getByTestId('report-export-only-input')).toHaveValue('Wok ID dups');

        await assertFileDownload(page, [
            page.getByTestId('report-export-button').click(),
            expect(page.getByTestId('report-export-button')).not.toBeDisabled(),
            expect(page.getByTestId('export-report-progress')).not.toBeAttached(),
        ]);
    });

    test('legacy report with no results shows alert', async ({ page }) => {
        await expect(page.getByTestId('report-export-button')).toBeDisabled();
        await expect(page.getByTestId('report-export-only-input')).toHaveValue('');
        await page.getByTestId('report-export-only-input').click();
        await assertAccessibility(page, 'div.StandardPage', {
            disabledRules: ['color-contrast'],
        });

        await page
            .locator('[role=option]')
            .getByText(/DOI Dups/)
            .click();
        await expect(page.getByTestId('report-export-only-input')).toHaveValue('DOI Dups');

        await page.getByTestId('report-export-button').click();

        await expect(page.getByTestId('export-report-progress')).toBeAttached();

        await expect(page.getByTestId('report-export-button')).not.toBeDisabled();
        await expect(page.getByTestId('export-report-progress')).not.toBeAttached();

        await expect(page.getByTestId('alert')).toBeVisible();
        await expect(page.getByTestId('alert')).toContainText('Nothing to export');

        // dismiss for coverage
        await page
            .getByTestId('alert')
            .getByTestId('dismiss')
            .click();
        await expect(page.getByTestId('alert')).not.toBeAttached();
    });

    test.describe('queued legacy reports', () => {
        test('should enable binding fields', async ({ page }) => {
            await expect(page.getByTestId('report-export-button')).toBeDisabled();
            await expect(page.getByTestId('report-export-only-input')).toHaveValue('');
            await page.getByTestId('report-export-only-input').click();
            await assertAccessibility(page, 'div.StandardPage', {
                disabledRules: ['color-contrast'],
            });

            await page.locator('[role=option]', { hasText: 'Queued report one binding' }).click();
            await expect(page.getByTestId('report-export-only-input')).toHaveValue('Queued report one binding');

            await expect(page.getByTestId('report-export-button')).toBeDisabled();

            await expect(page.getByTestId('report-export-only-date-from-input')).not.toBeDisabled();
            await expect(page.getByTestId('report-export-only-date-to-input')).toBeDisabled();

            await page.getByTestId('report-export-only-input').click();
            await page.locator('[role=option]', { hasText: 'Queued report two bindings' }).click();
            await expect(page.getByTestId('report-export-only-input')).toHaveValue('Queued report two bindings');

            // note: fill() doesn't work and pressSequentially() requires an extra leading 0
            await page.getByTestId('report-export-only-date-from-input').pressSequentially('001012024');
            await page.getByTestId('report-export-only-date-to-input').pressSequentially('002012024');
            await page.getByTestId('report-export-button').click();
            await expect(page.getByTestId('alert')).toBeVisible();
            await expect(page.getByTestId('alert')).toContainText('Report queued');
        });

        test('validates the filters', async ({ page }) => {
            await expect(page.getByTestId('report-export-button')).toBeDisabled();
            await expect(page.getByTestId('report-export-only-input')).toHaveValue('');
            await page.getByTestId('report-export-only-input').click();
            await assertAccessibility(page, 'div.StandardPage', {
                disabledRules: ['color-contrast'],
            });

            await page.locator('[role=option]', { hasText: 'Queued report two bindings' }).click();
            await expect(page.getByTestId('report-export-only-input')).toHaveValue('Queued report two bindings');

            // check the mui calendar appears if button clicked.
            await page
                .getByTestId('report-export-only-date-from')
                .locator('button')
                .click();
            await page
                .getByTestId('report-export-only-date-to')
                .locator('button')
                .click();
            await page
                .getByTestId('report-export-only-date-to')
                .locator('button')
                .click();
            await page.getByTestId('report-export-only-date-to-input').fill('01/01/2020');
            // date from should be in error state
            await expect(page.getByTestId('report-export-only-date-from-input')).toHaveAttribute('required');
            await expect(page.getByTestId('report-export-only-date-from')).toContainText('Required');
            await expect(page.getByTestId('report-export-only-date-from-input').locator('..')).toHaveClass(/Mui-error/);
            await expect(page.getByTestId('report-export-button')).toBeDisabled();

            await clearField(page, 'report-export-only-date-to-input');

            await page.getByTestId('report-export-only-date-from-input').fill('01/01/2020');
            // to date should be in error state
            await expect(page.getByTestId('report-export-only-date-to-input')).toHaveAttribute('required');
            await expect(page.getByTestId('report-export-only-date-to')).toContainText('Required');
            await expect(page.getByTestId('report-export-only-date-to-input').locator('..')).toHaveClass(/Mui-error/);

            await expect(page.getByTestId('report-export-button')).toBeDisabled();

            await clearField(page, 'report-export-only-date-from-input');

            // to before from
            await page.getByTestId('report-export-only-date-to-input').fill('01/01/2025');
            await page.getByTestId('report-export-only-date-from-input').fill('01/01/2026');
            await expect(page.getByTestId('report-export-only-date-from')).toContainText('Must not be after "to" date');
            await expect(page.getByTestId('report-export-only-date-to')).toContainText(
                'Must not be before "from" date',
            );

            await expect(page.getByTestId('report-export-only-date-from-input').locator('..')).toHaveClass(/Mui-error/);

            await assertAccessibility(page, 'div.StandardPage', {
                disabledRules: ['color-contrast'],
            });

            await expect(page.getByTestId('report-export-button')).toBeDisabled();
            await clearField(page, 'report-export-only-date-from-input');
            await page.getByTestId('report-export-only-date-from-input').fill('01/01/2024');

            await expect(page.getByTestId('report-export-only-date-to')).toContainText(
                'Must be within 1 week of "from" date',
            );
            await clearField(page, 'report-export-only-date-to-input');
            await page.getByTestId('report-export-only-date-to-input').fill('07/01/2024');
            await expect(page.getByTestId('report-export-only-date-to')).not.toContainText(
                'Must be within 1 week of "from" date',
            );
            await expect(page.getByTestId('report-export-button')).not.toBeDisabled();

            // test single binding with 52 week length
            await page.getByTestId('report-export-only-input').click();
            await page.locator('[role=option]', { hasText: 'Queued report one binding' }).click();
            await expect(page.getByTestId('report-export-only-input')).toHaveValue('Queued report one binding');
            await expect(page.getByTestId('report-export-only-date-from-input')).toHaveAttribute('required');
            await expect(page.getByTestId('report-export-only-date-from')).toContainText('Required');
            await expect(page.getByTestId('report-export-only-date-from-input').locator('..')).toHaveClass(/Mui-error/);
            await expect(page.getByTestId('report-export-only-date-to-input')).toBeDisabled();
            await expect(page.getByTestId('report-export-button')).toBeDisabled();

            await page.getByTestId('report-export-only-date-from-input').fill('01/01/2015');
            await expect(page.getByTestId('report-export-only-date-to-input')).toHaveValue('31/12/2015');
            await clearField(page, 'report-export-only-date-from-input');
            await page.getByTestId('report-export-only-date-from-input').fill('30/10/2015');
            await expect(page.getByTestId('report-export-only-date-to-input')).toHaveValue('28/10/2016');
            await clearField(page, 'report-export-only-date-from-input');
            await page.getByTestId('report-export-only-date-from-input').fill('28/02/2017');
            await expect(page.getByTestId('report-export-only-date-to-input')).toHaveValue('27/02/2018');

            // test auto-cutoff, when selected 'from' date is less than maximum date range.
            // Auto-cutoff makes the "to" date become the current date
            // since it doesnt make sense to have "to" dates in the future.
            // e.g. if max date range is 1 year, today's date is 20/11/2024, and
            // 'from' date is set to 20/06/2024, then normally the 'to' date would
            // become 20/06/2025, which is 6 months in the future. Instead, set 'to' date
            // automatically to today's date, making the range 20/06/2024 - 20/11/2024
            const today = moment();
            const dateFrom = moment().subtract(6, 'months');
            await clearField(page, 'report-export-only-date-from-input');
            await page.getByTestId('report-export-only-date-from-input').fill(dateFrom.format('DD/MM/YYYY'));
            await expect(page.getByTestId('report-export-only-date-to-input')).toHaveValue(today.format('DD/MM/YYYY'));
        });
    });

    test('displays and downloads a display report', async ({ page }) => {
        // works history
        await page.getByTestId('report-display-export-input').click();
        await expect(page.locator('[role=option]')).toHaveCount(2);
        await assertAccessibility(page, 'div.StandardPage', {
            disabledRules: ['color-contrast'],
        });
        await page.locator('[role=option]', { hasText: 'Works history' }).click();
        await page.getByTestId('report-display-export-date-from-input').fill('01/01/2020');
        await page.getByTestId('report-display-export-date-to-input').fill('02/01/2020');
        await page.getByTestId('report-display-export-button').click();
        await expect(page.getByTestId('report-display-data-grid')).toBeAttached();
        await expect(page.getByTestId('report-display-data-grid').locator('[role=columnheader]')).toHaveCount(6);
        await expect(page.getByTestId('report-display-data-grid').locator('[role=row]')).toHaveCount(7); // +1 for header
        await assertAccessibility(page, 'div.StandardPage', {
            disabledRules: ['color-contrast'],
        });

        await assertFileDownload(page, [page.getByTestId('report-display-export-export-button').click()]);

        // system alerts
        await page.getByTestId('report-display-export-input').click();
        await expect(page.locator('[role=option]')).toHaveCount(2);
        await page.locator('[role=option]', { hasText: 'System alert log' }).click();
        await page.getByTestId('report-display-export-button').click();
        await expect(page.getByTestId('report-display-data-grid')).toBeAttached();
        await expect(page.getByTestId('report-display-data-grid').locator('[role=columnheader]')).toHaveCount(8);
        await expect(page.getByTestId('report-display-data-grid').locator('[role=row]')).toHaveCount(8); // +1 for header
        await assertAccessibility(page, 'div.StandardPage', {
            disabledRules: ['color-contrast', 'aria-required-children'],
        });

        // check searching on system id only returns specific results
        await page.getByTestId('report-display-export-date-from-input').fill('');
        await page.getByTestId('report-display-export-date-to-input').fill('');
        await page.getByTestId('report-display-export-system-alert-id-input').fill('1');
        await page.getByTestId('report-display-export-button').click();
        await expect(page.getByTestId('report-display-data-grid')).toBeAttached();
        await expect(page.getByTestId('report-display-data-grid').locator('[role=columnheader]')).toHaveCount(9); // extra column for content field
        await expect(page.getByTestId('report-display-data-grid').locator('[role=row]')).toHaveCount(2); // +1 for header

        await assertFileDownload(page, [page.getByTestId('report-display-export-export-button').click()]);
    });

    test('displays a report even if user navs away and back', async ({ page }) => {
        // works history
        await page.getByTestId('report-display-export-input').click();
        await expect(page.locator('[role=option]')).toHaveCount(2);

        await page.locator('[role=option]', { hasText: 'Works history' }).click();
        await page.getByTestId('report-display-export-date-from-input').fill('01/01/2020');
        await page.getByTestId('report-display-export-date-to-input').fill('02/01/2020');
        await page.getByTestId('report-display-export-button').click();
        await expect(page.getByTestId('report-display-data-grid')).toBeAttached();
        await expect(page.getByTestId('report-display-data-grid').locator('[role=columnheader]')).toHaveCount(6);
        await expect(page.getByTestId('report-display-data-grid').locator('[role=row]')).toHaveCount(7); // +1 for header

        // nav away
        const todayTab = page.locator('[role=tab]', { hasText: 'TODAY' });
        await todayTab.click();
        await expect(todayTab).toHaveAttribute('aria-selected', 'true');

        await expect(page.getByTestId('standard-card-content')).toContainText('System Alerts');

        // nav back
        const reportsTab = page.locator('[role=tab]', { hasText: 'REPORTS' });
        await reportsTab.click();
        await expect(reportsTab).toHaveAttribute('aria-selected', 'true');

        await expect(page.getByTestId('standard-card-content').getByText('Export-only reports')).toBeVisible();

        // results should still be visible
        await expect(page.getByTestId('report-display-data-grid')).toBeAttached();
        await expect(page.getByTestId('report-display-data-grid').locator('[role=columnheader]')).toHaveCount(6);
        await expect(page.getByTestId('report-display-data-grid').locator('[role=row]')).toHaveCount(7); // +1 for header
    });

    test('validates the filters', async ({ page }) => {
        // use system alerts report as it includes
        // an additional field, but otherwise the
        // validation is the same
        await page.getByTestId('report-display-export-input').click();
        await expect(page.locator('[role=option]')).toHaveCount(2);
        await page.locator('[role=option]', { hasText: 'System alert log' }).click();

        await expect(page.getByTestId('report-display-export-button')).not.toBeDisabled();
        await expect(page.getByTestId('report-display-export-date-from-input')).not.toBeDisabled();
        await expect(page.getByTestId('report-display-export-date-to-input')).not.toBeDisabled();
        await expect(page.getByTestId('report-display-export-system-alert-id-input')).toBeAttached();

        // check the mui calendar appears if button clicked.
        await page
            .getByTestId('report-display-export-date-from')
            .locator('button')
            .click();
        await page
            .getByTestId('report-display-export-date-to')
            .locator('button')
            .click();
        await page
            .getByTestId('report-display-export-date-to')
            .locator('button')
            .click();
        await page.getByTestId('report-display-export-date-to-input').fill('01/01/2020');
        // date from should be in error state
        await expect(page.getByTestId('report-display-export-date-from-input')).toHaveAttribute('required');
        await expect(page.getByTestId('report-display-export-date-from')).toContainText('Required');
        await expect(page.getByTestId('report-display-export-date-from-input').locator('..')).toHaveClass(/Mui-error/);
        await expect(page.getByTestId('report-display-export-button')).toBeDisabled();
        await clearField(page, 'report-display-export-date-to-input');
        await expect(page.getByTestId('report-display-export-button')).not.toBeDisabled();

        await page.getByTestId('report-display-export-date-from-input').fill('01/01/2020');
        // to date should be in error state
        await expect(page.getByTestId('report-display-export-date-to-input')).toHaveAttribute('required');
        await expect(page.getByTestId('report-display-export-date-to')).toContainText('Required');
        await expect(page.getByTestId('report-display-export-date-to-input').locator('..')).toHaveClass(/Mui-error/);

        await expect(page.getByTestId('report-display-export-button')).toBeDisabled();
        await clearField(page, 'report-display-export-date-from-input');
        await expect(page.getByTestId('report-display-export-button')).not.toBeDisabled();

        // to before from
        await page.getByTestId('report-display-export-date-to-input').fill('01/01/2025');
        await page.getByTestId('report-display-export-date-from-input').fill('01/01/2026');
        await expect(page.getByTestId('report-display-export-date-from')).toContainText('Must not be after "to" date');
        await expect(page.getByTestId('report-display-export-date-from-input').locator('..')).toHaveClass(/Mui-error/);

        await assertAccessibility(page, 'div.StandardPage', {
            disabledRules: ['color-contrast'],
        });

        await expect(page.getByTestId('report-display-export-button')).toBeDisabled();
        await clearField(page, 'report-display-export-date-from-input');
        await page.getByTestId('report-display-export-date-from-input').fill('01/01/2024');

        // system alert id field
        await page.getByTestId('report-display-export-system-alert-id-input').fill('abc');
        await expect(page.getByTestId('report-display-export-system-alert-id-input').locator('..')).toHaveClass(
            /Mui-error/,
        );
        await expect(page.getByTestId('report-display-export-system-alert-id')).toContainText(
            'Must be a positive whole number',
        );
        await expect(page.getByTestId('report-display-export-button')).toBeDisabled();

        await assertAccessibility(page, 'div.StandardPage', {
            disabledRules: ['color-contrast'],
        });

        await page.getByTestId('report-display-export-system-alert-id-input').fill('');

        await page.getByTestId('report-display-export-system-alert-id-input').fill('-1');
        await expect(page.getByTestId('report-display-export-system-alert-id')).toContainText(
            'Must be a positive whole number',
        );
        await page.getByTestId('report-display-export-system-alert-id-input').fill('');

        await page.getByTestId('report-display-export-system-alert-id-input').fill('1.0');
        await expect(page.getByTestId('report-display-export-system-alert-id')).toContainText(
            'Must be a positive whole number',
        );
        await page.getByTestId('report-display-export-system-alert-id-input').fill('');

        await expect(page.getByTestId('report-display-export-button')).not.toBeDisabled();
    });
});
