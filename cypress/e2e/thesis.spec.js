context('Thesis', () => {
    const baseUrl = Cypress.config('baseUrl');

    afterEach(() => {
        cy.killWindowUnloadHandler();
    });

    it('shows rdm redirect message to non-whitelisted users', () => {
        cy.visit(`${baseUrl}/rhdsubmission?user=s3333333`);
        cy.get('[data-testid="alert-info-rdm-redirect"]')
            .should('exist')
            .should('be.visible');
    });

    it('is denied access if they have logged in with a non-student account', () => {
        cy.visit(`${baseUrl}/rhdsubmission?user=uqstaff`);
        cy.contains('Thesis deposit access denied');
    });

    it('Submitting a thesis successfully', () => {
        cy.visit(`${baseUrl}/rhdsubmission?user=s2222222`);
        cy.get('button#submit-thesis').should('to.have.attr', 'disabled');
        cy.get('[data-testid="thesis-submission-validation"] li').as('validationAlerts');

        const ensureErrorCount = count => {
            cy.get('@validationAlerts').should('have.length', count);
        };
        ensureErrorCount(8);

        // Title
        cy.typeCKEditor('rek-title', '<p>This is a thesis title</p>');
        ensureErrorCount(7);
        // Abstract
        cy.typeCKEditor('rek-description', '<p>This is the thesis abstract</p>');
        ensureErrorCount(6);

        // Thesis subtype
        cy.get('[data-testid=rek-genre-type-select]').click();
        cy.get('li[data-value="MPhil Thesis"]').click();
        ensureErrorCount(5);
        cy.get('button#submit-thesis').should('to.have.attr', 'disabled');

        // Enrolling unit
        cy.get('[data-testid=rek-org-unit-name-input]').type('a');
        cy.clickAutoSuggestion('rek-org-unit-name', 0);
        ensureErrorCount(4);
        cy.get('button#submit-thesis').should('to.have.attr', 'disabled');

        // Supervisors
        cy.get('[data-testid=rek-supervisor-input]').type('Ky Lane', { delay: 30 });
        ensureErrorCount(4);
        cy.get('button#submit-thesis').should('to.have.attr', 'disabled');
        cy.get('[data-testid=rek-supervisor-input]').type('{enter}', { delay: 30 });
        ensureErrorCount(3);
        cy.get('button#submit-thesis').should('to.have.attr', 'disabled');
        cy.get('button[aria-label="Remove this item"]').click();
        cy.get('button')
            .contains('Yes')
            .click();
        ensureErrorCount(4);
        cy.get('button#submit-thesis').should('to.have.attr', 'disabled');
        cy.get('[data-testid=rek-supervisor-input]').type('Vishal Asai{enter}', { delay: 30 });
        ensureErrorCount(3);
        cy.get('button#submit-thesis').should('to.have.attr', 'disabled');
        cy.get('[data-testid=rek-supervisor-input]').type('Ky Lane{enter}', { delay: 30 });
        cy.get('ul.ContributorList')
            .children()
            .should('have.length', 2);
        cy.get('ul.ContributorList')
            .children()
            .first()
            .should('contain', 'Vishal Asai');
        cy.get('ul.ContributorList')
            .children()
            .last()
            .should('contain', 'Ky Lane');
        cy.get('button[aria-label="Move item up the order"]').click();
        cy.get('ul.ContributorList')
            .children()
            .last()
            .should('contain', 'Vishal Asai');
        cy.get('ul.ContributorList')
            .children()
            .first()
            .should('contain', 'Ky Lane');
        cy.get('button[aria-label="Remove all items').click();
        cy.get('button')
            .contains('Yes')
            .click();
        ensureErrorCount(4);
        cy.get('[data-testid=rek-supervisor-input]').type('Ky Lane{enter}', { delay: 30 });
        ensureErrorCount(3);

        // Field of Research
        cy.get('[data-testid=rek-subject-input]').type('a');
        cy.clickAutoSuggestion('rek-subject', 0);
        ensureErrorCount(2);
        cy.get('button#submit-thesis').should('to.have.attr', 'disabled');
        cy.get('#rek-subject-list-row-0')
            .should('contain.text', '0101 Pure Mathematics')
            .get('#rek-subject-list-row-0-delete')
            .click();
        cy.get('button')
            .contains('Yes')
            .click();
        ensureErrorCount(3);
        cy.get('[data-testid=rek-subject-input]').type('b');
        cy.clickAutoSuggestion('rek-subject', 0);
        ensureErrorCount(2);
        cy.get('#delete-all-rek-subject').click();
        cy.get('button')
            .contains('Yes')
            .click();
        ensureErrorCount(3);
        cy.get('button#submit-thesis').should('to.have.attr', 'disabled');
        cy.get('[data-testid=rek-subject-input]').type('a');
        cy.clickAutoSuggestion('rek-subject', 0);
        ensureErrorCount(2);
        cy.get('button#submit-thesis').should('to.have.attr', 'disabled');

        // Keywords
        cy.get('[data-testid=rek-keywords-input]').type('First Keyword{enter}', {
            delay: 30,
        });
        ensureErrorCount(1);
        cy.get('button#submit-thesis').should('to.have.attr', 'disabled');
        cy.get('#rek-keywords-list-row-0-delete').click();
        cy.get('button')
            .contains('Yes')
            .click();
        ensureErrorCount(2);
        cy.get('[data-testid=rek-keywords-input]').type('Second Keyword{enter}', {
            delay: 30,
        });
        ensureErrorCount(1);
        cy.get('#delete-all-rek-keywords').click();
        cy.get('button')
            .contains('Yes')
            .click();
        ensureErrorCount(2);
        cy.get('[data-testid=rek-keywords-input]').type('Third Keyword{enter}', {
            delay: 30,
        });
        cy.get('#rek-keywords-list').should('have.length', 1);
        ensureErrorCount(1);
        cy.get('[data-testid=rek-keywords-input]').type('Fourth Keyword|Fifth Keyword|Sixth Keyword{enter}', {
            delay: 30,
        });
        cy.get('#rek-keywords-list')
            .children()
            .should('have.length', 4);

        // Files?
        const uploadFile = fileName => {
            cy.get('[data-testid="fez-datastream-info-input"]').attachFile(fileName, { subjectType: 'drag-n-drop' });
        };

        uploadFile('test.jpg');

        cy.get('[data-testid="dsi-dsid-0-delete"]').click();
        cy.get('button')
            .contains('Yes')
            .click();
        ensureErrorCount(1);

        uploadFile('test_two.jpg');
        cy.get('[id="delete-all-files"]').click();
        cy.get('button')
            .contains('Yes')
            .click();
        ensureErrorCount(1);

        uploadFile('test three.jpg');

        cy.get('[data-testid=alert]').should('have.length', 2);

        uploadFile('test.jpg');
        uploadFile('test_two.jpg');

        // Ready to submit
        cy.get('button#submit-thesis').should('not.have.attr', 'disabled');
    });
});
