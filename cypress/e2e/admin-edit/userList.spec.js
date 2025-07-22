context('Manage User List', () => {
    beforeEach(() => {
        cy.viewport(1200, 1000);
        cy.visit('/admin/users?user=uqstaff');
    });

    it('Allows number of records per page to be changed', () => {
        cy.get('.MuiSelect-select').click();
        cy.get('[data-value="50"]').click();
        cy.wait(1000);
        cy.get('#usr-id-0').should('exist');
        cy.get('#usr-id-1').should('exist');
    });
    it('Handles bulk delete', () => {
        cy.get('[data-testid="select-user-1"]').click();
        cy.get('[data-testid="users-delete-selected-users"]').click();
        cy.get('[data-testid="confirm-bulk-delete-users-confirmation"]').click();
        cy.wait(1000);
        cy.get('#usr-id-0').should('exist');
        cy.get('#usr-id-1').should('not.exist'); // mock data always deletes 1000000293
    });
    it('Handles new user', () => {
        cy.get('[data-testid="users-add-new-user"]').click();
        cy.get('[data-testid="usr-full-name-input"]').type('MOCK USER');
        cy.get('[data-testid="usr-email-input"]').type('mock@user.com');
        cy.get('[data-testid="usr-username-input"]').type('mock_user');
        cy.get('[data-testid="users-add-this-user-save"]').click();
        cy.wait(1000);
        cy.get('[data-testid="usr-full-name-0"]').should('exist');
        cy.get('#usr-full-name-0')
            .invoke('attr', 'value')
            .should('eq', 'MOCK USER');
        cy.get('[data-testid="usr-full-name-1"]').should('exist');
        cy.get('[data-testid="usr-full-name-2"]').should('exist');
    });
    it('Handles update user', () => {
        cy.get('[data-testid="users-list-row-0-edit-this-user"]').click();
        cy.get('#usr-full-name-input')
            .clear()
            .type('Test User UPDATE');
        cy.get('[data-testid="users-update-this-user-save"]').click();
        cy.get('#usr-full-name-0')
            .invoke('attr', 'value')
            .should('eq', 'Test User UPDATE');
    });
    it('Handles delete user', () => {
        cy.get('[data-testid="users-list-row-0-delete-this-user"]').click();
        cy.get('[data-testid="confirm-users-delete-this-user-confirmation"]').click();
        cy.get('[data-testid="alert-done-user-delete"]').should('be.visible');
    });
});
