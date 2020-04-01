context('Data Collection form', () => {
    let errorCount = 13;

    before(() => {
        cy.visit('/data-collections/add');
    });

    beforeEach(() => {
        cy.get('button#submit-data-collection')
            .as('submitButton')
            .should(errorCount === 0 ? 'not.be.disabled' : 'be.disabled');
        cy.get('div.Alert li')
            .as('errors')
            .should('have.length', errorCount);
    });

    after(() => {
        cy.killWindowUnloadHandler();
    });

    it('validates deposit agreement', () => {
        // Accept the agreement
        cy.get('input#deposit-agreement')
            .click();
        cy.get('@submitButton')
            .should('be.disabled');
        cy.get('@errors')
            .should('have.length', --errorCount);
    });

    it('validates Dataset information', () => {
        // Dataset name
        cy.get('#Datasetname')
            .type('Name of Dataset', { force: true });
        cy.get('@submitButton')
            .should('be.disabled');
        cy.get('@errors')
            .should('have.length', --errorCount);

        // Dataset description
        cy.get('#Datasetdescription')
            .type('Description of Dataset', { force: true });
        cy.get('@submitButton')
            .should('be.disabled');
        cy.get('@errors')
            .should('have.length', --errorCount);

        // Contact name
        cy.get('input#Contactname')
            .type('Ky Lane');
        cy.get('@submitButton')
            .should('be.disabled');
        cy.get('@errors')
            .should('have.length', --errorCount);

        // Contact name ID
        cy.get('input#ContactnameID-input')
            .type('a');
        cy.clickAutoSuggestion('ContactnameID', 0);
        cy.get('@submitButton')
            .should('be.disabled');
        cy.get('@errors')
            .should('have.length', --errorCount);

        // Contact email
        cy.get('input#Contactemail')
            .type('k.lane@');
        cy.get('p#Contactemail-helper-text')
            .contains('Email address is not valid')
            .should('have.length', 1);
        cy.get('@submitButton')
            .should('be.disabled');
        cy.get('@errors')
            .should('have.length', errorCount);
        cy.get('input#Contactemail')
            .type('uq.edu.au');
        cy.get('@errors')
            .should('have.length', --errorCount);

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
        cy.get('@submitButton')
            .should('be.disabled');
        cy.get('@errors')
            .should('have.length', errorCount);

        // Publisher
        cy.get('input#Publisher')
            .type('A publisher');
        cy.get('@submitButton')
            .should('be.disabled');
        cy.get('@errors')
            .should('have.length', errorCount);

        // Publication date
        cy.contains('h3', 'Dataset information')
            .closest('.StandardCard')
            .find('input#day')
            .type('16');
        cy.get('@errors')
            .should('have.length', errorCount);

        cy.get('div[role="button"][aria-haspopup="true"]')
            .contains('Month')
            .click();
        cy.get('li[data-value="11"]')
            .click();
        cy.get('@errors')
            .should('have.length', errorCount);

        cy.contains('h3', 'Dataset information')
            .closest('.StandardCard')
            .find('input#year')
            .type('1976');
        cy.get('@submitButton')
            .should('be.disabled');
        cy.get('@errors')
            .should('have.length', --errorCount);
    });

    it('validates FoR codes', () => {
        // Field of research
        cy.get('input#Fieldofresearch-input')
            .type('a');
        cy.clickAutoSuggestion('Fieldofresearch', 4);
        cy.get('@submitButton')
            .should('be.disabled');
        cy.get('@errors')
            .should('have.length', --errorCount);
        cy.get('button[title="Remove this item"]')
            .click();
        cy.get('[role="dialog"] button')
            .contains('Yes')
            .click();
        cy.get('@submitButton')
            .should('be.disabled');
        cy.get('@errors')
            .should('have.length', ++errorCount);
        cy.get('input#Fieldofresearch-input')
            .type('a');
        cy.clickAutoSuggestion('Fieldofresearch', 3);
        cy.get('@submitButton')
            .should('be.disabled');
        cy.get('@errors')
            .should('have.length', --errorCount);
        cy.get('input#Fieldofresearch-input')
            .type('a');
        cy.clickAutoSuggestion('Fieldofresearch', 1);
        cy.get('button[title="Remove all items"]')
            .click();
        cy.get('[role="dialog"] button')
            .contains('Yes')
            .click();
        cy.get('@submitButton')
            .should('be.disabled');
        cy.get('@errors')
            .should('have.length', ++errorCount);
        cy.get('input#Fieldofresearch-input')
            .type('a');
        cy.clickAutoSuggestion('Fieldofresearch', 2);
        cy.get('@submitButton')
            .should('be.disabled');
        cy.get('@errors')
            .should('have.length', --errorCount);
    });

    it('validates creators', () => {
        // Creators
        cy.get('input#creators-name-as-published-field')
            .type('Ky Lane');
        cy.get('@submitButton')
            .should('be.disabled');
        cy.get('@errors')
            .should('have.length', errorCount);
        cy.get('input#Entercreatorsrole-input')
            .type('Custom role');
        cy.get('button#submit-author')
            .click();
        cy.get('@submitButton')
            .should('be.disabled');
        cy.get('@errors')
            .should('have.length', --errorCount);
        cy.get('input#creators-name-as-published-field')
            .type('Vishal Asai');
        cy.get('input#Entercreatorsrole-input')
            .click();
        cy.clickAutoSuggestion('Entercreatorsrole', 1);
        cy.get('button#delete-creator-1')
            .click();
        cy.get('[role="dialog"] button')
            .contains('Yes')
            .click();
        cy.get('@submitButton')
            .should('be.disabled');
        cy.get('@errors')
            .should('have.length', errorCount);
        cy.get('div.Creators')
            .get('button[aria-label="Remove all items"]')
            .click();
        cy.get('[role="dialog"] button')
            .contains('Yes')
            .click();
        cy.get('@errors')
            .should('have.length', ++errorCount);
        cy.get('input#creators-name-as-published-field')
            .type('Ky Lane');
        cy.get('input#Entercreatorsrole-input')
            .type('UX Developer');
        cy.get('button#submit-author')
            .click();
        cy.get('@submitButton')
            .should('be.disabled');
        cy.get('@errors')
            .should('have.length', --errorCount);
    });

    it('validates access and licensing info', () => {
        // Access conditions
        cy.get('div#data-collection-access-selector')
            .click();
        cy.get('li[data-value="453618"]')
            .click();
        cy.get('@submitButton')
            .should('be.disabled');
        cy.get('@errors')
            .should('have.length', --errorCount);

        cy.get('div#data-collection-access-selector')
            .click();
        cy.get('li[data-value="453619"]')
            .click();
        cy.get('@submitButton')
            .should('be.disabled');
        cy.get('@errors')
            .should('have.length', errorCount);

        // Licensing and terms of access
        cy.get('div#data-collection-licence-selector')
            .click();
        cy.get('li[data-value="454104"]')
            .click();
        cy.get('@submitButton')
            .should('be.disabled');
        cy.get('@errors')
            .should('have.length', --errorCount);

        // Copyright notice
        cy.get('input#Copyrightnotice')
            .type('This is a copyright notice');
        cy.get('@submitButton')
            .should('be.disabled');
        cy.get('@errors')
            .should('have.length', errorCount);
    });

    it('validates project information', () => {
        // Project name
        cy.get('#Projectname')
            .type('This is the project name', { force: true });
        cy.get('@submitButton')
            .should('be.disabled');
        cy.get('@errors')
            .should('have.length', --errorCount);

        // Project description
        cy.get('#Projectdescription')
            .type(
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean dictum non purus id aliquet. ',
                {
                    force: true,
                },
            );
        cy.get('@submitButton')
            .should('not.be.disabled');
        cy.get('@errors')
            .should('have.length', --errorCount);

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
        cy.get('@submitButton')
            .should('not.be.disabled');
        cy.get('@errors')
            .should('have.length', errorCount);

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
        cy.get('@submitButton')
            .should('not.be.disabled');
        cy.get('@errors')
            .should('have.length', errorCount);
    });

    it('validates dataset details', () => {
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
        cy.get('@submitButton')
            .should('not.be.disabled');
        cy.get('@errors')
            .should('have.length', errorCount);

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
        cy.get('@submitButton')
            .should('not.be.disabled');
        cy.get('@errors')
            .should('have.length', errorCount);

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
        cy.get('@submitButton')
            .should('not.be.disabled');
        cy.get('@errors')
            .should('have.length', errorCount);

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

        cy.get('@errors')
            .should('have.length', errorCount);

        cy.get('@submitButton')
            .should('not.be.disabled');

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

        cy.get('@errors')
            .should('have.length', errorCount);
        cy.get('@submitButton')
            .should('not.be.disabled');
    });

    it('validates related datasets/work', () => {
        // Related datasets
        cy.get('input#DatasetWorktitle-input')
            .type('a');
        cy.clickAutoSuggestion('DatasetWorktitle', 0);
        // cy.get('@submitButton').should('be.disabled');
        // cy.get('@errors').should('have.length', 1);
        cy.get('input#DatasetWorktitle-input')
            .type('a');
        cy.clickAutoSuggestion('DatasetWorktitle', 1);
        cy.get('div[class*="Relateddatasets/work"]')
            .get('div.ListRow-NoLabel')
            .first()
            .get('p')
            .should('contain', 'Vaccination day');
        cy.get('div[class*="Relateddatasets/work"]')
            .get('div.ListRow-NoLabel')
            .last()
            .get('p')
            .should('contain', 'Early Onset Scoliosis');
        cy.get('div[class*="Relateddatasets/work"]')
            .get('button[title="Move item up the order"]')
            .click();
        cy.get('div[class*="Relateddatasets/work"]')
            .get('div.ListRow-NoLabel')
            .last()
            .get('p')
            .should('contain', 'Vaccination day');
        cy.get('div[class*="Relateddatasets/work"]')
            .get('div.ListRow-NoLabel')
            .first()
            .get('p')
            .should('contain', 'Early Onset Scoliosis');
    });
});
