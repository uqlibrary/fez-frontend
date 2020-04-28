import { default as recordList } from '../../../src/mock/data/records/publicationTypeListThesis';

context('Thesis admin edit', () => {
    const record = recordList.data[0];

    beforeEach(() => {
        cy.loadRecordForAdminEdit(record.rek_pid);
    });

    afterEach(() => {
        cy.adminEditCleanup();
    });

    it('should load the nav bar', () => {
        cy.adminEditCountCards(6);
        cy.adminEditNoAlerts();

        cy.adminEditTabbedView();
        cy.adminEditCheckDefaultTab('Bibliographic');
    });

    it('should render the different sections as expected', () => {
        // ------------------------------------------ BIBLIOGRAPHIC TAB ----------------------------------------------
        cy.log('Bibliographic tab');
        cy.get('.StandardPage form .StandardCard')
            .eq(1)
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
                            .should('contain', 'Language of work');
                        const langCodes = record.fez_record_search_key_language.map(lang => lang.rek_language);
                        cy.get('label[id="Language of work-label"]')
                            .parent()
                            .find('input[type=hidden]')
                            .should('have.value', langCodes.join(','))
                            .siblings('[role=button] span')
                            .should('have.length', 0); // If no matching codes found, there is a span present
                    });

                cy.get('@cards')
                    .eq(2)
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'Bibliographic');

                        cy.get('[id="Totalpages/Extent"]')
                            .should(
                                'have.value',
                                record.fez_record_search_key_total_pages.rek_total_pages,
                            );

                        cy.checkPartialDateFromRecordValue('Publication date', record.rek_date);

                        cy.get('span span')
                            .eq(0)
                            .should('have.text', 'Abstract / Description');

                        cy.get('label[id="Thesis type-label"]')
                            .parent()
                            .find('input[type=hidden]')
                            .should('have.value', record.rek_genre_type)
                            .siblings('[role=button]')
                            .should('have.text', record.rek_genre_type);

                        cy.get('#org-name-field')
                            .should(
                                'have.value',
                                record.fez_record_search_key_org_name.rek_org_name,
                            );
                        cy.get('#org-unit-name-field')
                            .should(
                                'have.value',
                                record.fez_record_search_key_org_unit_name.rek_org_unit_name,
                            );
                    });

                cy.get('@cards')
                    .eq(3)
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
                    .eq(4)
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
                    .eq(5)
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'Related publications');
                        const relatedPubs = record.fez_record_search_key_isderivationof.map(
                            item => item.rek_isderivationof_lookup,
                        );
                        relatedPubs.forEach((pub, index) => {
                            cy.get('p')
                                .eq(index)
                                .should('have.text', pub);
                        });
                    });
            });

        cy.get('#org-unit-name-field')
            .parent()
            .within(() => {
                cy.get('[title="Clear"]')
                    .click({ force: true });
            });

        cy.get('#org-unit-name-field-helper-text')
            .should('have.text', 'This field is required');

        cy.adminEditVerifyAlerts(1, ['Enrolling unit is required']);

        // ------------------------------------------ AUTHOR DETAILS TAB ---------------------------------------------
        cy.log('Author Details tab');
        cy.get('.StandardPage form .StandardCard')
            .eq(2)
            .within(() => {
                cy.get('h3')
                    .should('have.text', 'Author details');

                cy.get('.AdminCard')
                    .as('cards')
                    .eq(0)
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'Authors');
                        const authors = record.fez_record_search_key_author.map(item => item.rek_author);
                        authors.forEach((person, index) => {
                            cy.get('p')
                                .eq(2 * index)
                                .should('have.text', person);
                        });
                    });

                cy.get('@cards')
                    .eq(1)
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'Editors');
                        const contributors = record.fez_record_search_key_contributor.map(item => item.rek_contributor);
                        contributors.forEach((person, index) => {
                            cy.get('p')
                                .eq(index)
                                .should('have.text', person);
                        });
                    });

                cy.get('@cards')
                    .eq(2)
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'Supervisors');
                        const supervisors = record.fez_record_search_key_supervisor.map(item => item.rek_supervisor);
                        supervisors.forEach((person, index) => {
                            cy.get('p')
                                .eq(index)
                                .should('have.text', person);
                        });
                    });
            });

        // ----------------------------------------------- ADMIN TAB -------------------------------------------------
        cy.log('Admin tab');
        cy.get('.StandardPage form .StandardCard')
            .eq(3)
            .within(() => {
                cy.get('h3')
                    .should('have.text', 'Admin');

                cy.get('.AdminCard')
                    .as('cards')
                    .eq(0)
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'Member of collections');
                        cy.get('#member-of-collections-input-label')
                            .should('contain', 'Member of collections');

                        cy.get('[class*="MuiAutocomplete-tag-"]')
                            .eq(0)
                            .should('have.text', 'UQ Theses (RHD) - Official');
                        cy.get('[class*="MuiAutocomplete-tag-"]')
                            .eq(1)
                            .should('have.text', 'UQ Thesis (RHD) - Open Access');
                    });

                cy.get('@cards')
                    .eq(1)
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'Additional information');
                        cy.get('label[id="OA status-label"]')
                            .parent()
                            .find('input[type=hidden]')
                            .should('have.value', record.fez_record_search_key_oa_status.rek_oa_status.toString())
                            .siblings('[role=button]')
                            .should('have.text', record.fez_record_search_key_oa_status.rek_oa_status_lookup);
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

        // ---------------------------------------------- FILES TAB --------------------------------------------------
        cy.log('Files tab');
        cy.get('.StandardPage form .StandardCard')
            .eq(4)
            .within(() => {
                cy.get('h3')
                    .eq(0)
                    .should('have.text', 'Files');

                cy.get('.AdminCard')
                    .as('cards')
                    .eq(0)
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'Files');
                        // No visible files in mock
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
            });

        // --------------------------------------------- SECURITY TAB ------------------------------------------------
        cy.log('Security tab');
        cy.get('.StandardPage form .StandardCard')
            .eq(6)
            .within(() => {
                cy.root()
                    .children('div')
                    .children('div')
                    .children('h3')
                    .should('have.text', 'Security');

                cy.get('div:nth-child(1) > .StandardCard')
                    .within(() => {
                        cy.get('h4')
                            .should(
                                'have.text',
                                `${record.rek_object_type_lookup} level security - ${record.rek_pid}`,
                            );
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
                cy.get('div:nth-child(2) > .StandardCard')
                    .within(() => {
                        cy.get('h4')
                            .should('have.text', `Datastream level security - ${record.rek_pid}`);
                        cy.get('h6')
                            .eq(0)
                            .should('have.text', 'Inherited datastream security policy details');
                        cy.get('h6')
                            .eq(5)
                            .should('have.text', 'Override datastream security policy details');
                        cy.get('a')
                            .should('have.length', 11); // only non-derivatives are displayed
                    });
            });
    });
});
