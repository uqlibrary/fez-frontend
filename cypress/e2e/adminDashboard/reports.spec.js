context('Admin Dashboard - Reports tab', () => {
    beforeEach(() => {
        cy.loadAdminDashboard();
        cy.get('[role=tab]')
            .contains('REPORTS')
            .click()
            .should('have.attr', 'aria-selected', 'true');

        cy.data('standard-card-content').contains('Export-only reports');
        cy.injectAxe();
    });

    it('renders page as expected', () => {
        cy.data('report-export-button').should('be.disabled');
        cy.checkA11y(
            'div.StandardPage',
            {
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                rules: {
                    'color-contrast': { enabled: false },
                },
            },
            violations => console.log(violations),
        );
        cy.data('report-export-only-input')
            .should('have.value', '')
            .click();
        cy.get('[role=option]').should('have.length', 6);
        cy.get('[role=option]')
            .contains('Wok ID dups')
            .click();
        cy.data('report-export-only-input').should('have.value', 'Wok ID dups');

        cy.data('standard-card-content').contains('Display reports');
        cy.data('report-display-export-button').should('be.disabled');
        cy.data('report-display-export-export-button').should('be.disabled');
        cy.data('report-display-export-input').should('have.value', '');
        cy.data('report-display-export-date-from-input')
            .should('have.value', '')
            .should('be.disabled');
        cy.data('report-display-export-date-to-input')
            .should('have.value', '')
            .should('be.disabled');

        cy.data('report-display-export-system-alert-id-input').should('not.exist');
        cy.data('report-display-export-input').click();
        cy.get('[role=option]').should('have.length', 2);
        cy.get('[role=option]')
            .contains('Works history')
            .click();
        cy.data('report-display-export-input').should('have.value', 'Works history');
        cy.data('report-display-export-date-from-input')
            .should('have.value', '')
            .should('not.be.disabled');
        cy.data('report-display-export-date-to-input')
            .should('have.value', '')
            .should('not.be.disabled');

        cy.data('report-display-export-button').should('be.disabled'); // dates are required

        cy.data('report-display-export-input').click();
        cy.get('[role=option]').should('have.length', 2);
        cy.get('[role=option]')
            .contains('System alert log')
            .click();
        cy.data('report-display-export-input').should('have.value', 'System alert log');

        cy.data('report-display-export-system-alert-id-input').should('have.value', '');
        cy.data('report-display-export-button').should('not.be.disabled');
    });

    it('downloads a legacy report', () => {
        cy.data('report-export-button').should('be.disabled');
        cy.data('report-export-only-input')
            .should('have.value', '')
            .click();
        cy.checkA11y(
            'div.StandardPage',
            {
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                rules: {
                    'color-contrast': { enabled: false },
                },
            },
            violations => console.log(violations),
        );

        cy.get('[role=option]')
            .contains('Wok ID dups')
            .click();
        cy.data('report-export-only-input').should('have.value', 'Wok ID dups');

        cy.task('downloads', Cypress.config('downloadsFolder')).then(before => {
            cy.data('report-export-button')
                .should('not.be.disabled')
                .click();

            cy.data('export-report-progress').should('exist');
            cy.wait(2000);
            cy.task('downloads', Cypress.config('downloadsFolder')).then(after => {
                expect(after.length).to.be.eq(before.length + 1);
            });
        });

        cy.data('report-export-button').should('not.be.disabled');
        cy.data('export-report-progress').should('not.exist');
    });

    it('legacy report with no results shows alert', () => {
        cy.data('report-export-button').should('be.disabled');
        cy.data('report-export-only-input')
            .should('have.value', '')
            .click();
        cy.checkA11y(
            'div.StandardPage',
            {
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                rules: {
                    'color-contrast': { enabled: false },
                },
            },
            violations => console.log(violations),
        );

        cy.get('[role=option]')
            .contains('DOI Dups')
            .click();
        cy.data('report-export-only-input').should('have.value', 'DOI Dups');

        cy.data('report-export-button')
            .should('not.be.disabled')
            .click();

        cy.data('export-report-progress').should('exist');

        cy.data('report-export-button').should('not.be.disabled');
        cy.data('export-report-progress').should('not.exist');

        cy.data('alert')
            .should('be.visible')
            .contains('Nothing to export');

        // dismiss for coverage
        cy.data('alert').within(() => {
            cy.data('dismiss').click();
        });
        cy.data('alert').should('not.exist');
    });
    describe('queued legacy reports', () => {
        it('should enable binding fields', () => {
            cy.data('report-export-button').should('be.disabled');
            cy.data('report-export-only-input')
                .should('have.value', '')
                .click();
            cy.checkA11y(
                'div.StandardPage',
                {
                    includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                    rules: {
                        'color-contrast': { enabled: false },
                    },
                },
                violations => console.log(violations),
            );

            cy.get('[role=option]')
                .contains('Queued report one binding')
                .click();
            cy.data('report-export-only-input').should('have.value', 'Queued report one binding');

            cy.data('report-export-button').should('be.disabled');

            cy.data('report-export-only-date-from-input').should('not.be.disabled');
            cy.data('report-export-only-date-to-input').should('be.disabled');

            cy.data('report-export-only-input').click();
            cy.get('[role=option]')
                .contains('Queued report two bindings')
                .click();
            cy.data('report-export-only-input').should('have.value', 'Queued report two bindings');

            cy.data('report-export-only-date-from-input')
                .should('not.be.disabled')
                .type('01012024');
            cy.data('report-export-only-date-to-input')
                .should('not.be.disabled')
                .type('02012024');
            cy.data('report-export-button')
                .should('not.be.disabled')
                .click();
            cy.data('alert')
                .should('be.visible')
                .contains('Report queued');
        });

        it('validates the filters', () => {
            cy.data('report-export-button').should('be.disabled');
            cy.data('report-export-only-input')
                .should('have.value', '')
                .click();
            cy.checkA11y(
                'div.StandardPage',
                {
                    includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                    rules: {
                        'color-contrast': { enabled: false },
                    },
                },
                violations => console.log(violations),
            );

            cy.get('[role=option]')
                .contains('Queued report two bindings')
                .click();
            cy.data('report-export-only-input').should('have.value', 'Queued report two bindings');

            // check the mui calendar appears if button clicked.
            cy.data('report-export-only-date-from').within(() => {
                cy.get('button').click();
            });
            cy.get('.MuiPickersPopper-root').should('exist');
            cy.data('report-export-only-date-to').within(() => {
                cy.get('button').click();
            });
            cy.get('.MuiPickersPopper-root').should('exist');
            cy.data('report-export-only-date-to').within(() => {
                cy.get('button').click();
            });
            cy.get('.MuiPickersPopper-root').should('not.exist');
            cy.data('report-export-only-date-to-input').type('01/01/2020');
            // date from should be in error state
            cy.data('report-export-only-date-from-input').should('have.attr', 'required');
            cy.data('report-export-only-date-from').contains('Required');
            cy.data('report-export-only-date-from-input')
                .parent()
                .should('have.class', 'Mui-error');
            cy.data('report-export-button').should('be.disabled');

            cy.data('report-export-only-date-to-input').clear();

            cy.data('report-export-only-date-from-input').type('01/01/2020');
            // to date should be in error state
            cy.data('report-export-only-date-to-input').should('have.attr', 'required');
            cy.data('report-export-only-date-to').contains('Required');
            cy.data('report-export-only-date-to-input')
                .parent()
                .should('have.class', 'Mui-error');

            cy.data('report-export-button').should('be.disabled');

            cy.data('report-export-only-date-from-input').clear();

            // to before from
            cy.data('report-export-only-date-to-input').type('01/01/2025');
            cy.data('report-export-only-date-from-input').type('01/01/2026');
            cy.data('report-export-only-date-from').contains('Must not be after "to" date');
            cy.data('report-export-only-date-to').contains('Must not be before "from" date');

            cy.data('report-export-only-date-from-input')
                .parent()
                .should('have.class', 'Mui-error');

            cy.checkA11y(
                'div.StandardPage',
                {
                    includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                    rules: {
                        'color-contrast': { enabled: false },
                    },
                },
                violations => console.log(violations),
            );

            cy.data('report-export-button').should('be.disabled');
            cy.data('report-export-only-date-from-input')
                .clear()
                .type('01/01/2024');
        });
    });

    it('displays and downloads a display report', () => {
        // works history
        cy.data('report-display-export-input').click();
        cy.get('[role=option]').should('have.length', 2);
        cy.checkA11y(
            'div.StandardPage',
            {
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                rules: {
                    'color-contrast': { enabled: false },
                },
            },
            violations => console.log(violations),
        );
        cy.get('[role=option]')
            .contains('Works history')
            .click();
        cy.data('report-display-export-date-from-input').type('01/01/2020');
        cy.data('report-display-export-date-to-input').type('02/01/2020');
        cy.data('report-display-export-button').click();
        cy.data('report-display-data-grid').should('exist');
        cy.data('report-display-data-grid').within(() => {
            cy.get('[role=columnheader]').should('have.length', 6);
            cy.get('[role=row]').should('have.length', 7); // +1 for header
        });
        cy.checkA11y(
            'div.StandardPage',
            {
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                rules: {
                    'color-contrast': { enabled: false },
                    'aria-required-children': { enabled: false }, // TODO see: https://github.com/dequelabs/axe-core/issues/4419
                },
            },
            violations => console.log(violations),
        );

        cy.task('downloads', Cypress.config('downloadsFolder')).then(before => {
            cy.data('report-display-export-export-button')
                .should('not.be.disabled')
                .click();
            cy.task('downloads', Cypress.config('downloadsFolder')).then(after => {
                expect(after.length).to.be.eq(before.length + 1);
            });
        });

        // system alerts
        cy.data('report-display-export-input').click();
        cy.get('[role=option]').should('have.length', 2);
        cy.get('[role=option]')
            .contains('System alert log')
            .click();
        cy.data('report-display-export-button').click();
        cy.data('report-display-data-grid').should('exist');
        cy.data('report-display-data-grid').within(() => {
            cy.get('[role=columnheader]').should('have.length', 8);
            cy.get('[role=row]').should('have.length', 8); // +1 for header
        });
        cy.checkA11y(
            'div.StandardPage',
            {
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                rules: {
                    'color-contrast': { enabled: false },
                    'aria-required-children': { enabled: false }, // TODO see: https://github.com/dequelabs/axe-core/issues/4419
                },
            },
            violations => console.log(violations),
        );

        // check searching on system id only returns specific results
        cy.data('report-display-export-date-from-input').clear();
        cy.data('report-display-export-date-to-input').clear();
        cy.data('report-display-export-system-alert-id-input').type('1');
        cy.data('report-display-export-button').click();
        cy.data('report-display-data-grid').should('exist');
        cy.data('report-display-data-grid').within(() => {
            cy.get('[role=columnheader]').should('have.length', 9); // extra column for content field
            cy.get('[role=row]').should('have.length', 2); // +1 for header
        });

        cy.task('downloads', Cypress.config('downloadsFolder')).then(before => {
            cy.data('report-display-export-export-button')
                .should('not.be.disabled')
                .click();
            cy.task('downloads', Cypress.config('downloadsFolder')).then(after => {
                expect(after.length).to.be.eq(before.length + 1);
            });
        });
    });

    it('displays a report even if user navs away and back', () => {
        // works history
        cy.data('report-display-export-input').click();
        cy.get('[role=option]').should('have.length', 2);

        cy.get('[role=option]')
            .contains('Works history')
            .click();
        cy.data('report-display-export-date-from-input').type('01/01/2020');
        cy.data('report-display-export-date-to-input').type('02/01/2020');
        cy.data('report-display-export-button').click();
        cy.data('report-display-data-grid').should('exist');
        cy.data('report-display-data-grid').within(() => {
            cy.get('[role=columnheader]').should('have.length', 6);
            cy.get('[role=row]').should('have.length', 7); // +1 for header
        });

        // nav away
        cy.get('[role=tab]')
            .contains('TODAY')
            .click()
            .should('have.attr', 'aria-selected', 'true');

        cy.data('standard-card-content').contains('System Alerts');

        // nav back
        cy.get('[role=tab]')
            .contains('REPORTS')
            .click()
            .should('have.attr', 'aria-selected', 'true');

        cy.data('standard-card-content').contains('Export-only reports');

        // results should still be visible
        cy.data('report-display-data-grid').should('exist');
        cy.data('report-display-data-grid').within(() => {
            cy.get('[role=columnheader]').should('have.length', 6);
            cy.get('[role=row]').should('have.length', 7); // +1 for header
        });
    });

    it('validates the filters', () => {
        // use system alerts report as it includes
        // an additional field, but otherwise the
        // validation is the same
        cy.data('report-display-export-input').click();
        cy.get('[role=option]').should('have.length', 2);
        cy.get('[role=option]')
            .contains('System alert log')
            .click();

        cy.data('report-display-export-button').should('not.be.disabled');
        cy.data('report-display-export-date-from-input').should('not.be.disabled');
        cy.data('report-display-export-date-to-input').should('not.be.disabled');
        cy.data('report-display-export-system-alert-id-input').should('exist');

        // check the mui calendar appears if button clicked.
        cy.data('report-display-export-date-from').within(() => {
            cy.get('button').click();
        });
        cy.get('.MuiPickersPopper-root').should('exist');
        cy.data('report-display-export-date-to').within(() => {
            cy.get('button').click();
        });
        cy.get('.MuiPickersPopper-root').should('exist');
        cy.data('report-display-export-date-to').within(() => {
            cy.get('button').click();
        });
        cy.get('.MuiPickersPopper-root').should('not.exist');
        cy.data('report-display-export-date-to-input').type('01/01/2020');
        // date from should be in error state
        cy.data('report-display-export-date-from-input').should('have.attr', 'required');
        cy.data('report-display-export-date-from').contains('Required');
        cy.data('report-display-export-date-from-input')
            .parent()
            .should('have.class', 'Mui-error');
        cy.data('report-display-export-button').should('be.disabled');
        cy.data('report-display-export-date-to-input').clear();
        cy.data('report-display-export-button').should('not.be.disabled');

        cy.data('report-display-export-date-from-input').type('01/01/2020');
        // to date should be in error state
        cy.data('report-display-export-date-to-input').should('have.attr', 'required');
        cy.data('report-display-export-date-to').contains('Required');
        cy.data('report-display-export-date-to-input')
            .parent()
            .should('have.class', 'Mui-error');

        cy.data('report-display-export-button').should('be.disabled');
        cy.data('report-display-export-date-from-input').clear();
        cy.data('report-display-export-button').should('not.be.disabled');

        // to before from
        cy.data('report-display-export-date-to-input').type('01/01/2025');
        cy.data('report-display-export-date-from-input').type('01/01/2026');
        cy.data('report-display-export-date-from').contains('Must not be after "to" date');
        cy.data('report-display-export-date-from-input')
            .parent()
            .should('have.class', 'Mui-error');

        cy.checkA11y(
            'div.StandardPage',
            {
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                rules: {
                    'color-contrast': { enabled: false },
                },
            },
            violations => console.log(violations),
        );

        cy.data('report-display-export-button').should('be.disabled');
        cy.data('report-display-export-date-from-input')
            .clear()
            .type('01/01/2024');

        // system alert id field
        cy.data('report-display-export-system-alert-id-input').type('abc');
        cy.data('report-display-export-system-alert-id-input')
            .parent()
            .should('have.class', 'Mui-error');
        cy.data('report-display-export-system-alert-id').contains('Must be a positive whole number');
        cy.data('report-display-export-button').should('be.disabled');

        cy.checkA11y(
            'div.StandardPage',
            {
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                rules: {
                    'color-contrast': { enabled: false },
                },
            },
            violations => console.log(violations),
        );

        cy.data('report-display-export-system-alert-id-input').clear();

        cy.data('report-display-export-system-alert-id-input').type('-1');
        cy.data('report-display-export-system-alert-id').contains('Must be a positive whole number');
        cy.data('report-display-export-system-alert-id-input').clear();

        cy.data('report-display-export-system-alert-id-input').type('1.0');
        cy.data('report-display-export-system-alert-id').contains('Must be a positive whole number');
        cy.data('report-display-export-system-alert-id-input').clear();

        cy.data('report-display-export-button').should('not.be.disabled');

        cy.data('report-display-export-date-to-input').type('01/01/2025');
        cy.data('report-display-export-date-from-input').type('01/01/2024');
        cy.data('report-display-export-system-alert-id-input').type('10');
    });
});
