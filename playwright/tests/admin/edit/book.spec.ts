import { test, expect, Locator } from '../../../test';

import { default as recordList } from 'mock/data/records/publicationTypeListBook';
import { sherpaRomeo as sherpaMocks } from 'mock/data/sherpaRomeo';
import { ULRICHS_URL_PREFIX } from 'config/general';

import {
    adminEditCheckDefaultTab,
    adminEditCountCards,
    adminEditNoAlerts,
    adminEditTabbedView,
    adminEditVerifyAlerts,
    assertAffiliationsAllowed,
    loadRecordForAdminEdit,
} from '../helpers';

test.describe('Book admin edit', () => {
    const record = { ...recordList.data[0] };

    test('should load expected tabs', async ({ page }) => {
        await loadRecordForAdminEdit(page, record.rek_pid);
        await adminEditCountCards(page, 8);
        await adminEditNoAlerts(page);

        await adminEditTabbedView(page);
        await adminEditCheckDefaultTab(page, 'Bibliographic');

        await adminEditTabbedView(page, false); // Pass page to adminEditTabbedView
        await adminEditCountCards(page, 8);
    });

    test('should render the different sections as expected', async ({ page }) => {
        await loadRecordForAdminEdit(page, record.rek_pid);
        // ------------------------------------------ BIBLIOGRAPHIC TAB ----------------------------------------------
        // Bibliographic tab
        const bibliographicTab = page.getByTestId('bibliographic-section-content');
        await expect(bibliographicTab.locator('h4').getByText(/Title/)).toBeVisible();
        const langCodes = record.fez_record_search_key_language_of_title.map(lang => lang.rek_language_of_title);
        await expect(bibliographicTab.getByTestId('rek-language-of-title-input')).toHaveValue(langCodes.join(','));

        await expect(
            bibliographicTab.getByTestId('rek-language-of-title-input').locator('+ [role=button] span'),
        ).toHaveCount(0);

        await expect(bibliographicTab.getByTestId('rek-native-script-title-input')).toHaveValue(
            record.fez_record_search_key_native_script_title.rek_native_script_title,
        );
        await expect(bibliographicTab.getByTestId('rek-roman-script-title-input')).toHaveValue(
            record.fez_record_search_key_roman_script_title.rek_roman_script_title,
        );
        await expect(bibliographicTab.getByTestId('rek-translated-title-input')).toHaveValue(
            record.fez_record_search_key_translated_title.rek_translated_title,
        );

        // Clear and check required validation
        const placeOfPublicationInput = bibliographicTab.getByTestId('rek-place-of-publication-input');
        await placeOfPublicationInput.clear();
        await expect(
            placeOfPublicationInput
                .locator('..')
                .locator('..')
                .locator('p'),
        ).toHaveText('This field is required');

        await adminEditVerifyAlerts(page, 1, ['Place of publication is required']);
    });

    test('should render ISSN as expected', async ({ page }) => {
        const recordWithIssn = recordList.data[1]; // Using a different record from the list for this test
        await loadRecordForAdminEdit(page, recordWithIssn.rek_pid);
        const bibliographicTab = page.getByTestId('bibliographic-section-content');

        // Helper function for checking ISSN links
        const checkIssnLinks = async (container: Locator, issn: string) => {
            const sherpaLink =
                (sherpaMocks.find(item => item.srm_issn === issn) || {}).srm_journal_link ||
                sherpaMocks[0].srm_journal_link;
            await expect(container).toContainText(issn);
            await expect(container).toContainText('SHERPA/RoMEO');
            await expect(container).toContainText('Ulrichs');
            await expect(container.locator('#sherparomeo-link')).toHaveAttribute('href', sherpaLink);

            let ulrichsID = issn.replace('-', '');
            switch (issn) {
                case '0302-9743':
                    ulrichsID = '122527';
                    break;
                case '1611-3349':
                    ulrichsID = '339301';
                    break;
                default:
                    break;
            }
            await expect(container.locator('#ulrichs-link')).toHaveAttribute(
                'href',
                `${ULRICHS_URL_PREFIX}${ulrichsID}`,
            );
        };

        const issnBlock = bibliographicTab.locator('#rek-issn-list-editor');
        // Find existing entry
        const row0 = issnBlock.getByTestId('rek-issn-list-row-0');
        await checkIssnLinks(row0, '0302-9743');

        // Find existing entry with placeholder data
        const row1 = issnBlock.locator('#rek-issn-list-row-1');
        await expect(row1).toContainText('1611-3349');
        await expect(row1.locator('a')).toHaveCount(1);
        await expect(row1.locator('a')).toHaveAttribute('title', 'Lecture Notes in Computer Science');
        await expect(row1.locator('a')).toHaveAttribute(
            'aria-label',
            'Source publisher name/place and alternate ISSNs in a new window',
        );
        await expect(row1.locator('a')).toHaveAttribute('href', `${ULRICHS_URL_PREFIX}339301`);
        await row1.locator('button[aria-label="Edit this item"]').click();

        // Edit issn to a different one with valid data
        const issnInput = issnBlock.locator('input');
        await issnInput.press('End');
        await issnInput.press('Backspace');
        await issnInput.pressSequentially('0');
        await issnInput.press('Enter');
        await checkIssnLinks(row1, '1611-3340');

        // Add a 3rd entry without match in API
        const row2 = issnBlock.locator('#rek-issn-list-row-2');
        await issnInput.fill('11111111');
        await issnInput.press('Enter');
        await expect(row2).toContainText('1111-1111');
        await expect(row2).not.toContainText('SHERPA/RoMEO');
        await expect(row2).not.toContainText('Ulrichs');

        await page.setViewportSize({ width: 1000, height: 1000 });

        // Add 4th entry with match in API
        const row3 = issnBlock.locator('#rek-issn-list-row-3');
        await issnInput.fill('33333333');
        await issnInput.press('Enter');
        await checkIssnLinks(row3, '3333-3333');
        // Check the second 'a' tag within a span, typically for the title/aria-label link
        await expect(row3.locator('span > a').nth(1)).toHaveAttribute('title', 'Lecture Notes in Computer Science');
        await expect(row3.locator('span > a').nth(1)).toHaveAttribute(
            'aria-label',
            'Source publisher name/place and alternate ISSNs in a new window',
        );

        await row3.locator('button[aria-label="Edit this item"]').click();

        // Edit the 4th entry
        await issnInput.press('Control+A'); // Use Control+A for cross-platform select all
        await issnInput.press('Delete');
        await issnInput.fill('44444444');
        await issnInput.press('Enter');
        await expect(row3).not.toContainText('3333-3333');
        await checkIssnLinks(row3, '4444-4444');

        // Add a 5th entry
        const row4 = issnBlock.locator('#rek-issn-list-row-4');
        await issnInput.fill('55555555');
        await issnInput.press('Enter');

        // Verify and move up the 5th entry
        await checkIssnLinks(row4, '5555-5555');
        await page.locator('#rek-issn-list-row-4-move-up').click();

        // Ensure 4th and 5th entries have swapped properly
        const newRow3 = issnBlock.locator('#rek-issn-list-row-3'); // Re-get locator as elements might re-render
        const newRow4 = issnBlock.locator('#rek-issn-list-row-4');
        await checkIssnLinks(newRow3, '5555-5555');
        await checkIssnLinks(newRow4, '4444-4444');

        // New entry with sherpa placeholder data
        const row5 = issnBlock.locator('#rek-issn-list-row-5');
        await issnInput.fill('00000000');
        await issnInput.press('Enter');
        await expect(row5).toContainText('0000-0000');
        await expect(row5.locator('a')).not.toContainText('SHERPA/RoMEO'); // Check specific link element if needed
        await expect(row5).toContainText('Ulrichs'); // Check parent container for Ulrichs text

        // New entry with unknown sherpa status
        const row6 = issnBlock.locator('#rek-issn-list-row-6');
        await issnInput.fill('66666666');
        await issnInput.press('Enter');
        await checkIssnLinks(row6, '6666-6666');
    });
});

test.describe('Author affiliations', () => {
    const record = { ...recordList.data[0] }; // Assuming this record has the necessary author data

    test.beforeEach(async ({ page }) => {
        await loadRecordForAdminEdit(page, record.rek_pid);
    });

    test('should be available for this work type', async ({ page }) => {
        await assertAffiliationsAllowed(page, {
            // Pass page to assertAffiliationsAllowed
            authorName: 'Steve Su (uqysu4)',
            orgName: 'The University of Queensland',
            rowId: 2,
            allowed: true,
        });
    });
});
