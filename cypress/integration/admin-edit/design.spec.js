import { default as recordList } from '../../../src/mock/data/records/publicationTypeListDesign';

context('Design admin edit', () => {
    const record = recordList.data[0];

    beforeEach(() => {
        cy.loadRecordForAdminEdit(record.rek_pid);
    });

    afterEach(() => {
        cy.adminEditCleanup();
    });

    it('should load expected tabs', () => {
        cy.adminEditCountCards(7);

        cy.adminEditTabbedView();
        cy.adminEditCheckDefaultTab('Bibliographic');
        cy.adminEditCheckTabErrorBadge(5, '1');
    });

    it('should render the different sections as expected', () => {
        // ------------------------------------------ BIBLIOGRAPHIC TAB ----------------------------------------------
        cy.log('Bibliographic tab');
        cy.get('[data-testid=bibliographic-section-header]').should('contain', 'Bibliographic');
        cy.get('[data-testid=rek-job-number-input]').should(
            'have.value',
            record.fez_record_search_key_job_number.rek_job_number,
        );

        // ------------------------------------------ AUTHOR DETAILS TAB ---------------------------------------------
        cy.log('Author Details tab');
        cy.get('[data-testid=author-details-section-header]').contains('Author details');
        cy.get('[data-testid=author-details-section-content]').within(() => {
            cy.get('h4')
                .eq(0)
                .should('contain', 'Designers');
            const designers = record.fez_record_search_key_author.map(item => item.rek_author);
            designers.forEach((designer, index) => {
                cy.get(`[id=rek-author-list-row-${index}-name-as-published]`).should('contain', designer);
            });
        });

        cy.get('[data-testid=author-details-section-content]').within(() => {
            cy.get('h4')
                .eq(1)
                .should('contain', 'Contributors');
            const consultants = record.fez_record_search_key_contributor.map(item => item.rek_contributor);
            consultants.forEach((consultant, index) => {
                cy.get(`[id=rek-contributor-list-row-${index}-name-as-published]`).should('contain', consultant);
            });
        });

        cy.get('[data-testid=author-details-section-content]').within(() => {
            cy.get('h4')
                .eq(2)
                .should('contain', 'Creators');
            const creators = record.fez_record_search_key_creator_name.map(item => item.rek_creator_name);
            creators.forEach((creator, index) => {
                cy.get(`[id=rek-creator-name-list-row-${index}-name-as-published]`).should('contain', creator);
            });
        });
    });
});
