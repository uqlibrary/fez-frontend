context('Dataset', () => {
    beforeEach(() => {
        cy.visit('/data-collections/add');
        cy.viewport(1000, 800);
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
        cy.get('div.Alert')
            .get('ul')
            .children()
            .should('have.length', 19);

        // Accept the agreement
        cy.get('input#deposit-agreement').click();
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert')
            .get('ul')
            .children()
            .should('have.length', 18);

        // Dataset name
        cy.get('textarea#Datasetname').type('Name of Dataset', {delay: 30});
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert')
            .get('ul')
            .children()
            .should('have.length', 17);

        // Dataset name
        cy.get('textarea#Datasetdescription').type('Description of Dataset', {delay: 30});
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert')
            .get('ul')
            .children()
            .should('have.length', 16);

        // Contact name
        cy.get('input#Contactname').type('Ky Lane', {delay: 30});
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert')
            .get('ul')
            .children()
            .should('have.length', 15);

        // Contact name ID
        cy.get('input#ContactnameID-input').type('k', {delay: 30});
        cy.wait(1000);
        cy.get('li#ContactnameID-item-0').click();
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert')
            .get('ul')
            .children()
            .should('have.length', 14);

        // Contact email
        cy.get('input#Contactemail').type('k.lane@', {delay: 30});
        cy.get('p#Contactemail-helper-text')
            .contains('Email address is not valid')
            .should('have.length', 1);
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert')
            .get('ul')
            .children()
            .should('have.length', 14);
        cy.get('input#Contactemail').type('uq.edu.au', {delay: 30});
        cy.get('div.Alert')
            .get('ul')
            .children()
            .should('have.length', 13);

        // DOI
        cy.get('input#DOI').type('test', {delay: 30});
        cy.get('p#DOI-helper-text')
            .contains('DOI is not valid')
            .should('have.length', 1);
        cy.get('input#DOI').type('{backspace}{backspace}{backspace}{backspace}{backspace}10.1037/a0028240', {
            delay: 30,
        });
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert')
            .get('ul')
            .children()
            .should('have.length', 13);

        // Publisher
        cy.get('input#Publisher').type('A publisher', {delay: 30});
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert')
            .get('ul')
            .children()
            .should('have.length', 13);

        // Publication date
        cy.get('input#day').type('16', {delay: 30});
        cy.get('div.Alert')
            .get('ul')
            .children()
            .should('have.length', 13);
        cy.get('div[role="button"][aria-haspopup="true"]')
            .contains('Month')
            .click();
        cy.get('li[data-value="11"]').click();
        cy.get('div.Alert')
            .get('ul')
            .children()
            .should('have.length', 13);
        cy.get('input#year').type('1976', {delay: 30});
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert')
            .get('ul')
            .children()
            .should('have.length', 12);

        // Field of research
        cy.get('input#Fieldofresearch-input').type('a');
        cy.get('li#Fieldofresearch-item-4').click();
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert')
            .get('ul')
            .children()
            .should('have.length', 11);
        cy.get('button[title="Remove this item"]').click();
        cy.get('button')
            .contains('Yes')
            .click();
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert')
            .get('ul')
            .children()
            .should('have.length', 12);
        cy.get('input#Fieldofresearch-input').type('a');
        cy.get('li#Fieldofresearch-item-3').click();
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert')
            .get('ul')
            .children()
            .should('have.length', 11);
        cy.get('input#Fieldofresearch-input').type('a');
        cy.get('li#Fieldofresearch-item-1').click();
        cy.get('button[title="Remove all items"]').click();
        cy.get('button')
            .contains('Yes')
            .click();
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert')
            .get('ul')
            .children()
            .should('have.length', 12);
        cy.get('input#Fieldofresearch-input').type('a');
        cy.get('li#Fieldofresearch-item-2').click();
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert')
            .get('ul')
            .children()
            .should('have.length', 11);

        // Creators
        cy.get('input#creators-name-as-published-field').type('Ky Lane', {delay: 30});
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert')
            .get('ul')
            .children()
            .should('have.length', 11);
        cy.get('input#Entercreatorsrole-input').type('Custom role', {delay: 30});
        cy.get('button#submit-author').click();
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert')
            .get('ul')
            .children()
            .should('have.length', 12);
        cy.get('input#creators-name-as-published-field').type('Vishal Asai', {delay: 30});
        cy.get('input#Entercreatorsrole-input').click();
        cy.get('li#Entercreatorsrole-item-1').click();
        cy.get('button#delete-creator-1').click();
        cy.get('button')
            .contains('Yes')
            .click();
    });
});
