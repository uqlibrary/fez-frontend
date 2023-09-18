context('Scroll to top module', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('Scroll to the bottom of the homepage, then click the scroll to top and the tabs should be visible', () => {
        cy.contains('Peptide mimic').should('exist');
        cy.get('.StandardPage').should('exist'); // This forces a scroll to the top.
        cy.get('#scrolltopbtn').should('have.css', 'opacity', '0');
        cy.contains('Genome-wide association').scrollIntoView();
        cy.get('#scrolltopbtn').should('have.css', 'opacity', '0.5');
        cy.get('#scrolltopbtn').click();
        cy.get('#scrolltopbtn').should('have.css', 'opacity', '0');
    });
});
