import { test, expect } from '../../../test';

import { default as recordList } from 'mock/data/records/publicationTypeListDataCollection';

import {
    adminEditCheckDefaultTab,
    adminEditCheckTabErrorBadge,
    adminEditCountCards,
    adminEditTabbedView,
    adminEditVerifyAlerts,
    assertAffiliationsAllowed,
    loadRecordForAdminEdit,
} from '../helpers';
import { checkPartialDateFromRecordValue } from '../../../lib/helpers';

test.describe('Data Collection admin edit', () => {
    const record = { ...recordList.data[0] };

    test.beforeEach(async ({ page }) => {
        await loadRecordForAdminEdit(page, record.rek_pid);
    });

    test('should load expected tabs', async ({ page }) => {
        await adminEditCountCards(page, 9);
        await adminEditVerifyAlerts(page, 1, ['Publication date is required']);
        await adminEditTabbedView(page);
        await adminEditCheckDefaultTab(page, 'Bibliographic');
        await adminEditCheckTabErrorBadge(page, 'bibliographic');
    });

    test('should render the different sections as expected', async ({ page }) => {
        // ------------------------------------------ BIBLIOGRAPHIC TAB ----------------------------------------------
        const bibliographicTab = page.getByTestId('bibliographic-section-content');
        await expect(bibliographicTab.locator('h4').getByText(/Dataset name/)).toBeVisible();

        // -------------------------------------- ADMIN TAB -----------------------------------------
        // Admin tab
        const adminTab = page.getByTestId('admin-section-content');
        await expect(adminTab.locator('h4').getByText(/Additional information/)).toBeVisible();
        await expect(adminTab.getByTestId('rek-license-input')).toHaveValue(
            record.fez_record_search_key_license.rek_license.toString(),
        );
        await expect(adminTab.getByTestId('rek-license-select')).toHaveText(
            record.fez_record_search_key_license.rek_license_lookup,
        );
        await checkPartialDateFromRecordValue(page, 'rek-end-date', record.fez_record_search_key_end_date.rek_end_date);
    });
});

test.describe('Author affiliations', () => {
    const record = { ...recordList.data[0] };

    test.beforeEach(async ({ page }) => {
        await loadRecordForAdminEdit(page, record.rek_pid);
    });

    test('should not be available for this work type', async ({ page }) => {
        await assertAffiliationsAllowed(page, {
            authorName: 'Steve Su (uqysu4)',
            orgName: 'The University of Queensland',
            rowId: 0,
        });
    });
});

test.describe('Related Services', () => {
    const record = { ...recordList.data[0] };

    test.beforeEach(async ({ page }) => await loadRecordForAdminEdit(page, record.rek_pid));

    test('should auto fill description field with selected title', async ({ page }) => {
        await page.getByTestId('rek-related-service-id-input').pressSequentially('00tjv0s44');
        await page
            .getByTestId('rek-related-service-id-options')
            .locator('li', { hasText: /Test Org/ })
            .first()
            .click();
        await expect(page.getByTestId('rek-related-service-desc-input')).toHaveValue('Test Org');
        await page.getByTestId('rek-related-service-add').click();
        // should add to the second row
        await expect(page.getByTestId('related-service-list-row-1').getByText(/00tjv0s44/)).toBeVisible();
        await expect(page.getByTestId('related-service-list-row-1').getByText(/Test Org/)).toBeVisible();
    });
});
