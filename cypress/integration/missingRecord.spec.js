context('viewRecord', () => {
    it('Renders the Work not found message for a 404', () => {
        cy.visit('/view/UQ:abc123');
        cy.get('h2').contains('Work not found');
        cy.get('span').contains('404');
    });
});
