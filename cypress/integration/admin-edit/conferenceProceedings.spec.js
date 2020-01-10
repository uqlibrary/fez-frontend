import { default as recordList } from '../../../src/mock/data/records/publicationTypeListConferenceProceedings';

context('Conference Proceedings admin edit', () => {
    const record = recordList.data[0];
    const {
        dsi_dsid: visibleFilename,
        dsi_label: visibleFileDescription,
        dsi_security_policy: visibleFileSecurityPolicy,
    } = record.fez_datastream_info[0];
    // const { dsi_dsid: hiddenFilename } = record.fez_datastream_info[1];

    beforeEach(() => {
        cy.loadRecordForAdminEdit(record.rek_pid);
    });

    afterEach(() => {
        cy.adminEditCleanup();
    });

    it('should load expected tabs', () => {
        cy.get('.StandardPage form > div > div > div.StandardCard > div > div > h3')
            .as('cards')
            .should('have.length', 8);

        cy.get('.StandardPage form > div:nth-child(2)')
            .within(() => {
                cy.get('.Alert')
                    .should('exist')
                    .find('.alert-text')
                    .should('contain', 'Validation -')
                    .find('li')
                    .should('have.length', 1)
                    .should('contain', 'Author/creator names are required');
                cy.get('button')
                    .contains('Submit')
                    .should('exist')
                    .parent()
                    .should('be.disabled');
            });

        cy.wait(1000); // Wait for tabbing to fully load

        cy.get('input[value=tabbed]')
            .should('have.value', 'tabbed') // force the get to wait for the element
            .click()
            .should('be.checked');

        cy.get('@cards')
            .should('have.length', 1)
            .should('have.text', 'Bibliographic');

        cy.get('[role="tab"]')
            .eq(3)
            .find('[class*="MuiBadge-colorError"]')
            .should('have.text', '1');
    });

    it('should render the different sections as expected', () => {
        // ------------------------------------------ BIBLIOGRAPHIC TAB ----------------------------------------------
        cy.log('Bibliographic tab');
        cy.get('.StandardPage form .StandardCard')
            .eq(2)
            .within(() => {
                cy.get('.AdminCard')
                    .eq(0)
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'Title of proceedings');
                    });
            });

        // ------------------------------------------ AUTHOR DETAILS TAB ---------------------------------------------
        cy.log('Author Details tab');
        cy.get('.StandardPage form .StandardCard')
            .eq(3)
            .within(() => {
                cy.get('.AdminCard')
                    .eq(0)
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'Authors');
                        cy.get('#authors-name-as-published-field')
                            .type('Author{enter}');
                    });
            });
        cy.get('.StandardPage form > div:nth-child(2)')
            .within(() => {
                cy.get('.Alert')
                    .should('not.exist');
                cy.get('button')
                    .should('be.enabled');
            });

        // ---------------------------------------------- FILES TAB --------------------------------------------------
        cy.log('Files tab');
        cy.get('.StandardPage form .StandardCard')
            .eq(6)
            .within(() => {
                cy.get('div:nth-child(1) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Attached files');

                        cy.get('[class*=MuiCardContent-root] > div')
                            .within(() => {
                                cy.get(`a[title="${visibleFilename}"]`)
                                    .should('have.length', 1);

                                // TODO: Write test for file hidden as per new logic
                                // cy.get(`a[title="${hiddenFilename}"]`)
                                //     .should('have.length', 0);

                                cy.get('input[name=fileDescription]')
                                    .should('have.value', visibleFileDescription);
                            });
                    });
            });

        // --------------------------------------------- SECURITY TAB ------------------------------------------------
        cy.log('Security tab');
        cy.get('.StandardPage form > div > div:nth-child(8) > .StandardCard')
            .within(() => {
                cy.get('.StandardCard h3')
                    .eq(1)
                    .should('have.text', `Datastream level security - ${record.rek_pid}`);

                cy.get('.StandardCard')
                    .eq(1)
                    .within(() => {
                        cy.get('h6')
                            .eq(0)
                            .should('have.text', 'Inherited datastream security policy details');
                        record.fez_record_search_key_ismemberof.forEach((collection, index) => {
                            cy.get('h6')
                                .eq(2 * index + 1)
                                .should('have.text', collection.rek_ismemberof);
                            cy.get('h6')
                                .eq(2 * index + 2)
                                .should('have.text', collection.rek_ismemberof_lookup);
                            cy.get('p')
                                .eq(index)
                                .should('have.text', `Public (${collection.parent.rek_security_policy})`);
                        });
                        cy.get('h6')
                            .contains('Override datastream security policy details')
                            .siblings('div')
                            .as('dsiPolicyBlock')
                            .find(`a[title="${visibleFilename}"]`)
                            .should('have.text', visibleFilename);
                        cy.get('@dsiPolicyBlock')
                            .find(`input[name="${visibleFilename}"]`)
                            .should('have.value', visibleFileSecurityPolicy.toString());
                    });
            });
    });
});
