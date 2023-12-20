context('Data Collection form', () => {
    let errorCount = 13;

    before(() => {
        cy.visit('/data-collections/add');
    });

    after(() => {
        cy.killWindowUnloadHandler();
    });

    function submitButtonCorrect(incrementErrorCountBy = 0) {
        errorCount = errorCount + incrementErrorCountBy;
        cy.waitUntil(() => cy.get('[data-testid=submit-data-collection]').should('exist'));
        cy.get('[data-testid=submit-data-collection]').should(errorCount === 0 ? 'not.be.disabled' : 'be.disabled');
        if (errorCount > 0) {
            cy.get('[data-testid=alert] li').should('have.length', errorCount);
        }
    }

    it('correctly validates', () => {
        // 'validates deposit agreement'
        submitButtonCorrect();

        // Accept the agreement
        cy.get('[data-testid=rek-copyright-input]').click();
        submitButtonCorrect(-1);

        // 'validates Dataset information'

        // Dataset name
        cy.get('[data-testid=rek-title-input]').type('Name of Dataset');
        submitButtonCorrect(-1);

        // Dataset description
        cy.get('[data-testid=rek-description-input]').type('Description of Dataset');
        submitButtonCorrect(-1);

        // Contact name
        cy.get('[data-testid=rek-contributor-input]').type('Ky Lane');
        submitButtonCorrect(-1);

        // Contact name ID
        cy.get('[data-testid=rek-contributor-id-input]').type('David');
        cy.get('[data-testid=rek-contributor-id-options]')
            .contains('David Stevens')
            .click();

        submitButtonCorrect(-1);

        // Contact email
        cy.get('[data-testid=rek-contact-details-email-input]').type('k.lane@');
        cy.get('#rek-contact-details-email-helper-text')
            .contains('Email address is not valid')
            .should('have.length', 1);
        submitButtonCorrect();

        cy.get('[data-testid=rek-contact-details-email-input]').type('uq.edu.au');
        submitButtonCorrect(-1);

        // DOI
        cy.get('[data-testid=rek-doi-input]').type('test');
        cy.get('#rek-doi-helper-text')
            .contains('DOI is not valid')
            .should('have.length', 1);
        cy.get('[data-testid=rek-doi-input]').type(
            '{backspace}{backspace}{backspace}{backspace}{backspace}10.1037/a0028240',
            {
                delay: 30,
            },
        );
        submitButtonCorrect();

        // Publisher
        cy.get('[data-testid=rek-publisher-input]').type('A publisher');
        submitButtonCorrect();

        // Publication date
        cy.get('[data-testid=rek-date-day-input]').type('16');
        submitButtonCorrect();

        cy.get('[data-testid=rek-date-month-select]').click();
        cy.get('li[data-value="11"]').click();
        submitButtonCorrect();

        cy.get('[data-testid=rek-date-year-input]').type('1976');
        submitButtonCorrect(-1);

        // 'validates FoR codes'
        // Field of research
        cy.get('[data-testid=rek-subject-input]').type('a');
        cy.get('[data-testid=rek-subject-options]')
            .contains('010101')
            .click();
        submitButtonCorrect(-1);

        cy.get('button#field-of-research-list-row-0-delete').click();
        cy.get('[role="dialog"] button')
            .contains('Yes')
            .click();
        submitButtonCorrect(1);

        cy.get('[data-testid=rek-subject-input]').type('b');
        cy.get('[data-testid=rek-subject-options]')
            .contains('010101')
            .click();
        submitButtonCorrect(-1);

        cy.get('[data-testid=rek-subject-input]').type('a');
        cy.get('[data-testid=rek-subject-options]')
            .contains('010102')
            .click();

        cy.get('button#delete-all-field-of-research').click();
        cy.get('[role="dialog"] button')
            .contains('Yes')
            .click();
        submitButtonCorrect(1);

        cy.get('[data-testid=rek-subject-input]').type('b');
        cy.get('[data-testid=rek-subject-options]')
            .contains('010102')
            .click();
        submitButtonCorrect(-1);

        // 'validates creators

        // Creators
        cy.get('[data-testid=rek-author-input]').type('Ky Lane');
        submitButtonCorrect();

        cy.get('div#contributorForm')
            .find('[data-testid=rek-author-role-input]')
            .type('Custom role');
        cy.get('button[data-testid=rek-author-add]').click();
        submitButtonCorrect(-1);

        cy.get('[data-testid=rek-author-input]').type('Vishal Asai');
        cy.get('div#contributorForm')
            .find('[data-testid=rek-author-role-input]')
            .click();
        cy.get('li[role="option"]')
            .contains('Technician')
            .click();
        cy.get('button#rek-author-list-row-delete-1').click();
        cy.get('[role="dialog"] button')
            .contains('Yes')
            .click();
        submitButtonCorrect();

        cy.get('div.Creators')
            .get('button[aria-label="Remove all items"]')
            .click();
        cy.get('[role="dialog"] button')
            .contains('Yes')
            .click();
        submitButtonCorrect(1);

        cy.get('[data-testid=rek-author-input]').type('Ky Lane');
        cy.get('[data-testid=rek-author-role-input]').type('UX Developer');
        cy.get('button[data-testid=rek-author-add]').click();
        submitButtonCorrect(-1);

        // 'validates access and licensing info'

        // Access conditions
        cy.get('[data-testid=rek-access-conditions-select]').click();
        cy.get('li[data-value="453618"]').click();
        submitButtonCorrect(-1);

        cy.get('[data-testid=rek-access-conditions-select]').click();
        cy.get('li[data-value="453619"]').click();
        submitButtonCorrect();

        // Licensing and terms of access
        cy.get('[data-testid=rek-license-select]').click();
        cy.get('li[data-value="454104"]').click();
        submitButtonCorrect(-1);

        // Copyright notice
        cy.get('[data-testid=rek-rights-input]').type('This is a copyright notice');
        submitButtonCorrect();

        // 'validates project information'
        submitButtonCorrect();

        // Project name
        cy.get('[data-testid=rek-project-name-input]').type('This is the project name');
        submitButtonCorrect(-1);

        // Project description
        cy.get('[data-testid=rek-project-description-input]').type(
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean dictum non purus id aliquet. ',
        );
        submitButtonCorrect(-1);

        // Funding body
        cy.get('[data-testid=rek-grant-agency-input]').type('Funding body 1');
        cy.get('[data-testid=rek-grant-agency-add]').click();
        cy.get('[data-testid=rek-grant-agency-input]').type('Funding body 2');
        cy.get('[data-testid=rek-grant-agency-add]').click();
        cy.get('[data-testid=rek-grant-agency-list-row-1-move-up]').click();
        cy.get('[data-testid=rek-grant-agency-list-row-0-delete]').click();
        cy.get('[role="dialog"] button')
            .contains('Yes')
            .click();
        cy.get('[role="dialog"]').should('not.exist');
        cy.get('#delete-all-rek-grant-agency').click();
        cy.get('[role="dialog"] button')
            .contains('Yes')
            .click();
        cy.get('[data-testid=rek-grant-agency-input]').type('Funding body 3');
        cy.get('[data-testid=rek-grant-agency-add]').click();
        submitButtonCorrect();

        // Grant ID
        cy.get('[data-testid=rek-grant-id-input]').type('Grant ID 1');
        cy.get('[data-testid=rek-grant-id-add]').click();
        cy.get('[data-testid=rek-grant-id-input]').type('Grant ID 2');
        cy.get('[data-testid=rek-grant-id-add]').click();
        cy.get('[data-testid=rek-grant-id-list-row-1-move-up]').click();
        cy.get('[data-testid=rek-grant-id-list-row-0-delete]').click();
        cy.get('[role="dialog"] button')
            .contains('Yes')
            .click();
        cy.get('[data-testid=delete-all-rek-grant-id]').click();
        cy.get('[role="dialog"] button')
            .contains('Yes')
            .click();
        cy.get('[data-testid=rek-grant-id-input]').type('Grant ID 3');
        cy.get('[data-testid=rek-grant-id-add]').click();
        submitButtonCorrect();

        // 'validates dataset details'

        // Type of data
        cy.get('[data-testid=rek-type-of-data-input]').type('Type of data 1');
        cy.get('[data-testid=rek-type-of-data-add').click();
        cy.get('[data-testid=rek-type-of-data-input]').type('Type of data 2');
        cy.get('[data-testid=rek-type-of-data-add').click();
        cy.get('[data-testid=rek-type-of-data-list-row-1-move-up]').click();
        cy.get('[data-testid=rek-type-of-data-list-row-0-delete]').click();
        cy.get('[role="dialog"] button')
            .contains('Yes')
            .click();
        cy.get('[data-testid=delete-all-rek-type-of-data]').click();
        cy.get('[role="dialog"] button')
            .contains('Yes')
            .click();
        cy.get('[data-testid=rek-type-of-data-input]').type('Type of data 3');
        cy.get('[data-testid=rek-type-of-data-add').click();
        submitButtonCorrect();

        // Software required
        cy.get('[data-testid=rek-software-required-input]').type('Software required 1');
        cy.get('[data-testid=rek-software-required-add]').click();
        cy.get('[data-testid=rek-software-required-input]').type('Software required 2');
        cy.get('[data-testid=rek-software-required-add]').click();
        cy.get('[data-testid=rek-software-required-list-row-1-move-up]').click();
        cy.get('[data-testid=rek-software-required-list-row-0-delete]').click();
        cy.get('[role="dialog"] button')
            .contains('Yes')
            .click();
        cy.get('[data-testid=delete-all-rek-software-required]').click();
        cy.get('[role="dialog"] button')
            .contains('Yes')
            .click();
        cy.get('[data-testid=rek-software-required-input]').type('Software required 3');
        cy.get('[data-testid=rek-software-required-add]').click();
        submitButtonCorrect();

        // Keywords
        cy.get('[data-testid=rek-keywords-input]').type('Keywords 1');
        cy.get('[data-testid=rek-keywords-add]').click();
        cy.get('[data-testid=rek-keywords-input]').type('Keywords 2');
        cy.get('[data-testid=rek-keywords-add]').click();
        cy.get('[data-testid=rek-keywords-list-row-1-move-up]').click();
        cy.get('[data-testid=rek-keywords-list-row-0-delete]').click();
        cy.get('[role="dialog"] button')
            .contains('Yes')
            .click();
        cy.get('[data-testid=delete-all-rek-keywords]').click();
        cy.get('[role="dialog"] button')
            .contains('Yes')
            .click();
        cy.get('[data-testid=rek-keywords-input]').type('Keywords 3');
        cy.get('[data-testid=rek-keywords-add]').click();
        submitButtonCorrect();

        // Collection Start date
        // the field is not required - if we focus on it, type something in, clear and click on a different field,
        // we do not get an error
        cy.get('[data-testid=rek-start-date-day-input]')
            .type('16')
            .clear();
        cy.get('[data-testid=rek-keywords-input]').type('Keywords 1');
        cy.contains('p', 'Invalid day').should('not.exist');

        // an 31st of april is an invalid date
        cy.get('[data-testid=rek-start-date-day-input]').type('31');

        cy.get('[data-testid=rek-start-date-month-select]').click();
        cy.get('li[data-value="3"]').click();

        cy.get('[data-testid=rek-start-date-year-input]').type('2000');

        cy.contains('p', 'Invalid date').should('be.visible');

        // now check valid dates
        cy.get('[data-testid=rek-start-date-day-input]')
            .clear()
            .type('16');

        // enter future date and see error
        cy.get('[data-testid=rek-start-date-year-input]')
            .clear()
            .type('2100');

        cy.contains('p', 'Date must be before now').should('be.visible');

        // enter valid year
        cy.get('[data-testid=rek-start-date-year-input]')
            .clear()
            .type('1976');

        cy.contains('p', 'Date must be before now').should('not.exist');
        submitButtonCorrect();

        // End Collection date
        cy.get('[data-testid=rek-end-date-day-input]').type('16');

        cy.get('[data-testid=rek-end-date-month-select]')
            .parent()
            .click();
        cy.get('li[data-value="11"]').click();

        // enter future date and see error
        cy.get('[data-testid=rek-end-date-year-input]').type('2100');

        cy.contains('p', 'Date must be before now').should('be.visible');

        // enter end date before start date and see error
        cy.get('[data-testid=rek-end-date-year-input]')
            .clear()
            .type('1974');

        cy.contains('p', 'Date range is not valid').should('be.visible');

        // finally, enter valid date
        cy.get('[data-testid=rek-end-date-year-input]')
            .clear()
            .type('1976');

        cy.contains('p', 'Date range is not valid').should('not.exist');

        submitButtonCorrect();

        // 'validates related datasets/work'
        submitButtonCorrect();

        // Related datasets
        cy.get('[data-testid=rek-isdatasetof-input]').type('a');
        cy.clickAutoSuggestion('rek-isdatasetof', 0);
        submitButtonCorrect();

        cy.get('[data-testid=rek-isdatasetof-input]').type('a');
        cy.clickAutoSuggestion('rek-isdatasetof', 1);
        submitButtonCorrect();

        cy.get('#related-datasets-list-row-0').should('contain', 'A state-based vaccination register');
        cy.get('#related-datasets-list-row-1').should(
            'contain',
            'Bacterial plaques staining composition <sup>for</sup> evaluating dental <sub>caries</sub> activity',
        );
        cy.get('#related-datasets-list-row-1-move-up').click();

        cy.get('#related-datasets-list-row-0').should(
            'contain',
            'Bacterial plaques staining composition <sup>for</sup> evaluating dental <sub>caries</sub> activity',
        );
        cy.get('#related-datasets-list-row-1').should('contain', 'A state-based vaccination register');
        submitButtonCorrect();
    });
});
