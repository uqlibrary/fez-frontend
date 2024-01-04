import { default as recordList } from '../../../src/mock/data/records/publicationTypeListDesign';

context('Design admin edit', () => {
    const record = recordList.data[0];
    const nonNtroRecord = recordList.data[2];

    afterEach(() => {
        cy.adminEditCleanup();
    });

    it('should load expected tabs', () => {
        cy.loadRecordForAdminEdit(record.rek_pid);
        cy.adminEditCountCards(9);

        cy.adminEditTabbedView();
        cy.adminEditCheckDefaultTab('Bibliographic');
        cy.adminEditCheckTabErrorBadge('bibliographic', '2');
    });

    it('should render the different sections as expected', () => {
        cy.loadRecordForAdminEdit(record.rek_pid);
        // ------------------------------------------ BIBLIOGRAPHIC TAB ----------------------------------------------
        cy.log('Bibliographic tab');
        cy.get('[data-testid=bibliographic-section-header]').should('contain', 'Bibliographic');

        // ------------------------------------------ AUTHOR DETAILS TAB ---------------------------------------------
        cy.log('Author Details tab');
        cy.get('[data-testid=authors-section-header]').contains('Authors');
        cy.get('[data-testid=authors-section-content]').within(() => {
            cy.get('h4')
                .eq(0)
                .should('contain', 'Designers');
            const designers = record.fez_record_search_key_author.map(item => item.rek_author);
            designers.forEach((designer, index) => {
                cy.get(`[id=rek-author-list-row-${index}-name-as-published]`).should('contain', designer);
            });
        });

        cy.get('[data-testid=authors-section-content]').within(() => {
            cy.get('h4')
                .eq(1)
                .should('contain', 'Consultants');
            const consultants = record.fez_record_search_key_contributor.map(item => item.rek_contributor);
            consultants.forEach((consultant, index) => {
                cy.get(`[id=rek-contributor-list-row-${index}-name-as-published]`).should('contain', consultant);
            });
        });

        // ----------------------------------------- GRANT INFORMATION TAB ---------------------------------------------
        cy.log('Grant information tab');
        cy.get('[data-testid=grants-section-header]').contains('Grants');
    });

    it('should render different sections as expected for non-NTRO subtype', () => {
        cy.loadRecordForAdminEdit(nonNtroRecord.rek_pid);
        // ------------------------------------------ BIBLIOGRAPHIC TAB ----------------------------------------------
        cy.log('Bibliographic tab');
        cy.get('[data-testid=bibliographic-section-header]').should('contain', 'Bibliographic');
        cy.get('[data-testid=rek-job-number-input]').should(
            'have.value',
            record.fez_record_search_key_job_number.rek_job_number,
        );

        // ------------------------------------------ AUTHOR DETAILS TAB ---------------------------------------------
        cy.log('Author Details tab');
        cy.get('[data-testid=authors-section-header]').contains('Authors');
        cy.get('[data-testid=authors-section-content]').within(() => {
            cy.get('h4')
                .eq(0)
                .should('contain', 'Designers');
            const designers = record.fez_record_search_key_author.map(item => item.rek_author);
            designers.forEach((designer, index) => {
                cy.get(`[id=rek-author-list-row-${index}-name-as-published]`).should('contain', designer);
            });
        });

        cy.get('[data-testid=authors-section-content]').within(() => {
            cy.get('h4')
                .eq(1)
                .should('contain', 'Contributors');
            const consultants = record.fez_record_search_key_contributor.map(item => item.rek_contributor);
            consultants.forEach((consultant, index) => {
                cy.get(`[id=rek-contributor-list-row-${index}-name-as-published]`).should('contain', consultant);
            });
        });
    });
});
