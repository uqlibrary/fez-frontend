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
        cy.adminEditVerifyAlerts(3, ['Publisher is required', 'Work subtype is required']);

        cy.adminEditTabbedView();
        cy.adminEditCheckDefaultTab('Bibliographic');
        cy.adminEditCheckTabErrorBadge(1, '1');
        cy.adminEditCheckTabErrorBadge(3, '1');
    });

    it('should render the different sections as expected', () => {
        // ------------------------------------------ BIBLIOGRAPHIC TAB ----------------------------------------------
        cy.log('Bibliographic tab');
        cy.get('.StandardPage form >div >div')
            .get('.StandardCard')
            .eq(1)
            .as('bibliographicCard')
            .within(() => {
                cy.get('h4').should('contain', 'Bibliographic');
                cy.get('[data-testid=rek-project-name-input]').should(
                    'have.value',
                    record.fez_record_search_key_project_name.rek_project_name,
                );
                cy.checkPartialDateFromRecordValue(
                    'rek-project-start-date',
                    record.fez_record_search_key_project_start_date.rek_project_start_date,
                );
                cy.checkPartialDateFromRecordValue('End date', record.fez_record_search_key_end_date.rek_end_date);
            });

        cy.get('@bibliographicCard')
            .find('[data-testid=rek-publisher-input]')
            .type('Publisher')
            .parent()
            .parent()
            .children('p')
            .should('not.exist');

        cy.get('.StandardPage form > div:nth-child(2)').within(() => {
            cy.get('.Alert ul')
                .as('errorList')
                .find('li')
                .should('have.length', 2);
        });

        // ------------------------------------------ AUTHOR DETAILS TAB ---------------------------------------------
        cy.log('Author Details tab');
        cy.get('.StandardPage form >div >div')
            .get('.StandardCard')
            .eq(2)
            .as('authorDetailsTab')
            .within(() => {
                cy.get('h4').should('contain', 'Designers');
                const designers = record.fez_record_search_key_author.map(item => item.rek_author);
                designers.forEach((designer, index) => {
                    cy.get('p')
                        .eq(index)
                        .should('have.text', designer);
                });
            });
        cy.get('@authorDetailsTab').within(() => {
            cy.get('.AdminCard')
                .eq(1)
                .within(() => {
                    cy.get('h4').should('contain', 'Consultants');
                    const consultants = record.fez_record_search_key_contributor.map(item => item.rek_contributor);
                    consultants.forEach((consultant, index) => {
                        cy.get('p')
                            .eq(index)
                            .should('have.text', consultant);
                    });
                });
        });

        cy.get('@authorDetailsTab').within(() => {
            cy.get('.AdminCard')
                .eq(2)
                .within(() => {
                    cy.get('h4').should('contain', 'Creators');
                    const creators = record.fez_record_search_key_creator_name.map(item => item.rek_creator_name);
                    creators.forEach((creator, index) => {
                        cy.get('p')
                            .eq(index)
                            .should('have.text', creator);
                    });
                });
        });
    });
});
