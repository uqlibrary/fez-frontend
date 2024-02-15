context('Controlled vocabularies', () => {
    beforeEach(() => {
        cy.visit('/admin/controlled-vocabularies?user=uqstaff');
    });
    const dismissPopover = () => cy.get('body').click(0, 0);

    it('Renders the top level controlled vocabulary screen', () => {
        cy.get('[data-testid="page-title"]').should('contain', 'Controlled Vocabulary');
        cy.get('[data-testid="total-vocab"]').should('contain', 'Displaying 42 controlled vocabularies');
        cy.get('[data-testid="row-451780"]').should('contain', 'Fields of Research');
        dismissPopover();
    });

    it('Renders the child level controlled vocabulary screen', () => {
        cy.get('[data-testid="expand-row-453669"]').click();
        cy.get('[data-testid="row-453670"]').should('contain', 'Yukulta / Ganggalidda language G34');
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

                cy.get('[data-testid=cvo-order-input]').type('A');
                cy.get('[data-testid=portal-root]').should('contain', 'Must be a number');
                cy.get('[data-testid=update_dialog-action-button]').should('be.disabled');
                cy.get('[data-testid=cvo-order-input]')
                    .clear()
                    .type(1.1);
                cy.get('[data-testid=portal-root]').should('contain', 'Must be a whole number above zero');
                cy.get('[data-testid=portal-root]').should('not.contain', 'Must be a number');
                cy.get('[data-testid=cvo-order-input]')
                    .clear()
                    .type(2);
                cy.get('[data-testid=portal-root]').should('not.contain', 'Must be a whole number above zero');

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

                cy.get('[data-testid=cvo-order-input]').type('A');
                cy.get('[data-testid=portal-add-453669]').should('contain', 'Must be a number');
                cy.get('[data-testid=update_dialog-action-button]').should('be.disabled');
                cy.get('[data-testid=portal-add-453669]').should('not.contain', 'Must be a whole number above zero');
                cy.get('[data-testid=cvo-order-input]')
                    .clear()
                    .type(1.1);
                cy.get('[data-testid=portal-add-453669]').should('contain', 'Must be a whole number above zero');
                cy.get('[data-testid=portal-add-453669]').should('not.contain', 'Must be a number');
                cy.get('[data-testid=cvo-order-input]')
                    .clear()
                    .type(2);
                cy.get('[data-testid=portal-add-453669]').should('not.contain', 'Must be a whole number above zero');

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
                cy.get('[data-testid=cvo-order-input]').should('have.value', '1');
                cy.get('[data-testid=portal-edit-453669]').should('not.contain', 'Required');
                cy.get('[data-testid=cvo-title-input]').clear();
                cy.get('[data-testid=portal-edit-453669]').should('contain', 'Required');
                cy.get('[data-testid=cvo-title-input]').type('New title');

                cy.get('[data-testid=update_dialog-action-button]').should('not.be.disabled');

                cy.get('[data-testid=portal-edit-453669]').should('not.contain', 'Must be a number');
                cy.get('[data-testid=cvo-order-input]').type('A');
                cy.get('[data-testid=portal-edit-453669]').should('contain', 'Must be a number');
                cy.get('[data-testid=update_dialog-action-button]').should('be.disabled');
                cy.get('[data-testid=portal-edit-453669]').should('not.contain', 'Must be a whole number above zero');
                cy.get('[data-testid=cvo-order-input]')
                    .clear()
                    .type(1.1);
                cy.get('[data-testid=portal-edit-453669]').should('contain', 'Must be a whole number above zero');
                cy.get('[data-testid=portal-edit-453669]').should('not.contain', 'Must be a number');
                cy.get('[data-testid=cvo-order-input]')
                    .clear()
                    .type(2);
                cy.get('[data-testid=portal-edit-453669]').should('not.contain', 'Must be a whole number above zero');

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
                cy.get('[data-testid=cvo-order-input]').type('A');
                cy.get('[data-testid=portal-edit-453670]').should('contain', 'Must be a number');
                cy.get('[data-testid=update_dialog-action-button]').should('be.disabled');
                cy.get('[data-testid=portal-edit-453670]').should('not.contain', 'Must be a whole number above zero');
                cy.get('[data-testid=cvo-order-input]')
                    .clear()
                    .type(1.1);
                cy.get('[data-testid=portal-edit-453670]').should('contain', 'Must be a whole number above zero');
                cy.get('[data-testid=portal-edit-453670]').should('not.contain', 'Must be a number');
                cy.get('[data-testid=cvo-order-input]')
                    .clear()
                    .type(2);
                cy.get('[data-testid=portal-edit-453670]').should('not.contain', 'Must be a whole number above zero');

                cy.get('[data-testid=update_dialog-action-button]')
                    .should('not.be.disabled')
                    .click();
                cy.get('[data-testid=portal-root]').should('not.contain', 'Update vocabulary');
                cy.get('[data-testid=admin-edit-button-453670]').should('exist');
            });
        });
    });
});
