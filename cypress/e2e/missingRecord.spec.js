context('viewRecord', () => {
    it('Renders the Work not found message for a 404', () => {
        cy.visit('/view/UQ:abc123');
        cy.get('h2').contains('Work not found');
        cy.get('span').contains('404');
    });

    it('Renders the Work not found message for a 404 for a record with lower case uq', () => {
        cy.visit('/view/uq:abc123');
        cy.get('h2').contains('Work not found');
        cy.get('span').contains('404');
    });
});
