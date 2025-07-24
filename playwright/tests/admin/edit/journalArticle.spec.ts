import { test, expect } from '../../../test';

import { default as recordList } from 'mock/data/records/publicationTypeListJournalArticle';
import moment from 'moment';
import {
    adminEditCheckDefaultTab,
    adminEditCountCards,
    adminEditNoAlerts,
    adminEditTabbedView,
    adminEditVerifyAlerts,
    loadRecordForAdminEdit,
} from '../helpers';
import { readCKEditor } from '../../../lib/ckeditor';
import { checkPartialDateFromRecordValue } from '../../../lib/helpers';

test.describe('Journal Article admin edit', () => {
    const record = { ...recordList.data[0] };

    test.beforeEach(async ({ page }) => {
        await loadRecordForAdminEdit(page, record.rek_pid);
    });

    test('should load with specified elements', async ({ page }) => {
        await expect(page.locator('h2')).toHaveCount(1);
        await expect(page.locator('h2')).toHaveText(
            `Edit ${record.rek_display_type_lookup} - ${record.rek_title}: ${record.rek_pid}`,
        );
        await expect(page.locator('button[aria-label="Learn about keyboard shortcuts"]')).toBeVisible();
        await adminEditCountCards(page, 8);
        await adminEditNoAlerts(page);
        await adminEditTabbedView(page);
        await adminEditCheckDefaultTab(page, 'Bibliographic');
    });

    test('should render the different sections as expected', async ({ page }) => {
        await page.setViewportSize({ width: 1000, height: 1000 });

        // ---------------------------------------------- NOTES TAB --------------------------------------------------
        // Notes tab
        await expect(page.getByTestId('notes-section-header')).toHaveText('Notes');
        let ckeditorText = await readCKEditor(page, 'rek-notes');
        expect(ckeditorText).toContain(record.fez_record_search_key_notes.rek_notes);
        // 'Published online before print: 28 December 2012.'
        ckeditorText = await readCKEditor(page, 'ain-notes');
        expect(ckeditorText).toContain(record.fez_internal_notes.ain_detail); // 'Not yet indexed in Scopus/ISI 3/5/13'

        // ------------------------------------------- IDENTIFIERS TAB -----------------------------------------------
        // Identifiers tab
        await expect(page.getByTestId('identifiers-section-header')).toHaveText('Identifiers');
        const identifiersSectionContent = page.getByTestId('identifiers-section-content');
        {
            const adminCard0 = identifiersSectionContent.locator('.AdminCard').first();
            await expect(adminCard0.locator('h4')).toHaveText(/Manage identifiers/);
            await expect(adminCard0.getByTestId('rek-doi-input')).toHaveValue(record.fez_record_search_key_doi.rek_doi);
            await expect(adminCard0.getByTestId('rek-isi-loc-input')).toHaveValue(
                record.fez_record_search_key_isi_loc.rek_isi_loc,
            );
            await expect(adminCard0.getByTestId('rek-scopus-id-input')).toHaveValue(
                record.fez_record_search_key_scopus_id.rek_scopus_id,
            );
            await expect(adminCard0.getByTestId('rek-pubmed-id-input')).toHaveValue(
                record.fez_record_search_key_pubmed_id.rek_pubmed_id,
            );
            await expect(adminCard0.getByTestId('rek-pubmed-central-id-input')).toHaveValue(
                record.fez_record_search_key_pubmed_central_id.rek_pubmed_central_id,
            );
            await expect(adminCard0.getByTestId('rek-wok-doc-type-input')).toHaveValue(record.rek_wok_doc_type);
            await expect(adminCard0.getByTestId('rek-wok-doc-type-select')).toHaveText(
                new RegExp(`^${record.rek_wok_doc_type}`),
            );
            await expect(adminCard0.getByTestId('rek-scopus-doc-type-input')).toHaveValue(record.rek_scopus_doc_type);
            await expect(adminCard0.getByTestId('rek-scopus-doc-type-select')).toHaveText(
                new RegExp(`^${record.rek_scopus_doc_type}`),
            );
            await expect(adminCard0.getByTestId('rek-pubmed-doc-type-input')).toHaveValue(record.rek_pubmed_doc_type);
            await expect(adminCard0.getByTestId('rek-pubmed-doc-type-select')).toHaveText(record.rek_pubmed_doc_type);
        }
        {
            const adminCard1 = identifiersSectionContent.locator('.AdminCard').nth(1);
            await expect(adminCard1.locator('h4')).toHaveText(/Manage links/);
            // No content in mock.
        }

        // ------------------------------------------ BIBLIOGRAPHIC TAB ----------------------------------------------
        // Bibliographic tab
        await expect(page.getByTestId('bibliographic-section-header')).toHaveText('Bibliographic');
        const bibliographicSectionContent = page.getByTestId('bibliographic-section-content');
        const bibliographicCards = bibliographicSectionContent.locator('.AdminCard');

        {
            const card = bibliographicCards.first();
            await expect(card.locator('h4')).toHaveText(/Title/);
            await expect(card.locator('span span').first()).toContainText('Formatted title');
            const titleCkEditorText = await readCKEditor(page, 'rek-title');
            expect(titleCkEditorText).toContain(record.rek_title);
        }
        {
            const card = bibliographicCards.nth(1);
            await expect(card.locator('h4')).toHaveText(/Language of work & Journal name/);
            const langCodes = record.fez_record_search_key_language.map(lang => lang.rek_language);
            await expect(card.getByTestId('rek-language-input')).toHaveValue(langCodes.join(','));
            await expect(card.getByTestId('rek-journal-name-input')).toHaveValue(
                record.fez_record_search_key_journal_name.rek_journal_name,
            );
        }
        {
            const card = bibliographicCards.nth(2);
            await expect(card.locator('h4')).toHaveText(/ISBN/);
            // No ISBN in mock
        }
        {
            const card = bibliographicCards.nth(3);
            await expect(card.locator('h4')).toHaveText(/ISSN/);
            const issns = record.fez_record_search_key_issn;
            const ulrichsId = record.fez_record_search_key_issn.map(item => item.fez_ulrichs.ulr_title_id);
            const issnList = card.locator('#rek-issn-list');

            for (const [index, issnItem] of issns.entries()) {
                const issnRow = issnList.locator(`#rek-issn-list-row-${index}`);
                await expect(issnRow).toContainText(issnItem.rek_issn);

                const sherpaLinkLocator = issnRow.locator('#sherparomeo-link');
                await expect(sherpaLinkLocator).toContainText('SHERPA/RoMEO');
                await expect(sherpaLinkLocator).toHaveAttribute('href', issnItem.fez_sherpa_romeo.srm_journal_link);

                const ulrichsLinkLocator = issnRow.locator('#ulrichs-link');
                await expect(ulrichsLinkLocator).toContainText('Ulrichs');
                await expect(ulrichsLinkLocator).toHaveAttribute(
                    'href',
                    'https://resolver.library.uq.edu.au/openathens/redir?qurl=' +
                        encodeURIComponent('https://ulrichsweb.serialssolutions.com/title/') +
                        ulrichsId[index],
                );
            }
        }
        {
            const bibliographicCard = bibliographicCards.nth(4);
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

            // No value for Article number in mock
            await expect(bibliographicCard.getByTestId('rek-start-page-input')).toHaveValue(
                record.fez_record_search_key_start_page.rek_start_page,
            );
            await expect(bibliographicCard.getByTestId('rek-end-page-input')).toHaveValue(
                record.fez_record_search_key_end_page.rek_end_page,
            );
            await expect(bibliographicCard.getByTestId('rek-total-pages-input')).toHaveValue(
                record.fez_record_search_key_total_pages.rek_total_pages,
            );
            await checkPartialDateFromRecordValue(page, 'rek-date', record.rek_date);
            await expect(bibliographicCard.getByTestId('rek-date-available-input')).toHaveValue(
                moment(record.fez_record_search_key_date_available.rek_date_available).format('YYYY'),
            );
            await expect(bibliographicCard.locator('span span').first()).toHaveText('Abstract / Description');
            const descriptionCkEditorText = await readCKEditor(page, 'rek-description');
            expect(descriptionCkEditorText).toContain(record.rek_description);
        }
        {
            const card = bibliographicCards.nth(5);
            await expect(card.locator('h4')).toHaveText(/Keyword\(s\)/);
            const keywords = record.fez_record_search_key_keywords.map(item => item.rek_keywords);
            for (const [index, keyword] of keywords.entries()) {
                await expect(card.locator('p').nth(index)).toHaveText(keyword);
            }
        }
        {
            const card = bibliographicCards.nth(6);
            await expect(card.locator('h4')).toHaveText(/Subject/);
            const subjects = record.fez_record_search_key_subject.map(item => item.rek_subject_lookup);
            for (const [index, subject] of subjects.entries()) {
                await expect(card.locator('p').nth(index)).toHaveText(subject);
            }
        }
        {
            const card = bibliographicCards.nth(7);
            await expect(card.locator('h4')).toHaveText(/Sustainable Development Goal/);
            for (const [index, item] of record.fez_record_search_key_sdg_source.entries()) {
                await expect(card.locator('p').nth(index)).toHaveText(
                    `${item.sdg.cvo_title} - ${item.rek_sdg_source_lookup}`,
                );
            }
        }
        {
            const card = bibliographicCards.nth(8);
            await expect(card.locator('h4')).toHaveText(/Related publications/);
            // No Related publications in mock
        }

        // Journal name required field check
        const journalNameInput = page.getByTestId('rek-journal-name-input');
        await journalNameInput.clear();
        const journalNameHelperText = page.locator('#rek-journal-name-helper-text');
        await expect(journalNameHelperText).toBeVisible();
        await expect(journalNameHelperText).toHaveText('This field is required');

        await adminEditVerifyAlerts(page, 1, ['Journal name is required']);

        await journalNameInput.fill('Test');
        await adminEditNoAlerts(page);

        // ------------------------------------------ AUTHOR DETAILS TAB ---------------------------------------------
        // Author Details tab
        await expect(page.getByTestId('authors-section-header')).toHaveText('Authors');
        const authorsSectionContent = page.getByTestId('authors-section-content');
        {
            const authorsCard = authorsSectionContent.locator('.AdminCard').first();
            await expect(authorsCard.locator('h4')).toHaveText(/Authors/);
            const authors = record.fez_record_search_key_author.map(item => item.rek_author);
            const authorUsernames = record.fez_record_search_key_author_id.map(item => item.author.aut_org_username);
            const authorIDs = record.fez_record_search_key_author_id.map(item => item.rek_author_id);

            for (const [index, author] of authors.entries()) {
                await expect(authorsCard.getByTestId(`rek-author-list-row-${index}-name-as-published`)).toContainText(
                    author,
                );
                await expect(authorsCard.getByTestId(`rek-author-list-row-${index}-uq-identifiers`)).toContainText(
                    `${authorUsernames[index]} - ${authorIDs[index]}`,
                );
            }
        }

        // -------------------------------------- ADMIN TAB -----------------------------------------
        // Admin tab
        const collections = record.fez_record_search_key_ismemberof.map(item => item.rek_ismemberof_lookup);

        await expect(page.getByTestId('admin-section-header')).toHaveText('Admin');
        const adminSectionContent = page.getByTestId('admin-section-content');
        const adminCards = adminSectionContent.locator('.AdminCard');
        const collectionsCard = adminCards.first();

        {
            await expect(collectionsCard.locator('h4')).toHaveText(/Member of collection/);
            await expect(collectionsCard.locator('#rek-ismemberof-label')).toHaveText(/Member of collection/);
            await expect(collectionsCard.locator('[class*="MuiAutocomplete-tag"]').first()).toHaveText(
                'School of Nursing, Midwifery and Social Work Publications',
            );
            await expect(collectionsCard.locator('[class*="MuiAutocomplete-tag"]').nth(1)).toHaveText(
                'Official 2013 Collection',
            );
        }
        {
            const card = adminCards.nth(1);
            await expect(card.locator('h4')).toHaveText(/Additional information/);
            await expect(card.getByTestId('rek-subtype-input')).toHaveValue(record.rek_subtype);
            await expect(card.getByTestId('rek-subtype-select')).toHaveText(record.rek_subtype);
            await expect(card.getByTestId('rek-herdc-code-input')).toHaveValue(
                record.fez_record_search_key_herdc_code.rek_herdc_code.toString(),
            );
            await expect(card.getByTestId('rek-herdc-code-select')).toHaveText(
                new RegExp(`^${record.fez_record_search_key_herdc_code.rek_herdc_code_lookup}`),
            );
            await expect(card.getByTestId('rek-herdc-status-input')).toHaveValue(
                record.fez_record_search_key_herdc_status.rek_herdc_status.toString(),
            );
            await expect(card.getByTestId('rek-herdc-status-select')).toHaveText(
                record.fez_record_search_key_herdc_status.rek_herdc_status_lookup,
            );
            await expect(card.getByTestId('rek-institutional-status-input')).toHaveValue(
                record.fez_record_search_key_institutional_status.rek_institutional_status.toString(),
            );
            await expect(card.getByTestId('rek-institutional-status-select')).toHaveText(
                record.fez_record_search_key_institutional_status.rek_institutional_status_lookup,
            );
            await expect(card.getByTestId('rek-oa-status-input')).toHaveValue(
                record.fez_record_search_key_oa_status.rek_oa_status.toString(),
            );
            await expect(card.getByTestId('rek-oa-status-select')).toHaveText(
                record.fez_record_search_key_oa_status.rek_oa_status_lookup,
            );
            await expect(card.getByTestId('rek-oa-status-type-input')).toHaveValue(
                record.fez_record_search_key_oa_status_type.rek_oa_status_type.toString(),
            );
            await expect(card.getByTestId('rek-oa-status-type-select')).toHaveText(
                record.fez_record_search_key_oa_status_type.rek_oa_status_type_lookup,
            );
            // No content indicators selected in mock
            // No licence selected in mock
        }

        // Collection removal check
        for (const _ of collections) {
            await collectionsCard
                .locator('[class*="MuiChip-deleteIcon"]')
                .first()
                .click();
        }
        await expect(collectionsCard.locator('#rek-ismemberof-helper-text')).toBeVisible();
        await expect(collectionsCard.locator('#rek-ismemberof-helper-text')).toHaveText('This field is required');
        await adminEditVerifyAlerts(page, 1, ['You must select at least one collection']);

        // ----------------------------------------- GRANT INFORMATION TAB -------------------------------------------
        // Grant Information tab
        await expect(page.getByTestId('grants-section-header')).toHaveText('Grants');
        const grantsSectionContent = page.getByTestId('grants-section-content');
        {
            const card = grantsSectionContent.locator('.AdminCard').first();
            await expect(card.locator('h4')).toHaveText(/Grant information/);
            // No grant information in mock
        }

        // ---------------------------------------------- SECURITY TAB -----------------------------------------------
        // Security tab
        await expect(page.getByTestId('security-section-header')).toHaveText('Security');
        await expect(page.getByTestId('record-security-card-header')).toHaveText(
            `Work level security - ${record.rek_pid}`,
        );
        const securityCardContent = page.getByTestId('record-security-card-content');
        await expect(securityCardContent.locator('h6').first()).toHaveText('Inherited security policy details');
        for (const [index, collection] of record.fez_record_search_key_ismemberof.entries()) {
            await expect(securityCardContent.locator('h6').nth(2 * index + 1)).toHaveText(collection.rek_ismemberof);
            await expect(securityCardContent.locator('h6').nth(2 * index + 2)).toHaveText(
                collection.rek_ismemberof_lookup,
            );
            await expect(securityCardContent.locator('p').nth(index)).toHaveText(
                `Public (${collection.parent.rek_security_policy})`,
            );
        }
        if (record.rek_security_inherited) {
            await expect(securityCardContent.locator('input')).not.toBeChecked();
        }
    });
});

