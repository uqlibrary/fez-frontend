import { default as recordList } from '../../../src/mock/data/records/publicationTypeListNewspaperArticle';

context('Newspaper Article admin edit', () => {
    const record = recordList.data[0];

    beforeEach(() => {
        cy.loadRecordForAdminEdit(record.rek_pid);
    });

    afterEach(() => {
        cy.adminEditCleanup();
    });

    it('should load with specifed elements', () => {
        cy.adminEditCountCards(8);
        cy.adminEditNoAlerts();

        cy.adminEditTabbedView();
        cy.adminEditCheckDefaultTab('Bibliographic');
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
                    .eq(3)
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
                        cy.get('#Edition')
                            .should('have.value', record.fez_record_search_key_edition.rek_edition);
                        cy.get('#Newspaper')
                            .should('have.value', record.fez_record_search_key_newspaper.rek_newspaper);
                        cy.get('#Section')
                            .should('have.value', record.fez_record_search_key_section.rek_section);
                        cy.get('#Translatednewspaper')
                            .should(
                                'have.value',
                                record.fez_record_search_key_translated_newspaper.rek_translated_newspaper,
                            );
                    });
            });
    });
});
