import { default as recordList } from '../../../src/mock/data/records/publicationTypeListResearchReport';

context('Research Report admin edit', () => {
    // const baseUrl = Cypress.config('baseUrl');
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

    // it('should load with specifed elements', () => {
    //     cy.get('h2')
    //         .should('have.length', 1)
    //         .should('have.text', `Edit ${record.rek_display_type_lookup} - ${record.rek_title}: ${record.rek_pid}`);
    //
    //     cy.get('input[value=tabbed]')
    //         .should('be.not.checked');
    //
    //     cy.get('button[title="Learn about keyboard shortcuts"]')
    //         .should('exist');
    //
    //     cy.get('.StandardPage form > div > div > div.StandardCard > div > div > h3')
    //         .should('have.length', 9);
    // });

    it('should render Research Report specific fields on the Bibliographic tab', () => {
        cy.get('.StandardPage form > div > div:nth-child(3)')
            .within(() => {
                cy.root()
                    .children('.StandardCard')
                    .children('div')
                    .children('div')
                    .children('h3')
                    .should('have.text', 'Bibliographic');

                cy.get('div:nth-child(5) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Bibliographic');

                        cy.get('#ParentPublication')
                            .should(
                                'have.value',
                                record.fez_record_search_key_parent_publication.rek_parent_publication,
                            );

                        cy.get('#Startpage')
                            .should('have.value', record.fez_record_search_key_start_page.rek_start_page);
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
                            .should('have.text', record.fez_record_search_key_refereed_source.rek_refereed_source_lookup);
                        cy.get('#Reportnumber')
                            .should(
                                'have.value',
                                record.fez_record_search_key_report_number.rek_report_number,
                            );
                    });
            });
    });
});
