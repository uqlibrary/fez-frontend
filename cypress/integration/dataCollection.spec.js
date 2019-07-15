context('Data Collection form', () => {
    beforeEach(() => {
        cy.visit('/data-collections/add');
        cy.closeUnsupported();
    });

    afterEach(() => {
        // Add this when we have a dialog when navigating away from a form
        cy.window().then(win => (win.onbeforeunload = undefined));
    });

    it('Form behaves as expected', () => {
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert')
            .find('li')
            .should('have.length', 14);

        // Accept the agreement
        cy.get('input#deposit-agreement').click();
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert')
            .find('li')
            .should('have.length', 13);

        // Dataset name
        cy.get('textarea#Datasetname:visible', { timeout: 5000 }).type('Name of Dataset');
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert')
            .find('li')
            .should('have.length', 12);

        // Dataset description
        cy.get('textarea#Datasetdescription:visible', { timeout: 5000 }).type('Description of Dataset');
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert')
            .find('li')
            .should('have.length', 11);

        // Contact name
        cy.get('input#Contactname').type('Ky Lane');
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert')
            .find('li')
            .should('have.length', 10);

        // Contact name ID
        cy.get('input#ContactnameID-input').type('a');
        cy.wait(1000);
        cy.get('li#ContactnameID-item-0:visible')
            .invoke('width')
            .should('be.greaterThan', 0);
        cy.get('li#ContactnameID-item-0').click();
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert')
            .find('li')
            .should('have.length', 9);

        // Contact email
        cy.get('input#Contactemail').type('k.lane@');
        cy.get('p#Contactemail-helper-text')
            .contains('Email address is not valid')
            .should('have.length', 1);
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert')
            .find('li')
            .should('have.length', 9);
        cy.get('input#Contactemail').type('uq.edu.au');
        cy.get('div.Alert')
            .find('li')
            .should('have.length', 8);

        // DOI
        cy.get('input#DOI').type('test');
        cy.get('p#DOI-helper-text')
            .contains('DOI is not valid')
            .should('have.length', 1);
        cy.get('input#DOI').type('{backspace}{backspace}{backspace}{backspace}{backspace}10.1037/a0028240', {
            delay: 30,
        });
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert')
            .find('li')
            .should('have.length', 8);

        // Publisher
        cy.get('input#Publisher').type('A publisher');
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert')
            .find('li')
            .should('have.length', 8);

        // Publication date
        cy.get('input#day').type('16');
        cy.get('div.Alert')
            .find('li')
            .should('have.length', 8);
        cy.get('div[role="button"][aria-haspopup="true"]')
            .contains('Month')
            .click();
        cy.get('li[data-value="11"]').click();
        cy.get('div.Alert')
            .find('li')
            .should('have.length', 8);
        cy.get('input#year').type('1976');
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert')
            .find('li')
            .should('have.length', 7);

        // Field of research
        cy.get('input#Fieldofresearch-input').type('a');
        cy.wait(1000);
        cy.get('li#Fieldofresearch-item-4:visible')
            .invoke('width')
            .should('be.greaterThan', 0);
        cy.get('li#Fieldofresearch-item-4').click();
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert')
            .find('li')
            .should('have.length', 6);
        cy.get('button[title="Remove this item"]').click();
        cy.get('[role="dialog"] button')
            .contains('Yes')
            .click();
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert')
            .find('li')
            .should('have.length', 7);
        cy.get('input#Fieldofresearch-input').type('a');
        cy.wait(1000);
        cy.get('li#Fieldofresearch-item-3:visible')
            .invoke('width')
            .should('be.greaterThan', 0);
        cy.get('li#Fieldofresearch-item-3').click();
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert')
            .find('li')
            .should('have.length', 6);
        cy.get('input#Fieldofresearch-input').type('a');
        cy.wait(1000);
        cy.get('li#Fieldofresearch-item-1')
            .invoke('width')
            .should('be.greaterThan', 0);
        cy.get('li#Fieldofresearch-item-1').click();
        cy.get('button[title="Remove all items"]').click();
        cy.get('[role="dialog"] button')
            .contains('Yes')
            .click();
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert')
            .find('li')
            .should('have.length', 7);
        cy.get('input#Fieldofresearch-input').type('a');
        cy.wait(1000);
        cy.get('li#Fieldofresearch-item-2')
            .invoke('width')
            .should('be.greaterThan', 0);
        cy.get('li#Fieldofresearch-item-2').click();
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert')
            .find('li')
            .should('have.length', 6);

        // Creators
        cy.get('input#creators-name-as-published-field').type('Ky Lane');
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert')
            .find('li')
            .should('have.length', 6);
        cy.get('input#Entercreatorsrole-input').type('Custom role');
        cy.get('button#submit-author').click();
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert')
            .find('li')
            .should('have.length', 5);
        cy.get('input#creators-name-as-published-field').type('Vishal Asai');
        cy.get('input#Entercreatorsrole-input').click();
        cy.get('li#Entercreatorsrole-item-1')
            .invoke('width')
            .should('be.greaterThan', 0);
        cy.get('li#Entercreatorsrole-item-1').click();
        cy.get('button#delete-creator-1').click();
        cy.get('[role="dialog"] button')
            .contains('Yes')
            .click();
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert')
            .find('li')
            .should('have.length', 5);
        cy.get('div.Creators')
            .get('button[aria-label="Remove all items"]')
            .click();
        cy.get('[role="dialog"] button')
            .contains('Yes')
            .click();
        cy.get('div.Alert')
            .find('li')
            .should('have.length', 6);
        cy.get('input#creators-name-as-published-field').type('Ky Lane');
        cy.get('input#Entercreatorsrole-input').type('UX Developer');
        cy.get('button#submit-author').click();
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert')
            .find('li')
            .should('have.length', 5);

        // Access conditions

        cy.get('div#data-collection-access-selector').click();
        cy.get('li[data-value="453618"]').click();
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert')
            .find('li')
            .should('have.length', 3);

        cy.get('div#data-collection-access-selector').click();
        cy.get('li[data-value="453619"]').click();
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert')
            .find('li')
            .should('have.length', 4);

        // Licensing and terms of access
        cy.get('div#data-collection-license-selector').click();
        cy.get('li[data-value="453609"]').click();
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert')
            .find('li')
            .should('have.length', 3);

        // Copyright notice
        cy.get('input#Copyrightnotice').type('This is a copyright notice');
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert')
            .find('li')
            .should('have.length', 3);

        // Project name
        cy.get('textarea#Projectname:visible', { timeout: 5000 }).type('This is the project name');
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert')
            .find('li')
            .should('have.length', 2);

        // Project description
        cy.get('textarea#Projectdescription:visible', { timeout: 5000 }).type(
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean dictum non purus id aliquet. '
        );
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert')
            .find('li')
            .should('have.length', 1);

        // Funding body
        cy.get('input#funding-body-input').type('Funding body 1');
        cy.get('div.Fundingbody')
            .find('button#add-items')
            .click();
        cy.get('input#funding-body-input').type('Funding body 2');
        cy.get('div.Fundingbody')
            .find('button#add-items')
            .click();
        cy.get('div.Fundingbody')
            .find('button[title="Move funding body up the order"]')
            .click();
        cy.get('div.Fundingbody')
            .find('button#delete-0')
            .click();
        cy.get('[role="dialog"] button')
            .contains('Yes')
            .click();
        cy.get('[role="dialog"]').should('not.exist');
        cy.get('div.Fundingbody')
            .find('button[title="Remove all funding bodies"]')
            .click();
        cy.get('[role="dialog"] button')
            .contains('Yes')
            .click();
        cy.get('input#funding-body-input').type('Funding body 3');
        cy.get('div.Fundingbody')
            .find('button#add-items')
            .click();
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert')
            .find('li')
            .should('have.length', 1);

        // Grant ID
        cy.get('input#grant-id-input').type('Grant ID 1');
        cy.get('div.GrantIDs')
            .find('button#add-items')
            .click();
        cy.get('input#grant-id-input').type('Grant ID 2');
        cy.get('div.GrantIDs')
            .find('button#add-items')
            .click();
        cy.get('div.GrantIDs')
            .find('button[title="Move grant ID up the order"]')
            .click();
        cy.get('div.GrantIDs')
            .find('button#delete-0')
            .click();
        cy.get('[role="dialog"] button')
            .contains('Yes')
            .click();
        cy.get('div.GrantIDs')
            .find('button[title="Remove all grant IDs"]')
            .click();
        cy.get('[role="dialog"] button')
            .contains('Yes')
            .click();
        cy.get('input#grant-id-input').type('Grant ID 3');
        cy.get('div.GrantIDs')
            .find('button#add-items')
            .click();
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert')
            .find('li')
            .should('have.length', 1);

        // Type of data
        cy.get('input#type-of-data-input').type('Type of data 1');
        cy.get('div.Typeofdata')
            .find('button#add-items')
            .click();
        cy.get('input#type-of-data-input').type('Type of data 2');
        cy.get('div.Typeofdata')
            .find('button#add-items')
            .click();
        cy.get('div.Typeofdata')
            .find('button[title="Move type of data up the order"]')
            .click();
        cy.get('div.Typeofdata')
            .find('button#delete-0')
            .click();
        cy.get('[role="dialog"] button')
            .contains('Yes')
            .click();
        cy.get('div.Typeofdata')
            .find('button[title="Remove all type of data"]')
            .click();
        cy.get('[role="dialog"] button')
            .contains('Yes')
            .click();
        cy.get('input#type-of-data-input').type('Type of data 3');
        cy.get('div.Typeofdata')
            .find('button#add-items')
            .click();
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert')
            .find('li')
            .should('have.length', 1);

        // Software required
        cy.get('input#software-required-input').type('Software required 1');
        cy.get('div.Softwarerequired')
            .find('button#add-items')
            .click();
        cy.get('input#software-required-input').type('Software required 2');
        cy.get('div.Softwarerequired')
            .find('button#add-items')
            .click();
        cy.get('div.Softwarerequired')
            .find('button[title="Move software required up the order"]')
            .click();
        cy.get('div.Softwarerequired')
            .find('button#delete-0')
            .click();
        cy.get('[role="dialog"] button')
            .contains('Yes')
            .click();
        cy.get('div.Softwarerequired')
            .find('button[title="Remove all software required"]')
            .click();
        cy.get('[role="dialog"] button')
            .contains('Yes')
            .click();
        cy.get('input#software-required-input').type('Software required 3');
        cy.get('div.Softwarerequired')
            .find('button#add-items')
            .click();
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert')
            .find('li')
            .should('have.length', 1);

        // Keywords
        cy.get('input#keywords-input').type('Keywords 1');
        cy.get('div.Keywords')
            .find('button#add-items')
            .click();
        cy.get('input#keywords-input').type('Keywords 2');
        cy.get('div.Keywords')
            .find('button#add-items')
            .click();
        cy.get('div.Keywords')
            .find('button[title="Move keyword up the order"]')
            .click();
        cy.get('div.Keywords')
            .find('button#delete-0')
            .click();
        cy.get('[role="dialog"] button')
            .contains('Yes')
            .click();
        cy.get('div.Keywords')
            .find('button[title="Remove all keywords"]')
            .click();
        cy.get('[role="dialog"] button')
            .contains('Yes')
            .click();
        cy.get('input#keywords-input').type('Keywords 3');
        cy.get('div.Keywords')
            .find('button#add-items')
            .click();
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        cy.get('div.Alert')
            .find('li')
            .should('have.length', 1);

        // Start/End date
        // TODO: Awaiting Bug fix - https://www.pivotaltracker.com/story/show/167004604
        cy.get('input#rek_start_date')
            .clear()
            .type('01/01/1980');
        cy.get('input#rek_start_date').blur();
        cy.get('input#rek_end_date')
            .clear()
            .type('01/01/1979');
        cy.get('input#rek_end_date').blur();
        cy.get('div[aria-describedby="rek_start_date-helper-text"]')
            .find('p')
            .contains('Please provide a valid start/end date range')
            .should('be.visible');
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');

        cy.get('input#rek_start_date')
            .clear()
            .type('01/01/1980');
        cy.get('input#rek_start_date').blur();
        cy.get('input#rek_end_date')
            .clear()
            .type('01/01/1981');
        cy.get('input#rek_end_date').blur();
        cy.get('button#submit-data-collection').should('have.attr', 'disabled');

        // Related datasets
        cy.get('input#DatasetWorktitle-input').type('a');
        cy.wait(1000);
        cy.get('li#DatasetWorktitle-item-0:visible')
            .invoke('width')
            .should('be.greaterThan', 0);
        cy.get('li#DatasetWorktitle-item-0').click();
        // cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        // cy.get('div.Alert').find('li').should('have.length', 1);
        cy.get('input#DatasetWorktitle-input').type('a');
        cy.wait(1000);
        cy.get('li#DatasetWorktitle-item-1:visible')
            .invoke('width')
            .should('be.greaterThan', 0);
        cy.get('li#DatasetWorktitle-item-1').click();
        cy.get('div[class="undefined Relateddatasets/work"]')
            .get('div.ListRow-NoLabel')
            .first()
            .get('p')
            .should('contain', 'Vaccination day');
        cy.get('div[class="undefined Relateddatasets/work"]')
            .get('div.ListRow-NoLabel')
            .last()
            .get('p')
            .should('contain', 'Early Onset Scoliosis');
        cy.get('div[class="undefined Relateddatasets/work"]')
            .get('button[title="Move item up the order"]')
            .click();
        cy.get('div[class="undefined Relateddatasets/work"]')
            .get('div.ListRow-NoLabel')
            .last()
            .get('p')
            .should('contain', 'Vaccination day');
        cy.get('div[class="undefined Relateddatasets/work"]')
            .get('div.ListRow-NoLabel')
            .first()
            .get('p')
            .should('contain', 'Early Onset Scoliosis');
    });
});
