import { test, expect } from '../../../test';

import { default as recordList } from 'mock/data/records/publicationTypeListBookChapter';
import {
    loadRecordForAdminEdit,
    adminEditCountCards,
    adminEditNoAlerts,
    adminEditTabbedView,
    adminEditCheckDefaultTab,
    assertAffiliationsAllowed,
} from '../helpers';

test.describe('Book Chapter admin edit', () => {
    const record = { ...recordList.data[0] };

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
        // Bibliographic tab
        const bibliographicTab = page.getByTestId('bibliographic-section-content');
        await expect(bibliographicTab).toBeVisible(); // Ensure the tab content is visible

        // All assertions within the bibliographicTab scope
        await expect(bibliographicTab.getByTestId('rek-chapter-number-input')).toHaveValue(
            record.fez_record_search_key_chapter_number.rek_chapter_number,
        );
        // Using toContainText for partial match on label text
        await expect(bibliographicTab.locator('label').getByText('Book title *')).toBeVisible();
        await expect(bibliographicTab.getByTestId('rek-book-title-input')).toHaveValue(
            record.fez_record_search_key_book_title.rek_book_title,
        );

        await expect(bibliographicTab.getByTestId('rek-language-of-book-title-select')).toHaveText('Japanese');
        const languageSelect = bibliographicTab.getByTestId('rek-language-of-book-title-select');
        // This targets the sibling span of the button that is a sibling of the select's parent
        // Adjust the selector if the HTML structure is different, this is a common workaround for siblings.
        await expect(languageSelect.locator('xpath=./following-sibling::*[@role="button"]/span')).toHaveCount(0);

        await expect(bibliographicTab.getByTestId('rek-native-script-book-title-input')).toHaveValue(
            record.fez_record_search_key_native_script_book_title.rek_native_script_book_title,
        );
        await expect(bibliographicTab.getByTestId('rek-roman-script-book-title-input')).toHaveValue(
            record.fez_record_search_key_roman_script_book_title.rek_roman_script_book_title,
        );
        await expect(bibliographicTab.getByTestId('rek-translated-book-title-input')).toHaveValue(
            record.fez_record_search_key_translated_book_title.rek_translated_book_title,
        );

        // ISBN section within bibliographicTab
        await expect(bibliographicTab.locator('h4').getByText(/ISBN/)).toBeVisible();
        const isbns = record.fez_record_search_key_isbn.map(item => item.rek_isbn);
        for (const [index, isbn] of isbns.entries()) {
            // Use for...of for sequential async operations
            await expect(bibliographicTab.locator(`[data-testid="rek-isbn-list-row-${index}"] p`)).toHaveText(isbn);
        }

        // ------------------------------------------ AUTHOR DETAILS TAB ---------------------------------------------
        // Author Details tab
        const authorDetailsTab = page.getByTestId('authors-section-content');
        await expect(authorDetailsTab).toBeVisible(); // Ensure the tab content is visible

        await expect(authorDetailsTab.locator('h4').getByText(/Editors/)).toBeVisible();
        const editors = record.fez_record_search_key_contributor.map(item => item.rek_contributor);
        for (const [index, editor] of editors.entries()) {
            // Use for...of for sequential async operations
            await expect(
                authorDetailsTab.getByTestId(`rek-contributor-list-row-${index}-name-as-published`),
            ).toHaveText(editor);
        }
    });
});

test.describe('Author affiliations', () => {
    const record = { ...recordList.data[0] };

    test.beforeEach(async ({ page }) => {
        await loadRecordForAdminEdit(page, record.rek_pid);
    });

    test('should be available for this work type', async ({ page }) => {
        // Corrected assertAffiliationsAllowed call
        // Assuming assertAffiliationsAllowed expects individual arguments, not a string concatenation for authorName
        await assertAffiliationsAllowed(page, {
            authorName: 'Steve Su (uqysu4)', // Pass as a string directly
            orgName: 'The University of Queensland',
            rowId: 2,
            allowed: true,
        });
    });
});
