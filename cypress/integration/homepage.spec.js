context('Homepage', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.wait(2000);
        cy.closeUnsupported();
        cy.wait(2000);
    });

    it('Renders the tabbed panes as expected', () => {
        cy.get('button', { timeout: 1000 })
            .get('span')
            .contains('Trending on Scopus')
            .click();
        cy.get('h6')
            .should('contain', 'Scopus citation count')
            .should('not.contain', 'Web of Science citation count')
            .should('not.contain', 'Altmetric score');

        cy.get('button', { timeout: 1000 })
            .get('span')
            .contains('Trending on Web of science')
            .click();
        cy.get('h6')
            .should('not.contain', 'Scopus citation count')
            .should('contain', 'Web of Science citation count')
            .should('not.contain', 'Altmetric score');

        cy.get('button', { timeout: 1000 })
            .get('span')
            .contains('Trending on Altmetric')
            .click();
        cy.get('h6')
            .should('not.contain', 'Scopus citation count')
            .should('not.contain', 'Web of Science citation count')
            .should('contain', 'Altmetric score');

        cy.get('h3').should('contain', 'What is eSpace?');
    });

    it('Has expected menu items for a public user', () => {
        cy.visit('/?user=uqexpired');
        dismissUnsupportedBrowserMessage();
        cy.get('button[aria-label="Click to open the main navigation"]').click();
        cy.get('nav#mainMenu').get('div[role="button"]')
            .should('have.length', 4);
    });

    it('Has expected menu items for a researcher', () => {
        cy.visit('/?user=uqresearcher');
        dismissUnsupportedBrowserMessage();
        cy.get('button[aria-label="Click to open the main navigation"]').click();
        cy.get('nav#mainMenu').get('div[role="button"]')
            .should('have.length', 12);
    });

    it('Has expected menu items for an admin', () => {
        cy.visit('/?user=uqstaff');
        dismissUnsupportedBrowserMessage();
        cy.get('button[aria-label="Click to open the main navigation"]').click();
        cy.get('nav#mainMenu').get('div[role="button"]')
            .should('have.length', 16);
    });

    it('Has expected menu items for a student', () => {
        cy.visit('/?user=s1111111');
        dismissUnsupportedBrowserMessage();
        cy.get('button[aria-label="Click to open the main navigation"]').click();
        cy.get('nav#mainMenu').get('div[role="button"]')
            .should('have.length', 12);
    });

    it('Has expected menu items for a RHD student', () => {
        cy.visit('/?user=s2222222');
        dismissUnsupportedBrowserMessage();
        cy.get('button[aria-label="Click to open the main navigation"]').click();
        cy.get('nav#mainMenu').get('div[role="button"]')
            .should('have.length', 12);
    });
});
