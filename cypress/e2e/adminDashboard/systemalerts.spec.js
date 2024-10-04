context('Admin Dashboard - System Alerts tab', () => {
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
            .contains('SYSTEM ALERTS')
            .click()
            .should('have.attr', 'aria-selected', 'true');

        cy.data('standard-card-content').contains('8 system alerts');
    });

    it('renders table as expected', () => {
        cy.injectAxe();
        // no need to check every row, just check
        // a couple that have a different status
        cy.get('[role=row]').should('have.length', 9); // +1 for header row
        cy.checkA11y(
            'div.StandardPage',
            {
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                rules: {
                    'aria-required-children': { enabled: false }, // TODO see: https://github.com/dequelabs/axe-core/issues/4419
                },
            },
            violations => console.log(violations),
        );
        getRow(1).within(() => {
            getCell(1).contains('Issues on record - UQ:34555c6');
            getCell(2).within(() => {
                cy.data('alert-status-12').contains('Feeney, Michael');
            });
        });

        getRow(3).within(() => {
            getCell(1).contains('My Works - Claimed Work - UQ:1494946 - uqmdeben');
            getCell(2).within(() => {
                cy.data('alert-status-13').contains('Staff, Another');
            });
        });

        cy.get('.MuiTablePagination-displayedRows').should('have.text', '1–8 of 8');
        cy.get('.MuiTablePagination-input > input').should('have.value', 10);
    });

    it('shows detail drawer when row is clicked', () => {
        const data = {
            title: 'Issues on record - UQ:34555c6',
            link: 'https://espace.library.uq.edu.au/view/UQ:34555c6',
            alertId: '12',
            createdDate: '4th March 2023 02:45',
            description:
                'User “Tomaszewski, Wojciech (Wojtek) (uqwtomas)” has indicated that there are issues on record - UQ:34555c6.',
            status: 'Feeney, Michael',
        };

        getRow(1).click(); // click first row of results
        cy.injectAxe();
        assertDetailDrawer(data);
        cy.checkA11y(
            'div.StandardPage',
            {
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            },
            violations => console.log(violations),
        );

        cy.get('.MuiBackdrop-root').click(); // test drawer can be closed
        cy.get('.MuiBackdrop-root').should('not.exist');
    });

    it('prevents detail drawer from closing when busy', () => {
        const data = {
            title: 'Issues on record - UQ:34555c6',
            link: 'https://espace.library.uq.edu.au/view/UQ:34555c6',
            alertId: '12',
            createdDate: '4th March 2023 02:45',
            description:
                'User “Tomaszewski, Wojciech (Wojtek) (uqwtomas)” has indicated that there are issues on record - UQ:34555c6.',
            status: 'Feeney, Michael',
        };
        getRow(1).click(); // click first row of results

        assertDetailDrawer(data);

        cy.data('system-alert-detail-assignee').click();
        cy.data('system-alert-detail-options').within(() => {
            cy.get('[role=option]').should('have.length', 5);
            cy.get('[role=option]')
                .eq(2)
                .should('have.attr', 'aria-selected', 'true');
        });

        cy.data('system-alert-detail-action-button')
            .contains('Mark as resolved')
            .click();
        cy.data('system-alert-detail-action-button').should('be.disabled');
        cy.data('system-alert-detail-action-button').contains('Updating...');

        cy.data('system-alert-detail-assignee').within(() => {
            cy.data('system-alert-detail-assignee-input').should('be.disabled');
            cy.get('[role=progressbar]').should('be.visible');
        });
    });
});
