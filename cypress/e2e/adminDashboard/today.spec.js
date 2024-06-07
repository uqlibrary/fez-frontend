context('Admin Dashboard - Today tab', () => {
    beforeEach(() => {
        cy.loadAdminDashboard();
        // cy.injectAxe();
    });

    it('renders as expected', () => {
        // a more verbose test than usual, due to being
        // unable to do any similar testing in jest
        cy.get('[role=tab]').should('have.length', 3);
        cy.get('[role=tab]')
            .first()
            .should('contain', 'TODAY')
            .should('have.attr', 'aria-selected', 'true');
        cy.data('system-alerts-title').contains('System Alerts');

        // Charts
        cy.data('chart-container-system-alerts').within(() => {
            cy.get('svg').should('exist');
        });
        cy.data('system-alerts-table').within(() => {
            cy.get('td').contains('150');
            cy.get('td').contains('25');
            cy.get('td').contains('15 (10%)');
            cy.get('td').contains('135 (90%)');
        });
        cy.data('unprocessed-works-title').contains('Unprocessed Works');
        cy.data('unprocessed-works-subtitle').within(() => {
            cy.data('unprocessed-link').should('exist');
        });
        cy.data('chart-container-unprocessed-works').within(() => {
            cy.get('svg > text').contains('15');
        });
        cy.data('processed-works-title').contains('Processed Works');
        cy.data('processed-works-subtitle').contains('this iteration');
        cy.data('chart-container-processed-works').within(() => {
            cy.get('svg > text').contains('82');
        });
        cy.data('chart-container-open-access').within(() => {
            cy.get('svg text').contains('256 (20%)');
            cy.get('svg text').contains('of 1256 records');
        });

        // Quicklinks
        cy.get('[role=list]').within(() => {
            cy.get('[role=listitem]').should('have.length', 7);
        });
    });

    it('follows unprocessed works link', () => {
        cy.data('system-alerts-title').contains('System Alerts');
        cy.data('unprocessed-link')
            .invoke('removeAttr', 'target')
            .click();
        cy.url().should('include', 'https://espace.library.uq.edu.au/records/search');
    });
});
