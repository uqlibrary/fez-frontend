import { test, expect } from '../../../test';

import { default as recordList } from 'mock/data/records/publicationTypeListVideo';
import {
    adminEditCheckDefaultTab,
    adminEditCountCards,
    adminEditNoAlerts,
    adminEditTabbedView,
    assertAffiliationsAllowed,
    loadRecordForAdminEdit,
} from '../helpers';
import { typeCKEditor } from '../../../lib/ckeditor';

test.describe('Video admin edit', () => {
    const record = recordList.data[0];

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
        // Corrected locator chaining: get bibliographic content, then find the 5th AdminCard
        const bibliographicContent = page.getByTestId('bibliographic-section-content');
        const bibliographicCard = bibliographicContent.locator('.AdminCard').nth(4);
        await expect(bibliographicCard.locator('h4')).toHaveText(/Bibliographic/);
        // Video record includes the owner's Rights
        await expect(bibliographicCard.getByTestId('rek-rights-input')).toHaveValue(
            record.fez_record_search_key_rights.rek_rights,
        );
    });

    test('should submit successfully', async ({ page }) => {
        await typeCKEditor(page, 'rek-description', 'some description'); // description
        await page.locator('#admin-work-submit').click();
        // Confirmation message
        const dialog = page.locator('[role=dialog]');
        await expect(dialog.locator('h2')).toContainText('Work has been updated');
        // Locate the 'View updated work' button within the dialog and click it
        await dialog.locator('button', { hasText: 'View updated work' }).click();
        // Verify URL
        await expect(page).toHaveURL(`/view/${record.rek_pid}`);
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
            rowId: 4,
            allowed: false,
        });
    });
});
