import { default as recordList } from '../../../src/mock/data/records/publicationTypeListCreativeWork';

context('Creative Work admin edit', () => {
    const record = recordList.data[0];

    beforeEach(() => {
        cy.loadRecordForAdminEdit(record.rek_pid);
    });

    afterEach(() => {
        cy.adminEditCleanup();
    });

    it('should load expected tabs', () => {
        cy.adminEditCountCards(8);
        cy.adminEditNoAlerts();
        cy.adminEditTabbedView();
        cy.adminEditCheckDefaultTab('Bibliographic');
    });

    it('should render the different sections as expected', () => {
        // ------------------------------------------ BIBLIOGRAPHIC TAB ----------------------------------------------
        cy.log('Bibliographic tab');
        cy.get('.StandardPage form > div >div')
            .get('.StandardCard')
            .eq(1)
            .as('bibliographicTab')
            .within(() => {
                cy.get('h4').should('contain', 'Related publications');
                // prettier-ignore
                const pubList = record.fez_record_search_key_isderivationof.map(
                    item => item.rek_isderivationof_lookup
                );
                pubList.forEach((pub, index) => {
                    cy.get(`[data-testid=rek-isderivationof-list-row-${index}]`).should('have.text', pub);
                });
            });

        // -------------------------------------- ADDITIONAL INFORMATION TAB -----------------------------------------
        cy.log('Additional Information tab');
        cy.get('.StandardPage form > div > div')
            .get('.StandardCard')
            .eq(3)
            .as('additionalInformationTab')
            .within(() => {
                cy.get('h4').should('contain', 'Additional information');
                cy.get('[data-testid=rek-license-input]')
                    .should('have.value', record.fez_record_search_key_license.rek_license.toString())
                    .siblings('[role=button]')
                    .invoke('text')
                    .should('match', new RegExp(`^${record.fez_record_search_key_license.rek_license_lookup}`));
                cy.get('[data-testid="rek-content-indicator-select"]').should(
                    'have.text',
                    'Scholarship of Teaching and Learning',
                );
            });

        // ---------------------------------------------- NTRO TAB ---------------------------------------------------
        cy.log('NTRO tab');
        cy.get('.StandardPage form >div > div')
            .get('.StandardCard')
            .eq(4)
            .as('NTRO')
            .within(() => {
                cy.get('h3').should('contain', 'NTRO');

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

                        const significanceList = record.fez_record_search_key_significance.map(
                            item => item.rek_significance_lookup,
                        );
                        const contributionStatement = record.fez_record_search_key_creator_contribution_statement.map(
                            item => item.rek_creator_contribution_statement,
                        )[0];
                        significanceList.forEach((significance, index) => {
                            cy.get('p')
                                .eq(2 * index)
                                .should('have.text', significance);
                            cy.get('p')
                                .eq(2 * index + 1)
                                .should(
                                    'have.text',
                                    [/<p>/, /<\/p>/].reduce(
                                        (statement, regex) => statement.replace(regex, ''),
                                        contributionStatement,
                                    ),
                                );
                        });
                    });

                cy.get('.AdminCard')
                    .eq(1)
                    .within(() => {
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
