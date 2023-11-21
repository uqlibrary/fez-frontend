context('manageUsers', () => {
    beforeEach(() => {
        cy.viewport(1400, 1000);
        cy.visit('/admin/users?user=uqstaff');
        cy.get('[data-testid="page-title"]').contains('Manage users');
    });

    it('hides any visible alert when navigating away', () => {
        cy.contains('Delete user').should('not.exist');
        // test delete an user
        cy.get('[data-testid="users-list-row-0-delete-this-user"]')
            .parent()
            .click();
        // should show a success alert
        cy.contains('Delete user').should('exist');
        cy.get('[data-testid="confirm-users-delete-this-user-confirmation"]').click();
        cy.contains('A user has been successfully deleted.').should('exist');
        // nav away
        cy.get('[role=button]')
            .contains('My works')
            .click();
        cy.contains('A user has been successfully deleted.').should('not.exist');
        // nav back
        cy.get('[role=button]')
            .contains('Manage users')
            .click();
        cy.contains('A user has been successfully deleted.').should('not.exist');
    });

    context('coverage', () => {
        it('can add, update', () => {
            cy.get('[data-testid="users-add-new-user"]').click();
            cy.contains('User information').should('exist');
            cy.get('[data-testid="usr-full-name-input"]').type('Mock Test');
            cy.get('[data-testid="usr-email-input"]').type('test@test.com');
            cy.get('[data-testid="usr-username-input"]').type('testuser');
            cy.get('[data-testid="users-add-this-user-save"]').click();
            cy.get('[data-testid="usr-full-name-0"]').should('have.attr', 'value', 'MOCK USER');
            cy.contains('A user has been successfully added.').should('exist');
            cy.contains('User information').should('not.exist');

            cy.get('button[aria-label="Edit this user"]')
                .first()
                .click();
            cy.contains('User information').should('exist');
            cy.get('[data-testid="usr-full-name-input"]')
                .clear()
                .type('Mock Test 2');
            cy.get('[data-testid="users-update-this-user-save"]').click();
        });
        it('can delete in bulk', () => {
            cy.get('[data-testid="select-user-0"]').click();
            cy.get('[data-testid="users-delete-selected-users"]').should('exist');
            cy.get('[data-testid="select-user-1"]').click();
            cy.get('[data-testid="users-delete-selected-users"]').click();
            cy.contains('Delete selected users').should('exist');
            cy.get('[data-testid="confirm-bulk-delete-users-confirmation"]').click();
            cy.contains('1000000293 - User deleted').should('exist');
            cy.contains('9999999999 - User not found').should('exist');
        });
    });
});
