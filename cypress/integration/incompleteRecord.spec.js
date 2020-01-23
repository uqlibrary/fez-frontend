context('Incomplete record form', () => {
    afterEach(() => {
        cy.window()
            .then(win => {
                win.onbeforeunload = undefined;
            });
    });

    const checkSignificance = significance => {
        cy.get('#significance')
            .click();
        cy.get('#menu-significance')
            .should('exist')
            .find('li')
            .contains(significance)
            .click();
        cy.get('#significance')
            .should('contain', significance);
    };

    const checkResearchStatement = statement => {
        cy.type_ckeditor('editor1', statement);
        cy.read_ckeditor('editor1')
            .then(text => {
                cy.wrap(text)
                    .should('eq', statement);
            });
    };

    const checkAudienceSize = sizeText => {
        cy.get('#rek-audience-size')
            .click();
        cy.get('body > [role=presentation]')
            .find('li')
            .contains(sizeText)
            .click();
        cy.get('#rek-audience-size')
            .should('contain', sizeText);
    };

    const checkQualityIndicators = indicator => {
        cy.get('#quality-indicators')
            .click();
        cy.get('#menu-')
            .find('li')
            .contains(indicator)
            .click();
        cy.get('#menu-')
            .click(10, 10);
        cy.get('#quality-indicators')
            .should('contain', indicator);
    };

    const checkNonDeletableAuthors = authorCount => {
        Array.from({ length: authorCount }, (x, i) => {
            cy.get(`#delete-author-${i}`)
                .should('be.disabled');
        });
    };

    const authorEditInstruction = 'Step 2 of 2 - Update the affiliation information.';
    const grantMessage = 'You must click ADD GRANT to enter the value to the grants list';
    const validationErrorsSelector = 'form > div > div:last-of-type .Alert ul li';

    const editNonUQAuthor = (authorNumber, orgName, orgType) => {
        cy.get(`#edit-author-${authorNumber}`)
            .click()
            .parents('ul')
            .first()
            .siblings('div')
            .contains(authorEditInstruction);
        cy.get('#submit-author')
            .should('have.attr', 'disabled');
        cy.get('#authors-name-as-published-field')
            .should('have.attr', 'disabled');
        cy.get('#org-affiliation-name')
            .type(orgName);

        // Select affiliation type
        cy.get('#org-affiliation-type')
            .click();
        cy.get('#menu-')
            .find('li')
            .contains(orgType)
            .click();

        // Apply changes
        cy.get('#submit-author')
            .should('have.attr', 'tabindex', '0')
            .should('not.have.attr', 'disabled');
        cy.get('#submit-author') // Re-select to get updated element
            .click();
        cy.get(`#contributor-editor-row-${authorNumber}`)
            .should('contain', orgName)
            .should('contain', `Organisation type: ${orgType}`);
        cy.get(`#edit-author-${authorNumber}`)
            .parents('.StandardCard')
            .eq(0)
            .should('not.contain', authorEditInstruction);
    };

    const editUQAuthor = authorNumber => {
        cy.get(`#edit-author-${authorNumber}`)
            .click()
            .parents('ul')
            .first()
            .siblings('div')
            .contains(authorEditInstruction);
        cy.get('#authors-name-as-published-field')
            .should('have.attr', 'disabled');

        // Mark as UQ author
        cy.get('#org-affiliation-selector')
            .click();
        cy.get('#menu-')
            .find('li')
            .eq(1)
            .should('not.contain', 'Not')
            .click();
        cy.get('#authors-name-as-published-field')
            .should('have.attr', 'disabled');

        // Apply changes
        cy.get('#submit-author')
            .should('have.attr', 'tabindex', '0')
            .should('not.have.attr', 'disabled');
        cy.get('#submit-author') // Re-select to get updated element
            .click();
        cy.get(`#contributor-editor-row-${authorNumber}`)
            .should('contain', 'The University of Queensland')
            .should('contain', 'Organisation type: University');
        cy.get(`#edit-author-${authorNumber}`)
            .parents('.StandardCard')
            .eq(0)
            .should('not.contain', authorEditInstruction);
    };

    it('should allow completion of creative work', () => {
        const pid = 'UQ:352045';
        const authorUsername = 'uqrdav10';
        cy.visit(`/records/${pid}/incomplete?user=${authorUsername}`);
        cy.get('#update-my-work')
            .should('exist')
            .should('be.disabled');

        checkSignificance('Major');
        checkResearchStatement('Creator research statement');
        checkAudienceSize('Less than 100');
        checkQualityIndicators('Commissioned by external body');
        checkNonDeletableAuthors(4);
        editNonUQAuthor(0, 'Test org type', 'Government');
        editUQAuthor(1);
        editUQAuthor(3);
    });

    it('should allow completion of work with total pages field, a disabled author', () => {
        const pid = 'UQ:716942';
        const authorUsername = 'uqagrinb';
        cy.visit(`/records/${pid}/incomplete?user=${authorUsername}`);
        cy.get('#update-my-work')
            .should('exist')
            .should('be.disabled');

        checkSignificance('Major');
        checkResearchStatement('Creator research statement');

        cy.get('#rek-total-pages')
            .type('10');

        checkAudienceSize('Less than 100');
        checkQualityIndicators('Commissioned by external body');
        checkNonDeletableAuthors(4);

        cy.get('#edit-author-0')
            .should('be.disabled');

        editUQAuthor(1);
        editNonUQAuthor(2, 'Test org type', 'Government');
        editUQAuthor(3);

        cy.get(validationErrorsSelector)
            .should('have.length', 1)
            .should('contain', 'File submission to be completed');

        cy.get('#update-my-work')
            .should('exist')
            .should('be.disabled');
    });

    it('should have working tests for Grants editor', () => {
        cy.get('#grantAgencyName')
            .type('Grant name');
        cy.get('#grantAddButton')
            .should('be.disabled');
        cy.get(validationErrorsSelector)
            .as('validationMessage')
            .should('have.length', 2)
            .should('contain', grantMessage);
        cy.get('#grantId')
            .type('0001');
        cy.get('#grantType')
            .click();
        cy.get('body > [role=presentation]')
            .find('li')
            .contains('Commercial Gallery')
            .click();
        cy.get('#grantType')
            .should('contain', 'Commercial Gallery');
        cy.get('#grantAddButton')
            .should('be.enabled')
            .click();
        cy.get('@validationMessage')
            .should('have.length', 1)
            .should('not.contain', grantMessage);
    });
});
