import { test, expect } from '../../../test';

import { default as recordList } from 'mock/data/records/publicationTypeListNewspaperArticle';
import {
    adminEditCheckDefaultTab,
    adminEditCountCards,
    adminEditNoAlerts,
    adminEditTabbedView,
    assertAffiliationsAllowed,
    loadRecordForAdminEdit,
} from '../helpers';

test.describe('Newspaper Article admin edit', () => {
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
        // Bibliographic tab
        await expect(page.getByTestId('bibliographic-section-header')).toHaveText('Bibliographic');
        const bibliographicSectionContent = page.getByTestId('bibliographic-section-content');
        const adminCard = bibliographicSectionContent.locator('.AdminCard').nth(3); // Fixed 'scope' redeclaration

        await expect(adminCard.locator('h4')).toHaveText(/Bibliographic/);
        await expect(adminCard.getByTestId('rek-place-of-publication-input')).toHaveValue(
            record.fez_record_search_key_place_of_publication.rek_place_of_publication,
        );
        await expect(adminCard.getByTestId('rek-publisher-input')).toHaveValue(
            record.fez_record_search_key_publisher.rek_publisher,
        );
        await expect(adminCard.getByTestId('rek-edition-input')).toHaveValue(
            record.fez_record_search_key_edition.rek_edition,
        );
        await expect(adminCard.getByTestId('rek-newspaper-input')).toHaveValue(
            record.fez_record_search_key_newspaper.rek_newspaper,
        );
        await expect(adminCard.getByTestId('rek-section-input')).toHaveValue(
            record.fez_record_search_key_section.rek_section,
        );
        await expect(adminCard.getByTestId('rek-translated-newspaper-input')).toHaveValue(
            record.fez_record_search_key_translated_newspaper.rek_translated_newspaper,
        );
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
            rowId: 1,
            allowed: false,
        });
    });
});
