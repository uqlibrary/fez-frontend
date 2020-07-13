context('viewRecord', () => {
    it('Renders the Record not found message for a 404', () => {
        cy.visit('/view/UQ:abc123');
        cy.get('h2').contains('Record not found');
        cy.get('span').contains('404');
    });
});
