context('Homepage', () => {
    let currentTestTitle = '';
    const deviceTypes = ['mobile', 'tablet', 'desktop', 'wide'];

    beforeEach(() => {
        currentTestTitle = Cypress.mocha.getRunner().suite.ctx.currentTest.title;
    });

    const percySnapshotAfterLoad = () => {
        cy.get('button[role="tab"]')
            .should('contain', 'Trending on Altmetric');
        cy.percySnapshot(currentTestTitle);
    };

    const checkMenuItemCount = expectedCount => {
        cy.closeUnsupported();
        cy.get('button[aria-label="Click to open the main navigation"]')
            .click();
        cy.get('nav#mainMenu')
            .get('div[role="button"]')
            .should('have.length', expectedCount);
    };

    it('Renders the tabbed panes as expected', () => {
        cy.visit('/');
        cy.percySnapshot('Homepage loading');
        cy.closeUnsupported();

        cy.get('button[role="tab"]')
            .should('contain', 'Trending on Altmetric');
        deviceTypes.forEach(type => {
            cy.percyDeviceSnapshot(type, 'Homepage on load');
        });

        cy.get('button[role="tab"]')
            .contains('Trending on Scopus')
            .click();
        cy.get('h6')
            .should('contain', 'Scopus citation count')
            .should('not.contain', 'Web of Science citation count')
            .should('not.contain', 'Altmetric score');

        cy.percySnapshot('Homepage on Scopus tab');

        cy.get('button[role="tab"]')
            .contains('Trending on Web of science')
            .click();
        cy.get('h6')
            .should('not.contain', 'Scopus citation count')
            .should('contain', 'Web of Science citation count')
            .should('not.contain', 'Altmetric score');

        cy.percySnapshot('Homepage on WoS tab');

        cy.get('button[role="tab"]')
            .contains('Trending on Altmetric')
            .click();
        cy.get('h6')
            .should('not.contain', 'Scopus citation count')
            .should('not.contain', 'Web of Science citation count')
            .should('contain', 'Altmetric score');

        cy.percySnapshot('Homepage on Altmetric tab');

        cy.get('.StandardPage > div > div > div:nth-of-type(2) h3')
            .should('contain', 'What is eSpace?');
    });

    it('Has expected menu items for a public user', () => {
        cy.visit('/?user=uqexpired');
        checkMenuItemCount(4);
        percySnapshotAfterLoad();
    });

    it('Has expected menu items for a researcher', () => {
        cy.visit('/?user=uqresearcher');
        checkMenuItemCount(12);
        percySnapshotAfterLoad();
    });

    it('Has expected menu items for an admin', () => {
        cy.visit('/?user=uqstaff');
        checkMenuItemCount(20);
        percySnapshotAfterLoad();
    });

    it('Has expected menu items for a student without an author account', () => {
        cy.visit('/?user=s3333333');
        checkMenuItemCount(4);
        percySnapshotAfterLoad();
    });

    it('Has expected menu items for a RHD student', () => {
        cy.visit('/?user=s2222222');
        checkMenuItemCount(12);
        percySnapshotAfterLoad();
    });

    it('Has expected menu items for a Masqueradable staff member', () => {
        cy.visit('/?user=uqmasquerade');
        checkMenuItemCount(13);
        cy.get('#mainMenu .menu-item-container p')
            .contains('uq.masquerader@example.uq.edu.au');
        percySnapshotAfterLoad();
    });
});
