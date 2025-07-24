import { test, expect } from '../../../test';

import { default as recordList } from 'mock/data/records/publicationTypeListWorkingPaper';

import {
    adminEditCheckDefaultTab,
    adminEditCountCards,
    adminEditNoAlerts,
    adminEditTabbedView,
    loadRecordForAdminEdit,
    assertAffiliationsAllowed,
} from '../helpers';

import { readCKEditor } from '../../../lib/ckeditor';

test.describe('Working paper admin edit', () => {
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

        // Locate the bibliographic content section
        const bibliographicContent = page.getByTestId('bibliographic-section-content');
        await expect(bibliographicContent).toBeVisible(); // Ensure it's visible before interacting

        // First AdminCard (Title section)
        const titleCard = bibliographicContent.locator('.AdminCard').nth(0);
        await expect(titleCard.locator('h4')).toHaveText(/Title/); // Using regex for "Title"

        await expect(
            titleCard
                .locator('span')
                .locator('span')
                .nth(0),
        ).toContainText('Formatted title');

        expect(await readCKEditor(page, 'rek-title')).toContain(record.rek_title);

        // Fourth AdminCard (Bibliographic section)
        const bibliographicCard = bibliographicContent.locator('.AdminCard').nth(4);
        await expect(bibliographicCard.locator('h4')).toHaveText(/Bibliographic/);

        await expect(bibliographicCard.getByTestId('rek-report-number-input')).toHaveValue(
            record.fez_record_search_key_report_number.rek_report_number,
        );
        await expect(bibliographicCard.getByTestId('rek-org-name-input')).toHaveValue(
            record.fez_record_search_key_org_name.rek_org_name,
        );
        await expect(bibliographicCard.getByTestId('rek-org-unit-name-input')).toHaveValue(
            record.fez_record_search_key_org_unit_name.rek_org_unit_name,
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
            rowId: 1,
            allowed: false,
        });
    });
});
