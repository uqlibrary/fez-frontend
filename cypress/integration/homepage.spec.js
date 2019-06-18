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

    it('Clicking between trending panes', () => {
        cy.get('button', {timeout: 5000})
            .get('span')
            .contains('Trending on Scopus')
            .click();
        cy.wait(3000);
        cy.get('.content-container', {
            timeout: 1000,
            delay: 1000,
        }).toMatchSnapshot();

        cy.get('button', {timeout: 1000})
            .get('span')
            .contains('Trending on Web of science')
            .click();
        cy.wait(3000);
        cy.get('.content-container', {
            timeout: 1000,
            delay: 1000,
        }).toMatchSnapshot();

        cy.get('button', {timeout: 1000})
            .get('span')
            .contains('Trending on Altmetric')
            .click();
        cy.wait(3000);
        cy.get('.content-container', {
            timeout: 1000,
            delay: 1000,
        }).toMatchSnapshot();
    });
});
