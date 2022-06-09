context('As an admin,', () => {
    it('I can edit a collection', () => {
        cy.visit('/admin/edit/UQ:11399?user=uqstaff');

        cy.get('h2')
            .contains('Edit Collection')
            .should('exist');

        cy.wait(1000); // Wait for event handlers to attach

        cy.get('[data-testid=rek-ismemberof-1]')
            .find('svg')
            .click();

        cy.typeCKEditor(
            'rek-title',
            'Aboriginal and Torres Strait Islander Studies Unit Publications With Extra Data UPDATED',
        );
        cy.typeCKEditor('rek-description', 'Test collection description UPDATED');

        cy.get('[data-testid=rek-keywords-list-row-2-delete]').click();
        cy.get('h2').should('contain', 'Delete keyword');

        cy.get('button')
            .contains('Yes')
            .click();

        cy.typeCKEditor('ain-notes', 'Test internal notes UPDATED');

        cy.get('[data-testid=reason-input]').type('Automated Update test for Collection');

        cy.get('button')
            .contains('Save')
            .click();

        cy.get('h2').should('contain', 'Work has been updated');
    });
});
