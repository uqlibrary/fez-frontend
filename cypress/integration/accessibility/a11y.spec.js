context('WCAG', () => {
    it('App framework', () => {
        cy.visit('/');
        cy.injectAxe();
        cy.viewport(1280, 900);
        cy.wait(2000);

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
