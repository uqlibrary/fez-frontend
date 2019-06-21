context('Homepage', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/records/search');
        cy.get('#unsupportedBrowser.card button')
            .then(($button) => {
                // Button is only visible if browser is unsupported.
                if ($button.filter(':visible')) {
                    $button.click();
                }
            });
    });

    it('Doing a basic search', () => {
        cy.get('#simpleSearchField').type('cats and dogs{enter}', { delay: 20 });

        cy.get('#showAdvancedSearchButton').click();

        cy.get(
            '[aria-label="Check to search for publications with are only open access / full text"]',
        ).click();
        cy.get('body').click();

        cy.wait(3000);
        cy.get('.content-container', {
            timeout: 1000,
            delay: 1000,
        }).toMatchSnapshot();

        cy.get('[aria-label="Click to add another advanced search field"]', {
            delay: 1000,
        }).click();

        cy.get(
            '[aria-label="Click to select a field to search from the list - Select a field currently selected"]',
        ).click();

        cy.get('[data-value="rek_author"]').click();

        cy.wait(3000);
        cy.get('.content-container', {
            timeout: 1000,
            delay: 1000,
        }).toMatchSnapshot();
        cy.get('[placeholder="Add an author name"]').type('Ky Lane{enter}', {
            delay: 100,
        });

        cy.get('[aria-label="Click to add another advanced search field"]', {
            delay: 1000,
        }).click();
        cy.get(
            '[aria-label="Click to select a field to search from the list - Select a field currently selected"]',
        ).click();
        cy.get('[data-value="rek_ismemberof"]').click();
        cy.get('div')
            .contains('Select collections')
            .click();
        cy.get('[data-value="UQ:131735"]').click();
        cy.get('[data-value="UQ:131375"]').click();
        cy.get('[data-value="UQ:292807"]').click();
        cy.get('div[id="menu-"]')
            .get('div[aria-hidden="true"]')
            .click({ force: true, multiple: true }); // This will close any select field modal popup by force

        cy.wait(3000);
        cy.get('.content-container', {
            timeout: 1000,
            delay: 1000,
        }).toMatchSnapshot();
    });
});
