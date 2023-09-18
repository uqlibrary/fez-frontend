context('ORCiD Upload button', () => {
    beforeEach(() => {
        cy.visit('/dashboard');
    });

    it('should appear and open panel on click; panel can close', () => {
        cy.get('[data-testid="help-icon-orcid"]')
            .should('exist')
            .click();
        cy.get('[data-testid="help-drawer-message"]').should('exist');
        cy.get('[data-testid="help-drawer-title"]').should('contain', 'ORCID');
        cy.get('[data-testid="orcid-upload-start-button"]').should('be.enabled');
        cy.get('[data-testid="orcid-view-works-button"]').should('be.enabled');
        cy.get('[data-testid="help-drawer-close"]').click();
        cy.get('[data-testid="help-drawer-message"]').should('not.exist');
    });

    it('should open panel which closes on requesting ORCID upload', () => {
        cy.get('[data-testid="help-icon-orcid"]').click();
        cy.get('[data-testid="help-drawer-message"]').should('exist');
        cy.get('[data-testid="orcid-upload-start-button"]').click();
        cy.get('[data-testid="help-drawer-message"]').should('not.exist');
    });
});
