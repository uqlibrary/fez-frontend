context('Thesis', () => {
    const baseUrl = Cypress.config('baseUrl');

    const ensureErrorCount = count => {
        cy.get('@validationAlerts').should('have.length', count);
    };

    const uploadFile = fileName => {
        cy.get('[data-testid="fez-datastream-info-input"]').attachFile(fileName, { subjectType: 'drag-n-drop' });
    };

    afterEach(() => {
        cy.killWindowUnloadHandler();
    });

    context('HDR submission', () => {
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

        it('should allow form to be completed', () => {
            cy.visit(`${baseUrl}/rhdsubmission?user=s2222222`);
            cy.get('button#submit-thesis').should('to.have.attr', 'disabled');
            cy.get('[data-testid="thesis-submission-validation"] li').as('validationAlerts');
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

        // this can't be simply tested via a jest test, as the session expired dialog is
        // controlled up higher in the component tree
        it('should display session expired dialog', () => {
            cy.visit(`${baseUrl}/rhdsubmission?user=s5555555`);

            // Title
            cy.typeCKEditor('rek-title', 'a');
            // subtype
            cy.get('[data-testid=rek-genre-type-select]').click();
            cy.get('li[data-value="MPhil Thesis"]').click();
            // Abstract
            cy.typeCKEditor('rek-description', 'a');
            // unit
            cy.get('[data-testid=rek-org-unit-name-input]').type('a');
            cy.clickAutoSuggestion('rek-org-unit-name', 0);
            // filling this field once doesn't aways clear validation errors in this context
            cy.typeCKEditor('rek-title', 'ab');
            // supervisors
            cy.get('[data-testid=rek-supervisor-input]').type('a{enter}', { delay: 30 });
            // FoR
            cy.get('[data-testid=rek-subject-input]').type('a');
            cy.clickAutoSuggestion('rek-subject', 0);
            // keywords
            cy.get('[data-testid=rek-keywords-input]').type('a{enter}', {
                delay: 30,
            });
            cy.typeCKEditor('rek-description', 'ab');
            // files
            uploadFile('test.jpg');
            uploadFile('test_two.jpg');

            cy.get('[data-testid="thesis-submission-validation"]', { timeout: 5000 }).should('not.exist');
            cy.get('[data-testid="deposit-thesis"]').click();
            cy.get('H2', { timeout: 5000 }).contains('Session Expired');
        });
    });

    context('SBS submission', () => {
        it('should allow form to be completed', () => {
            cy.visit(`${baseUrl}/habslodge?user=s2222222`);
            cy.get('button#submit-thesis').should('to.have.attr', 'disabled');
            cy.get('[data-testid="thesis-submission-validation"] li').as('validationAlerts');
            ensureErrorCount(6);

            // Title
            cy.typeCKEditor('rek-title', '<p>This is a thesis title</p>');
            ensureErrorCount(5);
            // Abstract
            cy.typeCKEditor('rek-description', '<p>This is the thesis abstract</p>');
            ensureErrorCount(4);
            // Enrolling unit
            cy.get('[data-testid=rek-org-unit-name-input]').type('a');
            cy.clickAutoSuggestion('rek-org-unit-name', 0);
            ensureErrorCount(3);
            // Supervisors
            cy.get('[data-testid=rek-supervisor-input]').type('Ky Lane{enter}', { delay: 30 });
            ensureErrorCount(2);
            // Field of Research
            cy.get('[data-testid=rek-subject-input]').type('a');
            cy.clickAutoSuggestion('rek-subject', 0);
            ensureErrorCount(1);
            // Keywords
            cy.get('[data-testid=rek-keywords-input]').type('First Keyword{enter}', {
                delay: 30,
            });
            // Keywords
            cy.get('[data-testid=comments-input]').type('comments', {
                delay: 30,
            });
            // Files
            uploadFile('test.jpg');
            ensureErrorCount(0);
            // Ready to submit
            cy.get('button#submit-thesis').should('not.have.attr', 'disabled');
        });

        it('should display session expired dialog', () => {
            cy.visit(`${baseUrl}/habslodge?user=s5555555`);

            // Title
            cy.typeCKEditor('rek-title', 'a');
            // Abstract
            cy.typeCKEditor('rek-description', 'a');
            // Enrolling unit
            cy.get('[data-testid=rek-org-unit-name-input]').type('a');
            cy.clickAutoSuggestion('rek-org-unit-name', 0);
            // filling this field once doesn't aways clear validation errors in this context
            cy.typeCKEditor('rek-title', 'ab');
            // Supervisors
            cy.get('[data-testid=rek-supervisor-input]').type('Ky Lane{enter}', { delay: 30 });
            // Field of Research
            cy.get('[data-testid=rek-subject-input]').type('a');
            cy.clickAutoSuggestion('rek-subject', 0);
            cy.typeCKEditor('rek-description', 'ab');
            // Files
            uploadFile('test.jpg');
            uploadFile('test_two.jpg');

            cy.get('[data-testid="thesis-submission-validation"]', { timeout: 5000 }).should('not.exist');
            cy.get('[data-testid="deposit-thesis"]').click();
            cy.get('H2', { timeout: 5000 }).contains('Session Expired');
        });
    });
});
