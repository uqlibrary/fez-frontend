import { test, expect, Page, Locator } from '../../../test';
import { assertAccessibility } from '../../../lib/axe';
import { loadAdminDashboard } from '../../../lib/helpers';

test.describe('Admin Dashboard - System Alerts tab', () => {
    const getByTestId = (context: Page | Locator, testId: string) => {
        return context.getByTestId(testId);
    };

    const getRow = (page: Page, row: number) => {
        return page.locator('[role=row]').nth(row);
    };

    const getCell = (parentLocator: Page | Locator, cell: number) => {
        return parentLocator.locator('[role=gridcell]').nth(cell);
    };

    const assertDetailDrawer = async (page: Page, data: any) => {
        const detailDrawer = getByTestId(page, 'system-alert-detail');
        await expect(detailDrawer).toBeVisible();

        if (data) {
            if (data.title) {
                await expect(getByTestId(detailDrawer, 'system-alert-detail-title')).toContainText(data.title);
            }
            if (data.link) {
                const linkElement = getByTestId(detailDrawer, 'system-alert-detail-link');
                await expect(linkElement).toHaveAttribute('href', data.link);
                await expect(linkElement).toContainText(data.link);
                await expect(getByTestId(linkElement, 'OpenInNewIcon')).toBeVisible();
            }
            if (data.alertId) {
                await expect(getByTestId(detailDrawer, 'system-alert-detail-id')).toContainText(data.alertId);
            }
            if (data.createdDate) {
                await expect(getByTestId(detailDrawer, 'system-alert-detail-date-created')).toContainText(
                    data.createdDate,
                );
            }
            if (data.description) {
                await expect(getByTestId(detailDrawer, 'system-alert-detail-description')).toContainText(
                    data.description,
                );
            }
            if (data.status) {
                await expect(getByTestId(detailDrawer, 'system-alert-detail-assignee-input')).toHaveValue(data.status);
            }
            if (data.status === 'Unassigned') {
                await expect(getByTestId(detailDrawer, 'system-alert-detail-action-button')).not.toBeAttached();
            } else {
                await expect(getByTestId(detailDrawer, 'system-alert-detail-action-button')).toBeAttached();
            }
        }
    };

    test.beforeEach(async ({ page }) => {
        await loadAdminDashboard(page);

        const systemAlertsTab = page.locator('[role=tab]', { hasText: 'SYSTEM ALERTS' });
        await systemAlertsTab.click();
        await expect(systemAlertsTab).toHaveAttribute('aria-selected', 'true');

        await expect(getByTestId(page, 'standard-card-content')).toContainText('8 system alerts');
    });

    test('renders table as expected', async ({ page }) => {
        // no need to check every row, just check
        // a couple that have a different status
        await expect(page.locator('[role=row]')).toHaveCount(9);

        const firstRow = getRow(page, 1);
        await expect(getCell(firstRow, 1)).toContainText('Issues on record - UQ:34555c6');
        await expect(getByTestId(getCell(firstRow, 2), 'alert-status-12')).toContainText('Feeney, Michael');

        const thirdRow = getRow(page, 3);
        await expect(getCell(thirdRow, 1)).toContainText('My Works - Claimed Work - UQ:1494946 - uqmdeben');
        await expect(getByTestId(getCell(thirdRow, 2), 'alert-status-13')).toContainText('Staff, Another');

        await expect(page.locator('.MuiTablePagination-displayedRows')).toHaveText('1–8 of 8');
        await expect(page.locator('.MuiTablePagination-input > input')).toHaveValue('10');

        await assertAccessibility(page, 'div.StandardPage', { disabledRules: ['aria-required-children'] });
    });

    test('shows detail drawer when row is clicked', async ({ page }) => {
        const data = {
            title: 'Issues on record - UQ:34555c6',
            link: 'https://espace.library.uq.edu.au/view/UQ:34555c6',
            alertId: '12',
            createdDate: '4th March 2023 14:45',
            description:
                'User “Tomaszewski, Wojciech (Wojtek) (uqwtomas)” has indicated that there are issues on record - UQ:34555c6.',
            status: 'Feeney, Michael',
        };

        await getRow(page, 1).click();
        await assertDetailDrawer(page, data);
        await assertAccessibility(page, 'div.StandardPage');

        await page.locator('.MuiBackdrop-root').click();
        await expect(page.locator('.MuiBackdrop-root')).not.toBeAttached();
    });

    test('prevents detail drawer from closing when busy', async ({ page }) => {
        const data = {
            title: 'Issues on record - UQ:34555c6',
            link: 'https://espace.library.uq.edu.au/view/UQ:34555c6',
            alertId: '12',
            createdDate: '4th March 2023 14:45',
            description:
                'User “Tomaszewski, Wojciech (Wojtek) (uqwtomas)” has indicated that there are issues on record - UQ:34555c6.',
            status: 'Feeney, Michael',
        };
        await getRow(page, 1).click();

        await assertDetailDrawer(page, data);

        const assigneeDropdown = getByTestId(page, 'system-alert-detail-assignee');
        await assigneeDropdown.click();

        const optionsContainer = getByTestId(page, 'system-alert-detail-options');
        await expect(optionsContainer.locator('[role=option]')).toHaveCount(5);
        await expect(optionsContainer.locator('[role=option]').nth(3)).toHaveAttribute('aria-selected', 'true');

        const actionButton = getByTestId(page, 'system-alert-detail-action-button');
        await expect(actionButton).toContainText('Mark as resolved');
        await actionButton.click();

        await expect(actionButton).toBeDisabled();
        await expect(actionButton).toContainText('Updating...');

        const assigneeInputContainer = getByTestId(page, 'system-alert-detail-assignee');
        await expect(getByTestId(assigneeInputContainer, 'system-alert-detail-assignee-input')).toBeDisabled();
        await expect(assigneeInputContainer.locator('[role=progressbar]')).toBeVisible();
    });
});
