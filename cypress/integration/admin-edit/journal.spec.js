import { default as recordList } from '../../../src/mock/data/records/publicationTypeListJournal';

context('Journal admin edit', () => {
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

                    cy.get('[data-testid=rek-place-of-publication-input]').should(
                        'have.value',
                        record.fez_record_search_key_place_of_publication.rek_place_of_publication,
                    );
                    cy.get('[data-testid=rek-publisher-input]').should(
                        'have.value',
                        record.fez_record_search_key_publisher.rek_publisher,
                    );
                    cy.get('[data-testid=rek-volume-number-input]').should(
                        'have.value',
                        record.fez_record_search_key_volume_number.rek_volume_number,
                    );
                    cy.get('[data-testid=rek-issue-number-input]').should(
                        'have.value',
                        record.fez_record_search_key_issue_number.rek_issue_number,
                    );
                });

            cy.get('.AdminCard')
                .contains('h4', 'ISSN')
                .parents('.AdminCard')
                .as('issnBlock');

            const issn = record.fez_record_search_key_issn[0].rek_issn;
            const sherpaLink = `https://www.sherpa.ac.uk/romeo/search.php?issn=${issn}`;

            cy.get('#rek-issn-list-row-0').within(row => {
                cy.wrap(row)
                    .should('contain', issn)
                    .should('contain', 'SHERPA/RoMEO')
                    .get('#sherparomeo-link')
                    .should('have.attr', 'href', sherpaLink);
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
            rowId: 0,
        });
    });
});
