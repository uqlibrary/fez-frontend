import { default as recordList } from '../../../src/mock/data/records/publicationTypeListDataCollection';

context('Data Collection admin edit', () => {
    const record = recordList.data[0];

    beforeEach(() => {
        cy.loadRecordForAdminEdit(record.rek_pid);
    });

    afterEach(() => {
        cy.adminEditCleanup();
    });

    it('should load expected tabs', () => {
        cy.adminEditCountCards(8);
        cy.adminEditVerifyAlerts(1, ['Publication date is required']);

        cy.adminEditTabbedView();
        cy.adminEditCheckDefaultTab('Bibliographic');
        cy.adminEditCheckTabErrorBadge(2);

        cy.log('Finished testing tabs'); // This makes the test suite a bit more stable. It's magic :p
    });

    it('should render the different sections as expected', () => {
        // ------------------------------------------ BIBLIOGRAPHIC TAB ----------------------------------------------
        cy.log('Bibliographic tab');
        cy.get('.StandardPage form .StandardCard')
            .eq(2)
            .find('.AdminCard')
            .eq(0)
            .within(() => {
                cy.get('h4')
                    .should('contain', 'Dataset name');
            });
    });
});
