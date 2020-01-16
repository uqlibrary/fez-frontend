import { default as recordList } from '../../../src/mock/data/records/publicationTypeListDesign';
import moment from 'moment';

context('Design admin edit', () => {
    const record = recordList.data[0];

    beforeEach(() => {
        cy.loadRecordForAdminEdit(record.rek_pid);
    });

    afterEach(() => {
        cy.adminEditCleanup();
    });

    it('should load expected tabs', () => {
        cy.adminEditCountCards(8);
        cy.adminEditVerifyAlerts(3, ['Publisher is required', 'Work subtype is required']);

        cy.adminEditTabbedView();
        cy.adminEditCheckDefaultTab('Bibliographic');
        cy.adminEditCheckTabErrorBadge(2);
        cy.adminEditCheckTabErrorBadge(4);
    });

    it('should render the different sections as expected', () => {
        // ------------------------------------------ BIBLIOGRAPHIC TAB ----------------------------------------------
        cy.log('Bibliographic tab');
        cy.get('.StandardPage form .StandardCard')
            .eq(2)
            .find('.AdminCard')
            .eq(2)
            .as('bibliographicCard')
            .within(() => {
                cy.get('h4')
                    .should('contain', 'Bibliographic');
                cy.get('#Projectname')
                    .should('have.value', record.fez_record_search_key_project_name.rek_project_name);
                cy.get('[placeholder="Project start date"]')
                    .should(
                        'have.value',
                        moment(record.fez_record_search_key_project_start_date.rek_project_start_date)
                            .format('DD/MM/YYYY'),
                    );
                cy.get('#Scale')
                    .should('have.value', record.fez_record_search_key_scale.rek_scale);
                cy.get('#Jobnumber')
                    .should('have.value', record.fez_record_search_key_job_number.rek_job_number);
            });

        cy.get('@bibliographicCard')
            .find('#Publishername')
            .type('Publisher')
            .parent()
            .parent()
            .children('p')
            .should('not.exist');

        cy.get('.StandardPage form > div:nth-child(2)')
            .within(() => {
                cy.get('.Alert ul')
                    .as('errorList')
                    .find('li')
                    .should('have.length', 2);
            });

        cy.get('@bibliographicCard')
            .find('#Rights')
            .clear()
            .parent()
            .parent()
            .parent()
            .children('p')
            .should('have.text', 'This field is required');

        cy.get('@errorList')
            .find('li')
            .should('have.length', 3)
            .eq(0)
            .should('have.text', 'Rights is required');

        // ------------------------------------------ AUTHOR DETAILS TAB ---------------------------------------------
        cy.log('Author Details tab');
        cy.get('.StandardPage form .StandardCard')
            .eq(3)
            .find('.AdminCard')
            .as('cards')
            .eq(0)
            .within(() => {
                cy.get('h4')
                    .should('contain', 'Designers');
                const designers = record.fez_record_search_key_author.map(item => item.rek_author);
                designers.forEach((designer, index) => {
                    cy.get('p')
                        .eq(index)
                        .should('have.text', designer);
                });
            });
        cy.get('@cards')
            .eq(1)
            .within(() => {
                cy.get('h4')
                    .should('contain', 'Consultants');
                const consultants = record.fez_record_search_key_contributor.map(item => item.rek_contributor);
                consultants.forEach((consultant, index) => {
                    cy.get('p')
                        .eq(index)
                        .should('have.text', consultant);
                });
            });

        cy.get('@cards')
            .eq(2)
            .within(() => {
                cy.get('h4')
                    .should('contain', 'Creators');
                const creators = record.fez_record_search_key_creator_name.map(item => item.rek_creator_name);
                creators.forEach((creator, index) => {
                    cy.get('p')
                        .eq(index)
                        .should('have.text', creator);
                });
            });
    });
});
