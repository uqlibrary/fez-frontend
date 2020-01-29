import { default as recordList } from '../../../src/mock/data/records/publicationTypeListWorkingPaper';

context('Working paper admin edit', () => {
    const record = recordList.data[0];

    beforeEach(() => {
        cy.loadRecordForAdminEdit(record.rek_pid);
    });

    afterEach(() => {
        cy.adminEditCleanup();
    });

    it('should load with specifed elements', () => {
        cy.adminEditCountCards(8);
        cy.adminEditNoAlerts();

        cy.adminEditTabbedView();
        cy.adminEditCheckDefaultTab('Bibliographic');
    });

    it('should render the different sections as expected', () => {
        // ------------------------------------------ BIBLIOGRAPHIC TAB ----------------------------------------------
        cy.log('Bibliographic tab');
        cy.get('.StandardPage form .StandardCard')
            .eq(2)
            .within(() => {
                cy.get('h3')
                    .should('have.text', 'Bibliographic');

                cy.get('.AdminCard')
                    .as('cards')
                    .eq(0)
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'Title');
                        cy.get('span span')
                            .eq(0)
                            .should('contain.text', 'Formatted title');
                        cy.get('#cke_editor3')
                            .should('exist');
                        cy.readCKEditor('editor3')
                            .should(text => {
                                expect(text).to.contain(record.rek_title.replace("'", '&#39;'));
                            });
                    });

                cy.get('@cards')
                    .eq(2)
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'Bibliographic');
                        cy.get('#Reportnumber')
                            .should(
                                'have.value',
                                record.fez_record_search_key_report_number.rek_report_number,
                            );
                        cy.get('#Institution-input')
                            .should(
                                'have.value',
                                record.fez_record_search_key_org_name.rek_org_name,
                            );
                        cy.get('#Schooldepartmentorcentre-input')
                            .should(
                                'have.value',
                                record.fez_record_search_key_org_unit_name.rek_org_unit_name,
                            );
                    });
            });
    });
});
