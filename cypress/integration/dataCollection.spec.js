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
        cy.get('input#contact-name-id-auto-complete')
            .type('David');
        cy.get('#contact-name-id-auto-complete-popup')
            .contains('David Stevens')
            .click();

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
        cy.get('#publication-year-day')
            .type('16');
        cy.get('@errors')
            .should('have.length', errorCount);

        cy.get('#publication-year-month')
            .click();
        cy.get('li[data-value="11"]')
            .click();
        cy.get('@errors')
            .should('have.length', errorCount);

        cy.get('#publication-year-year')
            .type('1976');
        cy.get('@submitButton')
            .should('be.disabled');
        cy.get('@errors')
            .should('have.length', --errorCount);
    });

    it('validates FoR codes', () => {
        // Field of research
        cy.get('#field-of-research-field-input')
            .type('a');
        cy.get('li[role="option"]')
            .contains('010101')
            .click();
        cy.get('@submitButton')
            .should('be.disabled');
        cy.get('@errors')
            .should('have.length', --errorCount);
        cy.get('button#field-of-research-list-row-0-delete')
            .click();
        cy.get('[role="dialog"] button')
            .contains('Yes')
            .click();
        cy.get('@submitButton')
            .should('be.disabled');
        cy.get('@errors')
            .should('have.length', ++errorCount);

        cy.get('#field-of-research-field-input')
            .type('a');
        cy.get('li[role="option"]')
            .contains('010101')
            .click();
        cy.get('@submitButton')
            .should('be.disabled');
        cy.get('@errors')
            .should('have.length', --errorCount);

        cy.get('#field-of-research-field-input')
            .type('a');
        cy.get('li[role="option"]')
            .contains('010102')
            .click();

        cy.get('button#delete-all-field-of-research')
            .click();
        cy.get('[role="dialog"] button')
            .contains('Yes')
            .click();
        cy.get('@submitButton')
            .should('be.disabled');
        cy.get('@errors')
            .should('have.length', ++errorCount);

        cy.get('#field-of-research-field-input')
            .type('a');
        cy.get('li[role="option"]')
            .contains('010102')
            .click();
        cy.get('@submitButton')
            .should('be.disabled');
        cy.get('@errors')
            .should('have.length', --errorCount);
    });

    it('validates creators', () => {
        // Creators
        cy.get('#creators-name-as-published-field')
            .type('Ky Lane');
        cy.get('@submitButton')
            .should('be.disabled');
        cy.get('@errors')
            .should('have.length', errorCount);
        cy.get('div#contributorForm')
            .find('input#creator-role-field')
            .type('Custom role');
        cy.get('button#submit-author')
            .click();
        cy.get('@submitButton')
            .should('be.disabled');
        cy.get('@errors')
            .should('have.length', --errorCount);
        cy.get('#creators-name-as-published-field')
            .type('Vishal Asai');
        cy.get('div#contributorForm')
            .find('input#creator-role-field')
            .click();
        cy.get('li[role="option"]')
            .contains('Technician')
            .click();

        cy.get('button#creators-list-row-delete-1')
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
        cy.get('input#creator-role-field')
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
        cy.get('button#add-grant-agency')
            .click();
        cy.get('input#funding-body-input')
            .type('Funding body 2');
        cy.get('button#add-grant-agency')
            .click();
        cy.get('#grant-agency-list-row-1-move-up')
            .click();
        cy.get('#grant-agency-list-row-0-delete')
            .click();
        cy.get('[role="dialog"] button')
            .contains('Yes')
            .click();
        cy.get('[role="dialog"]')
            .should('not.exist');
        cy.get('#delete-all-grant-agency')
            .click();
        cy.get('[role="dialog"] button')
            .contains('Yes')
            .click();
        cy.get('input#funding-body-input')
            .type('Funding body 3');
        cy.get('button#add-grant-agency')
            .click();
        cy.get('@submitButton')
            .should('not.be.disabled');
        cy.get('@errors')
            .should('have.length', errorCount);

        // Grant ID
        cy.get('input#grant-id-input')
            .type('Grant ID 1');
        cy.get('button#add-grant-id')
            .click();
        cy.get('input#grant-id-input')
            .type('Grant ID 2');
        cy.get('button#add-grant-id')
            .click();
        cy.get('#grant-id-list-row-move-up-1')
            .click();
        cy.get('#grant-id-list-row-delete-0')
            .click();
        cy.get('[role="dialog"] button')
            .contains('Yes')
            .click();
        cy.get('#delete-all-grant-id')
            .click();
        cy.get('[role="dialog"] button')
            .contains('Yes')
            .click();
        cy.get('input#grant-id-input')
            .type('Grant ID 3');
        cy.get('button#add-grant-id')
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
        cy.get('button#add-type-of-data')
            .click();
        cy.get('input#type-of-data-input')
            .type('Type of data 2');
        cy.get('button#add-type-of-data')
            .click();
        cy.get('#type-of-data-list-row-1-move-up')
            .click();
        cy.get('#type-of-data-list-row-0-delete')
            .click();
        cy.get('[role="dialog"] button')
            .contains('Yes')
            .click();
        cy.get('#delete-all-type-of-data')
            .click();
        cy.get('[role="dialog"] button')
            .contains('Yes')
            .click();
        cy.get('input#type-of-data-input')
            .type('Type of data 3');
        cy.get('button#add-type-of-data')
            .click();
        cy.get('@submitButton')
            .should('not.be.disabled');
        cy.get('@errors')
            .should('have.length', errorCount);

        // Software required
        cy.get('input#software-required-input')
            .type('Software required 1');
        cy.get('button#add-software-required')
            .click();
        cy.get('input#software-required-input')
            .type('Software required 2');
        cy.get('button#add-software-required')
            .click();
        cy.get('#software-required-list-row-1-move-up')
            .click();
        cy.get('#software-required-list-row-0-delete')
            .click();
        cy.get('[role="dialog"] button')
            .contains('Yes')
            .click();
        cy.get('#delete-all-software-required')
            .click();
        cy.get('[role="dialog"] button')
            .contains('Yes')
            .click();
        cy.get('input#software-required-input')
            .type('Software required 3');
        cy.get('button#add-software-required')
            .click();
        cy.get('@submitButton')
            .should('not.be.disabled');
        cy.get('@errors')
            .should('have.length', errorCount);

        // Keywords
        cy.get('input#keywords-input')
            .type('Keywords 1');
        cy.get('button#add-keywords')
            .click();
        cy.get('input#keywords-input')
            .type('Keywords 2');
        cy.get('button#add-keywords')
            .click();
        cy.get('#keywords-list-row-1-move-up')
            .click();
        cy.get('#keywords-list-row-0-delete')
            .click();
        cy.get('[role="dialog"] button')
            .contains('Yes')
            .click();
        cy.get('#delete-all-keywords')
            .click();
        cy.get('[role="dialog"] button')
            .contains('Yes')
            .click();
        cy.get('input#keywords-input')
            .type('Keywords 3');
        cy.get('button#add-keywords')
            .click();
        cy.get('@submitButton')
            .should('not.be.disabled');
        cy.get('@errors')
            .should('have.length', errorCount);

        // Collection Start date
        // the field is not required - if we focus on it, type something in, clear and click on a different field,
        // we do not get an error
        cy.get('#collection-start-date-day')
            .type('16')
            .clear();
        cy.get('input#keywords-input')
            .type('Keywords 1');
        cy.contains('p', 'Invalid day')
            .should('not.be.visible');

        // an 31st of april is an invalid date
        cy.get('#collection-start-date-day')
            .type('31');

        cy.get('#collection-start-date-month')
            .parent()
            .click();
        cy.get('li[data-value="3"]')
            .click();

        cy.get('#collection-start-date-year')
            .type('2000');

        cy.contains('p', 'Invalid date')
            .should('be.visible');

        // now check valid dates
        cy.get('#collection-start-date-day')
            .clear()
            .type('16');

        // enter future date and see error
        cy.get('#collection-start-date-year')
            .clear()
            .type('2100');

        cy.contains('p', 'Date must be before now')
            .should('be.visible');

        // enter valid year
        cy.get('#collection-start-date-year')
            .clear()
            .type('1976');

        cy.contains('p', 'Date must be before now')
            .should('not.be.visible');

        cy.get('@errors')
            .should('have.length', errorCount);

        cy.get('@submitButton')
            .should('not.be.disabled');

        // End Collection date
        cy.get('#collection-end-date-day')
            .type('16');

        cy.get('#collection-end-date-month')
            .parent()
            .click();
        cy.get('li[data-value="11"]')
            .click();

        // enter future date and see error
        cy.get('#collection-end-date-year')
            .type('2100');

        cy.contains('p', 'Date must be before now')
            .should('be.visible');

        // enter end date before start date and see error
        cy.get('#collection-end-date-year')
            .clear()
            .type('1974');

        cy.contains('p', 'Date range is not valid')
            .should('be.visible');

        // finally, enter valid date
        cy.get('#collection-end-date-year')
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
        cy.get('#title-or-pid-field')
            .type('a');
        cy.clickAutoSuggestion('title-or-pid-field', 0);
        // cy.get('@submitButton').should('be.disabled');
        // cy.get('@errors').should('have.length', 1);
        cy.get('input#title-or-pid-field')
            .type('a');
        cy.clickAutoSuggestion('title-or-pid-field', 1);

        cy.get('#related-datasets-list-row-0')
            .should('contain', 'A state-based vaccination register');
        cy.get('#related-datasets-list-row-1')
            .should(
                'contain',
                'Bacterial plaques staining composition <sup>for</sup> evaluating dental <sub>caries</sub> activity',
            );
        cy.get('#related-datasets-list-row-1-move-up')
            .click();

        cy.get('#related-datasets-list-row-0')
            .should(
                'contain',
                'Bacterial plaques staining composition <sup>for</sup> evaluating dental <sub>caries</sub> activity',
            );
        cy.get('#related-datasets-list-row-1')
            .should('contain', 'A state-based vaccination register');
    });
});
