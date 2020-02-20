import { default as recordList } from '../../../src/mock/data/records/publicationTypeListJournal';

context('Journal admin edit', () => {
    const record = recordList.data[0];

    beforeEach(() => {
        cy.loadRecordForAdminEdit(record.rek_pid);
    });

    afterEach(() => {
        cy.adminEditCleanup();
    });

    it('should load with specifed elements', () => {
        cy.adminEditCountCards(7);
        cy.adminEditVerifyAlerts(2, ['Journal name is required']);

        cy.adminEditTabbedView();
        cy.adminEditCheckDefaultTab('Bibliographic');
        cy.adminEditCheckTabErrorBadge(2);
    });

    it('should render the different sections as expected', () => {
        // ------------------------------------------ BIBLIOGRAPHIC TAB ----------------------------------------------
        cy.log('Bibliographic tab');
        cy.get('.StandardPage form > div > div')
            .get('.StandardCard')
            .eq(1)
            .within(() => {
                cy.get('h3')
                    .should('have.text', 'Bibliographic');

                cy.get('.AdminCard')
                    .eq(4)
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
                        // cy.get('label[id="Refereed source-label"]')
                        //     .parent()
                        //     .find('input[type=hidden]')
                        //     .should('have.value', record.fez_record_search_key_refereed_source.rek_refereed_source)
                        //     .siblings('[role=button]')
                        //     .should(
                        //         'have.text',
                        //         record.fez_record_search_key_refereed_source.rek_refereed_source_lookup,
                        //     );
                    });
            });
    });
});
