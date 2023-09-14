context('As an admin,', () => {
    it('I can edit a community', () => {
        cy.visit('/admin/edit/UQ:3883?user=uqstaff');

        cy.get('h2')
            .contains('Edit Community')
            .should('exist');

        cy.wait(1000); // Wait for event handlers to attach

        cy.typeCKEditor('rek-title', 'The University of Queensland Library With Extra Data UPDATED');
        cy.typeCKEditor('rek-description', 'Test community description UPDATED');

        cy.get('[data-testid=rek-keywords-list-row-1-delete]').click();
        cy.get('h2').should('contain', 'Delete keyword');

        cy.get('button')
            .contains('Yes')
            .click();

        cy.typeCKEditor('ain-notes', 'Test internal notes UPDATED');

        cy.get('[data-testid=reason-input]').type('Automated Update test for Community');

        cy.get('button')
            .contains('Save')
            .click();

        cy.get('h2').should('contain', 'Work has been updated');
    });
});
