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

        cy.wait(1000); // Allow more time for rendering tabbing mechanism
        cy.get('input[value=tabbed]')
            .click()
            .should('be.checked');

        cy.get('@cards')
            .should('have.length', 1)
            .should('have.text', 'Bibliographic');
    });

    it('should render Bibliographic tab', () => {
        cy.get('.StandardPage form > div > div:nth-child(3)')
            .within(() => {
                cy.get('div:nth-child(8) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Related publications');
                        // prettier-ignore
                        const publist = record.fez_record_search_key_isderivationof.map(
                            item => item.rek_isderivationof_lookup
                        );
                        publist.forEach((pub, index) => {
                            cy.get('p')
                                .eq(index)
                                .should('have.text', pub);
                        });
                    });
            });
    });

    it('should render Additional information tab', () => {
        cy.get('.StandardPage form > div > div:nth-child(5)')
            .within(() => {
                cy.get('div:nth-child(2) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Additional information');
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
    });

    it('should render NTRO tab', () => {
        cy.get('.StandardPage form > div > div:nth-child(6)')
            .within(() => {
                cy.root()
                    .children('.StandardCard')
                    .children('div')
                    .children('div')
                    .children('h3')
                    .should('have.text', 'NTRO');

                cy.get('div:nth-child(1) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Audience size');
                        cy.get('#audienceSize')
                            .should('have.text', record.fez_record_search_key_audience_size.rek_audience_size_lookup)
                            .siblings('input')
                            .should('have.value', record.fez_record_search_key_audience_size.rek_audience_size.toString());
                    });

                cy.get('div:nth-child(2) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Scale/Significance of work & Creator research statement');

                        const significanceList = record.fez_record_search_key_significance.map(
                            item => item.rek_significance_lookup,
                        );
                        const contributionStatement = record.fez_record_search_key_creator_contribution_statement.map(
                            item => item.rek_creator_contribution_statement,
                        );
                        significanceList.forEach((significance, index) => {
                            cy.get('p')
                                .eq(2 * index)
                                .should('have.text', significance);
                            cy.get('p')
                                .eq(2 * index + 1)
                                .should('have.text', contributionStatement[index]);
                        });
                    });

                cy.get('div:nth-child(4) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Quality indicators');
                        const qualityIndicators = record.fez_record_search_key_quality_indicator;
                        cy.get('[id="Quality indicators-label"]')
                            .should('have.text', 'Quality indicators')
                            .siblings('div')
                            .find('input[type=hidden]')
                            .should('have.value', qualityIndicators.map(item => item.rek_quality_indicator)
                                .join(','))
                            .siblings('div')
                            .should('have.text', qualityIndicators.map(item => item.rek_quality_indicator_lookup)
                                .join(', '));
                    });
            });
    });
});