test.describe('Files tab functionality', () => {
    // This describe block is separate as it loads a different record.
    test.beforeEach(async ({ page }) => {
        // Use a different record for this test as per original journalArticle.spec.js
        const filesTabRecord = recordList.data[1];
        await loadRecordForAdminEdit(page, filesTabRecord.rek_pid);
    });

    test('should render the files tab as expected', async ({ page }) => {
        // ---------------------------------------------- FILES TAB --------------------------------------------------
        const filesTabRecord = recordList.data[1]; // Redundant, already set in beforeEach
        // Files Tab
        await expect(page.getByTestId('files-section-header')).toHaveText('Files');
        const filesSectionContent = page.getByTestId('files-section-content');
        const fileSizeInMB = Math.round((filesTabRecord.fez_datastream_info[1].dsi_size / 1024 / 1024) * 100) / 100;
        await expect(filesSectionContent.locator('h4').first()).toHaveText('Attached files');
        await expect(filesSectionContent.locator('p').first()).toHaveText(
            'There may be a delay before newly uploaded or renamed files appear on the record.',
        );
        await expect(filesSectionContent.locator('p').nth(2)).toHaveText(
            filesTabRecord.fez_datastream_info[1].dsi_dsid,
        );
        await expect(filesSectionContent.locator('input').first()).toHaveValue(
            filesTabRecord.fez_datastream_info[1].dsi_label,
        );
        await expect(filesSectionContent.locator('p').nth(3)).toHaveText(`${fileSizeInMB} MB`);
        await expect(filesSectionContent.locator('input').nth(1)).toHaveValue(
            moment(filesTabRecord.fez_datastream_info[1].dsi_embargo_date).format('DD/MM/YYYY'),
        );

        await expect(filesSectionContent.locator('h4', { hasText: /Advisory statement/ }).first()).toBeVisible();
        await expect(filesSectionContent.locator('h4', { hasText: /Copyright agreement/ }).first()).toBeVisible();
        const copyrightCheckbox = filesSectionContent.getByTestId('rek-copyright-input');
        if (filesTabRecord.rek_copyright === 'on') {
            await expect(copyrightCheckbox).toBeChecked();
        } else {
            await expect(copyrightCheckbox).not.toBeChecked(); // Assuming if not 'on', it's not checked
        }
    });
});
