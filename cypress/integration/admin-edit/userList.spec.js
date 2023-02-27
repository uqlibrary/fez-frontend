context('Manage User List', () => {
    beforeEach(() => {
        cy.visit('/admin/users?user=uqstaff');
    });

    it('Allows number of records per page to be changed', () => {
        cy.get('.MuiTablePagination-select').click();
        cy.get('[data-value="100"]').click();
        cy.wait(1000);
        cy.get('#usr-id-0').should('exist');
        cy.get('#usr-id-1').should('exist');
    });
});
