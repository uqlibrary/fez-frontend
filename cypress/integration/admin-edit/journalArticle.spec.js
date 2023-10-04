import { default as recordList } from '../../../src/mock/data/records/publicationTypeListJournalArticle';
import moment from 'moment';

context('Journal Article admin edit', () => {
    const record = recordList.data[0];

    it('should load with specified elements', () => {
        cy.loadRecordForAdminEdit(record.rek_pid);
        cy.get('h2')
            .should('have.length', 1)
            .should('have.text', `Edit ${record.rek_display_type_lookup} - ${record.rek_title}: ${record.rek_pid}`);

        cy.get('button[aria-label="Learn about keyboard shortcuts"]').should('exist');

        cy.adminEditCountCards(8);
        cy.adminEditNoAlerts();

        cy.adminEditTabbedView();
        cy.adminEditCheckDefaultTab('Bibliographic');
        cy.adminEditCleanup();
    });

    it('should render the different sections as expected', () => {
        cy.loadRecordForAdminEdit(record.rek_pid);
        cy.viewport(1000, 1000);

        // ---------------------------------------------- NOTES TAB --------------------------------------------------
        cy.log('Notes tab');
        cy.get('[data-testid=notes-section-header]').should('have.text', 'Notes');
        cy.get('[data-testid=notes-section-content]').within(() => {
            cy.get('#cke_rek-notes-editor').should('exist');
            cy.get('#cke_ain-notes-editor').should('exist');
        });

        cy.readCKEditor('ain-notes').should(text => {
            expect(text).to.contain(record.fez_internal_notes.ain_detail); // 'Not yet indexed in Scopus/ISI 3/5/13
        });

        // ------------------------------------------- IDENTIFIERS TAB -----------------------------------------------
        cy.log('Identifiers tab');
        cy.get('[data-testid=identifiers-section-header]').should('have.text', 'Identifiers');
        cy.get('[data-testid=identifiers-section-content]')
            .as('indentifiesTab')
            .within(() => {
                cy.get('.AdminCard')
                    .eq(0)
                    .within(() => {
                        cy.get('h4').should('contain', 'Manage identifiers');
                        cy.get('[data-testid=rek-doi-input]').should(
                            'have.value',
                            record.fez_record_search_key_doi.rek_doi,
                        );
                        cy.get('[data-testid=rek-isi-loc-input]').should(
                            'have.value',
                            record.fez_record_search_key_isi_loc.rek_isi_loc,
                        );
                        cy.get('[data-testid=rek-scopus-id-input]').should(
                            'have.value',
                            record.fez_record_search_key_scopus_id.rek_scopus_id,
                        );
                        cy.get('[data-testid=rek-pubmed-id-input]').should(
                            'have.value',
                            record.fez_record_search_key_pubmed_id.rek_pubmed_id,
                        );
                        cy.get('[data-testid=rek-pubmed-central-id-input]').should(
                            'have.value',
                            record.fez_record_search_key_pubmed_central_id.rek_pubmed_central_id,
                        );
                        cy.get('[data-testid=rek-wok-doc-type-input]')
                            .should('have.value', record.rek_wok_doc_type)
                            .get('[data-testid=rek-wok-doc-type-select]')
                            .invoke('text')
                            .should('match', new RegExp(`^${record.rek_wok_doc_type}`));
                        cy.get('[data-testid=rek-scopus-doc-type-input]')
                            .should('have.value', record.rek_scopus_doc_type)
                            .get('[data-testid=rek-scopus-doc-type-select]')
                            .invoke('text')
                            .should('match', new RegExp(`^${record.rek_scopus_doc_type}`));
                        cy.get('[data-testid=rek-pubmed-doc-type-input]')
                            .should('have.value', record.rek_pubmed_doc_type)
                            .get('[data-testid=rek-pubmed-doc-type-select]')
                            .should('have.text', record.rek_pubmed_doc_type);
                    });

                cy.get('.AdminCard')
                    .eq(1)
                    .within(() => {
                        cy.get('h4').should('contain', 'Manage links');
                        // No content in mock.
                    });
            });

        // ------------------------------------------ BIBLIOGRAPHIC TAB ----------------------------------------------
        cy.log('Bibliographic tab');
        cy.get('[data-testid=bibliographic-section-header]').should('have.text', 'Bibliographic');
        cy.get('[data-testid=bibliographic-section-content]')
            .as('bibliographicTab')
            .within(() => {
                cy.get('.AdminCard')
                    .as('cards')
                    .eq(0)
                    .within(() => {
                        cy.get('h4').should('contain', 'Title');
                        cy.get('span span')
                            .eq(0)
                            .should('contain.text', 'Formatted title');
                        cy.get('#cke_rek-title-editor').should('exist');
                        cy.readCKEditor('rek-title').should(text => {
                            expect(text).to.contain(record.rek_title);
                        });
                    });

                cy.get('@cards')
                    .eq(1)
                    .within(() => {
                        cy.get('h4').should('contain', 'Language of work & Journal name');
                        const langCodes = record.fez_record_search_key_language.map(lang => lang.rek_language);
                        cy.get('[data-testid=rek-language-input]').should('have.value', langCodes.join(','));

                        cy.get('[data-testid=rek-journal-name-input]').should(
                            'have.value',
                            record.fez_record_search_key_journal_name.rek_journal_name,
                        );
                    });

                cy.get('@cards')
                    .eq(2)
                    .within(() => {
                        cy.get('h4').should('contain', 'ISBN');

                        // No ISBN in mock
                    });

                cy.get('@cards')
                    .eq(3)
                    .within(() => {
                        cy.get('h4').should('contain', 'ISSN');
                        const issns = record.fez_record_search_key_issn;
                        const ulrichsId = record.fez_record_search_key_issn.map(item => item.fez_ulrichs.ulr_title_id);

                        cy.get('#rek-issn-list').within(() => {
                            issns.forEach((issn, index) => {
                                cy.get(`#rek-issn-list-row-${index}`).should('contain.text', issn.rek_issn);
                                cy.get(`#rek-issn-list-row-${index}`).within(() => {
                                    cy.get('#sherparomeo-link')
                                        .should('contain.text', 'SHERPA/RoMEO')
                                        .should('have.attr', 'href', issn.fez_sherpa_romeo.srm_journal_link);
                                });
                                cy.get(`#rek-issn-list-row-${index}`).within(() => {
                                    cy.get('#ulrichs-link')
                                        .should('contain.text', 'Ulrichs')
                                        .should(
                                            'have.attr',
                                            'href',
                                            'https://go.openathens.net/redirector/uq.edu.au?url=' +
                                                encodeURIComponent('https://ulrichsweb.serialssolutions.com/title/') +
                                                ulrichsId[index],
                                        );
                                });
                            });
                        });
                    });

                cy.get('@cards')
                    .eq(4)
                    .as('bibliographicCard')
                    .within(() => {
                        cy.get('h4').should('contain', 'Bibliographic');
                        cy.get('[data-testid=rek-place-of-publication-input]').should(
                            'have.value',
                            record.fez_record_search_key_place_of_publication.rek_place_of_publication,
                        );
                        cy.get('[data-testid=rek-publisher-input]').should(
                            'have.value',
                            record.fez_record_search_key_publisher.rek_publisher,
                        );
                        cy.get('[data-testid=rek-volume-number-input]').should(
                            'have.value',
                            record.fez_record_search_key_volume_number.rek_volume_number,
                        );
                        cy.get('[data-testid=rek-issue-number-input]').should(
                            'have.value',
                            record.fez_record_search_key_issue_number.rek_issue_number,
                        );
                        // No value for Article number in mock
                        cy.get('[data-testid=rek-start-page-input]').should(
                            'have.value',
                            record.fez_record_search_key_start_page.rek_start_page,
                        );
                        cy.get('[data-testid=rek-end-page-input]').should(
                            'have.value',
                            record.fez_record_search_key_end_page.rek_end_page,
                        );
                        cy.get('[data-testid=rek-total-pages-input]').should(
                            'have.value',
                            record.fez_record_search_key_total_pages.rek_total_pages,
                        );
                        cy.checkPartialDateFromRecordValue('rek-date', record.rek_date);
                        cy.get('[data-testid=rek-date-available-input]').should(
                            'have.value',
                            moment(record.fez_record_search_key_date_available.rek_date_available).format('YYYY'),
                        );
                        cy.get('span span')
                            .eq(0)
                            .should('have.text', 'Abstract / Description');
                        cy.get('#cke_rek-description-editor').should('exist');
                        cy.readCKEditor('rek-description').should(text => {
                            expect(text).to.contain(record.rek_description);
                        });
                    });

                cy.get('@cards')
                    .eq(5)
                    .within(() => {
                        cy.get('h4').should('contain', 'Keyword(s)');
                        const keywords = record.fez_record_search_key_keywords.map(item => item.rek_keywords);
                        keywords.forEach((keyword, index) => {
                            cy.get('p')
                                .eq(index)
                                .should('have.text', keyword);
                        });
                    });

                cy.get('@cards')
                    .eq(6)
                    .within(() => {
                        cy.get('h4').should('contain', 'Subject');
                        const subjects = record.fez_record_search_key_subject.map(item => item.rek_subject_lookup);
                        subjects.forEach((subject, index) => {
                            cy.get('p')
                                .eq(index)
                                .should('have.text', subject);
                        });
                    });

                cy.get('@cards')
                    .eq(7)
                    .within(() => {
                        cy.get('h4').should('contain', 'Related publications');
                        // No Related publications in mock
                    });
            });

        cy.get('[data-testid=rek-journal-name-input]')
            .clear()
            .parent()
            .siblings('p')
            .should('have.id', 'rek-journal-name-helper-text')
            .should('have.text', 'This field is required');

        cy.adminEditVerifyAlerts(1, ['Journal name is required']);

        cy.get('[data-testid=rek-journal-name-input]').type('Test');

        cy.adminEditNoAlerts();

        // ------------------------------------------ AUTHOR DETAILS TAB ---------------------------------------------
        cy.log('Author Details tab');
        cy.get('[data-testid=authors-section-header]').should('have.text', 'Authors');
        cy.get('[data-testid=authors-section-content]').within(() => {
            cy.get('.AdminCard')
                .eq(0)
                .as('authorsCard')
                .within(() => {
                    cy.get('h4').should('contain', 'Authors');
                    const authors = record.fez_record_search_key_author.map(item => item.rek_author);
                    const authorUsernames = record.fez_record_search_key_author_id.map(
                        item => item.author.aut_org_username,
                    );
                    // eslint-disable-next-line max-len
                    // const authorNames = record.fez_record_search_key_author_id.map(item => item.rek_author_id_lookup);
                    const authorIDs = record.fez_record_search_key_author_id.map(item => item.rek_author_id);
                    // const authorAffs = record.fez_record_search_key_author_affiliation_name.map(
                    //     item => item.rek_author_affiliation_name,
                    // );
                    authors.forEach((author, index) => {
                        cy.get(`[data-testid=rek-author-list-row-${index}-name-as-published]`).should(
                            'contain.text',
                            author,
                        );
                        cy.get(`[data-testid=rek-author-list-row-${index}-uq-identifiers]`).should(
                            'contain.text',
                            `${authorUsernames[index]} - ${authorIDs[index]}`,
                        );
                    });
                });
        });

        // cy.get('@authorsCard')
        //     .find('button[aria-label="Remove all items"]')
        //     .click();
        // cy.get('body > div[role=presentation]')
        //     .contains('Yes')
        //     .click();
        // cy.get('@authorsCard')
        //     .find('span[class*="colorError-"]')
        //     .should('have.length', 1)
        //     .should('have.text', 'Author/creator names are required');

        // cy.adminEditVerifyAlerts(1, ['Author/creator names are required']);

        // -------------------------------------- ADMIN TAB -----------------------------------------
        cy.log('Admin tab');
        const collections = record.fez_record_search_key_ismemberof.map(item => item.rek_ismemberof_lookup);

        cy.get('[data-testid=admin-section-header]').should('have.text', 'Admin');
        cy.get('[data-testid=admin-section-content]').within(() => {
            cy.get('.AdminCard')
                .as('cards')
                .eq(0)
                .as('collectionsCard')
                .within(() => {
                    cy.get('h4').should('contain', 'Member of collection');
                    cy.get('#rek-ismemberof-label').should('contain', 'Member of collection');
                    cy.get('[class*="MuiAutocomplete-tag"]')
                        .eq(0)
                        .should('have.text', 'School of Nursing, Midwifery and Social Work Publications');
                    cy.get('[class*="MuiAutocomplete-tag"]')
                        .eq(1)
                        .should('have.text', 'Official 2013 Collection');
                });

            cy.get('@cards')
                .eq(1)
                .within(() => {
                    cy.get('h4').should('contain', 'Additional information');
                    cy.get('[data-testid=rek-subtype-input]')
                        .should('have.value', record.rek_subtype)
                        .get('[data-testid=rek-subtype-select]')
                        .should('have.text', record.rek_subtype);
                    cy.get('[data-testid=rek-herdc-code-input]')
                        .should('have.value', record.fez_record_search_key_herdc_code.rek_herdc_code.toString())
                        .get('[data-testid=rek-herdc-code-select]')
                        .invoke('text')
                        .should(
                            'match',
                            new RegExp(`^${record.fez_record_search_key_herdc_code.rek_herdc_code_lookup}`),
                        );
                    cy.get('[data-testid=rek-herdc-status-input]')
                        .should('have.value', record.fez_record_search_key_herdc_status.rek_herdc_status.toString())
                        .get('[data-testid=rek-herdc-status-select]')
                        .should('have.text', record.fez_record_search_key_herdc_status.rek_herdc_status_lookup);
                    cy.get('[data-testid=rek-institutional-status-input]')
                        .should(
                            'have.value',
                            record.fez_record_search_key_institutional_status.rek_institutional_status.toString(),
                        )
                        .get('[data-testid=rek-institutional-status-select]')
                        .should(
                            'have.text',
                            record.fez_record_search_key_institutional_status.rek_institutional_status_lookup,
                        );
                    cy.get('[data-testid=rek-oa-status-input]')
                        .should('have.value', record.fez_record_search_key_oa_status.rek_oa_status.toString())
                        .get('[data-testid=rek-oa-status-select]')
                        .should('have.text', record.fez_record_search_key_oa_status.rek_oa_status_lookup);
                    cy.get('[data-testid=rek-oa-status-type-input]')
                        .should('have.value', record.fez_record_search_key_oa_status_type.rek_oa_status_type.toString())
                        .get('[data-testid=rek-oa-status-type-select]')
                        .should('have.text', record.fez_record_search_key_oa_status_type.rek_oa_status_type_lookup);
                    // No content indicators selected in mock
                    // No licence selected in mock
                });
        });

        cy.get('[data-testid=notes-section-header]').should('have.text', 'Notes');
        cy.get('[data-testid=notes-section-content]').within(() => {
            cy.get('.AdminCard')
                .as('cards')
                .eq(0)
                .within(() => {
                    cy.get('span span')
                        .eq(0)
                        .should('have.text', 'Additional notes (public)');
                    cy.get('#cke_rek-notes-editor').should('exist');
                    cy.readCKEditor('rek-notes').should(text => {
                        expect(text).to.contain(record.fez_record_search_key_notes.rek_notes);
                    });
                });
        });

        cy.get('@collectionsCard').within(() => {
            collections.forEach(() => {
                cy.get('[class*="MuiChip-deleteIcon"]')
                    .eq(0)
                    .click();
            });
            cy.get('#rek-ismemberof-helper-text')
                .should('exist')
                .should('have.text', 'This field is required');
        });

        cy.adminEditVerifyAlerts(1, ['You must select at least one collection']);

        // ----------------------------------------- GRANT INFORMATION TAB -------------------------------------------
        cy.log('Grant Information tab');

        cy.get('[data-testid=grants-section-header]').should('have.text', 'Grants');
        cy.get('[data-testid=grants-section-content]').within(() => {
            cy.get('.AdminCard')
                .eq(0)
                .within(() => {
                    cy.get('h4').should('contain', 'Grant information');
                    // No grant information in mock
                });
        });

        // ---------------------------------------------- SECURITY TAB -----------------------------------------------
        cy.log('Security tab');
        cy.get('[data-testid=security-section-header]').should('have.text', 'Security');
        cy.get('[data-testid=record-security-card-header]').should(
            'have.text',
            `Work level security - ${record.rek_pid}`,
        );
        cy.get('[data-testid=record-security-card-content]').within(() => {
            cy.get('h6')
                .eq(0)
                .should('have.text', 'Inherited security policy details');
            record.fez_record_search_key_ismemberof.forEach((collection, index) => {
                cy.get('h6')
                    .eq(2 * index + 1)
                    .should('have.text', collection.rek_ismemberof);
                cy.get('h6')
                    .eq(2 * index + 2)
                    .should('have.text', collection.rek_ismemberof_lookup);
                cy.get('p')
                    .eq(index)
                    .should('have.text', `Public (${collection.parent.rek_security_policy})`);
            });
            if (record.rek_security_inherited) {
                cy.get('label')
                    .contains('Override inherited security (detailed below)')
                    .parent()
                    .find('input')
                    .should('not.be.checked');
            }
        });
        cy.adminEditCleanup();
    });

    it('should render the files tab as expected', () => {
        // ---------------------------------------------- FILES TAB --------------------------------------------------

        const record = recordList.data[1];
        cy.loadRecordForAdminEdit(record.rek_pid);

        cy.log('Files Tab');
        cy.get('[data-testid=files-section-header]').should('have.text', 'Files');
        cy.get('[data-testid=files-section-content]').within(() => {
            const fileSizeInMB = Math.round((record.fez_datastream_info[1].dsi_size / 1024 / 1024) * 100) / 100;
            cy.get('h4')
                .eq(0)
                .should('have.text', 'Attached files');
            cy.get('p')
                .eq(0)
                .should(
                    'have.text',
                    'There may be a delay before newly uploaded or renamed files appear on the record.',
                );
            cy.get('p')
                .eq(2)
                .should('have.text', record.fez_datastream_info[1].dsi_dsid);
            cy.get('input')
                .eq(0)
                .should('have.value', record.fez_datastream_info[1].dsi_label);
            cy.get('p')
                .eq(3)
                .should('have.text', `${fileSizeInMB} MB`);
            cy.get('input')
                .eq(1)
                .should('have.value', moment(record.fez_datastream_info[1].dsi_embargo_date).format('DD/MM/YYYY'));
        });
        cy.get('[data-testid=files-section-content]').within(() => {
            cy.contains('h4', 'Advisory statement');
            cy.contains('h4', 'Copyright agreement');
            cy.get('[data-testid=rek-copyright-input]').should($checkbox => {
                if (record.rek_copyright === 'on') {
                    expect($checkbox).to.be.checked;
                } else {
                    expect($checkbox).not.to.be.checked;
                }
            });
        });
        cy.get('[data-testid=rek-copyright-input]').click();

        cy.adminEditVerifyAlerts(1, ['You are required to accept deposit agreement']);
        cy.adminEditCleanup();
    });

    describe('Author Affiliations', () => {
        beforeEach(() => {
            cy.loadRecordForAdminEdit(record.rek_pid);
        });

        afterEach(() => {
            cy.adminEditCleanup();
        });
        it('is only used for linked authors', () => {
            cy.get('[data-testid=rek-author-add]').click();
            cy.get('[data-testid=rek-author-input]').type('User, Test');
            cy.get('[data-testid=rek-author-add-save]').click();
            cy.get('[data-testid^="contributor-errorIcon-"]').should('have.length', 2); // will be 3 authors, 2 existing with error icons
        });

        it('can be added and edited', () => {
            //
            //
            //
            // Add author with UQ ID and single affiliation
            //
            //
            //
            cy.addAuthorAndAssert('Steve Su (uqysu4)', 85004);
            cy.addAffiliationAndAssert('Aboriginal and Torres Strait Islander Studies Unit', 877, '100%');

            cy.get('[data-testid=affiliationSaveBtn]').should('not.be.disabled');

            cy.get('[data-testid=deleteOrgBtn-877]')
                .should('exist')
                .click();

            cy.get('[data-testid=affiliationSaveBtn]').should('be.disabled');
            cy.get('[data-testid=orgSelect-877-input]').should('not.exist');
            cy.get('[data-testid=orgChip-877]').should('not.exist');

            cy.addAffiliationAndAssert('Aboriginal and Torres Strait Islander Studies Unit', 877, '100%');

            cy.get('[data-testid=affiliationSaveBtn]')
                .should('not.be.disabled')
                .click();

            cy.get('[data-testid=detailPanel-85004]').contains('[data-testid=orgChip-877]', '100%');
            cy.get('[data-testid=detailPanel-85004]').contains('Aboriginal and Torres Strait Islander Studies Unit');

            cy.get('[data-testid=affiliationCancelBtn]').should('not.exist');
            cy.get('[data-testid=affiliationSaveBtn]').should('not.exist');
            cy.get('[data-testid=orgChip-error]').should('not.exist');

            cy.get('[data-testid=expandPanelIcon-85004]')
                .should('exist')
                .click();

            //
            //
            //
            // Add author with UQ ID and multiple affiliations
            //
            //
            //
            cy.addAuthorAndAssert("O'Donoghue, Steven (uqsodono)", 75121);
            cy.addAffiliationAndAssert('Aboriginal and Torres Strait Islander Studies Unit', 877, '100%');

            cy.get('[data-testid=affiliationSaveBtn]').should('not.be.disabled');

            // add suggested org (coverage)
            cy.addAffiliationAndAssert(
                'Suggested: Information Systems and Resource Services (University of Queensland Library)',
                1248,
                '50%',
                true,
            );

            cy.get('[data-testid=orgChip-877]')
                .should('exist')
                .contains('50%');

            cy.addAffiliationAndAssert('Academic Administration Directorate', 1113, '33.333%');

            cy.get('[data-testid=orgChip-877]')
                .should('exist')
                .contains('33.334%');
            cy.get('[data-testid=orgChip-1248]')
                .should('exist')
                .contains('33.333%');

            cy.get('[data-testid=affiliationSaveBtn]')
                .should('not.be.disabled')
                .click();

            cy.get('[data-testid=detailPanel-75121]').contains('[data-testid=orgChip-877]', '33.334%');
            cy.get('[data-testid=detailPanel-75121]').contains('Aboriginal and Torres Strait Islander Studies Unit');
            cy.get('[data-testid=detailPanel-75121]').contains('[data-testid=orgChip-1248]', '33.333%');
            cy.get('[data-testid=detailPanel-75121]').contains(
                'Information Systems and Resource Services (University of Queensland Library)',
            );
            cy.get('[data-testid=detailPanel-75121]').contains('[data-testid=orgChip-1113]', '33.333%');
            cy.get('[data-testid=detailPanel-75121]').contains('Academic Administration Directorate');

            cy.get('[data-testid=affiliationCancelBtn]').should('not.exist');
            cy.get('[data-testid=affiliationSaveBtn]').should('not.exist');
            cy.get('[data-testid=orgChip-error]').should('not.exist');

            cy.get('[data-testid=expandPanelIcon-75121]')
                .should('exist')
                .click();

            //
            //
            //
            // Add author with non-HERDC affiliation
            //
            //
            //
            cy.addAuthorAndAssert('Kisely, Steve (uqskisely)', 78152);
            cy.addAffiliationAndAssert('Aboriginal and Torres Strait Islander Studies Unit', 877, '100%');

            cy.get('[data-testid=affiliationSaveBtn]').should('not.be.disabled');

            cy.addAffiliationAndAssert('Academic Administration', 973, '50%');

            cy.get('[data-testid=orgChip-877]')
                .should('exist')
                .contains('50%');

            cy.addAffiliationAndAssert('Academic Administration Directorate', 1113, '33.333%');

            cy.get('[data-testid=orgChip-877]')
                .should('exist')
                .contains('33.334%');
            cy.get('[data-testid=orgChip-973]')
                .should('exist')
                .contains('33.333%');

            // now test resetting to non-herdc, which should clear the above
            cy.addAffiliationAndAssert('!NON-HERDC', 1062, '100%');
            cy.get('[data-testid=orgChip-877]').should('not.exist');
            cy.get('[data-testid=orgChip-973]').should('not.exist');
            cy.get('[data-testid=orgChip-1113]').should('not.exist');
            // auto adds suggestion
            cy.get('[data-testid=orgChip-1248]')
                .should('exist')
                .contains('0%');
            cy.get('[data-testid=orgSelect-1248-input]')
                .should('exist')
                .should('have.value', 'Information Systems and Resource Services (University of Queensland Library)');
            // hides the add autocomplete element
            cy.get('[data-testid=orgSelect-add-input]').should('not.exist');

            cy.get('[data-testid=affiliationSaveBtn]')
                .should('not.be.disabled')
                .click();

            cy.get('[data-testid=detailPanel-78152]').contains('[data-testid=orgChip-1062]', '100%');
            cy.get('[data-testid=detailPanel-78152]').contains('!NON-HERDC');
            cy.get('[data-testid=detailPanel-78152]').contains('[data-testid=orgChip-1248]', '0%');
            cy.get('[data-testid=detailPanel-78152]').contains(
                'Information Systems and Resource Services (University of Queensland Library)',
            );

            cy.get('[data-testid=affiliationCancelBtn]').should('not.exist');
            cy.get('[data-testid=affiliationSaveBtn]').should('not.exist');
            cy.get('[data-testid=orgChip-error]').should('not.exist');

            // Now edit non-herdc to remove that option
            cy.get('[data-testid=affiliationEditBtn-78152]')
                .should('exist')
                .click();

            cy.get('[data-testid=orgSelect-1062-input]')
                .should('exist')
                .should('have.value', '!NON-HERDC');
            cy.get('[data-testid=orgChip-1062')
                .should('exist')
                .contains('100%');
            cy.get('[data-testid=orgSelect-1248-input]')
                .should('exist')
                .should('have.value', 'Information Systems and Resource Services (University of Queensland Library)');
            cy.get('[data-testid=orgChip-1248')
                .should('exist')
                .contains('0%');

            cy.get('[data-testid=deleteOrgBtn-1062]')
                .should('exist')
                .click();
            cy.get('[data-testid=orgSelect-1062-input]').should('not.exist');
            cy.get('[data-testid=orgChip-1062').should('not.exist');
            cy.get('[data-testid=orgChip-1248')
                .should('exist')
                .contains('100%');
            cy.get('[data-testid=affiliationSaveBtn]')
                .should('not.be.disabled')
                .click();
            cy.get('[data-testid=detailPanel-78152]').contains('[data-testid=orgChip-1248]', '100%');
            cy.get('[data-testid=detailPanel-78152]').contains(
                'Information Systems and Resource Services (University of Queensland Library)',
            );

            //
            // coverage - change the above org back to non-herdc
            //

            // currentOrgId, nextOrgId, nextOrgName, expectedPercent) =
            cy.get('[data-testid^=affiliationEditBtn-]')
                .should('exist')
                .click();

            cy.editAffiliationAndAssert(1248, 1062, '!NON-HERDC', '100%');
            // double check the suggested org has been re-added
            cy.get('[data-testid=orgSelect-1248-input]')
                .should('exist')
                .should('have.value', 'Information Systems and Resource Services (University of Queensland Library)');
            cy.get('[data-testid=orgChip-1248')
                .should('exist')
                .contains('0%');

            // hides the add autocomplete element
            cy.get('[data-testid=orgSelect-add-input]').should('not.exist');

            cy.get('[data-testid=affiliationSaveBtn]')
                .should('not.be.disabled')
                .click();

            cy.get('[data-testid=detailPanel-78152]').contains('[data-testid=orgChip-1062]', '100%');
            cy.get('[data-testid=detailPanel-78152]').contains('!NON-HERDC');
            cy.get('[data-testid=detailPanel-78152]').contains('[data-testid=orgChip-1248]', '0%');
            cy.get('[data-testid=detailPanel-78152]').contains(
                'Information Systems and Resource Services (University of Queensland Library)',
            );

            cy.get('[data-testid=affiliationCancelBtn]').should('not.exist');
            cy.get('[data-testid=affiliationSaveBtn]').should('not.exist');
            cy.get('[data-testid=orgChip-error]').should('not.exist');

            cy.get('[data-testid=expandPanelIcon-78152]')
                .should('exist')
                .click();
        });

        it('can fix < 100% error', () => {
            cy.get('[data-testid^="contributor-errorIcon-80316"]').should('exist');
            cy.get('[data-testid^="contributor-errorIcon-3223"]').should('exist');
            cy.get('[data-testid=expandPanelIcon-80316]')
                .should('exist')
                .click();

            cy.get('[data-testid=detailPanel-80316]').contains('p', 'School of Chemistry and Molecular Biosciences');
            cy.get('[data-testid=detailPanel-80316]').contains('p', 'Institute for Molecular Bioscience');
            cy.get('[data-testid=detailPanel-80316]').within(() => {
                cy.get('[data-testid=orgChip-881]').contains('50%');
                cy.get('[data-testid=orgChip-968]').contains('40%');
                cy.get('[data-testid=alert]').contains(
                    'Author affiliation information is incomplete - Percentage sum total of all affiliations must equal 100%',
                );
            });

            // Editing the author's affiliations automatically recalculates %
            cy.get('[data-testid=affiliationEditBtn-80316]')
                .should('exist')
                .click();
            cy.assertAffiliation('School of Chemistry and Molecular Biosciences', 881, '50%');
            cy.assertAffiliation('Institute for Molecular Bioscience', 968, '50%');

            cy.get('[data-testid=affiliationCancelBtn]')
                .should('exist')
                .click();

            // cancelling does not save the changes, affiliations still not 100%
            cy.get('[data-testid=detailPanel-80316]').within(() => {
                cy.get('[data-testid=orgChip-881]').contains('50%');
                cy.get('[data-testid=orgChip-968]').contains('40%');
                cy.get('[data-testid=alert]').contains(
                    'Author affiliation information is incomplete - Percentage sum total of all affiliations must equal 100%',
                );
            });

            // hit the auto recalc button
            cy.get('[data-testid=alert]').within(() => {
                cy.get('[data-testid=action-button]')
                    .contains('Recalculate Percentages')
                    .click();
            });

            cy.get('[data-testid=detailPanel-80316]').within(() => {
                cy.get('[data-testid=orgChip-881]').contains('50%');
                cy.get('[data-testid=orgChip-968]').contains('50%');
                cy.get('[data-testid=alert]').should('not.exist');
            });
            cy.get('[data-testid^="contributor-errorIcon-80316"]').should('not.exist');
        });
    });
});
