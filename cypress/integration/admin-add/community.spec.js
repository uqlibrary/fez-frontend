context('As an admin,', () => {
    it('I can create a collection', () => {
        cy.visit('/admin/community?user=uqstaff');

        cy.get('h2')
            .should('contain', 'Add a missing community');

        cy.get('h3')
            .should('contain', 'Community details');

        cy.get('#Titleofcommunity')
            .type('Fez E2E Test Community');

        cy.get('#Communitydescription')
            .type('Fez E2E Test Community description');

        cy.get('#keywords-input')
            .type('testing');
        cy.get('#add-items')
            .click();

        cy.contains('Add community')
            .click();

        cy.get('h3')
            .should('contain', 'Community added successfully');

        cy.get('button')
            .contains('Add another community')
            .click();

        cy.get('h3')
            .contains('Community details')
            .should('exist');
    });
});
