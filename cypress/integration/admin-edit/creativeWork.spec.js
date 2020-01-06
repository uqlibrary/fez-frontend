import { default as recordList } from '../../../src/mock/data/records/publicationTypeListCreativeWork';

context('Creative Work admin edit', () => {
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

    it('should load expected tabs', () => {
        cy.get('.StandardPage form > div > div > div.StandardCard > div > div > h3')
            .as('cards')
            .should('have.length', 9);

        cy.get('.StandardPage form > div:nth-child(2)')
            .within(() => {
                cy.get('.Alert')
                    .should('not.exist');
            });

        cy.get('.StandardPage form button')
            .contains('Submit')
            .should('exist')
            .parent()
            .should('be.enabled');

        cy.get('input[value=tabbed]')
            .should('have.value', 'tabbed') // force the get to wait for the element
            .click()
            .should('be.checked');

        cy.get('@cards')
            .should('have.length', 1)
            .should('have.text', 'Bibliographic');
    });

    it('should render Bibliographic tab', () => {
        cy.get('.StandardPage form .StandardCard')
            .eq(2)
            .find('.AdminCard')
            .eq(7)
            .within(() => {
                cy.get('h4')
                    .should('contain', 'Related publications');
                // prettier-ignore
                const pubList = record.fez_record_search_key_isderivationof.map(
                    item => item.rek_isderivationof_lookup
                );
                pubList.forEach((pub, index) => {
                    cy.get('p')
                        .eq(index)
                        .should('have.text', pub);
                });
            });
    });

    it('should render Additional information tab', () => {
        cy.get('.StandardPage form .StandardCard')
            .eq(4)
            .find('.AdminCard')
            .eq(1)
            .within(() => {
                cy.get('h4')
                    .should('contain', 'Additional information');
                cy.get('label[id="Content Indicators-label"]')
                    .parent()
                    .find('input[type=hidden]')
                    .should(
                        'have.value',
                        record.fez_record_search_key_content_indicator
                            .map(indicator => indicator.rek_content_indicator)
                            .join(','),
                    )
                    .siblings('[role=button]')
                    .should(
                        'have.text',
                        record.fez_record_search_key_content_indicator
                            .map(indicator => indicator.rek_content_indicator_lookup)
                            .join(', '),
                    );
            });
    });

    it('should render NTRO tab', () => {
        cy.get('.StandardPage form .StandardCard')
            .eq(5)
            .within(() => {
                cy.get('h3')
                    .should('contain', 'NTRO');

                cy.get('.AdminCard')
                    .eq(0)
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'Audience size');
                        cy.get('#audienceSize')
                            .should('have.text', record.fez_record_search_key_audience_size.rek_audience_size_lookup)
                            .siblings('input')
                            .should(
                                'have.value',
                                record.fez_record_search_key_audience_size.rek_audience_size.toString(),
                            );
                    });

                cy.get('.AdminCard')
                    .eq(1)
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'Scale/Significance of work & Creator research statement');

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
                    .eq(3)
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'Quality indicators');
                        const qualityIndicators = record.fez_record_search_key_quality_indicator;
                        cy.get('[id="Quality indicators-label"]')
                            .should('have.text', 'Quality indicators')
                            .siblings('div')
                            .find('input[type=hidden]')
                            .should('have.value', qualityIndicators.map(item => item.rek_quality_indicator)
                                .join(','))
                            .siblings('div')
                            .should(
                                'have.text',
                                qualityIndicators.map(item => item.rek_quality_indicator_lookup)
                                    .join(', '),
                            );
                    });
            });
    });
});
