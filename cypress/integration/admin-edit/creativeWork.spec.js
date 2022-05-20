import { default as recordList } from '../../../src/mock/data/records/publicationTypeListCreativeWork';

context('Creative Work admin edit', () => {
    const record = recordList.data[0];

    beforeEach(() => {
        cy.loadRecordForAdminEdit(record.rek_pid);
    });

    afterEach(() => {
        cy.adminEditCleanup();
    });

    it('the tabs should also include NTRO', () => {
        cy.adminEditCountCards(9);
        cy.adminEditNoAlerts();
        cy.adminEditTabbedView();
        cy.adminEditCheckDefaultTab('Bibliographic');
    });

    it('should render the different sections as expected', () => {
        // ------------------------------------------ BIBLIOGRAPHIC TAB ----------------------------------------------
        cy.log('Bibliographic tab');
        cy.get('[data-testid=bibliographic-section-content]')
            .as('bibliographicTab')
            .within(() => {
                cy.get('h4').should('contain', 'Related publications');
                const pubList = record.fez_record_search_key_isderivationof.map(item => item.rek_isderivationof_lookup);
                pubList.forEach((pub, index) => {
                    cy.get(`[data-testid=rek-isderivationof-list-row-${index}]`).should('have.text', pub);
                });
            });

        // -------------------------------------- ADMIN TAB -----------------------------------------
        cy.log('Additional Information tab');
        cy.get('[data-testid=admin-section-content]')
            .as('adminTab')
            .within(() => {
                cy.get('h4').should('contain', 'Additional information');
                cy.get('[data-testid=rek-license-input]')
                    .should('have.value', record.fez_record_search_key_license.rek_license.toString())
                    .siblings('[role=button]')
                    .invoke('text')
                    .should('equal', record.fez_record_search_key_license.rek_license_lookup);
                cy.get('[data-testid="rek-content-indicator-select"]').should(
                    'have.text',
                    'Scholarship of Teaching and Learning',
                );
            });

        // ---------------------------------------------- NTRO TAB ---------------------------------------------------
        cy.log('NTRO tab');
        cy.get('[data-testid=ntro-section-content]')
            .as('NTRO')
            .within(() => {
                // https://www.pivotaltracker.com/story/show/173121745
                // cy.get('.AdminCard')
                //     .eq(0)
                //     .within(() => {
                //         cy.get('h4').should('contain', 'Audience size');
                //         cy.get('[data-testid=rek-audience-size-select]')
                //             .should('have.text', record.fez_record_search_key_audience_size.rek_audience_size_lookup)
                //             .get('[data-testid=rek-audience-size-input]')
                //             .should(
                //                 'have.value',
                //                 record.fez_record_search_key_audience_size.rek_audience_size.toString(),
                //             );
                //     });

                cy.get('.AdminCard')
                    .eq(0)
                    .within(() => {
                        cy.get('h4').should('contain', 'Scale/Significance of work & Creator research statement');

                        // the list rows have the correct content
                        record.fez_record_search_key_significance
                            .map(item => item.rek_significance_lookup)
                            .forEach((significance, index) => {
                                cy.get(`[data-testid="scale-of-signficance-list-editor-field-list-row-${index}"]`)
                                    .find('p')
                                    .eq(0)
                                    .should('have.text', significance || 'Missing');
                            });

                        record.fez_record_search_key_creator_contribution_statement
                            .map(item => item.rek_creator_contribution_statement)
                            .forEach((contribution, index) => {
                                const reducedContributionStatement = [/<p>/, /<\/p>/].reduce(
                                    (statement, regex) => statement.replace(regex, ''),
                                    contribution,
                                );
                                cy.get(`[data-testid="scale-of-signficance-list-editor-field-list-row-${index}"]`)
                                    .find('span')
                                    .eq(0)
                                    .should('contain', reducedContributionStatement);
                            });

                        // the form is initially blank
                        cy.get('[data-testid="rek-significance-select"]').should('contain', '');
                        cy.readCKEditor('rek-creator-contribution-statement').then(text => {
                            expect(text).to.be.empty;
                        });

                        // can add an entry
                        cy.get('[data-testid="rek-significance-list"]')
                            .children()
                            .should('have.length', 3);
                        cy.get('[data-testid="rek-significance-select"]').click();
                        cy.waitUntil(() => cy.get('[data-testid="rek-significance-options"]').should('exist'));
                        cy.get('[data-testid="rek-significance-options"]')
                            .contains('Minor')
                            .click();
                        cy.get('[data-testid="rek-significance-select"]').should('contain', 'Minor');
                        cy.typeCKEditor('rek-creator-contribution-statement', 'new entry');
                        cy.get('button[data-testid="rek-significance-add"]')
                            .should('contain', 'ADD')
                            .click();
                        cy.get('[data-testid="rek-significance-list"]')
                            .children()
                            .should('have.length', 4);
                    });

                cy.get('.AdminCard')
                    .eq(1)
                    .within(() => {
                        cy.log('QUALITY INDICATORS SECTION');
                        cy.get('h4').should('contain', 'Quality indicators');
                        const qualityIndicators = record.fez_record_search_key_quality_indicator;
                        cy.get('[data-testid="rek-quality-indicator-input"]')
                            .should('have.value', qualityIndicators.map(item => item.rek_quality_indicator).join(','))
                            .get('[data-testid=rek-quality-indicator-select]')
                            .should(
                                'have.text',
                                qualityIndicators.map(item => item.rek_quality_indicator_lookup).join(', '),
                            );
                    });
            });
    });
});
