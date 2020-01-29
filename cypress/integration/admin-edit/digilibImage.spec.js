import { default as recordList } from '../../../src/mock/data/records/publicationTypeListDigilibImage';

context('Digilib Image admin edit', () => {
    const record = recordList.data[0];

    beforeEach(() => {
        cy.loadRecordForAdminEdit(record.rek_pid);
    });

    afterEach(() => {
        cy.adminEditCleanup();
    });

    it('should load with specifed elements', () => {
        cy.adminEditCountCards(8);
        cy.adminEditVerifyAlerts(2, ['Publication date is required', 'You are required to accept deposit agreement']);

        cy.adminEditTabbedView();
        cy.adminEditCheckDefaultTab('Bibliographic');
        cy.adminEditCheckTabErrorBadge(2);
        cy.adminEditCheckTabErrorBadge(6);
    });

    it('should render the different sections as expected', () => {
        // ------------------------------------------ BIBLIOGRAPHIC TAB ----------------------------------------------
        cy.log('Bibliographic tab');
        cy.get('.StandardPage form .StandardCard')
            .eq(2)
            .within(() => {
                cy.get('h3')
                    .should('have.text', 'Bibliographic');

                cy.get('.AdminCard')
                    .as('cards')
                    .eq(1)
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'Bibliographic');

                        cy.get('#Rights')
                            .should('have.value', record.fez_record_search_key_rights.rek_rights);
                        cy.get('label[id="Refereed source-label"]')
                            .parent()
                            .find('input[type=hidden]')
                            .should('have.value', record.fez_record_search_key_refereed_source.rek_refereed_source)
                            .siblings('[role=button]')
                            .should(
                                'have.text',
                                record.fez_record_search_key_refereed_source.rek_refereed_source_lookup,
                            );
                        cy.get('[placeholder="Construction date"]')
                            .should(
                                'have.value',
                                record.fez_record_search_key_construction_date.rek_construction_date,
                            );
                        cy.get('[placeholder="Date photo taken"]')
                            .should(
                                'have.value',
                                Cypress.moment(record.fez_record_search_key_date_photo_taken.rek_date_photo_taken)
                                    .format(
                                        'DD/MM/YYYY',
                                    ),
                            );
                        cy.get('[placeholder="Date photo scanned"]')
                            .should(
                                'have.value',
                                Cypress.moment(record.fez_record_search_key_date_scanned.rek_date_scanned)
                                    .format(
                                        'DD/MM/YYYY',
                                    ),
                            );
                    });

                cy.get('@cards')
                    .eq(2)
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

                cy.get('@cards')
                    .eq(3)
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'Period(s)');
                        const pubs = record.fez_record_search_key_period.map(pub => pub.rek_period);
                        pubs.forEach((pub, index) => {
                            cy.get('p')
                                .eq(index)
                                .should('have.text', pub);
                        });
                    });

                cy.get('@cards')
                    .eq(4)
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'Structural system(s)');
                        // prettier-ignore
                        const pubs = record.fez_record_search_key_structural_systems.map(
                            pub => pub.rek_structural_systems
                        );
                        pubs.forEach((pub, index) => {
                            cy.get('p')
                                .eq(index)
                                .should('have.text', pub);
                        });
                    });

                cy.get('@cards')
                    .eq(5)
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'Style');
                        const pubs = record.fez_record_search_key_style.map(pub => pub.rek_style);
                        pubs.forEach((pub, index) => {
                            cy.get('p')
                                .eq(index)
                                .should('have.text', pub);
                        });
                    });

                cy.get('@cards')
                    .eq(6)
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'Subcategory(ies)');
                        const pubs = record.fez_record_search_key_subcategory.map(pub => pub.rek_subcategory);
                        pubs.forEach((pub, index) => {
                            cy.get('p')
                                .eq(index)
                                .should('have.text', pub);
                        });
                    });

                cy.get('@cards')
                    .eq(7)
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'Surrounding feature(s)');
                        // prettier-ignore
                        const pubs = record.fez_record_search_key_surrounding_features.map(
                            pub => pub.rek_surrounding_features
                        );
                        pubs.forEach((pub, index) => {
                            cy.get('p')
                                .eq(index)
                                .should('have.text', pub);
                        });
                    });

                cy.get('@cards')
                    .eq(8)
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'Interior feature(s)');
                        // prettier-ignore
                        const pubs = record.fez_record_search_key_interior_features.map(
                            pub => pub.rek_interior_features
                        );
                        pubs.forEach((pub, index) => {
                            cy.get('p')
                                .eq(index)
                                .should('have.text', pub);
                        });
                    });

                cy.get('@cards')
                    .eq(9)
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'Building material(s)');
                        // prettier-ignore
                        const pubs = record.fez_record_search_key_building_materials.map(
                            pub => pub.rek_building_materials
                        );
                        pubs.forEach((pub, index) => {
                            cy.get('p')
                                .eq(index)
                                .should('have.text', pub);
                        });
                    });

                cy.get('@cards')
                    .eq(10)
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'Category(ies)');
                        const pubs = record.fez_record_search_key_category.map(pub => pub.rek_category);
                        pubs.forEach((pub, index) => {
                            cy.get('p')
                                .eq(index)
                                .should('have.text', pub);
                        });
                    });

                cy.get('@cards')
                    .eq(11)
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'Condition(s)');
                        const pubs = record.fez_record_search_key_condition.map(pub => pub.rek_condition);
                        pubs.forEach((pub, index) => {
                            cy.get('p')
                                .eq(index)
                                .should('have.text', pub);
                        });
                    });

                cy.get('@cards')
                    .eq(12)
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'Alternative title(s)');
                        // prettier-ignore
                        const pubs = record.fez_record_search_key_alternative_title.map(
                            pub => pub.rek_alternative_title
                        );
                        pubs.forEach((pub, index) => {
                            cy.get('p')
                                .eq(index)
                                .should('have.text', pub);
                        });
                    });

                cy.get('@cards')
                    .eq(13)
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'Architectural feature(s)');
                        const pubs = record.fez_record_search_key_architectural_features.map(
                            pub => pub.rek_architectural_features,
                        );
                        pubs.forEach((pub, index) => {
                            cy.get('p')
                                .eq(index)
                                .should('have.text', pub);
                        });
                    });
            });

        // ------------------------------------------ AUTHOR DETAILS TAB ---------------------------------------------
        cy.log('Author Details tab');
        cy.get('.StandardPage form .StandardCard')
            .eq(3)
            .within(() => {
                cy.get('h3')
                    .should('have.text', 'Author details');

                cy.get('.AdminCard')
                    .as('cards')
                    .eq(0)
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'Architects');
                        // prettier-ignore
                        const architects = record.fez_record_search_key_architect_name.map(
                            item => item.rek_architect_name
                        );
                        architects.forEach((author, index) => {
                            cy.get('p')
                                .eq(index)
                                .should('have.text', author);
                        });
                    });

                cy.get('@cards')
                    .eq(1)
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'Photographers');
                        const authors = record.fez_record_search_key_author.map(item => item.rek_author);
                        authors.forEach((author, index) => {
                            cy.get('p')
                                .eq(index)
                                .should('have.text', author);
                        });
                    });

                cy.get('@cards')
                    .eq(2)
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'Other contributors');
                        const contributors = record.fez_record_search_key_contributor.map(item => item.rek_contributor);
                        contributors.forEach((contributor, index) => {
                            cy.get('p')
                                .eq(index)
                                .should('have.text', contributor);
                        });
                    });
            });
    });
});
