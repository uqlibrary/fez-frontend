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
        cy.adminEditCountCards(7);
        cy.adminEditNoAlerts();

        cy.adminEditTabbedView();
        cy.adminEditCheckDefaultTab('Bibliographic');
    });

    it('should render the different sections as expected', () => {
        // ------------------------------------------ BIBLIOGRAPHIC TAB ----------------------------------------------
        cy.log('----------------Bibliographic tab----------------');
        cy.get('[data-testid=bibliographic-section-header]').should('have.text', 'Bibliographic');
        cy.get('[data-testid=bibliographic-section-content]').within(() => {
            cy.get('.AdminCard')
                .as('cards')
                .eq(0)
                .within(() => {
                    cy.get('h4').should('contain', 'Title');
                    cy.get('span span')
                        .eq(0)
                        .should('contain.text', 'Formatted title');
                    cy.readCKEditor('rek-title').then(text => {
                        expect(text).to.contain(record.rek_title);
                    });
                });

            cy.get('@cards')
                .eq(1)
                .within(() => {
                    cy.get('h4').should('contain', 'Language of work');
                    const langCodes = record.fez_record_search_key_language.map(lang => lang.rek_language);
                    cy.get('[data-testid=rek-language-input]').should('have.value', langCodes.join(','));
                });

            cy.get('@cards')
                .eq(2)
                .within(() => {
                    cy.get('h4').should('contain', 'Bibliographic');

                    cy.get('[data-testid=rek-total-pages-input]').should(
                        'have.value',
                        record.fez_record_search_key_total_pages.rek_total_pages,
                    );

                    cy.checkPartialDateFromRecordValue('rek-date', record.rek_date);

                    cy.get('span span')
                        .eq(0)
                        .should('have.text', 'Abstract / Description');

                    cy.get('[data-testid=rek-genre-type-input]')
                        .should('have.value', record.rek_genre_type)
                        .get('[data-testid=rek-genre-type-select]')
                        .should('have.text', record.rek_genre_type);

                    cy.get('[data-testid=rek-org-name-input]').should(
                        'have.value',
                        record.fez_record_search_key_org_name.rek_org_name,
                    );
                    cy.get('[data-testid=rek-org-unit-name-input]').should(
                        'have.value',
                        record.fez_record_search_key_org_unit_name.rek_org_unit_name,
                    );
                });

            cy.get('@cards')
                .eq(3)
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
                .eq(4)
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
                .eq(5)
                .within(() => {
                    cy.get('h4').should('contain', 'Related publications');
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

        // ------------------------------------------ AUTHOR DETAILS TAB ---------------------------------------------
        cy.log('----------------Author Details tab----------------');
        cy.get('[data-testid=authors-section-header]').should('have.text', 'Authors');
        cy.get('[data-testid=authors-section-content]').within(() => {
            cy.get('[data-testid=rek-author-list]').within(() => {
                const authors = record.fez_record_search_key_author.map(item => item.rek_author);
                authors.forEach((person, index) => {
                    cy.get(`[data-testid=rek-author-list-row-${index}-name-as-published]`).should('have.text', person);
                });
            });

            cy.get('[data-testid=rek-contributor-list]').within(() => {
                const contributors = record.fez_record_search_key_contributor.map(item => item.rek_contributor);
                contributors.forEach((person, index) => {
                    cy.get(`[data-testid=rek-contributor-list-row-${index}-name-as-published]`).should(
                        'have.text',
                        person,
                    );
                });
            });

            cy.get('[data-testid=rek-supervisor-list]').within(() => {
                const supervisors = record.fez_record_search_key_supervisor.map(item => item.rek_supervisor);
                supervisors.forEach((person, index) => {
                    cy.get(`[data-testid=rek-supervisor-list-row-${index}-name-as-published]`).should(
                        'have.text',
                        person,
                    );
                });
            });
        });

        // ----------------------------------------------- ADMIN TAB -------------------------------------------------
        cy.log('----------------Admin tab----------------');
        cy.get('[data-testid=admin-section-header]').should('have.text', 'Admin');
        cy.get('[data-testid=admin-section-content]').within(() => {
            cy.get('.AdminCard')
                .as('cards')
                .eq(0)
                .within(() => {
                    cy.get('h4').should('contain', 'Member of collection');
                    cy.get('#rek-ismemberof-label').should('contain', 'Member of collection');

                    cy.get('[class*="MuiAutocomplete-tag"]')
                        .eq(0)
                        .should('have.text', 'UQ Theses (HDR) - Open Access');
                    cy.get('[class*="MuiAutocomplete-tag"]')
                        .eq(1)
                        .should('have.text', 'UQ Theses (HDR) - Official');
                });

            cy.get('@cards')
                .eq(1)
                .within(() => {
                    cy.get('h4').should('contain', 'Additional information');
                    cy.get('[data-testid=rek-oa-status-input]')
                        .should('have.value', record.fez_record_search_key_oa_status.rek_oa_status.toString())
                        .get('[data-testid=rek-oa-status-select]')
                        .should('have.text', record.fez_record_search_key_oa_status.rek_oa_status_lookup);
                    cy.get('[data-testid=rek-license-input]')
                        .should('have.value', record.fez_record_search_key_license.rek_license.toString())
                        .siblings('[role=button]')
                        .invoke('text')
                        .should('equal', record.fez_record_search_key_license.rek_license_lookup);
                });
        });

        // ----------------------------------------------- NOTES TAB -------------------------------------------------
        cy.log('----------------Admin tab----------------');
        cy.get('[data-testid=notes-section-header]').should('have.text', 'Notes');
        cy.get('[data-testid=notes-section-content]').within(() => {
            cy.get('.AdminCard')
                .as('cards')
                .eq(0)
                .within(() => {
                    cy.get('span span')
                        .eq(0)
                        .should('have.text', 'Additional notes (public)');
                    cy.readCKEditor('rek-notes').then(text => {
                        expect(text).to.contain(record.fez_record_search_key_notes.rek_notes);
                    });
                });
        });

        // ---------------------------------------------- FILES TAB --------------------------------------------------
        cy.log('----------------Files tab----------------');
        cy.get('[data-testid=files-section-header]').should('have.text', 'Files');
        cy.get('[data-testid=files-section-content]').within(() => {
            cy.get('.AdminCard')
                .as('cards')
                .eq(0)
                .within(() => {
                    cy.get('h4').should('contain', 'Files');
                    // No visible files in mock
                });
            cy.get('@cards')
                .eq(1)
                .within(() => {
                    cy.get('h4').should('contain', 'Advisory statement');
                });
            cy.get('h4').should('contain', 'Copyright agreement');
            cy.get('[data-testid=rek-copyright-input]').should($checkbox => {
                if (record.rek_copyright === 'on') {
                    expect($checkbox).to.be.checked;
                } else {
                    expect($checkbox).not.to.be.checked;
                }
            });
        });

        // --------------------------------------------- SECURITY TAB ------------------------------------------------
        cy.log('----------------Security tab----------------');
        cy.get('[data-testid=security-section-header]').should('have.text', 'Security');
        cy.get('[data-testid=security-section-content]').within(() => {
            cy.get('div:nth-child(1) > .StandardCard').within(() => {
                cy.get('h4').should('have.text', `Work level security - ${record.rek_pid}`);
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
            cy.viewport(1024, 2000);
            cy.get('div:nth-child(2) > .StandardCard').within(() => {
                cy.get('h4').should('have.text', `Datastream level security - ${record.rek_pid}`);
                cy.get('h6')
                    .eq(0)
                    .should('have.text', 'Inherited datastream security policy details');
                cy.get('h6')
                    .eq(5)
                    .should('have.text', 'Override datastream security policy details');
                cy.get('a').should('have.length', 9); // only non-derivatives are displayed
            });
        });
    });
});

context('Author affiliations', () => {
    const record = recordList.data[0];

    beforeEach(() => {
        cy.loadRecordForAdminEdit(record.rek_pid);
    });

    afterEach(() => {
        cy.adminEditCleanup();
    });
    it('should not be available for this work type', () => {
        cy.assertAffiliationsAllowed({
            authorName: 'Steve Su (uqysu4)',
            orgName: 'The University of Queensland',
            rowId: 2,
        });
    });
});
