import { default as recordList } from '../../../src/mock/data/records/publicationTypeListJournalArticle';

context('Journal Article admin edit', () => {
    const record = recordList.data[0];

    it('should load with specifed elements', () => {
        cy.loadRecordForAdminEdit(record.rek_pid);
        cy.get('h2')
            .should('have.length', 1)
            .should('have.text', `Edit ${record.rek_display_type_lookup} - ${record.rek_title}: ${record.rek_pid}`);

        cy.get('button[title="Learn about keyboard shortcuts"]')
            .should('exist');

        cy.adminEditCountCards(7);
        cy.adminEditNoAlerts();

        cy.adminEditTabbedView();
        cy.adminEditCheckDefaultTab('Bibliographic');
        cy.adminEditCleanup();
    });

    it('should render the different sections as expected', () => {
        cy.loadRecordForAdminEdit(record.rek_pid);
        // ---------------------------------------------- ADMIN TAB --------------------------------------------------
        cy.log('Admin tab');
        cy.viewport(1000, 1000);
        cy.get('.StandardPage form >div >div')
            .get('.StandardCard')
            .eq(3)
            .within(() => {
                cy.get('h3')
                    .should('have.text', 'Admin');
                cy.get('#cke_editor3')
                    .should('exist');
                cy.get('#cke_editor4')
                    .should('exist');
                cy.get('#cke_editor5')
                    .should('exist');
            });

        cy.readCKEditor('editor4')
            .should(text => {
                expect(text).to.contain(record.fez_internal_notes.ain_detail); // 'Not yet indexed in Scopus/ISI 3/5/13
            });
        cy.readCKEditor('editor5')
            .should(text => {
                expect(text).to.contain(record.rek_herdc_notes); // 12/1/12 Amended ID at author request #886821
            });

        // ------------------------------------------- IDENTIFIERS TAB -----------------------------------------------
        cy.log('Identifiers tab');
        cy.get('.StandardPage form >div > div')
            .get('.StandardCard')
            .eq(0)
            .as('indentifiesTab')
            .within(() => {
                cy.get('h3')
                    .should('have.text', 'Identifiers');

                cy.get('.AdminCard')
                    .eq(0)
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'Manage identifiers');
                        cy.get('#DOI')
                            .should('have.value', record.fez_record_search_key_doi.rek_doi);
                        cy.get('#WoSID')
                            .should('have.value', record.fez_record_search_key_isi_loc.rek_isi_loc);
                        cy.get('#ScopusID')
                            .should('have.value', record.fez_record_search_key_scopus_id.rek_scopus_id);
                        cy.get('#PubMedID')
                            .should('have.value', record.fez_record_search_key_pubmed_id.rek_pubmed_id);
                        cy.get('#PubMedCentralID')
                            .should(
                                'have.value',
                                record.fez_record_search_key_pubmed_central_id.rek_pubmed_central_id,
                            );
                        cy.get('label[id="WoS doc type(s)-label"]')
                            .parent()
                            .find('input[type=hidden]')
                            .should('have.value', record.rek_wok_doc_type)
                            .siblings('[role=button]')
                            .invoke('text')
                            .should('match', new RegExp(`^${record.rek_wok_doc_type}`));
                        cy.get('label[id="Scopus doc type(s)-label"]')
                            .parent()
                            .find('input[type=hidden]')
                            .should('have.value', record.rek_scopus_doc_type)
                            .siblings('[role=button]')
                            .invoke('text')
                            .should('match', new RegExp(`^${record.rek_scopus_doc_type}`));
                        cy.get('label[id="PubMed doc type(s)-label"]')
                            .parent()
                            .find('input[type=hidden]')
                            .should('have.value', record.rek_pubmed_doc_type)
                            .siblings('[role=button]')
                            .should('have.text', record.rek_pubmed_doc_type);
                    });

                cy.get('.AdminCard')
                    .eq(1)
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'Manage links');
                        // No content in mock.
                    });
            });

        // ------------------------------------------ BIBLIOGRAPHIC TAB ----------------------------------------------
        cy.log('Bibliographic tab');
        cy.get('.StandardPage form >div >div')
            .get('.StandardCard')
            .eq(1)
            .as('bibliographicTab')
            .within(() => {
                cy.get('h3')
                    .should('have.text', 'Bibliographic');

                cy.get('.AdminCard')
                    .as('cards')
                    .eq(0)
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'Title');
                        cy.get('span span')
                            .eq(0)
                            .should('contain.text', 'Formatted title');
                        cy.get('#cke_editor1')
                            .should('exist');
                        cy.readCKEditor('editor1')
                            .should(text => {
                                expect(text).to.contain(record.rek_title);
                            });
                    });

                cy.get('@cards')
                    .eq(1)
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'Language of work & Journal name');
                        const langCodes = record.fez_record_search_key_language.map(lang => lang.rek_language);
                        cy.get('label[id="Language of work-label"]')
                            .parent()
                            .find('input[type=hidden]')
                            .should('have.value', langCodes.join(','))
                            .siblings('[role=button] span')
                            .should('have.length', 0); // If no matching codes found, there is a span present

                        cy.get('#Journalname')
                            .should(
                                'have.value',
                                record.fez_record_search_key_journal_name.rek_journal_name,
                            );
                    });

                cy.get('@cards')
                    .eq(2)
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'ISBN');

                        // No ISBN in mock
                    });

                cy.get('@cards')
                    .eq(3)
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'ISSN');
                        const issns = record.fez_record_search_key_issn.map(item => item.rek_issn);
                        const ulrichsId = record.fez_record_search_key_issn.map(item => item.fez_ulrichs.ulr_title_id);

                        cy.get('div.ISSNvalue')
                            .within(() => {
                                issns.forEach((issn, index) => {
                                    cy.get('.ListRow-ISSNvalue span>span')
                                        .eq(2 * index)
                                        .should('contain.text', issn);
                                    cy.get('.ListRow-ISSNvalue a')
                                        .eq(2 * index)
                                        .should('contain.text', 'SHERPA/RoMEO')
                                        .should(
                                            'have.attr',
                                            'href',
                                            'http://www.sherpa.ac.uk/romeo/search.php?issn=' + issn,
                                        );
                                    cy.get('.ListRow-ISSNvalue a')
                                        .eq(2 * index + 1)
                                        .should('contain.text', 'Ulrichs')
                                        .should(
                                            'have.attr',
                                            'href',
                                            'http://ezproxy.library.uq.edu.au/login?url=http://ulrichsweb.serialssolutions.com/title/' +
                                            ulrichsId[index],
                                        );
                                });
                            });
                    });

                cy.get('@cards')
                    .eq(4)
                    .as('bibliographicCard')
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'Bibliographic');
                        cy.get('#Placeofpublication')
                            .should(
                                'have.value',
                                record.fez_record_search_key_place_of_publication.rek_place_of_publication,
                            );
                        cy.get('#Publishername')
                            .should(
                                'have.value',
                                record.fez_record_search_key_publisher.rek_publisher,
                            );
                        cy.get('#Volume')
                            .should(
                                'have.value',
                                record.fez_record_search_key_volume_number.rek_volume_number,
                            );
                        cy.get('#Issue')
                            .should(
                                'have.value',
                                record.fez_record_search_key_issue_number.rek_issue_number,
                            );
                        // No value for Article number in mock
                        cy.get('#Startpage')
                            .should(
                                'have.value',
                                record.fez_record_search_key_start_page.rek_start_page,
                            );
                        cy.get('#Endpage')
                            .should('have.value', record.fez_record_search_key_end_page.rek_end_page);
                        cy.get('[id="Totalpages/Extent"]')
                            .should(
                                'have.value',
                                record.fez_record_search_key_total_pages.rek_total_pages,
                            );
                        cy.checkPartialDateFromRecordValue('Publication date', record.rek_date);
                        cy.get('#Yearavailable')
                            .should(
                                'have.value',
                                Cypress.moment(record.fez_record_search_key_date_available.rek_date_available)
                                    .format(
                                        'YYYY',
                                    ),
                            );
                        cy.get('span span')
                            .eq(0)
                            .should('have.text', 'Abstract / Description');
                        cy.get('#cke_editor2')
                            .should('exist');
                        cy.readCKEditor('editor2')
                            .should(text => {
                                expect(text).to.contain(record.rek_description);
                            });
                    });

                cy.get('@cards')
                    .eq(5)
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'Keyword(s)');
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
                        cy.get('h4')
                            .should('contain', 'Subject');
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
                        cy.get('h4')
                            .should('contain', 'Related publications');
                        // No Related publications in mock
                    });
            });

        cy.get('#Journalname')
            .clear()
            .parent()
            .siblings('p')
            .should('have.id', 'Journalname-helper-text')
            .should('have.text', 'This field is required');

        cy.adminEditVerifyAlerts(1, ['Journal name is required']);

        cy.get('#Journalname')
            .type('Test');

        cy.adminEditNoAlerts();

        // ------------------------------------------ AUTHOR DETAILS TAB ---------------------------------------------
        cy.log('Author Details tab');
        cy.get('.StandardPage form > div > div')
            .get('.StandardCard')
            .eq(2)
            .within(() => {
                cy.get('h3')
                    .should('have.text', 'Author details');

                cy.get('.AdminCard')
                    .eq(0)
                    .as('authorsCard')
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'Authors');
                        const authors = record.fez_record_search_key_author.map(item => item.rek_author);
                        const authorUsernames = record.fez_record_search_key_author_id.map(
                            item => item.author.aut_org_username,
                        );
                        const authorUQ = record.fez_record_search_key_author_id.map(item =>
                            item.rek_author_id_id > 0 ? 'UQ' : 'nonUQ',
                        );
                        const authorNames = record.fez_record_search_key_author_id.map(
                            item => item.rek_author_id_lookup,
                        );
                        const authorIDs = record.fez_record_search_key_author_id.map(item => item.rek_author_id);
                        const authorAffs = record.fez_record_search_key_author_affiliation_name.map((item, index) => {
                            return authorUQ[index] === 'UQ'
                                ? 'The University of Queensland'
                                : item.rek_author_affiliation_name;
                        });
                        authors.forEach((author, index) => {
                            cy.get('p')
                                .eq(2 * index)
                                .should('have.text', author);
                            cy.get('p')
                                .eq(2 * index + 1)
                                .should('contain.text', authorNames[index]);

                            cy.get('span')
                                .eq(9 + 11 * index)
                                .should(
                                    'have.text',
                                    `${authorAffs[index]} (${authorUsernames[index]} - ${authorIDs[index]})`,
                                );
                        });
                    });
            });

        cy.get('@authorsCard')
            .find('button[aria-label="Remove all items"]')
            .click();
        cy.get('body > div[role=dialog]')
            .contains('Yes')
            .click();
        cy.get('@authorsCard')
            .find('span[class*="colorError-"]')
            .should('have.length', 1)
            .should('have.text', 'Author/creator names are required');

        cy.adminEditVerifyAlerts(1, ['Author/creator names are required']);

        // -------------------------------------- ADMIN TAB -----------------------------------------
        cy.log('Admin tab');
        const collections = record.fez_record_search_key_ismemberof.map(item => item.rek_ismemberof_lookup);
        cy.get('.StandardPage form >div > div')
            .get('.StandardCard')
            .eq(3)
            .within(() => {
                cy.get('h3')
                    .should('have.text', 'Admin');

                cy.get('.AdminCard')
                    .as('cards')
                    .eq(0)
                    .as('collectionsCard')
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'Member of collections');
                        cy.get('#Memberofcollections-input-label')
                            .should('contain', 'Member of collections');
                        collections.forEach((collection, index) => {
                            cy.get('[class*="MuiChip-label-"]')
                                .eq(index)
                                .should('have.text', collection);
                        });
                    });

                cy.get('@cards')
                    .eq(1)
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'Additional information');
                        cy.get('label[id="Work sub-type-label"]')
                            .parent()
                            .find('input[type=hidden]')
                            .should('have.value', record.rek_subtype)
                            .siblings('[role=button]')
                            .should('have.text', record.rek_subtype);
                        cy.get('label[id="Category code-label"]')
                            .parent()
                            .find('input[type=hidden]')
                            .should('have.value', record.fez_record_search_key_herdc_code.rek_herdc_code.toString())
                            .siblings('[role=button]')
                            .invoke('text')
                            .should(
                                'match',
                                new RegExp(`^${record.fez_record_search_key_herdc_code.rek_herdc_code_lookup}`),
                            );
                        cy.get('label[id="Category code status-label"]')
                            .parent()
                            .find('input[type=hidden]')
                            .should('have.value', record.fez_record_search_key_herdc_status.rek_herdc_status.toString())
                            .siblings('[role=button]')
                            .should('have.text', record.fez_record_search_key_herdc_status.rek_herdc_status_lookup);
                        cy.get('label[id="Institutional status-label"]')
                            .parent()
                            .find('input[type=hidden]')
                            .should(
                                'have.value',
                                record.fez_record_search_key_institutional_status.rek_institutional_status.toString(),
                            )
                            .siblings('[role=button]')
                            .should(
                                'have.text',
                                record.fez_record_search_key_institutional_status.rek_institutional_status_lookup,
                            );
                        cy.get('label[id="OA status-label"]')
                            .parent()
                            .find('input[type=hidden]')
                            .should('have.value', record.fez_record_search_key_oa_status.rek_oa_status.toString())
                            .siblings('[role=button]')
                            .should('have.text', record.fez_record_search_key_oa_status.rek_oa_status_lookup);
                        // No content indicators selected in mock
                        cy.get('span span')
                            .eq(0)
                            .should('have.text', 'Additional notes');
                        cy.get('#cke_editor3')
                            .should('exist');
                        cy.readCKEditor('editor3')
                            .should(text => {
                                expect(text).to.contain(record.fez_record_search_key_notes.rek_notes);
                            });
                    });
            });

        cy.get('@collectionsCard')
            .within(() => {
                collections.forEach(() => {
                    cy.get('[role=button] > svg')
                        .eq(0)
                        .click();
                });
                cy.get('#Memberofcollections-input-helper-text')
                    .should('exist')
                    .should('have.text', 'This field is required');
            });

        cy.adminEditVerifyAlerts(2, ['You must select atleast one collection']);

        // ----------------------------------------- GRANT INFORMATION TAB -------------------------------------------
        cy.log('Grant Information tab');
        cy.get('.StandardPage form >div > div')
            .get('.StandardCard')
            .eq(4)
            .within(() => {
                cy.get('h3')
                    .should('have.text', 'Grant information');

                cy.get('.AdminCard')
                    .eq(0)
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'Grant information');
                        // No grant information in mock
                    });
            });

        // ---------------------------------------------- SECURITY TAB -----------------------------------------------
        cy.log('Security tab');
        cy.get('.StandardPage form >div >div')
            .get('.StandardCard')
            .eq(7)
            .within(() => {
                cy.root()
                    .children('div')
                    .children('div')
                    .children('h3')
                    .should('have.text', 'Security');

                cy.get('.StandardCard')
                    .within(() => {
                        cy.get('h4')
                            .eq(0)
                            .should('have.text', `${record.rek_object_type_lookup} level security - ${record.rek_pid}`);
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
            });
        cy.adminEditCleanup();
    });

    it('should render the files tab as expected', () => {
        // ---------------------------------------------- FILES TAB --------------------------------------------------

        const record = recordList.data[1];
        cy.loadRecordForAdminEdit(record.rek_pid);

        cy.log('Files Tab');
        cy.get('.StandardPage form > div > div')
            .get('.StandardCard')
            .eq(5)
            .within(() => {
                cy.get('.StandardCard')
                    .eq(0)
                    .within(() => {
                        // prettier-ignore
                        const fileSizeInMB = Math.round(
                            record.fez_datastream_info[1].dsi_size / 1024 / 1024 * 100
                        ) / 100;
                        cy.get('h4')
                            .should('have.text', 'Attached files');
                        cy.get('p')
                            .eq(1)
                            .should('have.text', record.fez_datastream_info[1].dsi_dsid);
                        cy.get('input')
                            .eq(1)
                            .should('have.value', record.fez_datastream_info[1].dsi_label);
                        cy.get('p')
                            .eq(2)
                            .should('have.text', `${fileSizeInMB} MB`);
                        cy.get('input')
                            .eq(2)
                            .should(
                                'have.value',
                                Cypress.moment(record.fez_datastream_info[1].dsi_embargo_date)
                                    .format('DD/MM/YYYY'),
                            );
                    });

                cy.get('.AdminCard')
                    .as('cards')
                    .eq(0)
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'Files');
                    });
            });
        cy.get('@cards')
            .eq(1)
            .within(() => {
                cy.get('h4')
                    .should('contain', 'Copyright agreement');
                cy.get('#deposit-agreement')
                    .should($checkbox => {
                        if (record.rek_copyright === 'on') {
                            expect($checkbox).to.be.checked;
                        } else {
                            expect($checkbox).not.to.be.checked;
                        }
                    });
            });
        cy.get('#deposit-agreement')
            .click();

        cy.adminEditVerifyAlerts(1, ['You are required to accept deposit agreement']);
        cy.adminEditCleanup();
    });
});
