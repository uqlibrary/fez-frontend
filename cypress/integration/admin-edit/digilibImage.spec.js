import { default as recordList } from '../../../src/mock/data/records/publicationTypeListDigilibImage';

context('Digilib Image admin edit', () => {
    const record = recordList.data[0];

    beforeEach(() => {
        cy.loadRecordForAdminEdit(record.rek_pid);
    });

    afterEach(() => {
        cy.adminEditCleanup();
    });

    it('should load with specified elements', () => {
        cy.adminEditCountCards(8);
        cy.adminEditVerifyAlerts(2, ['Publication date is required', 'You are required to accept deposit agreement']);
        cy.adminEditTabbedView();
        cy.adminEditCheckDefaultTab('Bibliographic');
        cy.adminEditCheckTabErrorBadge('bibliographic');
        cy.adminEditCheckTabErrorBadge('files');
    });

    it('should render the different sections as expected', () => {
        // ------------------------------------------ BIBLIOGRAPHIC TAB ----------------------------------------------
        cy.log('Bibliographic tab');
        cy.get('[data-testid=bibliographic-section-header]').should('have.text', 'Bibliographic');
        cy.get('[data-testid=bibliographic-section-content]')
            .as('bibliographicTab')
            .within(() => {
                cy.get('h4').should('contain', 'Bibliographic');

                cy.get('[data-testid=rek-rights-input]').should(
                    'have.value',
                    record.fez_record_search_key_rights.rek_rights,
                );

                cy.get('[data-testid=rek-construction-date-input]').should(
                    'have.value',
                    record.fez_record_search_key_construction_date.rek_construction_date,
                );

                cy.checkPartialDateFromRecordValue(
                    'rek-date-photo-taken',
                    record.fez_record_search_key_date_photo_taken.rek_date_photo_taken,
                );

                cy.checkPartialDateFromRecordValue(
                    'rek-date-scanned',
                    record.fez_record_search_key_date_scanned.rek_date_scanned,
                );

                cy.get('@bibliographicTab')
                    .get('.AdminCard')
                    .eq(2)
                    .within(() => {
                        cy.get('h4').should('contain', 'Geographic co-ordinates');
                        cy.get('[data-testid="rek-geographic-area"]').should('exist');
                    });

                cy.get('@bibliographicTab')
                    .get('.AdminCard')
                    .eq(3)
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

                cy.get('@bibliographicTab')
                    .get('.AdminCard')
                    .eq(4)
                    .within(() => {
                        cy.get('h4').should('contain', 'Period(s)');
                        const pubs = record.fez_record_search_key_period.map(pub => pub.rek_period);
                        pubs.forEach((pub, index) => {
                            cy.get('p')
                                .eq(index)
                                .should('have.text', pub);
                        });
                    });

                cy.get('@bibliographicTab')
                    .get('.AdminCard')
                    .eq(5)
                    .within(() => {
                        cy.get('h4').should('contain', 'Structural system(s)');
                        const pubs = record.fez_record_search_key_structural_systems.map(
                            pub => pub.rek_structural_systems,
                        );
                        pubs.forEach((pub, index) => {
                            cy.get('p')
                                .eq(index)
                                .should('have.text', pub);
                        });
                    });

                cy.get('@bibliographicTab')
                    .get('.AdminCard')
                    .eq(6)
                    .within(() => {
                        cy.get('h4').should('contain', 'Style');
                        const pubs = record.fez_record_search_key_style.map(pub => pub.rek_style);
                        pubs.forEach((pub, index) => {
                            cy.get('p')
                                .eq(index)
                                .should('have.text', pub);
                        });
                    });

                cy.get('@bibliographicTab')
                    .get('.AdminCard')
                    .eq(7)
                    .within(() => {
                        cy.get('h4').should('contain', 'Subcategory(ies)');
                        const pubs = record.fez_record_search_key_subcategory.map(pub => pub.rek_subcategory);
                        pubs.forEach((pub, index) => {
                            cy.get('p')
                                .eq(index)
                                .should('have.text', pub);
                        });
                    });

                cy.get('@bibliographicTab')
                    .get('.AdminCard')
                    .eq(8)
                    .within(() => {
                        cy.get('h4').should('contain', 'Surrounding feature(s)');
                        const pubs = record.fez_record_search_key_surrounding_features.map(
                            pub => pub.rek_surrounding_features,
                        );
                        pubs.forEach((pub, index) => {
                            cy.get('p')
                                .eq(index)
                                .should('have.text', pub);
                        });
                    });

                cy.get('@bibliographicTab')
                    .get('.AdminCard')
                    .eq(9)
                    .within(() => {
                        cy.get('h4').should('contain', 'Interior feature(s)');
                        const pubs = record.fez_record_search_key_interior_features.map(
                            pub => pub.rek_interior_features,
                        );
                        pubs.forEach((pub, index) => {
                            cy.get('p')
                                .eq(index)
                                .should('have.text', pub);
                        });
                    });

                cy.get('@bibliographicTab')
                    .get('.AdminCard')
                    .eq(10)
                    .within(() => {
                        cy.get('h4').should('contain', 'Building material(s)');
                        const pubs = record.fez_record_search_key_building_materials.map(
                            pub => pub.rek_building_materials,
                        );
                        pubs.forEach((pub, index) => {
                            cy.get('p')
                                .eq(index)
                                .should('have.text', pub);
                        });
                    });

                cy.get('@bibliographicTab')
                    .get('.AdminCard')
                    .eq(11)
                    .within(() => {
                        cy.get('h4').should('contain', 'Category(ies)');
                        const pubs = record.fez_record_search_key_category.map(pub => pub.rek_category);
                        pubs.forEach((pub, index) => {
                            cy.get('p')
                                .eq(index)
                                .should('have.text', pub);
                        });
                    });

                cy.get('@bibliographicTab')
                    .get('.AdminCard')
                    .eq(12)
                    .within(() => {
                        cy.get('h4').should('contain', 'Condition(s)');
                        const pubs = record.fez_record_search_key_condition.map(pub => pub.rek_condition);
                        pubs.forEach((pub, index) => {
                            cy.get('p')
                                .eq(index)
                                .should('have.text', pub);
                        });
                    });

                cy.get('@bibliographicTab')
                    .get('.AdminCard')
                    .eq(13)
                    .within(() => {
                        cy.get('h4').should('contain', 'Alternative title(s)');
                        const pubs = record.fez_record_search_key_alternative_title.map(
                            pub => pub.rek_alternative_title,
                        );
                        pubs.forEach((pub, index) => {
                            cy.get('p')
                                .eq(index)
                                .should('have.text', pub);
                        });
                    });

                cy.get('@bibliographicTab')
                    .get('.AdminCard')
                    .eq(14)
                    .within(() => {
                        cy.get('h4').should('contain', 'Architectural feature(s)');
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
        cy.get('[data-testid=authors-section-header]').should('have.text', 'Authors');
        cy.get('[data-testid=authors-section-content]')
            .as('authorDetailsTab')
            .within(() => {
                cy.get('.AdminCard')
                    .as('cards')
                    .eq(0)
                    .within(() => {
                        cy.get('h4').should('contain', 'Architects');
                        const architects = record.fez_record_search_key_architect_name.map(
                            item => item.rek_architect_name,
                        );
                        architects.forEach((author, index) => {
                            cy.get(`[data-testid=rek-architect-name-list-row-${index}-name-as-published]`).should(
                                'have.text',
                                author,
                            );
                        });
                    });

                cy.get('@cards')
                    .eq(1)
                    .within(() => {
                        cy.get('h4').should('contain', 'Photographers');
                        const authors = record.fez_record_search_key_author.map(item => item.rek_author);
                        authors.forEach((author, index) => {
                            cy.get(`[data-testid=rek-author-list-row-${index}-name-as-published]`).should(
                                'have.text',
                                author,
                            );
                        });
                    });

                cy.get('@cards')
                    .eq(2)
                    .within(() => {
                        cy.get('h4').should('contain', 'Other contributors');
                        const contributors = record.fez_record_search_key_contributor.map(item => item.rek_contributor);
                        contributors.forEach((contributor, index) => {
                            cy.get(`[data-testid=rek-contributor-list-row-${index}-name-as-published]`).should(
                                'have.text',
                                contributor,
                            );
                        });
                    });
            });

        // ------------------------------------------- IDENTIFIERS TAB -----------------------------------------------
        cy.log('Identifiers tab');
        cy.get('[data-testid=identifiers-section-content]').within(() => {
            cy.get('h4').should('contain', 'Location');
            const locations = record.fez_record_search_key_location.map(item => item.rek_location);
            locations.forEach((location, index) => {
                cy.get(`[data-testid=rek-location-list-row-${index}]`).should('have.text', location);
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
            rowId: 1,
        });
    });
});
