context('Controlled vocabularies', () => {
    beforeEach(() => {
        cy.visit('/admin/controlled-vocabularies?user=uqstaff');
    });
    const dismissPopover = () => cy.get('body').click(0, 0);

    it('Renders the top level controlled vocabulary screen', () => {
        cy.get('[data-testid="page-title"]').should('contain', 'Controlled Vocabulary');
        cy.get('[data-testid="total-vocab"]').should('contain', 'Displaying 42 total controlled vocabularies');
        cy.get('[data-testid="row-451780"]').should('contain', 'Fields of Research');
        dismissPopover();
    });
});
