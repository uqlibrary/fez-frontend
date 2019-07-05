context('Homepage', () => {
    it('Renders the tabbed panes as expected', () => {
        cy.visit('/');
        cy.closeUnsupported();
        cy.wait(3000);
        cy.get('button', { timeout: 30000 })
            .contains('Trending on Scopus')
            .click();
        cy.get('h6')
            .should('contain', 'Scopus citation count')
            .should('not.contain', 'Web of Science citation count')
            .should('not.contain', 'Altmetric score');

        cy.get('button', {timeout: 30000})
            .contains('Trending on Web of science')
            .click();
        cy.get('h6')
            .should('not.contain', 'Scopus citation count')
            .should('contain', 'Web of Science citation count')
            .should('not.contain', 'Altmetric score');

        cy.get('button', {timeout: 30000})
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
        cy.closeUnsupported();
        cy.wait(3000);
        cy.get('button[aria-label="Click to open the main navigation"]').click();
        cy.get('nav#mainMenu')
            .get('div[role="button"]')
            .should('have.length', 4);
    });

    it('Has expected menu items for a researcher', () => {
        cy.visit('/?user=uqresearcher');
        cy.closeUnsupported();
        cy.wait(3000);
        cy.get('button[aria-label="Click to open the main navigation"]').click();
        cy.get('nav#mainMenu')
            .get('div[role="button"]')
            .should('have.length', 12);
    });

    it('Has expected menu items for an admin', () => {
        cy.visit('/?user=uqstaff');
        cy.closeUnsupported();
        cy.wait(3000);
        cy.get('button[aria-label="Click to open the main navigation"]').click();
        cy.get('nav#mainMenu')
            .get('div[role="button"]')
            .should('have.length', 16);
    });

    it('Has expected menu items for a student', () => {
        cy.visit('/?user=s1111111');
        cy.closeUnsupported();
        cy.wait(3000);
        cy.get('button[aria-label="Click to open the main navigation"]').click();
        cy.get('nav#mainMenu')
            .get('div[role="button"]')
            .should('have.length', 12);
    });

    it('Has expected menu items for a RHD student', () => {
        cy.visit('/?user=s2222222');
        cy.closeUnsupported();
        cy.wait(3000);
        cy.get('button[aria-label="Click to open the main navigation"]').click();
        cy.get('nav#mainMenu')
            .get('div[role="button"]')
            .should('have.length', 12);
    });
});
