import { default as recordList } from '../../../src/mock/data/records/publicationTypeListPatent';

context('Data Collection admin edit', () => {
    const record = recordList.data[0];

    beforeEach(() => {
        cy.loadRecordForAdminEdit(record.rek_pid);
    });

    afterEach(() => {
        cy.adminEditCleanup();
    });

    it('should load expected tabs', () => {
        cy.adminEditCountCards(7);
        cy.adminEditNoAlerts();
        cy.adminEditTabbedView();
        cy.adminEditCheckDefaultTab('Bibliographic');

        cy.log('Finished testing tabs');
    });

    it('should render the different sections as expected', () => {
        // ------------------------------------------ BIBLIOGRAPHIC TAB ----------------------------------------------
        cy.log('Bibliographic tab');
        cy.get('[data-testid=bibliographic-section-content]')
            .as('bibliographicTab')
            .within(() => {
                cy.get('[data-testid=rek-genre-input]').should('have.value', record.rek_genre);
            });
    });
});
