import { test, expect } from '../../../test';

import { default as recordList } from 'mock/data/records/publicationTypeListConferenceProceedings';
import {
    assertAffiliationsAllowed,
    loadRecordForAdminEdit,
    adminEditCountCards,
    adminEditVerifyAlerts,
    adminEditTabbedView,
    adminEditCheckDefaultTab,
    adminEditCheckTabErrorBadge,
    adminEditNoAlerts,
} from '../helpers';

test.describe('Conference Proceedings admin edit', () => {
    const record = { ...recordList.data[0] };
    const {
        dsi_dsid: visibleFilename,
        dsi_label: visibleFileDescription,
        dsi_security_policy: visibleFileSecurityPolicy,
    } = record.fez_datastream_info[0];

    test.beforeEach(async ({ page }) => {
        await loadRecordForAdminEdit(page, record.rek_pid);
    });

    test('should load expected tabs', async ({ page }) => {
        await adminEditCountCards(page, 8);
        await adminEditVerifyAlerts(page, 1, ['Editor/contributor names are required']);
        await adminEditTabbedView(page);
        await adminEditCheckDefaultTab(page, 'Bibliographic');
        await adminEditCheckTabErrorBadge(page, 'authors');
    });

    test('should render the different sections as expected', async ({ page }) => {
        // ------------------------------------------ BIBLIOGRAPHIC TAB ----------------------------------------------
        // Bibliographic tab
        const bibliographicTab = page.getByTestId('bibliographic-section-content');
        await expect(bibliographicTab).toBeVisible(); // Ensure the tab content is visible
        await expect(bibliographicTab.locator('h4').getByText(/Title of proceedings/)).toBeVisible();

        // ------------------------------------------ AUTHOR DETAILS TAB ---------------------------------------------
        await expect(page.getByTestId('rek-contributor-add')).toBeVisible();
        await page.getByTestId('rek-contributor-add').click();

        // Author Details tab
        const editorDetailsTab = page.getByTestId('authors-section-content');
        await expect(editorDetailsTab).toBeVisible(); // Ensure the tab content is visible

        await expect(editorDetailsTab.locator('h4').getByText(/Editors/)).toBeVisible();
        await editorDetailsTab.getByTestId('rek-contributor-add').click();
        await editorDetailsTab.getByTestId('rek-contributor-input').fill('Editor');
        await editorDetailsTab.getByTestId('rek-contributor-input').press('Enter');

        await adminEditNoAlerts(page);

        // ---------------------------------------------- FILES TAB --------------------------------------------------
        // Files tab
        const filesTab = page.getByTestId('files-section-content');
        await expect(filesTab).toBeVisible(); // Ensure the tab content is visible

        await expect(filesTab.locator('h4').getByText('Attached files')).toBeVisible();

        // Locating the specific div for file details
        const fileDetailsDiv = filesTab.locator('[class*=MuiCardContent-root] > div:nth-child(3)');
        await expect(fileDetailsDiv.locator(`a[title="${visibleFilename}"]`)).toHaveCount(1);
        await expect(fileDetailsDiv.locator('input[name=fileDescription]')).toHaveValue(visibleFileDescription);

        // --------------------------------------------- SECURITY TAB ------------------------------------------------
        // Security tab
        const securityTab = page.getByTestId('security-section-content');
        await expect(securityTab).toBeVisible(); // Ensure the tab content is visible

        await expect(securityTab.locator('h4').nth(1)).toHaveText(`Datastream level security - ${record.rek_pid}`);

        const standardCardNth1 = securityTab.locator('.StandardCard').nth(1);
        await expect(standardCardNth1.locator('h6').first()).toHaveText('Inherited datastream security policy details');

        for (const [index, collection] of record.fez_record_search_key_ismemberof.entries()) {
            await expect(securityTab.locator('h6').nth(2 * index + 1)).toHaveText(collection.rek_ismemberof);
            await expect(securityTab.locator('h6').nth(2 * index + 2)).toHaveText(collection.rek_ismemberof_lookup);
            await expect(securityTab.locator('p').nth(index)).toHaveText(
                `Public (${collection.parent.rek_security_policy})`,
            );
        }

        // To find "Override datastream security policy details" and its sibling div:
        const overrideHeading = securityTab.locator('h6').getByText('Override datastream security policy details');
        const dsiPolicyBlock = overrideHeading.locator('+ div'); // Selects the next sibling div

        await expect(dsiPolicyBlock.locator(`a[title="${visibleFilename}"]`)).toHaveText(visibleFilename);
        await expect(dsiPolicyBlock.locator(`input[name="${visibleFilename}"]`)).toHaveValue(
            visibleFileSecurityPolicy.toString(),
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
            rowId: 0,
            allowed: false,
        });
    });
});
