context('Favourite search bookmark', () => {
    it('should direct to advanced search page', () => {
        const baseUrl = Cypress.config('baseUrl');
        cy.visit('/published?user=uqstaff');
        cy.url().should('include', `${baseUrl}/records/search`);
    });
});
