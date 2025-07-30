context('As an admin, I can', () => {
    it('see language related fields', () => {
        cy.visit('/admin/add?user=uqstaff');

        // Choose a collection
        cy.get('[data-testid=rek-ismemberof-input]').type('a');
        cy.clickAutoSuggestion('rek-ismemberof', 0);

        // Choose display type
        cy.get('[data-testid=rek-display-type-select]').click();
        cy.get('[data-testid=rek-display-type-options]')
            .contains('li', 'Book Chapter')
            .click();

        // Choose sub type
        cy.get('[data-testid=rek-subtype-select]').click();
        cy.get('[data-testid=rek-subtype-options]')
            .contains('li', 'Research book chapter (original research)')
            .click();

        // Apply selections
        cy.get('button')
            .contains('Create work')
            .should('exist')
            .click();

        // Language related fields should not show when language is english
        cy.get('[data-testid=rek-language-of-title-select]').should('not.exist');
        cy.get('[data-testid=rek-native-script-title-input]').should('not.exist');
        cy.get('[data-testid=rek-roman-script-title-input]').should('not.exist');
        cy.get('[data-testid=rek-translated-title-input]').should('not.exist');

        // Select German
        cy.get('[data-testid=rek-language-select]').click();
        cy.get('[data-testid=rek-language-options]')
            .contains('li', 'German')
            .click();

        cy.get('[data-testid=rek-language-of-title-select]').should('exist');
        cy.get('[data-testid=rek-native-script-title-input]').should('exist');
        cy.get('[data-testid=rek-roman-script-title-input]').should('exist');
        cy.get('[data-testid=rek-translated-title-input]').should('exist');
    });
});
