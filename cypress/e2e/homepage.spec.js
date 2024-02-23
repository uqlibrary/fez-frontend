context('Homepage', () => {
    const checkMenuItemCount = expectedCount => {
        cy.get('button[aria-label="Click to open the main navigation"]').click();
        cy.get('nav#mainMenu')
            .get('div[role="button"]')
            .should('have.length', expectedCount);
    };

    it('Renders the tabbed panes as expected', () => {
        cy.visit('/');

        cy.get('button[role="tab"]')
            .contains('Trending on Scopus')
            .click();
        cy.get('h6')
            .should('contain', 'Scopus citation count')
            .should('not.contain', 'Web of Science citation count')
            .should('not.contain', 'Altmetric score');

        cy.get('button[role="tab"]')
            .contains('Trending on Web of science')
            .click();
        cy.get('h6')
            .should('not.contain', 'Scopus citation count')
            .should('contain', 'Web of Science citation count')
            .should('not.contain', 'Altmetric score');

        cy.get('button[role="tab"]')
            .contains('Trending on Altmetric')
            .click();
        cy.get('h6')
            .should('not.contain', 'Scopus citation count')
            .should('not.contain', 'Web of Science citation count')
            .should('contain', 'Altmetric score');

        cy.contains('h3', 'Acknowledgement of Country');
        cy.contains('h3', 'Cultural advice');
    });

    it('Has expected menu items for a public user', () => {
        cy.visit('/?user=uqexpired');
        checkMenuItemCount(5);
    });

    it('Has expected menu items for a researcher', () => {
        cy.visit('/?user=uqresearcher');
        checkMenuItemCount(14);
    });

    it('Has expected menu items for an admin', () => {
        cy.visit('/?user=uqstaff');
        checkMenuItemCount(28);
    });

    it('Has expected menu items for a student without an author account', () => {
        cy.visit('/?user=s3333333');
        checkMenuItemCount(6);
    });

    it('Has expected menu items for a RHD student', () => {
        cy.visit('/?user=s2222222');
        checkMenuItemCount(14);
    });

    it('Has expected menu items for a Masqueradable staff member', () => {
        cy.visit('/?user=uqmasquerade');
        checkMenuItemCount(15);
        cy.get('#mainMenu .menu-item-container p').contains('uq.masquerader@example.uq.edu.au');
    });

    it('Shows help panel as expected', () => {
        cy.visit('/?user=uqresearcher');
        cy.get('button#help-icon').click();
        cy.get('[data-testid=help-drawer-title]')
            .should('be.visible')
            .contains('About these metrics');
        cy.get('[data-testid=help-drawer-close]')
            .contains('CLOSE')
            .click();
        cy.get('[data-testid=help-drawer-title]').should('not.be.visible');
    });
});
