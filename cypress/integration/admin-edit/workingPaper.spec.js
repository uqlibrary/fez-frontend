import { default as recordList } from '../../../src/mock/data/records/publicationTypeListWorkingPaper';

context('Working paper admin edit', () => {
    const record = recordList.data[0];

    beforeEach(() => {
        cy.visit(`/admin/edit/${record.rek_pid}?user=uqstaff`);
        cy.closeUnsupported();
        cy.wait(1000); // Wait for data load
    });

    afterEach(() => {
        cy.window()
            .then(win => (win.onbeforeunload = undefined));
    });

    it('should load with specifed elements', () => {
        cy.get('.StandardPage form > div > div > div.StandardCard > div > div > h3')
            .as('cards')
            .should('have.length', 8);

        cy.get('.StandardPage form > div > div:nth-child(9)')
            .within(() => {
                cy.get('.Alert')
                    .should('not.exist');
                cy.get('button')
                    .should('be.enabled');
            });

        cy.get('input[value=tabbed]')
            .should('have.value', 'tabbed') // force the get to wait for the element
            .click()
            .should('be.checked');

        cy.get('@cards')
            .should('have.length', 1)
            .should('have.text', 'Bibliographic');
    });

    it('should render Working Paper specific fields on the Bibliographic tab', () => {
        cy.get('.StandardPage form > div > div:nth-child(3)')
            .within(() => {
                cy.root()
                    .children('.StandardCard')
                    .children('div')
                    .children('div')
                    .children('h3')
                    .should('have.text', 'Bibliographic');

                cy.get('div:nth-child(1) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Title');
                        cy.get('span span')
                            .eq(0)
                            .should('contain.text', 'Formatted title');
                        cy.wait(1000); // Allow more time for rendering ckeditor
                        cy.get('#cke_editor3')
                            .should('exist');
                        cy.read_ckeditor('editor3')
                            .should(text => {
                                expect(text).to.contain(record.rek_title.replace("'", '&#39;'));
                            });
                    });

                cy.get('div:nth-child(3) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Bibliographic');
                        cy.get('#Reportnumber')
                            .should(
                                'have.value',
                                record.fez_record_search_key_report_number.rek_report_number,
                            );
                        cy.get('#Institution-input')
                            .should('have.value', record.fez_record_search_key_org_name.rek_org_name);
                        cy.get('#Schooldepartmentorcentre-input')
                            .should(
                                'have.value',
                                record.fez_record_search_key_org_unit_name.rek_org_unit_name,
                            );
                    });
            });
    });
});
