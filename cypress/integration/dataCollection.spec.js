context('Data Collection form', () => {
    beforeEach(() => {
        cy.visit('/data-collections/add');
        cy.closeUnsupported();
    });

    afterEach(() => {
        // Add this when we have a dialog when navigating away from a form
        cy.window()
            .then(win => (win.onbeforeunload = undefined));
    });

    it('Form behaves as expected', () => {
        cy.get('button#submit-data-collection')
            .should('have.attr', 'disabled');
        cy.get('div.Alert li')
            .should('have.length', 13);

        // Accept the agreement
        cy.get('input#deposit-agreement')
            .click();
        cy.get('button#submit-data-collection')
            .should('have.attr', 'disabled');
        cy.get('div.Alert li')
            .should('have.length', 12);

        // Dataset name
        cy.get('textarea#Datasetname:visible', { timeout: 5000 })
            .type('Name of Dataset');
        cy.get('button#submit-data-collection')
            .should('have.attr', 'disabled');
        cy.get('div.Alert li')
            .should('have.length', 11);

        // Dataset description
        cy.get('textarea#Datasetdescription:visible', { timeout: 5000 })
            .type('Description of Dataset');
        cy.get('button#submit-data-collection')
            .should('have.attr', 'disabled');
        cy.get('div.Alert li')
            .should('have.length', 10);

        // Contact name
        cy.get('input#Contactname')
            .type('Ky Lane');
        cy.get('button#submit-data-collection')
            .should('have.attr', 'disabled');
        cy.get('div.Alert li')
            .should('have.length', 9);

        // Contact name ID
        cy.get('input#ContactnameID-input')
            .type('a');
        cy.wait(1000);
        cy.get('li#ContactnameID-item-0:visible')
            .invoke('width')
            .should('be.greaterThan', 0);
        cy.get('li#ContactnameID-item-0')
            .click();
        cy.get('button#submit-data-collection')
            .should('have.attr', 'disabled');
        cy.get('div.Alert li')
            .should('have.length', 8);

        // Contact email
        cy.get('input#Contactemail')
            .type('k.lane@');
        cy.get('p#Contactemail-helper-text')
            .contains('Email address is not valid')
            .should('have.length', 1);
        cy.get('button#submit-data-collection')
            .should('have.attr', 'disabled');
        cy.get('div.Alert li')
            .should('have.length', 8);
        cy.get('input#Contactemail')
            .type('uq.edu.au');
        cy.get('div.Alert li')
            .should('have.length', 7);

        // DOI
        cy.get('input#DOI')
            .type('test');
        cy.get('p#DOI-helper-text')
            .contains('DOI is not valid')
            .should('have.length', 1);
        cy.get('input#DOI')
            .type('{backspace}{backspace}{backspace}{backspace}{backspace}10.1037/a0028240', {
                delay: 30,
            });
        cy.get('button#submit-data-collection')
            .should('have.attr', 'disabled');
        cy.get('div.Alert li')
            .should('have.length', 7);

        // Publisher
        cy.get('input#Publisher')
            .type('A publisher');
        cy.get('button#submit-data-collection')
            .should('have.attr', 'disabled');
        cy.get('div.Alert li')
            .should('have.length', 7);

        // Publication date
        cy.contains('h3', 'Dataset information')
            .closest('.StandardCard')
            .find('input#day')
            .type('16');
        cy.get('div.Alert li')
            .should('have.length', 7);

        cy.get('div[role="button"][aria-haspopup="true"]')
            .contains('Month')
            .click();
        cy.get('li[data-value="11"]')
            .click();
        cy.get('div.Alert li')
            .should('have.length', 7);

        cy.contains('h3', 'Dataset information')
            .closest('.StandardCard')
            .find('input#year')
            .type('1976');
        cy.get('button#submit-data-collection')
            .should('have.attr', 'disabled');
        cy.get('div.Alert li')
            .should('have.length', 6);

        // Field of research
        cy.get('input#Fieldofresearch-input')
            .type('a');
        cy.wait(1000);
        cy.get('li#Fieldofresearch-item-4:visible')
            .invoke('width')
            .should('be.greaterThan', 0);
        cy.get('li#Fieldofresearch-item-4')
            .click();
        cy.get('button#submit-data-collection')
            .should('have.attr', 'disabled');
        cy.get('div.Alert li')
            .should('have.length', 5);
        cy.get('button[title="Remove this item"]')
            .click();
        cy.get('[role="dialog"] button')
            .contains('Yes')
            .click();
        cy.get('button#submit-data-collection')
            .should('have.attr', 'disabled');
        cy.get('div.Alert li')
            .should('have.length', 6);
        cy.get('input#Fieldofresearch-input')
            .type('a');
        cy.wait(1000);
        cy.get('li#Fieldofresearch-item-3:visible')
            .invoke('width')
            .should('be.greaterThan', 0);
        cy.get('li#Fieldofresearch-item-3')
            .click();
        cy.get('button#submit-data-collection')
            .should('have.attr', 'disabled');
        cy.get('div.Alert li')
            .should('have.length', 5);
        cy.get('input#Fieldofresearch-input')
            .type('a');
        cy.wait(1000);
        cy.get('li#Fieldofresearch-item-1')
            .invoke('width')
            .should('be.greaterThan', 0);
        cy.get('li#Fieldofresearch-item-1')
            .click();
        cy.get('button[title="Remove all items"]')
            .click();
        cy.get('[role="dialog"] button')
            .contains('Yes')
            .click();
        cy.get('button#submit-data-collection')
            .should('have.attr', 'disabled');
        cy.get('div.Alert li')
            .should('have.length', 6);
        cy.get('input#Fieldofresearch-input')
            .type('a');
        cy.wait(1000);
        cy.get('li#Fieldofresearch-item-2')
            .invoke('width')
            .should('be.greaterThan', 0);
        cy.get('li#Fieldofresearch-item-2')
            .click();
        cy.get('button#submit-data-collection')
            .should('have.attr', 'disabled');
        cy.get('div.Alert li')
            .should('have.length', 5);

        // Creators
        cy.get('input#creators-name-as-published-field')
            .type('Ky Lane');
        cy.get('button#submit-data-collection')
            .should('have.attr', 'disabled');
        cy.get('div.Alert li')
            .should('have.length', 5);
        cy.get('input#Entercreatorsrole-input')
            .type('Custom role');
        cy.get('button#submit-author')
            .click();
        cy.get('button#submit-data-collection')
            .should('have.attr', 'disabled');
        cy.get('div.Alert li')
            .should('have.length', 4);
        cy.get('input#creators-name-as-published-field')
            .type('Vishal Asai');
        cy.get('input#Entercreatorsrole-input')
            .click();
        cy.get('li#Entercreatorsrole-item-1')
            .invoke('width')
            .should('be.greaterThan', 0);
        cy.get('li#Entercreatorsrole-item-1')
            .click();
        cy.get('button#delete-creator-1')
            .click();
        cy.get('[role="dialog"] button')
            .contains('Yes')
            .click();
        cy.get('button#submit-data-collection')
            .should('have.attr', 'disabled');
        cy.get('div.Alert li')
            .should('have.length', 4);
        cy.get('div.Creators')
            .get('button[aria-label="Remove all items"]')
            .click();
        cy.get('[role="dialog"] button')
            .contains('Yes')
            .click();
        cy.get('div.Alert li')
            .should('have.length', 5);
        cy.get('input#creators-name-as-published-field')
            .type('Ky Lane');
        cy.get('input#Entercreatorsrole-input')
            .type('UX Developer');
        cy.get('button#submit-author')
            .click();
        cy.get('button#submit-data-collection')
            .should('have.attr', 'disabled');
        cy.get('div.Alert li')
            .should('have.length', 4);

        // Access conditions

        cy.get('div#data-collection-access-selector')
            .click();
        cy.get('li[data-value="453618"]')
            .click();
        cy.get('button#submit-data-collection')
            .should('have.attr', 'disabled');
        cy.get('div.Alert li')
            .should('have.length', 3);

        cy.get('div#data-collection-access-selector')
            .click();
        cy.get('li[data-value="453619"]')
            .click();
        cy.get('button#submit-data-collection')
            .should('have.attr', 'disabled');
        cy.get('div.Alert li')
            .should('have.length', 3);

        // Licensing and terms of access
        cy.get('div#data-collection-license-selector')
            .click();
        cy.get('li[data-value="453609"]')
            .click();
        cy.get('button#submit-data-collection')
            .should('have.attr', 'disabled');
        cy.get('div.Alert li')
            .should('have.length', 2);

        // Copyright notice
        cy.get('input#Copyrightnotice')
            .type('This is a copyright notice');
        cy.get('button#submit-data-collection')
            .should('have.attr', 'disabled');
        cy.get('div.Alert li')
            .should('have.length', 2);

        // Project name
        cy.get('textarea#Projectname:visible', { timeout: 5000 })
            .type('This is the project name');
        cy.get('button#submit-data-collection')
            .should('have.attr', 'disabled');
        cy.get('div.Alert li')
            .should('have.length', 1);

        // Project description
        cy.get('textarea#Projectdescription:visible', { timeout: 5000 })
            .type(
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean dictum non purus id aliquet. ',
            );
        cy.get('button#submit-data-collection')
            .should('not.have.attr', 'disabled');
        cy.get('div.Alert li')
            .should('have.length', 0);

        // Funding body
        cy.get('input#funding-body-input')
            .type('Funding body 1');
        cy.get('div.Fundingbody')
            .find('button#add-items')
            .click();
        cy.get('input#funding-body-input')
            .type('Funding body 2');
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
        cy.get('[role="dialog"]')
            .should('not.exist');
        cy.get('div.Fundingbody')
            .find('button[title="Remove all funding bodies"]')
            .click();
        cy.get('[role="dialog"] button')
            .contains('Yes')
            .click();
        cy.get('input#funding-body-input')
            .type('Funding body 3');
        cy.get('div.Fundingbody')
            .find('button#add-items')
            .click();
        cy.get('button#submit-data-collection')
            .should('not.have.attr', 'disabled');
        cy.get('div.Alert li')
            .should('have.length', 0);

        // Grant ID
        cy.get('input#grant-id-input')
            .type('Grant ID 1');
        cy.get('div.GrantIDs')
            .find('button#add-items')
            .click();
        cy.get('input#grant-id-input')
            .type('Grant ID 2');
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
        cy.get('input#grant-id-input')
            .type('Grant ID 3');
        cy.get('div.GrantIDs')
            .find('button#add-items')
            .click();
        cy.get('button#submit-data-collection')
            .should('not.have.attr', 'disabled');
        cy.get('div.Alert li')
            .should('have.length', 0);

        // Type of data
        cy.get('input#type-of-data-input')
            .type('Type of data 1');
        cy.get('div.Typeofdata')
            .find('button#add-items')
            .click();
        cy.get('input#type-of-data-input')
            .type('Type of data 2');
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
        cy.get('input#type-of-data-input')
            .type('Type of data 3');
        cy.get('div.Typeofdata')
            .find('button#add-items')
            .click();
        cy.get('button#submit-data-collection')
            .should('not.have.attr', 'disabled');
        cy.get('div.Alert li')
            .should('have.length', 0);

        // Software required
        cy.get('input#software-required-input')
            .type('Software required 1');
        cy.get('div.Softwarerequired')
            .find('button#add-items')
            .click();
        cy.get('input#software-required-input')
            .type('Software required 2');
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
        cy.get('input#software-required-input')
            .type('Software required 3');
        cy.get('div.Softwarerequired')
            .find('button#add-items')
            .click();
        cy.get('button#submit-data-collection')
            .should('not.have.attr', 'disabled');
        cy.get('div.Alert li')
            .should('have.length', 0);

        // Keywords
        cy.get('input#keywords-input')
            .type('Keywords 1');
        cy.get('div.Keywords')
            .find('button#add-items')
            .click();
        cy.get('input#keywords-input')
            .type('Keywords 2');
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
        cy.get('input#keywords-input')
            .type('Keywords 3');
        cy.get('div.Keywords')
            .find('button#add-items')
            .click();
        cy.get('button#submit-data-collection')
            .should('not.have.attr', 'disabled');
        cy.get('div.Alert li')
            .should('have.length', 0);

        // Collection Start date
        // the field is not required - if we focus on it, type something in, clear and click on a different field,
        // we do not get an error
        cy.contains('span', 'Collection start date')
            .parent()
            .find('input#day')
            .type('16')
            .clear();
        cy.get('input#keywords-input')
            .type('Keywords 1');
        cy.contains('p', 'Invalid day')
            .should('not.be.visible');

        // an 31st of april is an invalid date
        cy.contains('span', 'Collection start date')
            .parent()
            .find('input#day')
            .type('31');

        cy.contains('span', 'Collection start date')
            .parent()
            .contains('Month')
            .parent()
            .click();
        cy.get('li[data-value="3"]')
            .click();

        cy.contains('span', 'Collection start date')
            .parent()
            .find('input#year')
            .type('2000');

        cy.contains('p', 'Invalid date')
            .should('be.visible');

        // now check valid dates
        cy.contains('span', 'Collection start date')
            .parent()
            .find('input#day')
            .clear()
            .type('16');

        // enter future date and see error
        cy.contains('span', 'Collection start date')
            .parent()
            .find('input#year')
            .clear()
            .type('2100');

        cy.contains('p', 'Date must be before now')
            .should('be.visible');

        // enter valid year
        cy.contains('span', 'Collection start date')
            .parent()
            .find('input#year')
            .clear()
            .type('1976');

        cy.contains('p', 'Date must be before now')
            .should('not.be.visible');

        cy.get('div.Alert li')
            .should('have.length', 0);

        cy.get('button#submit-data-collection')
            .should('not.have.attr', 'disabled');

        // End Collection date
        cy.contains('span', 'Collection end date')
            .parent()
            .find('input#day')
            .type('16');

        cy.contains('span', 'Collection end date')
            .parent()
            .contains('Month')
            .parent()
            .click();
        cy.get('li[data-value="11"]')
            .click();

        // enter future date and see error
        cy.contains('span', 'Collection end date')
            .parent()
            .find('input#year')
            .type('2100');

        cy.contains('p', 'Date must be before now')
            .should('be.visible');

        // enter end date before start date and see error
        cy.contains('span', 'Collection end date')
            .parent()
            .find('input#year')
            .clear()
            .type('1974');

        cy.contains('p', 'Date range is not valid')
            .should('be.visible');

        // finally, enter valid date
        cy.contains('span', 'Collection end date')
            .parent()
            .find('input#year')
            .clear()
            .type('1976');

        cy.contains('p', 'Date range is not valid')
            .should('not.be.visible');

        cy.get('div.Alert li')
            .should('have.length', 0);
        cy.get('button#submit-data-collection')
            .should('not.have.attr', 'disabled');

        // Related datasets
        cy.get('input#DatasetWorktitle-input')
            .type('a');
        cy.wait(1000);
        cy.get('li#DatasetWorktitle-item-0:visible')
            .invoke('width')
            .should('be.greaterThan', 0);
        cy.get('li#DatasetWorktitle-item-0')
            .click();
        // cy.get('button#submit-data-collection').should('have.attr', 'disabled');
        // cy.get('div.Alert').find('li').should('have.length', 1);
        cy.get('input#DatasetWorktitle-input')
            .type('a');
        cy.wait(1000);
        cy.get('li#DatasetWorktitle-item-1:visible')
            .invoke('width')
            .should('be.greaterThan', 0);
        cy.get('li#DatasetWorktitle-item-1')
            .click();
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
