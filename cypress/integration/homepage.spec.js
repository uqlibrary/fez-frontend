context('Homepage', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000');
        cy.get('#unsupportedBrowser.card button')
            .then(($button) => {
                // Button is only visible if browser is unsupported.
                if ($button.filter(':visible')) {
                    $button.click();
                }
            });
    });

    it('Renders whole page as expected', () => {
        cy.get('html').toMatchSnapshot();
    });

    it('Renders the tabbed panes as expected', () => {
        cy.get('button', { timeout: 5000 })
            .get('span')
            .contains('Trending on Scopus')
            .click();
        cy.wait(3000);
        cy.get('.content-container', {
            timeout: 1000,
            delay: 1000,
        }).toMatchSnapshot();

        cy.get('button', { timeout: 1000 })
            .get('span')
            .contains('Trending on Web of science')
            .click();
        cy.wait(3000);
        cy.get('.content-container', {
            timeout: 1000,
            delay: 1000,
        }).toMatchSnapshot();

        cy.get('button', { timeout: 1000 })
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
