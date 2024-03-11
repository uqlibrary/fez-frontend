context('Controlled vocabularies', () => {
    beforeEach(() => {
        cy.visit('/admin/controlled-vocabularies?user=uqstaff');
    });
    const dismissPopover = () => cy.get('body').click(0, 0);

    it('Renders the top level controlled vocabulary screen', () => {
        cy.get('[data-testid="page-title"]').should('contain', 'Controlled Vocabulary');
        cy.get('[data-testid="total-vocab"]').should('contain', 'Displaying 42 total controlled vocabularies');
        cy.get('[data-testid="row-em-451780"]').should('contain', 'Fields of Research');
        // half of all rows should be editable
        cy.get('[data-testid^=admin-edit-button-]').should('have.length', 21);
        // half of all rows should be readonly
        cy.get('[data-testid^=row-locked-icon-]').should('have.length', 21);
        dismissPopover();

        // test tooltips
        cy.get('[data-testid=row-hidden-icon-453226]').trigger('mouseover');
        cy.get('[role=tooltip]').should('contain', 'This vocabulary is hidden');
        cy.get('[data-testid=row-locked-icon-456849]').trigger('mouseover');
        cy.get('[role=tooltip]').should('contain', 'This vocabulary and children are read-only');
    });

    it('Renders the editable child level controlled vocabulary screen', () => {
        cy.get('[data-testid="expand-row-453669"]').click();
        cy.get('[data-testid="child-row-em-453670"]').should('contain', 'Yukulta / Ganggalidda language G34');
        cy.get('[data-testid=admin-add-vocabulary-button-453669]').should('be.visible');
        cy.get('[data-testid=vocab-child-body]').within(() => {
            cy.get('[data-testid^=child-row-em-]').should('have.length', 10);
            cy.get('[data-testid^=admin-edit-button-]').should('have.length', 10);
        });
        dismissPopover();
    });
    it('Renders the readonly child level controlled vocabulary screen', () => {
        cy.get('[data-testid="expand-row-454139"]').click();
        cy.get('[data-testid="child-row-em-454140"]').should('contain', 'Associate Editor');
        cy.get('[data-testid=admin-add-vocabulary-button-454139]').should('not.exist');
        cy.get('[data-testid=vocab-child-body]').within(() => {
            cy.get('[data-testid^=child-row-em-]').should('have.length', 9);
            cy.get('[data-testid^=admin-edit-button-]').should('have.length', 0);
        });
        dismissPopover();
    });

    it('Navigate field of research', () => {
        cy.get('[data-testid="expand-row-451780"]').click();
        cy.get('[data-testid="child-row-em-451799"]').should('contain', '01 Mathematical Sciences');

        cy.get('[data-testid="child-row-title-link-451799"]').click();
        cy.get('[data-testid="child-row-em-451800"]').should('contain', '0101 Pure Mathematics');

        cy.get('[data-testid="child-row-title-link-451800"]').click();
        cy.get('[data-testid="child-row-em-451801"]').should('contain', '010101 Algebra and Number Theory');

        cy.get('[data-testid="child-row-title-link-451801"]').click();
        cy.get('[data-testid="nav-451801"]').should('contain', '010101 Algebra and Number Theory');

        cy.get('[data-testid="nav-451800"]').click();
        cy.get('[data-testid="child-row-title-451801"]').should('contain', '010101 Algebra and Number Theory');

        cy.get('[data-testid="nav-451780"]').click();
        cy.get('[data-testid="child-row-title-451799"]').should('contain', '01 Mathematical Sciences');

        dismissPopover();
    });

    it('Expand two rows', () => {
        cy.get('[data-testid="expand-row-451780"]').click();
        cy.get('[data-testid="child-row-em-451799"]').should('contain', '01 Mathematical Sciences');

        cy.get('[data-testid="expand-row-453669"]').click();
        cy.get('[data-testid="nav-451780"]').should('have.length', 1);

        dismissPopover();
    });

    describe('admin', () => {
        describe('adding vocabs', () => {
            it('should show an Add panel when the top-level Add button is clicked', () => {
                cy.get('[data-testid=admin-add-vocabulary-button]').click();
                cy.get('[data-testid=portal-root]').should('contain', 'Add vocabulary');
                cy.get('[data-testid=admin-add-vocabulary-button]').should('be.disabled');
                cy.get('[data-testid=update_dialog-action-button]').should('be.disabled');

                cy.get('[data-testid=cvo-title-input]').type('Test title');
                cy.get('[data-testid=update_dialog-action-button]').should('not.be.disabled');

                cy.get('[data-testid=update_dialog-action-button]')
                    .should('not.be.disabled')
                    .click();

                cy.get('[data-testid=portal-root]').should('not.contain', 'Add vocabulary');
                cy.get('[data-testid=admin-add-vocabulary-button]').should('not.be.disabled');
            });

            it('should show an Add panel when a child Add button is clicked', () => {
                cy.get('[data-testid=expand-row-453669]').click();
                cy.get('[data-testid=admin-add-vocabulary-button-453669]').click();
                cy.get('[data-testid=portal-add-453669]').should('contain', 'Add vocabulary');
                cy.get('[data-testid=admin-add-vocabulary-button-453669]').should('be.disabled');
                cy.get('[data-testid=update_dialog-action-button]').should('be.disabled');

                cy.get('[data-testid=cvo-title-input]').type('Test title');
                cy.get('[data-testid=update_dialog-action-button]').should('not.be.disabled');

                cy.get('[data-testid=update_dialog-action-button]')
                    .should('not.be.disabled')
                    .click();

                cy.get('[data-testid=portal-add-453669]').should('not.contain', 'Add vocabulary');
                cy.get('[data-testid=admin-add-vocabulary-button-453669]').should('not.be.disabled');
            });
        });
        describe('editing vocabs', () => {
            it('should show a populated Edit panel when a top-level Edit button is clicked', () => {
                cy.get('[data-testid=expand-row-453669]').click();
                cy.get('[data-testid=vocab-table-453669]').should('be.visible');
                cy.get('[data-testid=admin-edit-button-453669]').click();
                cy.get('[data-testid=vocab-table-453669]').should('not.exist');
                cy.get('[data-testid=portal-edit-453669]').should('contain', 'Update vocabulary');
                cy.get('[data-testid=admin-edit-button-453669]').should('not.exist');
                cy.get('[data-testid=update_dialog-action-button]').should('be.disabled');

                cy.get('[data-testid=cvo-title-input]').should('have.value', 'AIATSIS codes');
                cy.get('[data-testid=cvo-desc-input]').should('have.value', 'This is my edited version');
                cy.get('[data-testid=portal-edit-453669]').should('not.contain', 'Required');
                cy.get('[data-testid=cvo-title-input]').clear();
                cy.get('[data-testid=portal-edit-453669]').should('contain', 'Required');
                cy.get('[data-testid=cvo-title-input]').type('New title');

                cy.get('[data-testid=update_dialog-action-button]').should('not.be.disabled');

                cy.get('[data-testid=update_dialog-action-button]')
                    .should('not.be.disabled')
                    .click();
                cy.get('[data-testid=portal-root]').should('not.contain', 'Update vocabulary');
                cy.get('[data-testid=admin-edit-button-453669]').should('exist');
            });

            it('should show a populated Edit panel when a child-level Edit button is clicked', () => {
                cy.get('[data-testid=expand-row-453669]').click();
                cy.get('[data-testid=vocab-table-453669]').should('be.visible');
                cy.get('[data-testid=admin-edit-button-453670]').click();
                cy.get('[data-testid=vocab-table-453669]').should('exist');
                cy.get('[data-testid=portal-edit-453670]').should('contain', 'Update vocabulary');
                cy.get('[data-testid=admin-edit-button-453670]').should('not.exist');
                cy.get('[data-testid=update_dialog-action-button]').should('be.disabled');

                cy.get('[data-testid=cvo-title-input]').should('have.value', 'Yukulta / Ganggalidda language G34');
                cy.get('[data-testid=cvo-external-id-input]').should('have.value', 'G34');
                cy.get('[data-testid=portal-edit-453670]').should('not.contain', 'Required');
                cy.get('[data-testid=cvo-title-input]').clear();
                cy.get('[data-testid=portal-edit-453670]').should('contain', 'Required');
                cy.get('[data-testid=cvo-title-input]').type('New title');

                cy.get('[data-testid=update_dialog-action-button]').should('not.be.disabled');

                cy.get('[data-testid=portal-edit-453670]').should('not.contain', 'Must be a number');

                cy.get('[data-testid=update_dialog-action-button]')
                    .should('not.be.disabled')
                    .click();
                cy.get('[data-testid=portal-root]').should('not.contain', 'Update vocabulary');
                cy.get('[data-testid=admin-edit-button-453670]').should('exist');
            });
        });
    });
});
