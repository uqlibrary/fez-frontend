import { test, expect } from '../../../test';

import { default as recordList } from 'mock/data/records/publicationTypeListPatent';
import {
    adminEditCheckDefaultTab,
    adminEditCountCards,
    adminEditNoAlerts,
    adminEditTabbedView,
    assertAffiliationsAllowed,
    loadRecordForAdminEdit,
} from '../helpers';

test.describe('Patent admin edit', () => {
    const record = { ...recordList.data[0] };

    test.beforeEach(async ({ page }) => {
        await loadRecordForAdminEdit(page, record.rek_pid);
    });

    test('should load expected tabs', async ({ page }) => {
        await adminEditCountCards(page, 8);
        await adminEditNoAlerts(page);
        await adminEditTabbedView(page);
        await adminEditCheckDefaultTab(page, 'Bibliographic');
        // Finished testing tabs
    });

    test('should render the different sections as expected', async ({ page }) => {
        // ------------------------------------------ BIBLIOGRAPHIC TAB ----------------------------------------------
        // Bibliographic tab
        const bibliographicSectionContent = page.getByTestId('bibliographic-section-content'); // Renamed for clarity, original had 'bibliographicTab' and 'scope'
        await expect(bibliographicSectionContent.getByTestId('rek-genre-input')).toHaveValue(record.rek_genre);
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
            rowId: 2,
            allowed: false,
        });
    });
});
