context('Dashboard', () => {
    beforeEach(() => {
        cy.visit('/dashboard');
    });

    context('non mobile', () => {
        beforeEach(() => {
            cy.viewport(600, 400);
        });

        it('should display graphs', () => {
            cy.contains('Professor J Researcher');
            cy.get('[data-testid=standard-card-espace-works-per-year]').should('exist');
            cy.get('[data-testid=standard-card-work-types-overview-content]').should('exist');
        });
    });

    context('mobile', () => {
        beforeEach(() => {
            cy.viewport(599, 400);
        });

        it("shouldn't display graphs", () => {
            cy.contains('Professor J Researcher');
            cy.get('[data-testid=standard-card-espace-works-per-year]').should('not.exist');
            cy.get('[data-testid=standard-card-work-types-overview-content]').should('not.exist');
        });
    });
});
