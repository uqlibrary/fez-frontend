import { default as recordList } from '../../../src/mock/data/records/publicationTypeListDataCollection';

context('Data Collection admin edit', () => {
    const record = recordList.data[0];

    beforeEach(() => {
        cy.loadRecordForAdminEdit(record.rek_pid);
    });

    afterEach(() => {
        cy.adminEditCleanup();
    });

    it('should load expected tabs', () => {
        cy.adminEditCountCards(8);
        cy.adminEditVerifyAlerts(1, ['Publication date is required']);

        cy.adminEditTabbedView();
        cy.adminEditCheckDefaultTab('Bibliographic');
        cy.adminEditCheckTabErrorBadge('bibliographic');

        cy.log('Finished testing tabs'); // This makes the test suite a bit more stable. It's magic :p
    });

    it('should render the different sections as expected', () => {
        // ------------------------------------------ BIBLIOGRAPHIC TAB ----------------------------------------------
        cy.log('Bibliographic tab');
        cy.get('[data-testid=bibliographic-section-content]')
            .as('bibliographicTab')
            .within(() => {
                cy.get('h4').should('contain', 'Dataset name');
            });

        // -------------------------------------- ADMIN TAB -----------------------------------------
        cy.log('Admin tab');
        cy.get('[data-testid=admin-section-content]')
            .as('additionalInformationTab')
            .within(() => {
                cy.get('h4').should('contain', 'Additional information');
                cy.get('[data-testid=rek-license-input]')
                    .should('have.value', record.fez_record_search_key_license.rek_license.toString())
                    .get('[data-testid=rek-license-select]')
                    .invoke('text')
                    .should('equal', record.fez_record_search_key_license.rek_license_lookup);
                cy.checkPartialDateFromRecordValue('rek-end-date', record.fez_record_search_key_end_date.rek_end_date);
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
