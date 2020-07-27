context('WCAG', () => {
    it('App framework', () => {
        cy.visit('/');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('a.appTitle').contains('UQ eSpace');

        cy.log('Header');
        cy.checkA11y('header#mainHeader', {
            reportName: 'App',
            scopeName: 'Header',
            includedImpacts: ['serious', 'critical'],
        });
        cy.log('Navigation');
        cy.checkA11y('nav#mainMenu', {
            reportName: 'App',
            scopeName: 'Navigation menu',
            includedImpacts: ['serious', 'critical'],
        });
        cy.log('Content container');
        cy.checkA11y('div#content-container', {
            reportName: 'App',
            scopeName: 'Content container',
            includedImpacts: ['serious', 'critical'],
        });
    });
});
