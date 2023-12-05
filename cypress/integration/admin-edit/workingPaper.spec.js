import { default as recordList } from '../../../src/mock/data/records/publicationTypeListWorkingPaper';

context('Working paper admin edit', () => {
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
                .as('cards')
                .eq(0)
                .within(() => {
                    cy.get('h4').should('contain', 'Title');
                    cy.get('span span')
                        .eq(0)
                        .should('contain.text', 'Formatted title');
                    cy.readCKEditor('rek-title').should(text => {
                        expect(text).to.contain(record.rek_title);
                    });
                });

            cy.get('@cards')
                .eq(4)
                .within(() => {
                    cy.get('h4').should('contain', 'Bibliographic');
                    cy.get('[data-testid=rek-report-number-input]').should(
                        'have.value',
                        record.fez_record_search_key_report_number.rek_report_number,
                    );
                    cy.get('[data-testid=rek-org-name-input]').should(
                        'have.value',
                        record.fez_record_search_key_org_name.rek_org_name,
                    );
                    cy.get('[data-testid=rek-org-unit-name-input]').should(
                        'have.value',
                        record.fez_record_search_key_org_unit_name.rek_org_unit_name,
                    );
                });
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
            rowId: 1,
        });
    });
});
