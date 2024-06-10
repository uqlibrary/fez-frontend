context('Admin Dashboard - Today tab', () => {
    beforeEach(() => {
        cy.loadAdminDashboard();
        // cy.injectAxe();
    });

    it('renders tabs as expected', () => {
        cy.get('[role=tab]').should('have.length', 3);
        cy.get('[role=tab]')
            .first()
            .contains('TODAY')
            .should('have.attr', 'aria-selected', 'true');
        cy.get('[role=tab]')
            .eq(1)
            .contains('SYSTEM ALERTS')
            .should('have.attr', 'aria-selected', 'false');
        cy.get('[role=tab]')
            .eq(1)
            .within(() => {
                cy.get('[data-testid^=tab-counter]').contains('8');
            });
        cy.get('[role=tab]')
            .last()
            .contains('REPORTS')
            .should('have.attr', 'aria-selected', 'false');

        cy.get('[role=tab]')
            .eq(1)
            .click();
        cy.data('standard-card-content').contains('system alerts');
        cy.get('[role=tab]')
            .last()
            .click();
        cy.data('standard-card-content').contains('Export-only reports');
    });

    it('renders charts and quick links as expected', () => {
        // a more verbose test than usual, due to being
        // unable to test charts in jest unit tests

        cy.data('system-alerts-title').contains('System Alerts');

        // Charts
        cy.data('chart-container-system-alerts').within(() => {
            cy.get('svg').should('exist');
            cy.get('svg > rect').should('have.length', 2);
        });
        cy.data('system-alerts-table').within(() => {
            cy.get('td').contains('150');
            cy.get('td').contains('25');
            cy.get('td').contains('15 (10%)');
            cy.get('td').contains('135 (90%)');
        });
        cy.data('unprocessed-works-title').contains('Unprocessed Works');
        cy.data('unprocessed-works-subtitle').within(() => {
            cy.data('unprocessed-link').should('exist');
        });
        cy.data('chart-container-unprocessed-works').within(() => {
            cy.get('svg > text').contains('15');
            cy.get('svg path').should('have.length', 1);
        });
        cy.data('processed-works-title').contains('Processed Works');
        cy.data('processed-works-subtitle').contains('this iteration');
        cy.data('chart-container-processed-works').within(() => {
            cy.get('svg > text').contains('82');
            cy.get('svg path').should('have.length', 1);
        });
        cy.data('chart-container-open-access').within(() => {
            cy.get('svg text').contains('256 (20%)');
            cy.get('svg text').contains('of 1256 records');
            cy.get('svg path').should('have.length', 3);
            cy.get('svg circle').should('have.length', 1);
        });

        // Quicklinks
        cy.get('[role=list]').within(() => {
            cy.get('[role=listitem]').should('have.length', 7);
        });
    });

    it('follows unprocessed works link', () => {
        cy.data('system-alerts-title').contains('System Alerts');
        cy.data('unprocessed-link')
            .invoke('removeAttr', 'target')
            .click();
        cy.url().should('include', 'https://espace.library.uq.edu.au/records/search');
    });

    describe('Quick links', () => {
        it('follows internal links when clicked', () => {
            cy.data('standard-card').contains('Quick Links');
            cy.get('[role=listitem]')
                .first()
                .within(() => {
                    cy.get('a')
                        .invoke('removeAttr', 'target')
                        .click();
                    cy.url().should('include', 'https://espace.library.uq.edu.au/records/search');
                });
        });

        it('follows external links when clicked', () => {
            cy.data('standard-card').contains('Quick Links');
            cy.get('[role=listitem]')
                .contains('UQ Library')
                .invoke('removeAttr', 'target')
                .click();
            cy.url().should('include', 'https://www.library.uq.edu.au');
        });

        it('handles reordering correctly', () => {
            cy.data('standard-card').contains('Quick Links');
            cy.get('[role=listitem]')
                .eq(0)
                .contains('2021+ Imported Records with an Author ID and Research Subtypes Only');
            cy.data('admin-actions-button-1').click();
            cy.get('[data-testid^=admin-actions-menu-option-]')
                .contains('Move up')
                .click();
            cy.get('[role=listitem]')
                .eq(1)
                .contains('2021+ Imported Records with an Author ID and Research Subtypes Only');
            cy.get('[role=listitem]')
                .eq(0)
                .contains('UQ Library');
            cy.data('admin-actions-button-0').click();
            cy.get('[data-testid^=admin-actions-menu-option-]')
                .contains('Move down')
                .click();
            cy.get('[role=listitem]')
                .eq(1)
                .contains('UQ Library');
            cy.data('admin-actions-button-1').click();
            cy.get('[data-testid^=admin-actions-menu-option-]')
                .contains('Move to bottom')
                .click();
            cy.get('[role=listitem]')
                .last()
                .contains('UQ Library');
            cy.data('admin-actions-button-6').click();
            cy.get('[data-testid^=admin-actions-menu-option-]')
                .contains('Move to top')
                .click();
            cy.get('[role=listitem]')
                .eq(0)
                .contains('UQ Library');
        });

        it('handles deletion', () => {
            cy.data('standard-card').contains('Quick Links');
            cy.get('[role=listitem]')
                .eq(1)
                .contains('UQ Library');
            cy.data('admin-actions-button-1').click();
            cy.get('[data-testid^=admin-actions-menu-option-]')
                .contains('Delete')
                .click();
            cy.data('standard-card-content').contains('DELETE UQ Library');
            cy.data('qlk_title-input')
                .should('have.value', 'UQ Library')
                .should('have.attr', 'disabled');
            cy.data('qlk_link-input')
                .should('have.value', 'https://www.library.uq.edu.au')
                .should('have.attr', 'disabled');
            cy.get('button')
                .contains('Delete')
                .click();
            cy.data('standard-card-content')
                .contains('DELETE UQ Library')
                .should('not.exist');
        });

        it('handles editing', () => {
            cy.data('standard-card').contains('Quick Links');
            cy.get('[role=listitem]')
                .eq(1)
                .contains('UQ Library');
            cy.data('admin-actions-button-1').click();
            cy.get('[data-testid^=admin-actions-menu-option-]')
                .contains('Edit')
                .click();
            cy.data('standard-card-content').contains('Edit UQ Library');
            cy.data('qlk_title-input')
                .should('have.value', 'UQ Library')
                .should('not.have.attr', 'disabled');
            cy.data('qlk_title-input').type(' updated');
            cy.data('qlk_title-input').should('have.value', 'UQ Library updated');

            cy.data('qlk_link-input')
                .should('have.value', 'https://www.library.uq.edu.au')
                .should('not.have.attr', 'disabled');
            cy.data('qlk_link-input').type(' updated');
            cy.data('qlk_link-input').should('have.value', 'https://www.library.uq.edu.au updated');

            cy.data('qlk_title-input').clear();
            cy.data('qlk_title-input')
                .parent()
                .should('have.class', 'Mui-error');

            cy.get('button')
                .contains('Save')
                .click();

            cy.data('qlk_link-input').clear();
            cy.data('qlk_link-input')
                .parent()
                .should('have.class', 'Mui-error');
            cy.data('qlk_title').contains('Required');
            cy.data('qlk_link').contains('Required');

            cy.data('qlk_title-input').type('Test title');
            cy.data('qlk_link-input').type('Test link');
            cy.data('qlk_title-input')
                .parent()
                .should('not.have.class', 'Mui-error');
            cy.data('qlk_link-input')
                .parent()
                .should('not.have.class', 'Mui-error');

            cy.get('button')
                .contains('Save')
                .click();
            cy.data('standard-card-content')
                .contains('Edit UQ Library')
                .should('not.exist');
        });

        it('handles adding', () => {
            cy.data('standard-card').contains('Quick Links');

            cy.data('add-quick-link').click();

            cy.data('standard-card-content').contains('Add new quick link');

            cy.data('qlk_title-input')
                .parent()
                .should('have.class', 'Mui-error');
            cy.data('qlk_link-input')
                .parent()
                .should('have.class', 'Mui-error');

            cy.get('button')
                .contains('Save')
                .click();

            cy.data('qlk_title').contains('Required');
            cy.data('qlk_link').contains('Required');

            cy.data('qlk_title-input')
                .should('have.value', '')
                .should('not.have.attr', 'disabled');

            cy.data('qlk_title-input').type('New title');
            cy.data('qlk_title-input').should('have.value', 'New title');

            cy.data('qlk_link-input')
                .should('have.value', '')
                .should('not.have.attr', 'disabled');
            cy.data('qlk_link-input').type('New link');
            cy.data('qlk_link-input').should('have.value', 'New link');

            cy.data('qlk_title-input')
                .parent()
                .should('not.have.class', 'Mui-error');
            cy.data('qlk_link-input')
                .parent()
                .should('not.have.class', 'Mui-error');
            cy.data('qlk_title')
                .contains('Required')
                .should('not.exist');
            cy.data('qlk_link')
                .contains('Required')
                .should('not.exist');

            cy.get('button')
                .contains('Save')
                .click();

            cy.data('standard-card-content')
                .contains('Edit UQ Library')
                .should('not.exist');
        });
    });
});
