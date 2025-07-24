import { test, expect } from '../../../test';

import { default as recordList } from 'mock/data/records/publicationTypeListJournal';
import {
    adminEditCheckDefaultTab,
    adminEditCountCards,
    adminEditNoAlerts,
    adminEditTabbedView,
    assertAffiliationsAllowed,
    loadRecordForAdminEdit,
} from '../helpers';

test.describe('Journal admin edit', () => {
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

        const bibliographicCard = bibliographicSectionContent.locator('.AdminCard').nth(4);
        await expect(bibliographicCard.locator('h4')).toHaveText(/Bibliographic/);
        await expect(bibliographicCard.getByTestId('rek-place-of-publication-input')).toHaveValue(
            record.fez_record_search_key_place_of_publication.rek_place_of_publication,
        );
        await expect(bibliographicCard.getByTestId('rek-publisher-input')).toHaveValue(
            record.fez_record_search_key_publisher.rek_publisher,
        );
        await expect(bibliographicCard.getByTestId('rek-volume-number-input')).toHaveValue(
            record.fez_record_search_key_volume_number.rek_volume_number,
        );
        await expect(bibliographicCard.getByTestId('rek-issue-number-input')).toHaveValue(
            record.fez_record_search_key_issue_number.rek_issue_number,
        );

        const issn = record.fez_record_search_key_issn[0].rek_issn;
        const sherpaLink = `https://www.sherpa.ac.uk/romeo/search.php?issn=${issn}`;

        const issnRow = page.locator('#rek-issn-list-row-0');
        await expect(issnRow).toContainText(issn);
        await expect(issnRow).toContainText('SHERPA/RoMEO');
        await expect(issnRow.locator('#sherparomeo-link')).toHaveAttribute('href', sherpaLink);
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
            allowed: false, // Explicitly set allowed to false as per previous fixes
        });
    });
});
