import { default as recordList } from '../../../src/mock/data/records/publicationTypeListJournalArticle';
import moment from 'moment';

context('Journal Article admin edit', () => {
    const record = recordList.data[0];

    beforeEach(() => {
        cy.visit(`/admin/edit/${record.rek_pid}?user=uqstaff`);
        cy.closeUnsupported();
        cy.wait(1000); // Wait for data load
        cy.waitForCkeditorToHaveLoaded();
    });

    afterEach(() => {
        cy.window()
            .then(win => (win.onbeforeunload = undefined));
    });

    it('should load with specifed elements', () => {
        cy.get('h2')
            .should('have.length', 1)
            .should('have.text', `Edit ${record.rek_display_type_lookup} - ${record.rek_title}: ${record.rek_pid}`);

        cy.get('input[value=tabbed]')
            .should('have.value', 'tabbed') // force the get to wait for the element
            .should('be.not.checked');

        cy.get('button[title="Learn about keyboard shortcuts"]')
            .should('exist');

        cy.get('.StandardPage form > div > div > div.StandardCard > div > div > h3')
            .as('cards')
            .should('have.length', 8);

        cy.get('.StandardPage form > div > div:nth-child(9)')
            .within(() => {
                cy.get('.Alert')
                    .should('not.exist');
                cy.get('button')
                    .should('be.enabled');
            });

        cy.wait(1000);
        cy.get('input[value=tabbed]')
            .should('have.value', 'tabbed') // force the get to wait for the element
            .click()
            .should('be.checked');

        cy.get('@cards')
            .should('have.length', 1)
            .should('have.text', 'Bibliographic');
    });

    it('should render Admin tab', () => {
        cy.get('.StandardPage form > div > div:nth-child(1)')
            .within(() => {
                cy.root()
                    .children('.StandardCard')
                    .children('div')
                    .children('div')
                    .children('h3')
                    .should('have.text', 'Admin');
                cy.get('span span')
                    .eq(0)
                    .should('have.text', 'Internal notes');
                cy.get(' > div > div:nth-child(2) > div > div:nth-child(2) span span')
                    .should('have.text', 'HERDC notes');
                cy.get('#cke_editor1')
                    .should('exist');
                cy.get('#cke_editor2')
                    .should('exist');
            });

        cy.read_ckeditor('editor1')
            .should(text => {
                expect(text).to.contain(record.fez_internal_notes.ain_detail);
            });
        cy.read_ckeditor('editor2')
            .should(text => {
                expect(text).to.contain(record.rek_herdc_notes);
            });
    });

    it('should render Identifiers tab', () => {
        cy.get('.StandardPage form > div > div:nth-child(2)')
            .within(() => {
                cy.root()
                    .children('.StandardCard')
                    .children('div')
                    .children('div')
                    .children('h3')
                    .should('have.text', 'Identifiers');

                cy.get('div:nth-child(1) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Manage identifiers');
                        cy.get('#DOI')
                            .should('have.value', record.fez_record_search_key_doi.rek_doi);
                        cy.get('#WoSID')
                            .should('have.value', record.fez_record_search_key_isi_loc.rek_isi_loc);
                        cy.get('#ScopusID')
                            .should('have.value', record.fez_record_search_key_scopus_id.rek_scopus_id);
                        cy.get('#PubMedID')
                            .should('have.value', record.fez_record_search_key_pubmed_id.rek_pubmed_id);
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

                cy.get('div:nth-child(2) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Manage links');
                        // No content in mock.
                    });
            });
    });

    it('should render Bibliographic tab', () => {
        cy.get('.StandardPage form > div > div:nth-child(3)')
            .within(() => {
                cy.root()
                    .children('.StandardCard')
                    .children('div')
                    .children('div')
                    .children('h3')
                    .should('have.text', 'Bibliographic');

                cy.get('div:nth-child(1) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Title');
                        cy.get('span span')
                            .eq(0)
                            .should('contain.text', 'Formatted title');
                        cy.get('#cke_editor3')
                            .should('exist');
                        cy.read_ckeditor('editor3')
                            .should(text => {
                                expect(text).to.contain(record.rek_title);
                            });
                    });

                cy.get('div:nth-child(2) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Language of work');
                        const langCodes = record.fez_record_search_key_language.map(lang => lang.rek_language);
                        cy.get('label[id="Language of work-label"]')
                            .parent()
                            .find('input[type=hidden]')
                            .should('have.value', langCodes.join(','))
                            .siblings('[role=button] span')
                            .should('have.length', 0); // If no matching codes found, there is a span present
                    });

                cy.get('div:nth-child(3) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Journal name');
                        cy.get('#Journalname')
                            .should('have.value', record.fez_record_search_key_journal_name.rek_journal_name);
                    });

                cy.get('div:nth-child(4) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'ISBN');

                        // No ISBN in mock
                    });

                cy.get('div:nth-child(5) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'ISSN');
                        const issns = record.fez_record_search_key_issn.map(item => item.rek_issn);
                        issns.forEach((issn, index) => {
                            cy.get('p')
                                .eq(index)
                                .should('have.text', issn);
                        });
                    });

                cy.get('div:nth-child(6) > .StandardCard')
                    .within(() => {
                        cy.root()
                            .as('bibliographicCard');
                        cy.get('h3')
                            .should('have.text', 'Bibliographic');
                        cy.get('#Placeofpublication')
                            .should(
                                'have.value',
                                record.fez_record_search_key_place_of_publication.rek_place_of_publication,
                            );
                        cy.get('#Publishername')
                            .should('have.value', record.fez_record_search_key_publisher.rek_publisher);
                        cy.get('#Volume')
                            .should('have.value', record.fez_record_search_key_volume_number.rek_volume_number);
                        cy.get('#Issue')
                            .should('have.value', record.fez_record_search_key_issue_number.rek_issue_number);
                        // No value for Article number in mock
                        cy.get('#Startpage')
                            .should('have.value', record.fez_record_search_key_start_page.rek_start_page);
                        cy.get('#Endpage')
                            .should('have.value', record.fez_record_search_key_end_page.rek_end_page);
                        cy.get('[id="Totalpages/Extent"]')
                            .should(
                                'have.value',
                                record.fez_record_search_key_total_pages.rek_total_pages,
                            );
                        cy.get('[placeholder="Publication date"]')
                            .should(
                                'have.value',
                                moment(record.rek_date)
                                    .format('DD/MM/YYYY'),
                            );
                        cy.get('#Yearavailable')
                            .should(
                                'have.value',
                                moment(record.fez_record_search_key_date_available.rek_date_available)
                                    .format('YYYY'),
                            );
                        cy.get('span span')
                            .eq(0)
                            .should('have.text', 'Abstract / Description');
                        cy.get('#cke_editor4')
                            .should('exist');
                        cy.read_ckeditor('editor4')
                            .should(text => {
                                expect(text).to.contain(record.rek_description);
                            });
                        cy.get('label[id="Refereed source-label"]')
                            .parent()
                            .find('input[type=hidden]')
                            .should('have.value', record.fez_record_search_key_refereed_source.rek_refereed_source)
                            .siblings('[role=button]')
                            .should('have.text', record.fez_record_search_key_refereed_source.rek_refereed_source_lookup);
                    });

                cy.get('div:nth-child(7) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Keyword(s)');
                        const keywords = record.fez_record_search_key_keywords.map(item => item.rek_keywords);
                        keywords.forEach((keyword, index) => {
                            cy.get('p')
                                .eq(index)
                                .should('have.text', keyword);
                        });
                    });

                cy.get('div:nth-child(8) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Subject');
                        const subjects = record.fez_record_search_key_subject.map(item => item.rek_subject_lookup);
                        subjects.forEach((subject, index) => {
                            cy.get('p')
                                .eq(index)
                                .should('have.text', subject);
                        });
                    });

                cy.get('div:nth-child(9) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Related publications');
                        // No Related publications in mock
                    });
            });

        cy.get('#Journalname')
            .clear()
            .parent()
            .siblings('p')
            .should('have.id', 'Journalname-helper-text')
            .should('have.text', 'This field is required');

        cy.get('.StandardPage form > div > div:nth-child(9)')
            .within(() => {
                cy.get('.Alert')
                    .should('exist')
                    .find('.alert-text')
                    .should('contain', 'Validation -')
                    .find('li')
                    .should('have.length', 1)
                    .should('contain', 'Journal name is required');
            });
        cy.get('.StandardPage form > div > div:nth-child(10) button')
            .should('be.disabled');

        // Skipped until bugfix for rek_date clearing via keyboard not triggering validation error
        // https://www.pivotaltracker.com/story/show/168742188/comments/207811461
        // cy.get('#Journalname')
        //     .type('Test');

        // cy.get('.StandardPage form > div > div:nth-child(9)')
        //     .within(() => {
        //         cy.get('.Alert')
        //             .should('not.exist');
        //         cy.get('button')
        //             .should('be.enabled');
        //     });

        // cy.get('@bibliographicCard')
        //     .get('[placeholder="Publication date"]')
        //     .clear();
        // cy.get('.StandardPage form > div > div:nth-child(9)')
        //     .within(() => {
        //         cy.get('.Alert')
        //             .should('exist')
        //             .find('.alert-text')
        //             .should('contain', 'Validation -')
        //             .find('li')
        //             .should('have.length', 1)
        //             .should('contain', 'Publication date is required');
        //     });
        // cy.get('.StandardPage form > div > div:nth-child(10) button')
        //     .should('be.disabled');
    });

    it('should render Author details tab', () => {
        cy.get('.StandardPage form > div > div:nth-child(4)')
            .within(() => {
                cy.root()
                    .children('.StandardCard')
                    .children('div')
                    .children('div')
                    .children('h3')
                    .should('have.text', 'Author details');

                cy.get('div:nth-child(1) > .StandardCard')
                    .within(() => {
                        cy.root()
                            .as('authorsCard');
                        cy.get('h3')
                            .should('have.text', 'Authors');
                        const authors = record.fez_record_search_key_author.map(item => item.rek_author);
                        const authorAffs = record.fez_record_search_key_author_affiliation_name.map(
                            item => item.rek_author_affiliation_name,
                        );
                        authors.forEach((author, index) => {
                            cy.get('p')
                                .eq(2 * index)
                                .should('have.text', author);
                            cy.get('p')
                                .eq(2 * index + 1)
                                .should('have.text', authorAffs[index]);
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
        cy.get('.StandardPage form > div > div:nth-child(9)')
            .within(() => {
                cy.get('.Alert')
                    .should('exist')
                    .find('.alert-text')
                    .should('contain', 'Validation -')
                    .find('li')
                    .should('have.length', 1)
                    .should('contain', 'Author/creator names are required');
            });
        cy.get('.StandardPage form > div > div:nth-child(10) button')
            .should('be.disabled');
    });

    it('should render Additional information tab', () => {
        const collections = record.fez_record_search_key_ismemberof.map(item => item.rek_ismemberof_lookup);
        cy.get('.StandardPage form > div > div:nth-child(5)')
            .within(() => {
                cy.root()
                    .children('.StandardCard')
                    .children('div')
                    .children('div')
                    .children('h3')
                    .should('have.text', 'Additional information');

                cy.get('div:nth-child(1) > .StandardCard')
                    .as('collectionsCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Member of collections');
                        cy.get('#Memberofcollections-input-label')
                            .should('contain', 'Member of collections');
                        collections.forEach((collection, index) => {
                            cy.get('[class*="MuiChip-label-"]')
                                .eq(index)
                                .should('have.text', collection);
                        });
                    });

                cy.get('div:nth-child(2) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Additional information');
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
                            .should('match', new RegExp(`^${record.fez_record_search_key_herdc_code.rek_herdc_code_lookup}`));
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
                        cy.get('#cke_editor5')
                            .should('exist');
                        cy.read_ckeditor('editor5')
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

        cy.get('.StandardPage form > div > div:nth-child(9)')
            .within(() => {
                cy.get('.Alert')
                    .should('exist')
                    .find('.alert-text')
                    .should('contain', 'Validation -')
                    .find('li')
                    .should('have.length', 1)
                    .should('contain', 'You must select atleast one collection');
            });

        cy.get('.StandardPage form > div > div:nth-child(10) button')
            .should('be.disabled');
    });

    it('should render Grant information tab', () => {
        cy.get('.StandardPage form > div > div:nth-child(6)')
            .within(() => {
                cy.root()
                    .children('.StandardCard')
                    .children('div')
                    .children('div')
                    .children('h3')
                    .should('have.text', 'Grant information');

                cy.get('div:nth-child(1) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Grant information');
                        // No grant information in mock
                    });
            });
    });

    it('should render Files tab', () => {
        const record = recordList.data[1];

        cy.window()
            .then(win => (win.onbeforeunload = undefined));

        cy.visit(`/admin/edit/${record.rek_pid}?user=uqstaff`);
        cy.closeUnsupported();
        cy.wait(1000); // Wait for data load
        cy.waitForCkeditorToHaveLoaded();

        cy.get('.StandardPage form > div > div:nth-child(7)')
            .within(() => {
                cy.root()
                    .children('.StandardCard')
                    .children('div')
                    .children('div')
                    .children('h3')
                    .should('have.text', 'Files');

                cy.get('div:nth-child(2) > div > div:nth-child(1) .StandardCard')
                    .within(() => {
                        // prettier-ignore
                        const fileSizeInMB = Math.round(
                            record.fez_datastream_info[1].dsi_size / 1024 / 1024 * 100
                        ) / 100;
                        cy.get('h3')
                            .should('have.text', 'Attached files');
                        cy.get('p')
                            .eq(0)
                            .should('have.text', record.fez_datastream_info[1].dsi_dsid);
                        cy.get('input')
                            .eq(0)
                            .should('have.value', record.fez_datastream_info[1].dsi_label);
                        cy.get('p')
                            .eq(1)
                            .should('have.text', `${fileSizeInMB} MB`);
                        cy.get('input')
                            .eq(1)
                            .should('have.value', moment(record.fez_datastream_info[1].dsi_embargo_date)
                                .format('DD/MM/YYYY'));
                    });

                cy.get('div:nth-child(2) > div > div:nth-child(2) .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Files');
                    });
                cy.get('div:nth-child(2) > div > div:nth-child(3) .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Advisory statement');
                        cy.get('span span')
                            .eq(0)
                            .should('have.text', 'Advisory statement');
                        // No advisory statement in mock
                    });
                cy.get('div:nth-child(2) > div > div:nth-child(4) .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Copyright agreement');
                        cy.get('#deposit-agreement')
                            .should($checkbox => {
                                if (record.rek_copyright === 'on') {
                                    expect($checkbox).to.be.checked;
                                } else {
                                    expect($checkbox).not.to.be.checked;
                                }
                            });
                    });
            });
        cy.get('#deposit-agreement')
            .click();
        cy.get('.StandardPage form > div > div:nth-child(9)')
            .within(() => {
                cy.get('.Alert')
                    .should('exist')
                    .find('.alert-text')
                    .should('contain', 'Validation -')
                    .find('li')
                    .should('have.length', 1)
                    .should('contain', 'You are required to accept deposit agreement');
            });
        cy.get('.StandardPage form > div > div:nth-child(10) button')
            .should('be.disabled');
    });

    it('should render Security tab', () => {
        cy.get('.StandardPage form > div > div:nth-child(8)')
            .within(() => {
                cy.root()
                    .children('.StandardCard')
                    .children('div')
                    .children('div')
                    .children('h3')
                    .should('have.text', 'Security');

                cy.get('.StandardCard .StandardCard')
                    .within(() => {
                        cy.get('h3')
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
                                .should('be.not.checked');
                        }
                    });
            });
    });
});
