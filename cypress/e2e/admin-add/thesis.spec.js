context('Thesis admin add', () => {
    it('should correctly set the Bibliographic sub-type when the display type is Thesis', () => {
        // This test exists to ensure the React Hook Form custom hook correctly sets
        // the work sub-type when the user creates a new Thesis work.

        cy.visit('/admin/add?user=uqstaff');
        // sometimes the page takes a VERY long time to load
        cy.waitUntil(
            () =>
                cy
                    .get('h2')
                    .should('exist')
                    .should('be.visible')
                    .should('contain.text', 'Add a new work'),
            {
                timeout: 10000,
            },
        );

        // Choose a collection
        cy.data('rek-ismemberof-input').click();
        cy.clickAutoSuggestion('rek-ismemberof', 0);

        // Choose display type
        cy.get('[data-testid=rek-display-type-select]').click();
        cy.get('[data-testid=rek-display-type-options]')
            .contains('li', 'Thesis')
            .click();

        // Choose subtype
        cy.get('[data-testid=rek-subtype-select]').click();
        cy.get('[data-testid=rek-subtype-options]')
            .contains('li', 'Honours Thesis')
            .click();

        // Apply selections
        cy.get('button')
            .contains('Create work')
            .should('exist')
            .click();

        cy.get('h2')
            .should('exist')
            .should('be.visible')
            .should('contain.text', 'Add a new Thesis');

        cy.data('rek-genre-type-input').should('have.value', 'Honours Thesis');
    });
});
