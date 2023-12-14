import { sherpaRomeo as sherpaMocks } from '../../../src/mock/data/sherpaRomeo';

context('JournalAdmin', () => {
    const removeJournalLock = () => {
        cy.get('[data-testid=alert-error]').within(() => {
            cy.get('[data-testid=action-button]').click();
        });
    };

    context('with valid jid', () => {
        beforeEach(() => {
            cy.visit('/admin/journal/edit/12?user=uqstaff&navigatedFrom=%2Fjournal%2Fview%2F12');
        });
        it('should show lock screen, and allow it to be removed', () => {
            cy.get('[data-testid=alert-error]').should('contain.text', 'THIS WORK IS LOCKED');
            removeJournalLock();
            cy.get('[data-testid=alert-error]').should('not.exist');
        });

        it('should allow updating of enabled fields', () => {
            removeJournalLock();
            cy.get('[data-testid=jnl_title-input]').type(' UPDATED');
            cy.get('[data-testid=jnl_title-input]').should('have.value', 'Advanced Nonlinear Studies UPDATED');
            cy.get('[data-testid=jnl_publisher-input]').type(' UPDATED');
            cy.get('[data-testid=jnl_publisher-input]').should('have.value', 'Walter de Gruyter GmbH UPDATED');
            cy.typeCKEditor('jnl-advisory-statement', ' UPDATED');
            cy.readCKEditor('jnl-advisory-statement').then(text => {
                expect(text).to.contain('This is an advisory statement UPDATED');
            });
        });
        it('should have a fully functioning ISSN editor', () => {
            removeJournalLock();
            const ulrichsLinkPrefix =
                'https://go.openathens.net/redirector/uq.edu.au?url=' +
                encodeURIComponent('https://ulrichsweb.serialssolutions.com/title/');

            cy.get('[data-testid=bibliographic-section-content]').as('bibliographicTab');

            const checkIssnLinks = (container, issn) => {
                const sherpaLink =
                    (sherpaMocks.find(item => item.srm_issn === issn) || {}).srm_journal_link ||
                    sherpaMocks[0].srm_journal_link;
                cy.wrap(container)
                    .should('contain', issn)
                    // Make sure the data has loaded...
                    .should('contain', 'SHERPA/RoMEO')
                    .should('contain', 'Ulrichs')
                    .get('#sherparomeo-link')
                    .should('have.attr', 'href', sherpaLink);
                let ulrichsID = issn.replace('-', '');
                switch (issn) {
                    case '2169-0375':
                        ulrichsID = '473255';
                        break;
                    case '0388-0001':
                        ulrichsID = '89641';
                        break;
                    default:
                        break;
                }
                cy.get('#ulrichs-link').should('have.attr', 'href', `${ulrichsLinkPrefix}${ulrichsID}`);
            };

            cy.get('@bibliographicTab').within(() => {
                cy.get('.AdminCard')
                    .contains('h4', 'ISSN')
                    .parents('.AdminCard')
                    .as('issnBlock');
                cy.log('Find existing entry');
                cy.get('#jnl_issn_jid-list-row-0').within(row => {
                    checkIssnLinks(row, '0388-0001');
                });

                cy.log('Find existing entry with placeholder data');
                cy.get('#jnl_issn_jid-list-row-1')
                    .should('contain', '2169-0375')
                    .within(() => {
                        cy.get('a#ulrichs-link')
                            .should('have.attr', 'title', 'Advanced Nonlinear Studies (Online)')
                            .should(
                                'have.attr',
                                'aria-label',
                                'Source publisher name/place and alternate ISSNs in a new window',
                            )
                            .should('have.attr', 'href', `${ulrichsLinkPrefix}473255`);
                        cy.get('button[aria-label="Edit this item"]').click();
                    });
                cy.log('Edit issn to a different one with valid data');
                cy.get('@issnBlock')
                    .find('input')
                    .type('{backspace}0{enter}');
                cy.get('#jnl_issn_jid-list-row-1').within(row => {
                    checkIssnLinks(row, '2169-0370');
                });
                cy.log('Add a 3rd entry without match in API');
                cy.get('@issnBlock')
                    .find('input')
                    .type('11111111{enter}');
                cy.get('#jnl_issn_jid-list-row-2')
                    .should('contain', '1111-1111')
                    // Mock returns no sherpa/ulrichs data for issn 1111-1111 or 2222-2222.
                    .should('not.contain', 'SHERPA/RoMEO')
                    .should('not.contain', 'Ulrichs');
                cy.viewport(1000, 1000);
                cy.log('Add 4th entry with match in API');
                cy.get('@issnBlock')
                    .find('input')
                    .type('33333333{enter}');
                cy.get('#jnl_issn_jid-list-row-3').within(row => {
                    checkIssnLinks(row, '3333-3333');
                    cy.get('span > a')
                        .eq(1)
                        .should('have.attr', 'title', 'Lecture Notes in Computer Science')
                        .should(
                            'have.attr',
                            'aria-label',
                            'Source publisher name/place and alternate ISSNs in a new window',
                        );
                });
                cy.get('#jnl_issn_jid-list-row-3')
                    .find('button[aria-label="Edit this item"]')
                    .click();
                cy.log('Edit the 4th entry');
                cy.get('@issnBlock')
                    .find('input')
                    .type('{selectall}{del}44444444{enter}');
                cy.get('#jnl_issn_jid-list-row-3')
                    .should('not.contain', '3333-3333')
                    .within(row => {
                        checkIssnLinks(row, '4444-4444');
                    });
                cy.log('Add a 5th entry');
                cy.get('@issnBlock')
                    .find('input')
                    .type('55555555{enter}');
                cy.log('Verify and move up the 5th entry');
                cy.get('#jnl_issn_jid-list-row-4').within(row => {
                    checkIssnLinks(row, '5555-5555');
                });
                cy.get('#jnl_issn_jid-list-row-4-move-up').click();
                cy.log('Ensure 4th and 5th entries have swapped properly');
                cy.get('#jnl_issn_jid-list-row-3').within(row => {
                    checkIssnLinks(row, '5555-5555');
                });
                cy.get('#jnl_issn_jid-list-row-4').within(row => {
                    checkIssnLinks(row, '4444-4444');
                });
                cy.log('New entry with sherpa placeholder data');
                cy.get('@issnBlock')
                    .find('input')
                    .type('00000000{enter}');

                // / below bit is failing
                cy.get('#jnl_issn_jid-list-row-5')
                    .should('contain', '0000-0000')
                    .find('a')
                    .should('not.contain', 'SHERPA/RoMEO')
                    .should('contain', 'Ulrichs');
                cy.log('New entry with unknown sherpa status');
                cy.get('@issnBlock')
                    .find('input')
                    .type('66666666{enter}');
                cy.get('#jnl_issn_jid-list-row-6').within(row => {
                    checkIssnLinks(row, '6666-6666');
                });
            });

            cy.adminEditCleanup();
        });
        it('should submit changes', () => {
            removeJournalLock();
            cy.get('[data-testid=jnl_title-input]').type(' UPDATED');
            cy.get('[data-testid=jnl_title-input]').should('have.value', 'Advanced Nonlinear Studies UPDATED');
            cy.get('[data-testid=jnl_publisher-input]').type(' UPDATED');
            cy.get('[data-testid=jnl_publisher-input]').should('have.value', 'Walter de Gruyter GmbH UPDATED');
            cy.get('[data-testid=jnl_publisher-input]').type(' UPDATED');
            cy.typeCKEditor('jnl-advisory-statement', ' UPDATED');
            cy.readCKEditor('jnl-advisory-statement').then(text => {
                expect(text).to.contain('This is an advisory statement UPDATED');
            });
            cy.get('button[data-testid=jnl_issn_jid-list-row-1-move-up]').click();
            cy.get('button[data-testid=submit-admin]').click();
            cy.get('[role=presentation').should('contain.text', 'Work has been updated');
            cy.get('[data-testid=alert-done').should('contain.text', 'Success - Work has been saved successfully');
        });
        it('should nav to view page after save', () => {
            const baseUrl = Cypress.config('baseUrl');
            removeJournalLock();
            cy.get('button[data-testid=submit-admin]').click();
            cy.get('[role=presentation').should('contain.text', 'Work has been updated');
            // cancel button used for 'view updated work' button
            cy.get('button[data-testid=cancel-dialog-box]').click();

            cy.url().should('equal', `${baseUrl}/journal/view/12`);
        });
        it('should nav to view page after cancel button is clicked', () => {
            const baseUrl = Cypress.config('baseUrl');
            removeJournalLock();
            cy.get('button[data-testid=admin-work-cancel]').click();
            cy.url().should('equal', `${baseUrl}/journal/view/12`);
        });
        it('should nav to journal search page after save', () => {
            const baseUrl = Cypress.config('baseUrl');
            removeJournalLock();
            cy.get('button[data-testid=submit-admin]').click();
            cy.get('[role=presentation').should('contain.text', 'Work has been updated');
            // cancel button used for 'view updated work' button
            cy.get('button[data-testid=confirm-dialog-box]').click();

            cy.url().should('equal', `${baseUrl}/journals/search/`);
        });
        it('should show error block when required fields are missing values', () => {
            removeJournalLock();
            cy.get('[data-testid=jnl_title-input]').type('{selectall}{del}');
            cy.get('[data-testid=alert-warning]').should('contain.text', 'Journal title is required');

            cy.get('[data-testid=jnl_publisher-input]').type('{selectall}{del}');
            cy.get('[data-testid=alert-warning]').should('contain.text', 'Journal publisher is required');

            cy.get('[data-testid=submit-admin-top').should('have.attr', 'disabled');
            cy.get('[data-testid=submit-admin').should('have.attr', 'disabled');
        });
        it('should support tab mode', () => {
            removeJournalLock();
            cy.get('input[type=checkbox][value=tabbed]')
                .parent()
                .should('have.attr', 'aria-label', 'Switch to tabbed mode');
            cy.get('input[type=checkbox][value=tabbed]').click();
            cy.get('input[type=checkbox][value=tabbed]')
                .parent()
                .should('have.attr', 'aria-label', 'Switch to full form mode');
            cy.get('[role=tab]').should('have.length', 5);
            cy.get('[role=tab]')
                .eq(0)
                .should('have.attr', 'aria-selected', 'true');

            cy.get('[data-testid=jnl_title-input]').type('{selectall}{del}');
            cy.get('[role=tab]')
                .eq(0)
                .within(() => {
                    cy.get('span.MuiBadge-badge.MuiBadge-colorError').should('contain.text', '1');
                });
            cy.get('[id$=-section]').should('have.length', 1);
            cy.get('#admin-section-header').should('contain.text', 'Admin');
        });
    });

    context('with invalid jid', () => {
        it('should show journal not found message', () => {
            cy.visit('/admin/journal/edit/999?user=uqstaff');
            cy.get('[data-testid=page-title]').should('contain.text', 'Work not found');
        });
    });
});
