import { default as recordList } from '../../../src/mock/data/records/publicationTypeListVideo';

context('Video admin edit', () => {
    const record = recordList.data[0];

    beforeEach(() => {
        cy.loadRecordForAdminEdit(record.rek_pid);
    });

    afterEach(() => {
        cy.adminEditCleanup();
    });

    it('should load with specified elements', () => {
        cy.adminEditCountCards(8);
        cy.adminEditNoAlerts();

        cy.adminEditTabbedView();
        cy.adminEditCheckDefaultTab('Bibliographic');
    });

    it('should render the different sections as expected', () => {
        // ------------------------------------------ BIBLIOGRAPHIC TAB ----------------------------------------------
        cy.log('Bibliographic tab');
        cy.get('[data-testid=bibliographic-section-header]').should('have.text', 'Bibliographic');
        cy.get('[data-testid=bibliographic-section-content]').within(() => {
            cy.get('.AdminCard')
                .eq(4)
                .within(() => {
                    cy.get('h4').should('contain', 'Bibliographic');

                    // Video record includes the owner's Rights
                    cy.get('[data-testid=rek-rights-input]').should(
                        'have.value',
                        record.fez_record_search_key_rights.rek_rights,
                    );
                });
        });
    });

    it('should submit successfully', () => {
        const baseUrl = Cypress.config('baseUrl');
        cy.typeCKEditor('rek-description', 'some description'); // description
        cy.get('#admin-work-submit').click({ scrollBehavior: 'center' });

        // Confirmation message
        cy.get('[role=dialog]')
            .should('exist')
            .find('h2')
            .should('contain', 'Work has been updated')
            .parent()
            .contains('button', 'View updated work')
            .click();
        cy.url().should('equal', `${baseUrl}/view/${record.rek_pid}`);
    });
});

context('Author affiliations', () => {
    const record = recordList.data[0];

    beforeEach(() => {
        cy.loadRecordForAdminEdit(record.rek_pid);
    });

    afterEach(() => {
        cy.adminEditCleanup();
    });
    it('should not be available for this work type', () => {
        cy.assertAffiliationsAllowed({
            authorName: 'Steve Su (uqysu4)',
            orgName: 'The University of Queensland',
            rowId: 4,
        });
    });
});
