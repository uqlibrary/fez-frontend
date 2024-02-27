context('Controlled vocabularies', () => {
    beforeEach(() => {
        cy.visit('/admin/controlled-vocabularies?user=uqstaff');
    });
    const dismissPopover = () => cy.get('body').click(0, 0);

    it('Renders the top level controlled vocabulary screen', () => {
        cy.get('[data-testid="page-title"]').should('contain', 'Controlled Vocabulary');
        cy.get('[data-testid="total-vocab"]').should('contain', 'Displaying 42 total controlled vocabularies');
        cy.get('[data-testid="row-em-451780"]').should('contain', 'Fields of Research');
        dismissPopover();
    });

    it('Renders the child level controlled vocabulary screen', () => {
        cy.get('[data-testid="expand-row-453669"]').click();
        cy.get('[data-testid="child-row-em-453670"]').should('contain', 'Yukulta / Ganggalidda language G34');
        dismissPopover();
    });

    it('Navigate field of research', () => {
        cy.get('[data-testid="expand-row-451780"]').click();
        cy.get('[data-testid="child-row-em-451799"]').should('contain', '01 Mathematical Sciences');

        cy.get('[data-testid="child-row-title-link-451799"]').click();
        cy.get('[data-testid="child-row-em-451800"]').should('contain', '0101 Pure Mathematics');

        cy.get('[data-testid="child-row-title-link-451800"]').click();
        cy.get('[data-testid="child-row-em-451801"]').should('contain', '010101 Algebra and Number Theory');

        cy.get('[data-testid="child-row-title-link-451801"]').click();
        cy.get('[data-testid="nav-451801"]').should('contain', '010101 Algebra and Number Theory');

        cy.get('[data-testid="nav-451800"]').click();
        cy.get('[data-testid="child-row-title-451801"]').should('contain', '010101 Algebra and Number Theory');

        cy.get('[data-testid="nav-451780"]').click();
        cy.get('[data-testid="child-row-title-451799"]').should('contain', '01 Mathematical Sciences');

        dismissPopover();
    });
});
