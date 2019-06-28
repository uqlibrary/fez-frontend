context('Dataset', () => {
    beforeEach(() => {
        cy.visit('/data-collections/add');
        cy.viewport(1000, 1400);
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
        cy.get('div.Alert').find('li').should('have.length', 14);

        // Accept the agreement
        cy.get('input#deposit-agreement').click();
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert').find('li').should('have.length', 13);

        // Dataset name
        cy.get('textarea#Datasetname').type('Name of Dataset', {delay: 30});
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert').find('li').should('have.length', 12);

        // Dataset name
        cy.get('textarea#Datasetdescription').type('Description of Dataset', {delay: 30});
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert').find('li').should('have.length', 11);

        // Contact name
        cy.get('input#Contactname').type('Ky Lane', {delay: 30});
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert').find('li').should('have.length', 10);

        // Contact name ID
        cy.get('input#ContactnameID-input').type('k', {delay: 30});
        cy.wait(1000);
        cy.get('li#ContactnameID-item-0').click();
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert').find('li').should('have.length', 9);

        // Contact email
        cy.get('input#Contactemail').type('k.lane@', {delay: 30});
        cy.get('p#Contactemail-helper-text')
            .contains('Email address is not valid')
            .should('have.length', 1);
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert').find('li').should('have.length', 9);
        cy.get('input#Contactemail').type('uq.edu.au', {delay: 30});
        cy.get('div.Alert').find('li').should('have.length', 8);

        // DOI
        cy.get('input#DOI').type('test', {delay: 30});
        cy.get('p#DOI-helper-text')
            .contains('DOI is not valid')
            .should('have.length', 1);
        cy.get('input#DOI').type('{backspace}{backspace}{backspace}{backspace}{backspace}10.1037/a0028240', {
            delay: 30,
        });
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert').find('li').should('have.length', 8);

        // Publisher
        cy.get('input#Publisher').type('A publisher', {delay: 30});
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert').find('li').should('have.length', 8);

        // Publication date
        cy.get('input#day').type('16', {delay: 30});
        cy.get('div.Alert').find('li').should('have.length', 8);
        cy.get('div[role="button"][aria-haspopup="true"]')
            .contains('Month')
            .click();
        cy.get('li[data-value="11"]').click();
        cy.get('div.Alert').find('li').should('have.length', 8);
        cy.get('input#year').type('1976', {delay: 30});
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert').find('li').should('have.length', 7);

        // Field of research
        cy.get('input#Fieldofresearch-input').type('a');
        cy.get('li#Fieldofresearch-item-4').click();
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert').find('li').should('have.length', 6);
        cy.get('button[title="Remove this item"]').click();
        cy.get('button')
            .contains('Yes')
            .click();
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert').find('li').should('have.length', 7);
        cy.get('input#Fieldofresearch-input').type('a');
        cy.get('li#Fieldofresearch-item-3').click();
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert').find('li').should('have.length', 6);
        cy.get('input#Fieldofresearch-input').type('a');
        cy.get('li#Fieldofresearch-item-1').click();
        cy.get('button[title="Remove all items"]').click();
        cy.get('button')
            .contains('Yes')
            .click();
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert').find('li').should('have.length', 7);
        cy.get('input#Fieldofresearch-input').type('a');
        cy.get('li#Fieldofresearch-item-2').click();
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert').find('li').should('have.length', 6);

        // Creators
        cy.get('input#creators-name-as-published-field').type('Ky Lane', {delay: 30});
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert').find('li').should('have.length', 6);
        cy.get('input#Entercreatorsrole-input').type('Custom role', {delay: 30});
        cy.get('button#submit-author').click();
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert').find('li').should('have.length', 5);
        cy.get('input#creators-name-as-published-field').type('Vishal Asai', {delay: 30});
        cy.get('input#Entercreatorsrole-input').click();
        cy.get('li#Entercreatorsrole-item-1').click();
        cy.get('button#delete-creator-1').click();
        cy.get('button')
            .contains('Yes')
            .click();
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert').find('li').should('have.length', 5);
        cy.get('div.Creators').get('button[aria-label="Remove all items"]').click();
        cy.get('button')
            .contains('Yes')
            .click();
        cy.get('div.Alert').find('li').should('have.length', 6);
        cy.get('input#creators-name-as-published-field').type('Ky Lane', {delay: 30});
        cy.get('input#Entercreatorsrole-input').type('UX Developer', {delay: 30});
        cy.get('button#submit-author').click();
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert').find('li').should('have.length', 5);

        // Access conditions

        cy.get('div#data-collection-access-selector').click();
        cy.get('li[data-value="453618"]').click();
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert').find('li').should('have.length', 3);

        cy.get('div#data-collection-access-selector').click();
        cy.get('li[data-value="453619"]').click();
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert').find('li').should('have.length', 4);

        // Licensing and terms of access
        cy.get('div#data-collection-license-selector').click();
        cy.get('li[data-value="453609"]').click();
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert').find('li').should('have.length', 3);

        // Copyright notice
        cy.get('input#Copyrightnotice').type('This is a copyright notice', {delay: 30});
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert').find('li').should('have.length', 3);

        // Project name
        cy.get('textarea#Projectname').type('This is the project name');
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert').find('li').should('have.length', 2);

        // Project description
        cy.get('textarea#Projectdescription').type('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean dictum non purus id aliquet. ', {delay: 10});
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert').find('li').should('have.length', 1);

        // Funding body
        cy.get('input#funding-body-input').type('Funding body 1', {delay: 30});
        cy.get('div.Fundingbody').find('button#add-items').click();
        cy.get('input#funding-body-input').type('Funding body 2', {delay: 30});
        cy.get('div.Fundingbody').find('button#add-items').click();
        cy.get('div.Fundingbody').find('button[title="Move funding body up the order"]').click();
        cy.get('div.Fundingbody').find('button#delete-0').click();
        cy.get('button')
            .contains('Yes')
            .click();
        cy.get('div.Fundingbody').find('button[title="Remove all funding bodies"]').click();
        cy.get('button')
            .contains('Yes')
            .click();
        cy.get('input#funding-body-input').type('Funding body 3', {delay: 30});
        cy.get('div.Fundingbody').find('button#add-items').click();
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert').find('li').should('have.length', 1);

        // Grant ID
        cy.get('input#grant-id-input').type('Grant ID 1', {delay: 30});
        cy.get('div.GrantIDs').find('button#add-items').click();
        cy.get('input#grant-id-input').type('Grant ID 2', {delay: 30});
        cy.get('div.GrantIDs').find('button#add-items').click();
        cy.get('div.GrantIDs').find('button[title="Move grant ID up the order"]').click();
        cy.get('div.GrantIDs').find('button#delete-0').click();
        cy.get('button')
            .contains('Yes')
            .click();
        cy.get('div.GrantIDs').find('button[title="Remove all grant IDs"]').click();
        cy.get('button')
            .contains('Yes')
            .click();
        cy.get('input#grant-id-input').type('Grant ID 3', {delay: 30});
        cy.get('div.GrantIDs').find('button#add-items').click();
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert').find('li').should('have.length', 1);

        // Type of data
        cy.get('input#type-of-data-input').type('Type of data 1', {delay: 30});
        cy.get('div.Typeofdata').find('button#add-items').click();
        cy.get('input#type-of-data-input').type('Type of data 2', {delay: 30});
        cy.get('div.Typeofdata').find('button#add-items').click();
        cy.get('div.Typeofdata').find('button[title="Move type of data up the order"]').click();
        cy.get('div.Typeofdata').find('button#delete-0').click();
        cy.get('button')
            .contains('Yes')
            .click();
        cy.get('div.Typeofdata').find('button[title="Remove all type of data"]').click();
        cy.get('button')
            .contains('Yes')
            .click();
        cy.get('input#type-of-data-input').type('Type of data 3', {delay: 30});
        cy.get('div.Typeofdata').find('button#add-items').click();
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert').find('li').should('have.length', 1);


    });
});
