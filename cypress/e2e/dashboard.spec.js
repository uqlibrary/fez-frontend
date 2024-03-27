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

        it('should display orcid sync drawer', () => {
            cy.get('[data-testid=help-icon-orcid]').click();
            cy.get('[data-testid=orcid-upload-start-button]').click(); // close the drawer when done
            cy.get('[data-testid=orcid-upload-start-button]').should('not.exist');
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

context.only('Dashboard with no OrcID', () => {
    it('should show the Link ORCID ID form in place of dashboard', () => {
        cy.visit('/dashboard?user=s4444444');
        cy.get('[data-testid=orcid-required]').should('exist');
        cy.get('[data-testid=standard-card-i-already-have-an-orcid-id]').should('exist');
        cy.get('[data-testid=standard-card-i-need-an-orcid-id-content]').should('exist');
        cy.get('[data-testid=standard-card-espace-works-per-year]').should('not.exist');
        cy.get('[data-testid=standard-card-work-types-overview-content]').should('not.exist');
    });
});
