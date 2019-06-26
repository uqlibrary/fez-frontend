context('Dataset', () => {
    beforeEach(() => {
        cy.visit('/data-collections/add');
        cy.viewport(1000,800);
        cy.get('#unsupportedBrowser.card button').then($button => {
            // Button is only visible if browser is unsupported.
            if ($button.filter(':visible')) {
                $button.click();
            }
        });
        cy.wait(2000);
    });

    afterEach(() => {
        // Add this when we have a dialog when navigating away from a form
        cy.window().then(win => (win.onbeforeunload = undefined));
    });

    it('Form behaves as expected', () => {
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert').get('ul').children().should('have.length', 19);

        // Accept the agreement
        cy.get('input#deposit-agreement').click();
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert').get('ul').children().should('have.length', 18);

        // Dataset name
        cy.get('textarea#Datasetname').type('Name of Dataset', {delay: 100});
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert').get('ul').children().should('have.length', 17);

        // Dataset name
        cy.get('textarea#Datasetdescription').type('Description of Dataset', {delay: 100});
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert').get('ul').children().should('have.length', 16);

        cy.wait(30000);
    });
});
