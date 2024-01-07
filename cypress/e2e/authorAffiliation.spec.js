context('Record with invalid affiliation', () => {
    it('should show correct indicators for orphaned affiliations, and provide navigation', () => {
        cy.visit('/view/UQ:871c1f8?user=uqstaff');
        cy.get('[data-testid="error-affiliation-toggle-icon"]')
            .should('exist')
            .click();
        cy.get('#adminViewRecordDrawerDesktop [data-testid="affiliation_error_drawer_indicator"]').should('exist');
        cy.get('#adminViewRecordDrawerDesktop [data-testid="affil_error_88844"]')
            .should('contain', 'Robertson, Avril A. B. not 100%')
            .should('contain', 'has incomplete author affiliation information');
        cy.get('#adminViewRecordDrawerDesktop [data-testid="affil_error_7624840"]')
            .should('contain', 'Affiliate, Orphaned')
            .should('contain', 'has orphaned author information');
        cy.get('#adminViewRecordDrawerDesktop [data-testid="btnFixAffiliations"]').click();
        cy.get('#admin-work-cancel-top')
            .should('exist')
            .click();
        cy.get('[data-testid="page-title"]').should('contain', 'Chick');
    });
});
