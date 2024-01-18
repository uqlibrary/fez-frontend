context('Favourite search bookmark', () => {
    it('should direct to advanced search page', () => {
        const baseUrl = Cypress.config('baseUrl');
        cy.visit('/published?user=uqstaff');
        cy.url().should('include', `${baseUrl}/records/search`);
    });
});
context('Favourite searches', () => {
    it('should rename and delete a search item correctly', () => {
        cy.visit('/admin/favourite-search?user=uqstaff');
        cy.get('[data-testid=favourite-search-list-item-1-edit]').click();
        cy.get('[data-testid="fvs-description-input"]')
            .clear()
            .type('New value test');
        cy.get('[data-testid="favourite-search-list-item-1-save"]').click();
        cy.get('[data-testid="fvs-description-1"]').should('contain', 'New value test');
        cy.get('[data-testid="favourite-search-list-item-1-delete"]').click();
        cy.get('[data-testid="favourite-search-list-item-1-save"]').click();
        cy.get('[data-testid="fvs-description-1"]').should('not.exist');
    });
});
