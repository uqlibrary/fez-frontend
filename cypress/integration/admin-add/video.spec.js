context('As an admin,', () => {
    it('I can add a missing record', () => {
        cy.visit('/admin/add?user=uqstaff');

        // Choose a collection
        cy.get('#Memberofcollections-input')
            .type('a');
        cy.clickAutoSuggestion('Memberofcollections', 0);

        // Choose display type
        cy.get('#rek-display-type')
            .click();
        cy.get('#menu-rek_display_type')
            .contains('li', 'Video')
            .click();

        // Apply selections
        cy.get('button')
            .contains('Create record')
            .should('exist')
            .click();

        // Fill required fields
        cy.typeCKEditor('editor1', 'Test title');
        cy.get('#year')
            .type('2020');
        cy.get('#Copyrightnotice')
            .type('All rights reserved');
        cy.get('#authors-name-as-published-field')
            .type('Test author');
        cy.get('#submit-author')
            .click();
        cy.get('#deposit-agreement')
            .click();

        // Submit form
        cy.get('#admin-work-submit')
            .should('contain', 'Save')
            .click();

        // Confirmation message
        cy.get('[role=dialog]')
            .should('exist')
            .find('h6')
            .should('contain', 'Work has been added');
    });
});
