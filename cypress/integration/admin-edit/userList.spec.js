context('Manage User List', () => {
    beforeEach(() => {
        cy.viewport(1200, 1000);
        cy.visit('/admin/users?user=uqstaff');
    });

    it('Allows number of records per page to be changed', () => {
        cy.get('.MuiTablePagination-select').click();
        cy.get('[data-value="100"]').click();
        cy.wait(1000);
        cy.get('#usr-id-0').should('exist');
        cy.get('#usr-id-1').should('exist');
    });
    it('Handles bulk delete', () => {
        cy.get('[data-testid="select-user-1"]').click();
        cy.get('[data-testid="users-delete-selected-users"]').click();
        cy.get('[data-testid="confirm-bulk-delete-users-confirmation"]').click();
        cy.wait(1000);
        cy.get('#usr-id-1').should('exist');
        cy.get('#usr-id-0').should('not.exist');
    });
    it('Handles row delete', () => {});
});
