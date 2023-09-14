context('As an admin,', () => {
    it('I can create a community', () => {
        cy.visit('/admin/community?user=uqstaff');

        cy.get('h2').should('contain', 'Add a missing community');

        cy.get('h3').should('contain', 'Community details');

        cy.get('[data-testid=rek-title-input]').type('Fez E2E Test Community');

        cy.get('[data-testid=rek-description-input]').type('Fez E2E Test Community description');

        cy.get('[data-testid=rek-keywords-input]').type('testing');
        cy.get('[data-testid=rek-keywords-add]').click();

        cy.get('[data-testid=submit-community]').click();

        cy.get('h3').should('contain', 'Community added successfully');

        cy.get('button')
            .contains('Add another community')
            .click();

        cy.get('h3')
            .contains('Community details')
            .should('exist');
    });
});
