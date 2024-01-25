context('As an admin,', () => {
    it('I can add a video', () => {
        cy.viewport(1200, 1600);
        cy.visit('/admin/add?user=uqstaff');

        // Choose a collection
        cy.get('[data-testid=rek-ismemberof-input]').type('a');
        cy.clickAutoSuggestion('rek-ismemberof', 0);

        // Choose display type
        cy.get('[data-testid=rek-display-type-select]').click();
        cy.get('[data-testid=rek-display-type-options]')
            .contains('li', 'Video')
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
        cy.get('[data-testid=rek-rights-input]').type('All rights reserved');
        cy.get('[data-testid=rek-author-add]').click();
        cy.get('[data-testid=rek-author-input]').type('Test author');
        cy.get('[data-testid=rek-author-add-save]').click();
        cy.get('[data-testid=rek-copyright-input]').click();

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

context('Author affiliations', () => {
    it('should not be available for this work type', () => {
        cy.visit('/admin/add?user=uqstaff');

        // Choose a collection
        cy.get('[data-testid=rek-ismemberof-input]').type('a');
        cy.clickAutoSuggestion('rek-ismemberof', 0);

        // Choose display type
        cy.get('[data-testid=rek-display-type-select]').click();
        cy.get('[data-testid=rek-display-type-options]')
            .contains('li', 'Video')
            .click();

        // Apply selections
        cy.wait(200);
        cy.get('button')
            .contains('Create work')
            .should('exist');
        cy.get('button')
            .contains('Create work')
            .click();

        cy.assertAffiliationsAllowed({
            authorName: 'Steve Su (uqysu4)',
            orgName: 'The University of Queensland',
            rowId: 0,
        });
    });
});
