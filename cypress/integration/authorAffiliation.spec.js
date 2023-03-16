context('Record with invalid affiliation', () => {
    it('should show correct indicators for orphaned affiliations', () => {
        cy.visit('/view/UQ:40186z?user=uqstaff');
        cy.get('[data-testid="error-affiliation-toggle-icon"]')
            .should('exist')
            .click();
        cy.get('#adminViewRecordDrawerDesktop [data-testid="affiliation_error_drawer_indicator"]').should('exist');
        cy.get('#adminViewRecordDrawerDesktop [data-testid="affil_error_99999"]').should('contain', 'One, Test');
        cy.get('#adminViewRecordDrawerDesktop [data-testid="affil_error_99999"]').should(
            'contain',
            'orphaned author affiliation information',
        );
    });

    it('should show correct indicators, and provide navigation', () => {
        cy.visit('/view/UQ:40186a?user=uqstaff');
        cy.get('[data-testid="error-affiliation-toggle-icon"]')
            .should('exist')
            .click();
        cy.get('#adminViewRecordDrawerDesktop [data-testid="affiliation_error_drawer_indicator"]').should('exist');
        cy.get('#adminViewRecordDrawerDesktop [data-testid="affil_error_1489"]').should('contain', 'One, Test');
        cy.get('#adminViewRecordDrawerDesktop [data-testid="btnFixAffiliations"]').click();
        cy.get('#admin-work-cancel-top')
            .should('exist')
            .click();
        cy.get('[data-testid="page-title"]').should('contain', 'Multiparameter');
    });
});
