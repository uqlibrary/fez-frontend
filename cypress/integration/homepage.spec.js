context('Homepage', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000');
        cy.get('button')
            .contains('Close this message', {timeout: 5000})
            .click({
                force: true,
            });
        cy.wait(3000);
    });

    it('Renders the tabbed panes as expected', () => {
        cy.get('button')
            .get('span')
            .contains('Trending on Scopus')
            .click();
        cy.get('h6').should('contain', 'Scopus citation count');
        cy.get('h6').should('not.contain', 'Web of Science citation count');
        cy.get('h6').should('not.contain', 'Altmetric score');

        cy.get('button')
            .get('span')
            .contains('Trending on Web of science')
            .click();
        cy.get('h6').should('not.contain', 'Scopus citation count');
        cy.get('h6').should('contain', 'Web of Science citation count');
        cy.get('h6').should('not.contain', 'Altmetric score');

        cy.get('button')
            .get('span')
            .contains('Trending on Altmetric')
            .click();
        cy.get('h6').should('not.contain', 'Scopus citation count');
        cy.get('h6').should('not.contain', 'Web of Science citation count');
        cy.get('h6').should('contain', 'Altmetric score');

        cy.get('h3').should('contain', 'What is eSpace?');
    });
});
