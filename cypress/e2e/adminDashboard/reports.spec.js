context('Admin Dashboard - Reports tab', () => {
    const getRow = row => {
        return cy.get('[role=row]').eq(row);
    };
    const getCell = cell => {
        return cy.get('[role=gridcell]').eq(cell);
    };

    const assertDetailDrawer = data => {
        cy.data('system-alert-detail').should('be.visible');
        if (!!data) {
            cy.data('system-alert-detail').within(() => {
                !!data?.title && cy.data('system-alert-detail-title').contains(data.title);
                if (!!data?.link) {
                    cy.data('system-alert-detail-link')
                        .should('have.attr', 'href', data.link)
                        .contains(data.link);
                    cy.data('system-alert-detail-link').within(() => {
                        cy.data('OpenInNewIcon').should('be.visible');
                    });
                }
                !!data?.alertId && cy.data('system-alert-detail-id').contains(data.alertId);
                !!data?.createdDate && cy.data('system-alert-detail-date-created').contains(data.createdDate);
                !!data?.description && cy.data('system-alert-detail-description').contains(data.description);
                !!data?.status && cy.data('system-alert-detail-assignee-input').should('have.value', data.status);
                if (data?.status === 'Unassigned') {
                    cy.data('system-alert-detail-action-button').should('not.exist');
                } else cy.data('system-alert-detail-action-button').should('exist');
            });
        }
    };

    beforeEach(() => {
        cy.loadAdminDashboard();
        cy.get('[role=tab]')
            .contains('REPORTS')
            .click()
            .should('have.attr', 'aria-selected', 'true');

        cy.data('standard-card-content').contains('Export-only reports');
        // cy.injectAxe();
    });

    it('renders page as expected', () => {
        cy.data('report-export-button').should('be.disabled');
        cy.data('report-export-only-input')
            .should('have.value', '')
            .click();
        cy.get('[role=option]').should('have.length', 4);
        cy.get('[role=option]')
            .eq(0)
            .within(() => {
                cy.get('p').should('have.length', 2);
                cy.get('p')
                    .eq(0)
                    .contains('Wok ID dups');
            });
        cy.get('[role=option]')
            .eq(0)
            .click();
        cy.data('report-export-only-input').should('have.value', 'Wok ID dups');

        cy.data('standard-card-content').contains('Display reports');
        cy.data('report-display-button').should('be.disabled');
        cy.data('report-display-export-button').should('be.disabled');
        cy.data('report-display-export-input').should('have.value', '');
        cy.data('report-display-date-from-input')
            .should('have.value', '')
            .should('be.disabled');
        cy.data('report-display-date-to-input')
            .should('have.value', '')
            .should('be.disabled');

        cy.data('report-display-system-alert-id-input').should('not.exist');
        cy.data('report-display-export-input').click();
        cy.get('[role=option]').should('have.length', 2);
        cy.get('[role=option]')
            .contains('Works history')
            .click();
        cy.data('report-display-export-input').should('have.value', 'Works history');
        cy.data('report-display-date-from-input')
            .should('have.value', '')
            .should('not.be.disabled');
        cy.data('report-display-date-to-input')
            .should('have.value', '')
            .should('not.be.disabled');

        cy.data('report-display-button').should('not.be.disabled');

        cy.data('report-display-export-input').click();
        cy.get('[role=option]').should('have.length', 2);
        cy.get('[role=option]')
            .contains('System alert log')
            .click();
        cy.data('report-display-export-input').should('have.value', 'System alert log');

        cy.data('report-display-system-alert-id-input').should('have.value', '');
    });

    it('downloads an export-only report', () => {
        cy.data('report-export-button').should('be.disabled');
        cy.data('report-export-only-input')
            .should('have.value', '')
            .click();
        cy.get('[role=option]')
            .eq(0)
            .click();
        cy.data('report-export-only-input').should('have.value', 'Wok ID dups');

        cy.intercept('GET', '/admin/Exported*').as('exportReport');

        cy.data('report-export-button').click();
        cy.data('report-export-button').should('be.disabled');
        cy.data('export-report-progress').should('exist');
        cy.wait('@exportReport'); // wait for the response to be received
        cy.data('report-export-button').should('not.be.disabled');
        cy.data('export-report-progress').should('not.exist');
    });

    it('downloads a display report', () => {
        cy.data('report-display-export-input').click();
        cy.get('[role=option]').should('have.length', 2);
        cy.get('[role=option]')
            .contains('Works history')
            .click();
        cy.data('report-display-button').click();

        cy.task('downloads', Cypress.config('downloadsFolder')).then(before => {
            cy.data('report-display-export-button')
                .should('not.be.disabled')
                .click();
            cy.task('downloads', Cypress.config('downloadsFolder')).then(after => {
                expect(after.length).to.be.eq(before.length + 1);
            });
        });
    });
});
