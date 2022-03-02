context('As an admin,', () => {
    it('I can add a journal article', () => {
        cy.visit('/admin/add?user=uqstaff');

        // Choose a collection
        cy.get('[data-testid=rek-ismemberof-input]').type('a');
        cy.clickAutoSuggestion('rek-ismemberof', 0);

        // Choose display type
        cy.get('[data-testid=rek-display-type-select]').click();
        cy.get('[data-testid=rek-display-type-options]')
            .contains('li', 'Journal Article')
            .click();

        // Choose sub type
        cy.get('[data-testid=rek-subtype-select]').click();
        cy.get('[data-testid=rek-subtype-options]')
            .contains('li', 'Article (original research)')
            .click();

        // Apply selections
        cy.get('button')
            .contains('Create work')
            .should('exist')
            .click();

        // Confirm that alert badges are present when in tabbed mode
        cy.adminEditTabbedView();
        cy.adminEditCheckTabErrorBadge('bibliographic', 3);
        cy.adminEditCheckTabErrorBadge('files');
        cy.adminEditTabbedView(false);

        // Fill required fields
        cy.typeCKEditor('rek-title', 'Test title');
        cy.get('[data-testid=rek-date-year-input]').type('2020');
        cy.get('[data-testid=rek-author-add]').click();
        cy.get('[data-testid=rek-author-input]').type('Test author');
        cy.get('[data-testid=rek-author-add-save]').click();
        cy.get('[data-testid=rek-copyright-input]').click();

        // Lookup journal
        cy.get('[data-testid=fez-matched-journals-input]').type('acta');
        cy.clickAutoSuggestion('fez-matched-journals', 0);

        // Submit form
        cy.get('#admin-work-submit')
            .should('contain', 'Save')
            .click();

        // Confirmation message
        cy.get('[role=dialog]')
            .should('exist')
            .find('h2')
            .should('contain', 'Work has been added');
    });
});
