context('Incomplete record form', () => {
    afterEach(() => {
        cy.killWindowUnloadHandler();
    });

    const checkSignificance = significance => {
        cy.get('[data-testid=rek-significance-select]').click();
        cy.get('[data-testid=rek-significance-options]')
            .contains(significance)
            .click();
        cy.get('[data-testid=rek-significance-select]').should('contain', significance);
    };

    const checkResearchStatement = statement => {
        cy.typeCKEditor('rek-creator-contribution-statement', statement);
        cy.readCKEditor('rek-creator-contribution-statement').then(text => {
            expect(text).to.contain(statement);
        });
    };

    const checkAudienceSize = sizeText => {
        cy.get('[data-testid=rek-audience-size-select]').click();
        cy.get('[data-testid=rek-audience-size-options]')
            .contains(sizeText)
            .click();
        cy.get('[data-testid=rek-audience-size-select]').should('contain', sizeText);
    };

    const checkQualityIndicators = indicator => {
        cy.get('[data-testid=rek-quality-indicator-select]').click();
        cy.get('[data-testid=rek-quality-indicator-options]')
            .find('li')
            .contains(indicator)
            .click();
        cy.get('[data-testid=rek-quality-indicator-options]').click(10, 10);
        cy.get('[data-testid=rek-quality-indicator-select]').should('contain', indicator);
    };

    const checkNonDeletableAuthors = authorCount => {
        Array.from({ length: authorCount }, (x, i) => {
            cy.get(`#rek-author-list-row-delete-${i}`).should('be.disabled');
        });
    };

    const authorEditInstruction = 'Step 2 of 2 - Update the affiliation information.';
    const grantMessage = 'You must click ADD GRANT to enter the value to the grants list';
    const validationErrorsSelector = '[data-testid=alert] li';

    const editNonUQAuthor = (authorNumber, orgName, orgType) => {
        cy.get(`#rek-author-list-row-edit-${authorNumber}`)
            .click()
            .parents('ul')
            .first()
            .siblings('div')
            .contains(authorEditInstruction);
        cy.get('[data-testid=rek-author-add]').should('have.attr', 'disabled');
        cy.get('[data-testid=rek-author-input]').should('have.attr', 'disabled');
        cy.get('#org-affiliation-name').type(orgName);

        // Select affiliation type
        cy.get('#org-affiliation-type').click();
        cy.get('#menu-org-affiliation-type')
            .find('li')
            .contains(orgType)
            .click();

        // Apply changes
        cy.get('[data-testid=rek-author-add]')
            .should('have.attr', 'tabindex', '0')
            .should('not.have.attr', 'disabled');
        cy.get('[data-testid=rek-author-add]') // Re-select to get updated element
            .click();
        cy.get(`#rek-author-list-row-${authorNumber}`)
            .should('contain', orgName)
            .should('contain', `Organisation type: ${orgType}`);
        cy.get(`#rek-author-list-row-edit-${authorNumber}`)
            .parents('.StandardCard')
            .eq(0)
            .should('not.contain', authorEditInstruction);
    };

    const editUQAuthor = authorNumber => {
        cy.get(`#rek-author-list-row-edit-${authorNumber}`)
            .click()
            .parents('ul')
            .first()
            .siblings('div')
            .contains(authorEditInstruction);
        cy.get('[data-testid=rek-author-input]').should('have.attr', 'disabled');

        // Mark as UQ author
        cy.get('#org-affiliation-select').click();
        cy.get('#org-affiliation-options')
            .find('li')
            .eq(1)
            .should('not.contain', 'Not')
            .click();
        cy.get('[data-testid=rek-author-input]').should('have.attr', 'disabled');

        // Apply changes
        cy.get('[data-testid=rek-author-add]')
            .should('have.attr', 'tabindex', '0')
            .should('not.have.attr', 'disabled');
        cy.get('[data-testid=rek-author-add]') // Re-select to get updated element
            .click();
        cy.get(`#rek-author-list-row-${authorNumber}`)
            .should('contain', 'The University of Queensland')
            .should('contain', 'Organisation type: University');
        cy.get(`#rek-author-list-row-edit-${authorNumber}`)
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

        cy.get('#rek-total-pages-input').type('10');

        checkAudienceSize('Less than 100');
        checkQualityIndicators('Commissioned by external body');
        checkNonDeletableAuthors(4);

        cy.get('#rek-author-list-row-edit-0').should('be.disabled');

        editUQAuthor(1);
        editNonUQAuthor(2, 'Test org type', 'Government');
        editUQAuthor(3);

        cy.get(validationErrorsSelector)
            .should('have.length', 1)
            .should('contain', 'File submission to be completed');

        cy.get('#update-my-work')
            .should('exist')
            .should('be.disabled');

        // 'should have working tests for Grants editor'
        cy.get('[data-testid=rek-grant-agency-input]').type('Grant name');
        cy.get('[data-testid=rek-grant-add]').should('be.disabled');
        cy.get(validationErrorsSelector)
            .as('validationMessage')
            .should('have.length', 2)
            .should('contain', grantMessage);
        cy.get('[data-testid=rek-grant-id-input]').type('0001');
        cy.get('[data-testid=rek-grant-type-select]').click();
        cy.get('body > [role=presentation]')
            .find('li')
            .contains('Commercial Gallery')
            .click();
        cy.get('[data-testid=rek-grant-type-input]').should('have.value', '453984');
        cy.get('[data-testid=rek-grant-add]')
            .should('be.enabled')
            .click();
        cy.get('@validationMessage')
            .should('have.length', 1)
            .should('not.contain', grantMessage);
    });

    it("should allow going back to list using browser's back button", () => {
        cy.visit('/records/incomplete');

        // navigate to the first incomplete work form
        cy.get('button')
            .contains(/complete work/i)
            .should('exist')
            .first()
            .click();

        // verify that the work form is loaded
        cy.get('h2')
            .contains(/complete my work/i)
            .should('exist');

        // navigate back to the list
        cy.go('back');
        cy.get('button')
            .contains(/yes/i)
            // TODO revisit upon deploying refactored MyIncompleteRecord component
            // setting this as conditional, as it works locally but not in CB
            .then($button => {
                if ($button && $button.is(':visible')) {
                    cy.wrap($button).click();
                }
            });

        // ensure the list page is loaded
        cy.url().should('contain', '/records/incomplete');
        cy.get('button')
            .contains(/complete work/i)
            .should('have.length.gt', 0);
    });

    context('author list', () => {
        beforeEach(() => {
            const pid = 'UQ:352045';
            const authorUsername = 'uqrdav10';
            cy.visit(`/records/${pid}/incomplete?user=${authorUsername}`);
        });

        context('big screens', () => {
            beforeEach(() => {
                cy.viewport(900, 800);
            });

            it('should display without overlaying elements', () => {
                // assert author list scrolling
                cy.get('[data-testid=rek-author-list]').should('have.css', 'overflowY', 'scroll');
                // assert action table styling
                cy.get('[data-testid=rek-author-list-row-0-actions]')
                    // .should('have.css', 'marginLeft', '55.5px')
                    .should('not.have.css', 'borderTopColor', 'rgb(221, 221, 221)')
                    .should('not.have.css', 'borderTopWidth', '1px')
                    .should('not.have.css', 'marginTop', '10px')
                    .should('not.have.css', 'marginBottom', '-8px');
            });
        });

        context('small screens', () => {
            beforeEach(() => {
                cy.viewport(899, 600);
            });

            it('should display without overlaying elements', () => {
                // assert author list scrolling
                cy.get('[data-testid=rek-author-list]').should('have.css', 'overflowY', 'scroll');
                // assert action table styling
                cy.get('[data-testid=rek-author-list-row-0-actions]')
                    // .should('not.have.css', 'marginLeft', '65px')
                    .should('have.css', 'borderTopColor', 'rgb(221, 221, 221)')
                    .should('have.css', 'marginTop', '10px')
                    .should('have.css', 'marginBottom', '-8px');
                cy.get('[data-testid=rek-author-list-row-0-actions]')
                    .invoke('css', 'border-top-width')
                    .then(value => {
                        // getting 1.09545px :(
                        const borderTopWidth = parseInt(value, 10);
                        expect(borderTopWidth).to.eq(1);
                    });
            });
        });
    });
});
