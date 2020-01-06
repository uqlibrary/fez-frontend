import { default as recordList } from '../../../src/mock/data/records/publicationTypeListResearchReport';

context('Research Report admin edit', () => {
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
            .should('have.length', 9);

        cy.get('.StandardPage form > div:nth-child(2)')
            .within(() => {
                cy.get('.Alert')
                    .should('not.exist');
            });

        cy.get('.StandardPage form button')
            .contains('Submit')
            .should('exist')
            .parent()
            .should('be.enabled');

        cy.get('input[value=tabbed]')
            .should('have.value', 'tabbed') // force the get to wait for the element
            .click()
            .should('be.checked');

        cy.get('@cards')
            .should('have.length', 1)
            .should('have.text', 'Bibliographic');
    });

    it('should render Research Report specific fields on the Bibliographic tab', () => {
        cy.get('.StandardPage form .StandardCard')
            .eq(2)
            .within(() => {
                cy.get('h3')
                    .should('have.text', 'Bibliographic');

                cy.get('.AdminCard')
                    .eq(4)
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'Bibliographic');

                        cy.get('#ParentPublication')
                            .should(
                                'have.value',
                                record.fez_record_search_key_parent_publication.rek_parent_publication,
                            );

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
                        cy.get('label[id="Refereed source-label"]')
                            .parent()
                            .find('input[type=hidden]')
                            .should('have.value', record.fez_record_search_key_refereed_source.rek_refereed_source)
                            .siblings('[role=button]')
                            .should(
                                'have.text',
                                record.fez_record_search_key_refereed_source.rek_refereed_source_lookup,
                            );
                        cy.get('#Reportnumber')
                            .should(
                                'have.value',
                                record.fez_record_search_key_report_number.rek_report_number,
                            );
                    });
            });
    });

    it('should render Research Report specific fields on the Grants tab', () => {
        cy.get('.StandardPage form .StandardCard')
            .eq(6)
            .within(() => {
                cy.get('h3')
                    .should('have.text', 'Grant information');

                cy.get('.AdminCard')
                    .eq(0)
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'Grant information');

                        const numberItemsInRow = 3;
                        record.fez_record_search_key_grant_agency.map((pub, index) => {
                            cy.get('p')
                                .eq(index * numberItemsInRow)
                                .should('have.text', pub.rek_grant_agency);
                        });
                        record.fez_record_search_key_grant_id.map((id, index) => {
                            cy.get('p')
                                .eq(index * numberItemsInRow + 1)
                                .should('have.text', id.rek_grant_id);
                        });
                        record.fez_record_search_key_grant_agency_type.map((type, index) => {
                            cy.get('p')
                                .eq(index * numberItemsInRow + 2)
                                .should('have.text', type.rek_grant_agency_type_lookup);
                        });
                    });
            });
    });
});
