context('As an admin,', () => {
    it('I can create a collection', () => {
        cy.visit('/admin/collection?user=uqstaff');

        cy.get('h3')
            .contains('Add a missing collection')
            .should('exist')
            .parents('.StandardCard')
            .should('contain', 'Select a community')
            .find('[data-testid=rek-ismemberof-select]')
            .as('communitySelector')
            .should('exist');

        cy.wait(1000); // Wait for event handlers to attach
        cy.get('@communitySelector').click();

        cy.get('[data-testid=rek-ismemberof-options]')
            .contains('li', 'Advanced Computational')
            .click();

        cy.get('h3').contains('Collection details');

        cy.get('[data-testid=rek-title-input]').type('E2E Testing Collection');
        cy.get('[data-testid=rek-description-input]').type('This collection is created through automated testing.');

        cy.get('[data-testid=rek-keywords-input]').type('testing');
        cy.get('[data-testid=rek-keywords-add]').click();

        cy.get('[data-testid=rek-keywords-list]')
            .should('exist')
            .contains('p', 'testing');

        cy.get('button')
            .contains('Add collection')
            .click();

        cy.get('h3').should('contain', 'Collection added successfully');

        cy.get('button')
            .contains('Add another collection')
            .click();

        cy.get('h3')
            .contains('Add a missing collection')
            .should('exist');
    });
});
