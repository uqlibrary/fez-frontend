import { default as recordList } from '../../../src/mock/data/records/publicationTypeListDesign';
import moment from 'moment';

context('Design admin edit', () => {
    afterEach(() => {
        cy.window()
            .then(win => (win.onbeforeunload = undefined));
    });

    it('should load expected tabs', () => {
        const record = recordList.data[0];
        cy.visit(`/admin/edit/${record.rek_pid}?user=uqstaff`);
        cy.closeUnsupported();
        cy.wait(1000);

        cy.get('.StandardPage form > div > div > div.StandardCard > div > div > h3')
            .as('cards')
            .should('have.length', 8);

        cy.get('input[value=tabbed]')
            .click()
            .should('be.checked');

        cy.get('@cards')
            .should('have.length', 1)
            .should('have.text', 'Bibliographic');

        cy.get('[role="tab"]')
            .eq(2)
            .find('[class*="MuiBadge-colorError"]')
            .should('have.text', '1');

        cy.get('[role="tab"]')
            .eq(4)
            .find('[class*="MuiBadge-colorError"]')
            .should('have.text', '1');
    });

    it('should render Bibliographic tab', () => {
        const record = recordList.data[1];
        cy.visit(`/admin/edit/${record.rek_pid}?user=uqstaff`);
        cy.closeUnsupported();
        cy.wait(1000);

        cy.get('.StandardPage form > div > div:nth-child(3)')
            .within(() => {
                cy.get('div:nth-child(3) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Bibliographic');
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
            });
    });

    it('should render Author details tab', () => {
        const record = recordList.data[0];
        cy.visit(`/admin/edit/${record.rek_pid}?user=uqstaff`);
        cy.closeUnsupported();
        cy.wait(1000);

        cy.get('.StandardPage form > div > div:nth-child(4)')
            .within(() => {
                cy.get('div:nth-child(1) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Designers');
                        const designers = record.fez_record_search_key_author.map(item => item.rek_author);
                        designers.forEach((designer, index) => {
                            cy.get('p')
                                .eq(index)
                                .should('have.text', designer);
                        });
                    });
                cy.get('div:nth-child(2) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Consultants');
                        const consultants = record.fez_record_search_key_contributor.map(item => item.rek_contributor);
                        consultants.forEach((consultant, index) => {
                            cy.get('p')
                                .eq(index)
                                .should('have.text', consultant);
                        });
                    });
                cy.get('div:nth-child(3) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Creators');
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
