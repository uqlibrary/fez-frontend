import { test, expect } from '../../../test';

import { default as recordList } from 'mock/data/records/publicationTypeListResearchReport';
import {
    adminEditCheckDefaultTab,
    adminEditCountCards,
    adminEditNoAlerts,
    adminEditTabbedView,
    loadRecordForAdminEdit,
} from '../helpers';

test.describe('Research Report admin edit', () => {
    const record = { ...recordList.data[0] };

    test.beforeEach(async ({ page }) => {
        await loadRecordForAdminEdit(page, record.rek_pid);
    });

    test('should load with specified elements', async ({ page }) => {
        await adminEditCountCards(page, 9);
        await adminEditNoAlerts(page);
        await adminEditTabbedView(page);
        await adminEditCheckDefaultTab(page, 'Bibliographic');
    });

    test('should render the different sections as expected', async ({ page }) => {
        // ------------------------------------------ BIBLIOGRAPHIC TAB ----------------------------------------------
        await expect(page.getByTestId('bibliographic-section-header')).toHaveText('Bibliographic');
        const bibliographicSectionContent = page.getByTestId('bibliographic-section-content');
        const bibliographicAdminCard = bibliographicSectionContent.locator('.AdminCard').nth(4);

        await expect(bibliographicAdminCard.locator('h4')).toHaveText(/Bibliographic/);
        await expect(bibliographicAdminCard.getByTestId('rek-parent-publication-input')).toHaveValue(
            record.fez_record_search_key_parent_publication.rek_parent_publication,
        );
        await expect(bibliographicAdminCard.getByTestId('rek-start-page-input')).toHaveValue(
            record.fez_record_search_key_start_page.rek_start_page,
        );
        await expect(bibliographicAdminCard.getByTestId('rek-end-page-input')).toHaveValue(
            record.fez_record_search_key_end_page.rek_end_page,
        );
        await expect(bibliographicAdminCard.getByTestId('rek-total-pages-input')).toHaveValue(
            record.fez_record_search_key_total_pages.rek_total_pages,
        );
        await expect(bibliographicAdminCard.getByTestId('rek-report-number-input')).toHaveValue(
            record.fez_record_search_key_report_number.rek_report_number,
        );

        // ------------------------------------------ ADMIN TAB ----------------------------------------------
        await expect(page.getByTestId('admin-section-header')).toHaveText('Admin');
        const adminSectionContent = page.getByTestId('admin-section-content');
        const adminInfoAdminCard = adminSectionContent.locator('.AdminCard').nth(1);

        await expect(adminInfoAdminCard.locator('h4')).toHaveText(/Additional information/);
        await expect(adminInfoAdminCard.getByTestId('rek-refereed-source-input')).toHaveValue(
            record.fez_record_search_key_refereed_source.rek_refereed_source,
        );
        await expect(adminInfoAdminCard.getByTestId('rek-refereed-source-select')).toHaveText(
            record.fez_record_search_key_refereed_source.rek_refereed_source_lookup,
        );
        await expect(adminInfoAdminCard.getByTestId('rek-license-input')).toHaveValue(
            record.fez_record_search_key_license.rek_license.toString(),
        );
        const licenseInput = adminInfoAdminCard.getByTestId('rek-license-input');
        const parentOfLicenseInput = licenseInput.locator('xpath=..');
        const licenseCombobox = parentOfLicenseInput.getByRole('combobox');
        await expect(licenseCombobox).toHaveText(record.fez_record_search_key_license.rek_license_lookup);

        // ---------------------------------------- GRANT INFORMATION TAB --------------------------------------------
        await expect(page.getByTestId('grants-section-header')).toHaveText('Grants');
        const grantsSectionContent = page.getByTestId('grants-section-content');
        const grantInfoAdminCard = grantsSectionContent.locator('.AdminCard').first();

        await expect(grantInfoAdminCard.locator('h4')).toHaveText(/Grant information/);

        const numberItemsInRow = 3;
        await Promise.all(
            record.fez_record_search_key_grant_agency.map(async (pub, index) => {
                await expect(grantInfoAdminCard.locator('p').nth(index * numberItemsInRow)).toHaveText(
                    pub.rek_grant_agency,
                );
            }),
        );
        await Promise.all(
            record.fez_record_search_key_grant_id.map(async (id, index) => {
                await expect(grantInfoAdminCard.locator('p').nth(index * numberItemsInRow + 1)).toHaveText(
                    id.rek_grant_id,
                );
            }),
        );
        await Promise.all(
            record.fez_record_search_key_grant_agency_type.map(async (type, index) => {
                await expect(grantInfoAdminCard.locator('p').nth(index * numberItemsInRow + 2)).toHaveText(
                    type.rek_grant_agency_type_lookup,
                );
            }),
        );
    });
});
