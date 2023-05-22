import { default as recordList } from '../../../src/mock/data/records/publicationTypeListImage';

context('Image admin edit', () => {
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
        cy.get('[data-testid=bibliographic-section-content]')
            .as('bibliographicTab')
            .within(() => {
                cy.get('.AdminCard')
                    .eq(2)
                    .within(() => {
                        cy.get('h4').should('contain', 'Bibliographic');

                        cy.get('[data-testid=rek-original-format-input]').should(
                            'have.value',
                            record.fez_record_search_key_original_format.rek_original_format,
                        );
                        cy.get('[data-testid=rek-source-input]').should(
                            'have.value',
                            record.fez_record_search_key_source.rek_source,
                        );
                        cy.get('[data-testid=rek-rights-input]').should(
                            'have.value',
                            record.fez_record_search_key_rights.rek_rights,
                        );
                    });
            });

        // ---------------------------------------------- ADMIN TAB --------------------------------------------------
        cy.log('Admin tab');
        cy.get('[data-testid=admin-section-header]').should('have.text', 'Admin');
        cy.get('[data-testid=admin-section-content]')
            .as('adminTab')
            .within(() => {
                cy.get('[data-testid=rek-oa-status-input]')
                    .should('have.value', record.fez_record_search_key_oa_status.rek_oa_status.toString())
                    .get('[data-testid=rek-oa-status-select]')
                    .should('have.text', record.fez_record_search_key_oa_status.rek_oa_status_lookup);
            });
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
            rowId: 0,
        });
    });
});
