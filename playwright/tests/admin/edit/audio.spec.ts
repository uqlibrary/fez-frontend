import { test, expect } from '../../../test';

import { default as recordList } from 'mock/data/records/publicationTypeListAudio';
import {
    adminEditCheckDefaultTab,
    adminEditCheckTabErrorBadge,
    adminEditCountCards,
    adminEditNoAlerts,
    adminEditTabbedView,
    adminEditVerifyAlerts,
    assertAffiliationsAllowed,
    loadRecordForAdminEdit,
} from '../helpers';
import { checkPartialDateFromRecordValue, setPartialDate } from '../../../lib/helpers';
import { readCKEditor } from '../../../lib/ckeditor';

test.describe('Audio admin edit', () => {
    const record = { ...recordList.data[0] };

    test.beforeEach(async ({ page }) => {
        await loadRecordForAdminEdit(page, record.rek_pid);
    });

    test('should load expected tabs', async ({ page }) => {
        await adminEditCountCards(page, 8);
        await adminEditVerifyAlerts(page, 1, ['Publication date is required']);
        await adminEditTabbedView(page);
        await adminEditCheckDefaultTab(page, 'Bibliographic');
        await adminEditCheckTabErrorBadge(page, 'bibliographic');
    });

    test('should render the different sections as expected', async ({ page }) => {
        // ------------------------------------------- IDENTIFIERS TAB -----------------------------------------------
        // Identifiers tab
        const identifiersScope = page.getByTestId('identifiers-section-content');
        await expect(identifiersScope.locator('h4').getByText('Manage links')).toBeVisible();
        const links = [
            {
                url: record.fez_record_search_key_link[0].rek_link,
                description: record.fez_record_search_key_link_description[0].rek_link_description,
            },
        ];

        for (const link of links) {
            const rowLocator = identifiersScope.getByTestId(`rek-link-list-row-${links.indexOf(link)}`);
            await expect(rowLocator.locator('p')).toHaveText(`Link: ${link.url}`);
            await expect(rowLocator.locator('span').getByText(`Description: ${link.description}`)).toBeVisible();
        }

        // ------------------------------------------ BIBLIOGRAPHIC TAB ----------------------------------------------
        // Bibliographic tab
        const bibliographicCard = page.getByTestId('bibliographic-section-content');
        await expect(bibliographicCard.locator('h4').getByText('Bibliographic')).toBeVisible();
        await checkPartialDateFromRecordValue(
            page,
            'rek-date-recorded',
            record.fez_record_search_key_date_recorded.rek_date_recorded,
        );
        await expect(bibliographicCard.getByTestId('rek-acknowledgements-input')).toHaveText(
            record.fez_record_search_key_acknowledgements.rek_acknowledgements,
        );
        await expect(bibliographicCard.getByTestId('rek-length-input')).toHaveValue(
            record.fez_record_search_key_length.rek_length.toString(),
        );
        await expect(bibliographicCard.getByTestId('rek-source-input')).toHaveText(
            record.fez_record_search_key_source.rek_source,
        );
        await expect(bibliographicCard.getByTestId('rek-rights-input')).toHaveText(
            record.fez_record_search_key_rights.rek_rights,
        );
        await expect(bibliographicCard.getByTestId('rek-transcript').locator('.MuiTypography-caption')).toHaveText(
            'Transcript',
        );

        const transcriptText = await readCKEditor(page, 'rek-transcript');
        console.log('text=', transcriptText);
        expect(transcriptText).toContain(record.fez_record_search_key_transcript.rek_transcript.substring(0, 10));

        await expect(bibliographicCard.getByTestId('rek-alternate-genre-input')).toHaveValue(
            record.fez_record_search_key_alternate_genre.map(item => item.rek_alternate_genre).join(','),
        );

        const alternateSelect = bibliographicCard.getByTestId('rek-alternate-genre-select');
        await expect(alternateSelect).toHaveText(
            record.fez_record_search_key_alternate_genre.map(item => item.rek_alternate_genre_lookup).join(','),
        );
        await expect(bibliographicCard.getByTestId('rek-location-input')).toHaveValue(
            record.fez_record_search_key_location.map(item => item.rek_location).join(''),
        );
        const pubDateBlock = bibliographicCard.locator('[id=rek-date]');
        await expect(pubDateBlock.locator('p')).toHaveText('Year required');
        await setPartialDate(page, 'rek-date', { day: 1, month: 1, year: 2020 });
        await expect(pubDateBlock.locator('p')).not.toBeVisible();

        await adminEditNoAlerts(page);

        // ---------------------------------------------- FILES TAB --------------------------------------------------
        // Files tab
        const filesTab = page.getByTestId('files-section-content');

        // start: check embargo date can be cleared
        const embargoDateInput = filesTab
            .locator('#embargoDateButton-UQFL173_b57_R298B_2579510-mp3')
            .locator('div > div > input');
        await expect(embargoDateInput).toHaveValue('01/01/2099');
        const embargoDateButton = filesTab
            .locator('#embargoDateButton-UQFL173_b57_R298B_2579510-mp3')
            .locator('div > div > div > button');
        await embargoDateButton.click(); // date picker popup appears
        await expect(page.locator('[role="dialog"] [role="presentation"] .MuiPickersCalendarHeader-label')).toHaveText(
            'January 2099',
        );
        await embargoDateButton.click(); // date picker disappears
        await embargoDateInput.focus();
        await page.keyboard.press('Control+A');
        await page.keyboard.press('Backspace');

        await expect(
            filesTab
                .getByTestId('standard-card-attached-files-content')
                .getByText('Embargo date removed - review security policy on Security tab'),
        ).toBeVisible();
        // end: check embargo date can be cleared

        const advisoryCardScope = filesTab.locator('.AdminCard').nth(1);
        await expect(advisoryCardScope.locator('h4')).toHaveText('Advisory statement');
        await expect(advisoryCardScope.locator('span span').first()).toHaveText('Advisory statement');

        const advisoryText = await readCKEditor(page, 'rek-advisory-statement');
        expect(advisoryText).toContain(record.fez_record_search_key_advisory_statement.rek_advisory_statement);
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
        });
    });
});
