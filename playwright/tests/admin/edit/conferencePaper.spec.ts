import { test, expect } from '../../../test';

import { default as recordList } from 'mock/data/records/publicationTypeListConferencePaper';
import {
    adminEditCheckDefaultTab,
    adminEditCountCards,
    adminEditNoAlerts,
    adminEditTabbedView,
    assertAffiliationsAllowed,
    loadRecordForAdminEdit,
} from '../helpers';

test.describe('Conference Paper admin edit', () => {
    const record = recordList.data[0];

    test.beforeEach(async ({ page }) => {
        await loadRecordForAdminEdit(page, record.rek_pid);
    });

    test('should load expected tabs', async ({ page }) => {
        await adminEditCountCards(page, 8);
        await adminEditNoAlerts(page);
        await adminEditTabbedView(page);
        await adminEditCheckDefaultTab(page, 'Bibliographic');
    });

    test('should render the different sections as expected', async ({ page }) => {
        // ------------------------------------------ BIBLIOGRAPHIC TAB ----------------------------------------------
        console.log('Bibliographic tab');
        const bibliographicTab = page.getByTestId('bibliographic-section-content');
        await expect(bibliographicTab.locator('h4').getByText(/Title of paper/)).toBeVisible();
        await expect(bibliographicTab.locator('h4').getByText(/Conference name/)).toBeVisible();
        await expect(bibliographicTab.locator('h4').getByText(/Conference details/)).toBeVisible();
        await expect(bibliographicTab.locator('h4').getByText(/Proceedings title/)).toBeVisible();
        await expect(bibliographicTab.locator('h4').getByText(/Journal name/)).toBeVisible();
        await expect(bibliographicTab.getByTestId('rek-conference-name-input')).toHaveValue(
            record.fez_record_search_key_conference_name.rek_conference_name,
        );
        await expect(bibliographicTab.getByTestId('rek-native-script-conference-name-input')).toHaveValue(
            record.fez_record_search_key_native_script_conference_name.rek_native_script_conference_name,
        );
        await expect(bibliographicTab.getByTestId('rek-roman-script-conference-name-input')).toHaveValue(
            record.fez_record_search_key_roman_script_conference_name.rek_roman_script_conference_name,
        );
        await expect(bibliographicTab.getByTestId('rek-translated-conference-name-input')).toHaveValue(
            record.fez_record_search_key_translated_conference_name.rek_translated_conference_name,
        );
        await expect(bibliographicTab.getByTestId('rek-conference-location-input')).toHaveValue(
            record.fez_record_search_key_conference_location.rek_conference_location,
        );
        await expect(bibliographicTab.getByTestId('rek-conference-dates-input')).toHaveValue(
            record.fez_record_search_key_conference_dates.rek_conference_dates,
        );
        await expect(bibliographicTab.getByTestId('rek-proceedings-title-input')).toHaveValue(
            record.fez_record_search_key_proceedings_title.rek_proceedings_title,
        );
        await expect(bibliographicTab.getByTestId('rek-language-of-proceedings-title-select')).toHaveText('German');
        await expect(
            bibliographicTab
                .getByTestId('rek-language-of-proceedings-title-select')
                .locator('..')
                .locator('[role=button] span'),
        ).toHaveCount(0);
        await expect(bibliographicTab.getByTestId('rek-native-script-proceedings-title-input')).toHaveValue(
            record.fez_record_search_key_native_script_proceedings_title.rek_native_script_proceedings_title,
        );
        await expect(bibliographicTab.getByTestId('rek-roman-script-proceedings-title-input')).toHaveValue(
            record.fez_record_search_key_roman_script_proceedings_title.rek_roman_script_proceedings_title,
        );
        await expect(bibliographicTab.getByTestId('rek-translated-proceedings-title-input')).toHaveValue(
            record.fez_record_search_key_translated_proceedings_title.rek_translated_proceedings_title,
        );
        await expect(bibliographicTab.getByTestId('rek-journal-name-input')).toHaveValue(
            record.fez_record_search_key_journal_name.rek_journal_name,
        );
        await expect(bibliographicTab.getByTestId('rek-language-of-journal-name-select')).toHaveText('German');
        await expect(
            bibliographicTab
                .getByTestId('rek-language-of-journal-name-select')
                .locator('..')
                .locator('[role=button] span'),
        ).toHaveCount(0);
        await expect(bibliographicTab.getByTestId('rek-native-script-journal-name-input')).toHaveValue(
            record.fez_record_search_key_native_script_journal_name.rek_native_script_journal_name,
        );
        await expect(bibliographicTab.getByTestId('rek-roman-script-journal-name-input')).toHaveValue(
            record.fez_record_search_key_roman_script_journal_name.rek_roman_script_journal_name,
        );
        await expect(bibliographicTab.getByTestId('rek-translated-journal-name-input')).toHaveValue(
            record.fez_record_search_key_translated_journal_name.rek_translated_journal_name,
        );
        await expect(bibliographicTab.getByTestId('rek-series-input')).toHaveValue(
            record.fez_record_search_key_series.rek_series,
        );
        await expect(bibliographicTab.getByTestId('rek-article-number-input')).toHaveValue(
            record.fez_record_search_key_article_number.rek_article_number,
        );

        const errorMessages = [
            'Conference name is required',
            'Conference location is required',
            'Conference dates are required',
        ];

        const selectors = [
            '[data-testid=rek-conference-name-input]',
            '[data-testid=rek-conference-location-input]',
            '[data-testid=rek-conference-dates-input]',
        ];

        for (const [index, selector] of selectors.entries()) {
            await bibliographicTab.locator(selector).clear();
            await expect(page.getByTestId('alert-warning')).toContainText(errorMessages[index]);
        }
    });
});
test.describe('Author affiliations', () => {
    const record = recordList.data[0];

    test.beforeEach(async ({ page }) => {
        await loadRecordForAdminEdit(page, record.rek_pid);
    });

    test('should be available for this work type', async ({ page }) => {
        await assertAffiliationsAllowed(page, {
            authorName: 'Steve Su (uqysu4)',
            orgName: 'The University of Queensland',
            rowId: 4,
            allowed: true,
        });
    });
});
