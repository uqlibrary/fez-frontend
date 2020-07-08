import { default as recordList } from '../../../src/mock/data/records/publicationTypeListImage';

context('Image admin edit', () => {
    const record = recordList.data[0];

    beforeEach(() => {
        cy.loadRecordForAdminEdit(record.rek_pid);
    });

    afterEach(() => {
        cy.adminEditCleanup();
    });

    it('should load with specified elements', () => {
        cy.adminEditCountCards(7);
        cy.adminEditNoAlerts();
        cy.adminEditTabbedView();
        cy.adminEditCheckDefaultTab('Bibliographic');
    });

    it('should render the different sections as expected', () => {
        // ------------------------------------------ BIBLIOGRAPHIC TAB ----------------------------------------------
        cy.log('Bibliographic tab');
        cy.get('.StandardPage form > div > div')
            .get('.StandardCard')
            .eq(1)
            .as('bibliographicTab')
            .within(() => {
                cy.get('h3').should('have.text', 'Bibliographic');

                cy.get('.AdminCard')
                    .eq(2)
                    .within(() => {
                        cy.get('h4').should('contain', 'Bibliographic');

                        cy.get('[data-testid=rek-genre-input]').should('have.value', record.rek_genre);
                        cy.get('[data-testid=rek-original-format-input]').should(
                            'have.value',
                            record.fez_record_search_key_original_format.rek_original_format,
                        );
                        cy.get('[data-testid=rek-source-input]').should(
                            'have.value',
                            record.fez_record_search_key_source.rek_source,
                        );
                        cy.get('[data-testid=rek-rights-input]').should(
                            'have.value',
                            record.fez_record_search_key_rights.rek_rights,
                        );
                    });
            });
    });
});
