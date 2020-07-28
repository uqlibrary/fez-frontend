context('WCAG', () => {
    it('App framework', () => {
        cy.visit('/');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('h3').contains('What is eSpace?');
        cy.log('App');
        cy.checkA11y(null, {
            reportName: 'App',
            scopeName: 'Page structure',
            includedImpacts: ['moderate', 'serious', 'critical'],
        });
        cy.log('Header');
        cy.checkA11y('header#mainHeader', {
            reportName: 'App',
            scopeName: 'Header',
            includedImpacts: ['moderate', 'serious', 'critical'],
        });
        cy.log('Navigation');
        cy.checkA11y('nav#mainMenu', {
            reportName: 'App',
            scopeName: 'Navigation menu',
            includedImpacts: ['moderate', 'serious', 'critical'],
        });
        cy.log('Content container');
        cy.checkA11y('div#content-container', {
            reportName: 'App',
            scopeName: 'Content container',
            includedImpacts: ['moderate', 'serious', 'critical'],
        });
    });
});
