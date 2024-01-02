import { default as recordList } from '../../../src/mock/data/records/publicationTypeListNewspaperArticle';

context('Newspaper Article admin edit', () => {
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
                .eq(3)
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
                    cy.get('[data-testid=rek-edition-input]').should(
                        'have.value',
                        record.fez_record_search_key_edition.rek_edition,
                    );
                    cy.get('[data-testid=rek-newspaper-input]').should(
                        'have.value',
                        record.fez_record_search_key_newspaper.rek_newspaper,
                    );
                    cy.get('[data-testid=rek-section-input]').should(
                        'have.value',
                        record.fez_record_search_key_section.rek_section,
                    );
                    cy.get('[data-testid=rek-translated-newspaper-input]').should(
                        'have.value',
                        record.fez_record_search_key_translated_newspaper.rek_translated_newspaper,
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
