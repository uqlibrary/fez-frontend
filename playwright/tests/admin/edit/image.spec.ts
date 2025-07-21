import { test, expect } from '../../../test';

import { default as recordList } from 'mock/data/records/publicationTypeListImage';

import {
    adminEditCheckDefaultTab,
    adminEditCountCards,
    adminEditNoAlerts,
    adminEditTabbedView,
    assertAffiliationsAllowed,
    loadRecordForAdminEdit,
} from '../helpers';

test.describe('Image admin edit', () => {
    const record = { ...recordList.data[0] };

    test.beforeEach(async ({ page }) => {
        await loadRecordForAdminEdit(page, record.rek_pid);
    });

    test('should load with specified elements', async ({ page }) => {
        await adminEditCountCards(page, 8);
        await adminEditNoAlerts(page);
        await adminEditTabbedView(page);
        await adminEditCheckDefaultTab(page, 'Bibliographic');
    });

    test('should render the different sections as expected', async ({ page }) => {
        // ------------------------------------------ BIBLIOGRAPHIC TAB ----------------------------------------------
        console.log('Bibliographic tab');
        await expect(page.getByTestId('bibliographic-section-header')).toHaveText('Bibliographic');
        const bibliographicTab = page.getByTestId('bibliographic-section-content');

        const bibliographicCard = bibliographicTab.locator('.AdminCard').nth(2);
        await expect(bibliographicCard.locator('h4')).toHaveText(/Bibliographic/);
        await expect(bibliographicCard.getByTestId('rek-original-format-input')).toHaveValue(
            record.fez_record_search_key_original_format.rek_original_format,
        );
        await expect(bibliographicCard.getByTestId('rek-source-input')).toHaveValue(
            record.fez_record_search_key_source.rek_source,
        );
        await expect(bibliographicCard.getByTestId('rek-rights-input')).toHaveValue(
            record.fez_record_search_key_rights.rek_rights,
        );

        // ---------------------------------------------- ADMIN TAB --------------------------------------------------
        console.log('Admin tab');
        await expect(page.getByTestId('admin-section-header')).toHaveText('Admin');
        const adminTab = page.getByTestId('admin-section-content');

        await expect(adminTab.getByTestId('rek-oa-status-input')).toHaveValue(
            record.fez_record_search_key_oa_status.rek_oa_status.toString(),
        );
        await expect(adminTab.locator('[data-testid=rek-oa-status-select]')).toHaveText(
            record.fez_record_search_key_oa_status.rek_oa_status_lookup,
        );
    });
});

test.describe('Author affiliations', () => {
    const record = recordList.data[0];

    test.beforeEach(async ({ page }) => {
        await loadRecordForAdminEdit(page, record.rek_pid);
    });

    test('should not be available for this work type', async ({ page }) => {
        await assertAffiliationsAllowed(page, {
            authorName: 'Steve Su (uqysu4)',
            orgName: 'The University of Queensland',
            rowId: 0,
            allowed: false,
        });
    });
});
