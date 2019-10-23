import { default as recordList } from '../../../src/mock/data/records/publicationTypeListDigilibImage';
import moment from 'moment';

context('Digilib Image admin edit', () => {
    const record = recordList.data[0];

    beforeEach(() => {
        cy.visit(`/admin/edit/${record.rek_pid}?user=uqstaff`);
        cy.closeUnsupported();
        cy.wait(1000); // Wait for data load
    });

    afterEach(() => {
        cy.window()
            .then(win => (win.onbeforeunload = undefined));
    });

    it('should load with specifed elements', () => {
        cy.get('.StandardPage form > div > div > div.StandardCard > div > div > h3')
            .as('cards')
            .should('have.length', 8);

        cy.get('.StandardPage form > div > div:nth-child(9)')
            .within(() => {
                cy.get('.Alert')
                    .should('exist')
                    .find('.alert-text')
                    .should('contain', 'Validation -')
                    .find('li')
                    .should('have.length', 2)
                    .should('contain', 'Publication date is required')
                    .should('contain', 'You are required to accept deposit agreement');
            });

        cy.get('.StandardPage form > div > div:nth-child(10) button')
            .should('exist')
            .should('be.disabled');

        cy.get('input[value=tabbed]')
            .click()
            .should('be.checked');

        cy.get('@cards')
            .should('have.length', 1)
            .should('have.text', 'Bibliographic');

        cy.get('[role="tab"]')
            .eq(2)
            .find('[class*="MuiBadge-colorError"]')
            .should('have.text', '1');

        cy.get('[role="tab"]')
            .eq(6)
            .find('[class*="MuiBadge-colorError"]')
            .should('have.text', '1');
    });

    it('should render Digilib Image specific fields on the Bibliographic tab', () => {
        cy.get('.StandardPage form > div > div:nth-child(3)')
            .within(() => {
                cy.root()
                    .children('.StandardCard')
                    .children('div')
                    .children('div')
                    .children('h3')
                    .should('have.text', 'Bibliographic');

                cy.get('div:nth-child(2) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Bibliographic');

                        cy.get('#Rights')
                            .should('have.value', record.fez_record_search_key_rights.rek_rights);
                        cy.get('label[id="Refereed source-label"]')
                            .parent()
                            .find('input[type=hidden]')
                            .should('have.value', record.fez_record_search_key_refereed_source.rek_refereed_source)
                            .siblings('[role=button]')
                            .should('have.text', record.fez_record_search_key_refereed_source.rek_refereed_source_lookup);
                        cy.get('[placeholder="Construction date"]')
                            .should(
                                'have.value',
                                record.fez_record_search_key_construction_date.rek_construction_date,
                            );
                        cy.get('[placeholder="Date photo taken"]')
                            .should(
                                'have.value',
                                moment(record.fez_record_search_key_date_photo_taken.rek_date_photo_taken)
                                    .format('DD/MM/YYYY'),
                            );
                        cy.get('[placeholder="Date photo scanned"]')
                            .should(
                                'have.value',
                                moment(record.fez_record_search_key_date_scanned.rek_date_scanned)
                                    .format('DD/MM/YYYY'),
                            );
                    });

                cy.get('div:nth-child(3) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Related publications');
                        const relatedPubs = record.fez_record_search_key_isderivationof.map(
                            item => item.rek_isderivationof_lookup,
                        );
                        relatedPubs.forEach((pub, index) => {
                            cy.get('p')
                                .eq(index)
                                .should('have.text', pub);
                        });
                    });

                cy.get('div:nth-child(4) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Period(s)');
                        const pubs = record.fez_record_search_key_period.map(pub => pub.rek_period);
                        pubs.forEach((pub, index) => {
                            cy.get('p')
                                .eq(index)
                                .should('have.text', pub);
                        });
                    });

                cy.get('div:nth-child(5) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Structural system(s)');
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

                cy.get('div:nth-child(6) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Style');
                        const pubs = record.fez_record_search_key_style.map(pub => pub.rek_style);
                        pubs.forEach((pub, index) => {
                            cy.get('p')
                                .eq(index)
                                .should('have.text', pub);
                        });
                    });

                cy.get('div:nth-child(7) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Subcategory(ies)');
                        const pubs = record.fez_record_search_key_subcategory.map(pub => pub.rek_subcategory);
                        pubs.forEach((pub, index) => {
                            cy.get('p')
                                .eq(index)
                                .should('have.text', pub);
                        });
                    });

                cy.get('div:nth-child(8) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Surrounding feature(s)');
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

                cy.get('div:nth-child(9) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Interior feature(s)');
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

                cy.get('div:nth-child(10) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Building material(s)');
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

                cy.get('div:nth-child(11) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Category(ies)');
                        const pubs = record.fez_record_search_key_category.map(pub => pub.rek_category);
                        pubs.forEach((pub, index) => {
                            cy.get('p')
                                .eq(index)
                                .should('have.text', pub);
                        });
                    });

                cy.get('div:nth-child(12) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Condition(s)');
                        const pubs = record.fez_record_search_key_condition.map(pub => pub.rek_condition);
                        pubs.forEach((pub, index) => {
                            cy.get('p')
                                .eq(index)
                                .should('have.text', pub);
                        });
                    });

                cy.get('div:nth-child(13) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Alternative title(s)');
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

                cy.get('div:nth-child(14) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Architectural feature(s)');
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
                        cy.get('h3')
                            .should('have.text', 'Architects');
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

                cy.get('div:nth-child(2) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Photographers');
                        const authors = record.fez_record_search_key_author.map(item => item.rek_author);
                        authors.forEach((author, index) => {
                            cy.get('p')
                                .eq(index)
                                .should('have.text', author);
                        });
                    });

                cy.get('div:nth-child(3) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Other contributors');
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
