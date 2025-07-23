import { test, expect } from '../../../test';

import { default as recordList } from 'mock/data/records/publicationTypeListThesis';
import {
    adminEditCheckDefaultTab,
    adminEditCountCards,
    adminEditNoAlerts,
    adminEditTabbedView,
    assertAffiliationsAllowed,
    loadRecordForAdminEdit,
} from '../helpers';
import { readCKEditor } from '../../../lib/ckeditor';
import { checkPartialDateFromRecordValue } from '../../../lib/helpers';

test.describe('Thesis admin edit', () => {
    const record = recordList.data[0];

    test.beforeEach(async ({ page }) => {
        await loadRecordForAdminEdit(page, record.rek_pid);
    });

    test('should load the nav bar', async ({ page }) => {
        await adminEditCountCards(page, 7);
        await adminEditNoAlerts(page);
        await adminEditTabbedView(page);
        await adminEditCheckDefaultTab(page, 'Bibliographic');
    });

    test('should render the different sections as expected', async ({ page }) => {
        // ------------------------------------------ BIBLIOGRAPHIC TAB ----------------------------------------------
        console.log('----------------Bibliographic tab----------------');
        await expect(page.getByTestId('bibliographic-section-header')).toHaveText('Bibliographic');
        const bibliographicSectionContent = page.getByTestId('bibliographic-section-content');
        const bibliographicAdminCards = bibliographicSectionContent.locator('.AdminCard');

        // Card 0: Title
        const titleCard = bibliographicAdminCards.nth(0);
        await expect(titleCard.locator('h4')).toHaveText(/Title/);
        await expect(titleCard.locator('span span').first()).toContainText('Formatted title');
        // Assuming readCKEditor is a helper function that returns the text content of the CKEditor
        expect(await readCKEditor(page, 'rek-title')).toContain(record.rek_title);

        // Card 1: Language of work
        const languageCard = bibliographicAdminCards.nth(1);
        await expect(languageCard.locator('h4')).toHaveText(/Language of work/);
        const langCodes = record.fez_record_search_key_language.map(lang => lang.rek_language);
        await expect(languageCard.getByTestId('rek-language-input')).toHaveValue(langCodes.join(','));

        // Card 2: Bibliographic details
        const bibliographicDetailsCard = bibliographicAdminCards.nth(2);
        await expect(bibliographicDetailsCard.locator('h4')).toHaveText(/Bibliographic/);
        await expect(bibliographicDetailsCard.getByTestId('rek-total-pages-input')).toHaveValue(
            record.fez_record_search_key_total_pages.rek_total_pages,
        );
        // Assuming checkPartialDateFromRecordValue is a helper function
        await checkPartialDateFromRecordValue(page, 'rek-date', record.rek_date);
        await expect(bibliographicDetailsCard.locator('span span').first()).toHaveText('Abstract / Description');
        await expect(bibliographicDetailsCard.getByTestId('rek-genre-type-input')).toHaveValue(record.rek_genre_type);
        await expect(bibliographicDetailsCard.getByTestId('rek-genre-type-select')).toHaveText(record.rek_genre_type);
        await expect(bibliographicDetailsCard.getByTestId('rek-org-name-input')).toHaveValue(
            record.fez_record_search_key_org_name.rek_org_name,
        );
        await expect(bibliographicDetailsCard.getByTestId('rek-org-unit-name-input')).toHaveValue(
            record.fez_record_search_key_org_unit_name.rek_org_unit_name,
        );

        // Card 3: Keyword(s)
        const keywordsCard = bibliographicAdminCards.nth(3);
        await expect(keywordsCard.locator('h4')).toHaveText(/Keyword\(s\)/);
        const keywords = record.fez_record_search_key_keywords.map(item => item.rek_keywords);
        await Promise.all(
            keywords.map(async (keyword, index) => {
                await expect(keywordsCard.locator('p').nth(index)).toHaveText(keyword);
            }),
        );

        // Card 4: Subject
        const subjectCard = bibliographicAdminCards.nth(4);
        await expect(subjectCard.locator('h4')).toHaveText(/Subject/);
        const subjects = record.fez_record_search_key_subject.map(item => item.rek_subject_lookup);
        await Promise.all(
            subjects.map(async (subject, index) => {
                await expect(subjectCard.locator('p').nth(index)).toHaveText(subject);
            }),
        );

        // Card 6: Related publications
        const relatedPublicationsCard = bibliographicAdminCards.nth(6);
        await expect(relatedPublicationsCard.locator('h4')).toHaveText(/Related publications/);
        const relatedPubs = record.fez_record_search_key_isderivationof.map(item => item.rek_isderivationof_lookup);
        await Promise.all(
            relatedPubs.map(async (pub, index) => {
                await expect(relatedPublicationsCard.locator('p').nth(index)).toHaveText(pub);
            }),
        );

        // ------------------------------------------ AUTHOR DETAILS TAB ---------------------------------------------
        console.log('----------------Author Details tab----------------');
        await expect(page.getByTestId('authors-section-header')).toHaveText('Authors');
        const authorsSectionContent = page.getByTestId('authors-section-content');

        // Author list
        const authorList = authorsSectionContent.getByTestId('rek-author-list');
        const authors = record.fez_record_search_key_author.map(item => item.rek_author);
        await Promise.all(
            authors.map(async (person, index) => {
                await expect(authorList.getByTestId(`rek-author-list-row-${index}-name-as-published`)).toHaveText(
                    person,
                );
            }),
        );

        // Supervisor list
        const supervisorList = authorsSectionContent.getByTestId('rek-supervisor-list');
        const supervisors = record.fez_record_search_key_supervisor.map(item => item.rek_supervisor);
        await Promise.all(
            supervisors.map(async (person, index) => {
                await expect(
                    supervisorList.getByTestId(`rek-supervisor-list-row-${index}-name-as-published`),
                ).toHaveText(person);
            }),
        );

        // ----------------------------------------------- ADMIN TAB -------------------------------------------------
        console.log('----------------Admin tab----------------');
        await expect(page.getByTestId('admin-section-header')).toHaveText('Admin');
        const adminSectionContent = page.getByTestId('admin-section-content');
        const adminAdminCards = adminSectionContent.locator('.AdminCard');

        // Card 0: Member of collection
        const memberOfCollectionCard = adminAdminCards.nth(0);
        await expect(memberOfCollectionCard.locator('h4')).toHaveText(/Member of collection/);
        await expect(memberOfCollectionCard.locator('#rek-ismemberof-label')).toHaveText(/Member of collection/);
        await expect(memberOfCollectionCard.locator('[class*="MuiAutocomplete-tag"]').first()).toHaveText(
            'UQ Theses (HDR) - Open Access',
        );
        await expect(memberOfCollectionCard.locator('[class*="MuiAutocomplete-tag"]').nth(1)).toHaveText(
            'UQ Theses (HDR) - Official',
        );

        // Card 1: Additional information
        const additionalInfoCard = adminAdminCards.nth(1);
        await expect(additionalInfoCard.locator('h4')).toHaveText(/Additional information/);
        await expect(additionalInfoCard.getByTestId('rek-oa-status-input')).toHaveValue(
            record.fez_record_search_key_oa_status.rek_oa_status.toString(),
        );
        await expect(additionalInfoCard.getByTestId('rek-oa-status-select')).toHaveText(
            record.fez_record_search_key_oa_status.rek_oa_status_lookup,
        );
        await expect(additionalInfoCard.getByTestId('rek-license-input')).toHaveValue(
            record.fez_record_search_key_license.rek_license.toString(),
        );
        const licenseInput = additionalInfoCard.getByTestId('rek-license-input');
        const licenseInputParent = licenseInput.locator('xpath=..'); // Get parent
        const licenseCombobox = licenseInputParent.getByRole('combobox'); // Find combobox within parent
        await expect(licenseCombobox).toHaveText(record.fez_record_search_key_license.rek_license_lookup);

        // ----------------------------------------------- NOTES TAB -------------------------------------------------
        console.log('----------------Notes tab----------------');
        await expect(page.getByTestId('notes-section-header')).toHaveText('Notes');
        const notesSectionContent = page.getByTestId('notes-section-content');
        const notesAdminCards = notesSectionContent.locator('.AdminCard');

        // Card 0: Additional notes
        const additionalNotesCard = notesAdminCards.nth(0);
        await expect(additionalNotesCard.locator('span span').first()).toHaveText('Additional notes (public)');
        // Assuming readCKEditor is a helper function that returns the text content of the CKEditor
        const rekNotesText = await readCKEditor(page, 'rek-notes');
        await expect(rekNotesText).toContain(record.fez_record_search_key_notes.rek_notes);

        // ---------------------------------------------- FILES TAB --------------------------------------------------
        console.log('----------------Files tab----------------');
        await expect(page.getByTestId('files-section-header')).toHaveText('Files');
        const filesSectionContent = page.getByTestId('files-section-content');
        const filesAdminCards = filesSectionContent.locator('.AdminCard');

        // Card 0: Files
        const filesCard = filesAdminCards.nth(0);
        await expect(filesCard.locator('h4')).toHaveText(/Files/);
        // No visible files in mock - no Playwright assertion needed here

        // Card 1: Advisory statement
        const advisoryStatementCard = filesAdminCards.nth(1);
        await expect(advisoryStatementCard.locator('h4')).toHaveText(/Advisory statement/);

        // Copyright agreement (this h4 is a direct child of filesSectionContent, not within a card)
        await expect(filesSectionContent.locator('h4').filter({ hasText: 'Copyright agreement' })).toBeVisible(); // Changed to filter for clarity
        const copyrightCheckbox = filesSectionContent.getByTestId('rek-copyright-input');
        if (record.rek_copyright === 'on') {
            await expect(copyrightCheckbox).toBeChecked();
        } else {
            await expect(copyrightCheckbox).not.toBeChecked();
        }

        // --------------------------------------------- SECURITY TAB ------------------------------------------------
        console.log('----------------Security tab----------------');
        await expect(page.getByTestId('security-section-header')).toHaveText('Security');
        const securitySectionContent = page.getByTestId('security-section-content');

        // Work level security
        const workLevelSecurityCard = securitySectionContent.locator('div:nth-child(1) > .StandardCard');
        await expect(workLevelSecurityCard.locator('h4')).toHaveText(`Work level security - ${record.rek_pid}`);
        await expect(workLevelSecurityCard.locator('h6').first()).toHaveText('Inherited security policy details');
        await Promise.all(
            record.fez_record_search_key_ismemberof.map(async (collection, index) => {
                await expect(workLevelSecurityCard.locator('h6').nth(2 * index + 1)).toHaveText(
                    collection.rek_ismemberof,
                );
                await expect(workLevelSecurityCard.locator('h6').nth(2 * index + 2)).toHaveText(
                    collection.rek_ismemberof_lookup,
                );
                await expect(workLevelSecurityCard.locator('p').nth(index)).toHaveText(
                    `Public (${collection.parent.rek_security_policy})`,
                );
            }),
        );
        if (record.rek_security_inherited) {
            // Find label containing text, then find the input associated with it
            await expect(
                workLevelSecurityCard
                    .locator('label', { hasText: 'Override inherited security (detailed below)' })
                    .locator('input'),
            ).not.toBeChecked();
        }

        await page.setViewportSize({ width: 1024, height: 2000 });
        // Datastream level security
        const datastreamLevelSecurityCard = securitySectionContent.locator('div:nth-child(2) > .StandardCard');
        await expect(datastreamLevelSecurityCard.locator('h4')).toHaveText(
            `Datastream level security - ${record.rek_pid}`,
        );
        await expect(datastreamLevelSecurityCard.locator('h6').first()).toHaveText(
            'Inherited datastream security policy details',
        );
        await expect(datastreamLevelSecurityCard.locator('h6').nth(5)).toHaveText(
            'Override datastream security policy details',
        );
        await expect(datastreamLevelSecurityCard.locator('a')).toHaveCount(9); // only non-derivatives are displayed
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
