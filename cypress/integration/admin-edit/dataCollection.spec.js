import { default as recordList } from '../../../src/mock/data/records/publicationTypeListDataCollection';

context('Data Collection admin edit', () => {
    const record = recordList.data[0];

    beforeEach(() => {
        cy.visit(`/admin/edit/${record.rek_pid}?user=uqstaff`);
        cy.closeUnsupported();
        cy.wait(1000);
        cy.waitForCkeditorToHaveLoaded();
    });

    afterEach(() => {
        cy.window()
            .then(win => (win.onbeforeunload = undefined));
    });

    it('should load expected tabs', () => {
        cy.get('.StandardPage form > div > div > div.StandardCard > div > div > h3')
            .as('cards')
            .should('have.length', 8);

        // validation block
        // Disabled until a fix is merged
        // cy.get('.StandardPage form > div > div:nth-child(9)')
        //     .within(() => {
        //         cy.get('.Alert')
        //             .should('exist')
        //             .find('.alert-text')
        //             .should('contain', 'Validation -')
        //             .find('li')
        //             .should('have.length', 3)
        //             .should('contain', 'Project description is required')
        //             .should('contain', 'You are required to accept deposit agreement')
        //             .should('contain', 'Rights is required');
        //     });

        // submit button block
        cy.get('.StandardPage form > div > div:nth-child(10) button')
            .should('exist')
            .should('be.disabled');

        cy.get('input[value=tabbed]')
            .should('have.value', 'tabbed') // force the get to wait for the element
            .click()
            .should('be.checked');

        cy.get('@cards')
            .should('have.length', 1)
            .should('have.text', 'Bibliographic');

        // Disabled until a fix is merged
        // cy.get('[role="tab"]')
        //     .eq(2)
        //     .find('[class*="MuiBadge-colorError"]')
        //     .should('have.text', '1');

        // cy.get('[role="tab"]')
        //     .eq(4)
        //     .find('[class*="MuiBadge-colorError"]')
        //     .should('have.text', '1');

        // cy.get('[role="tab"]')
        //     .eq(6)
        //     .find('[class*="MuiBadge-colorError"]')
        //     .should('have.text', '1');
    });

    it('should render Bibliographic tab', () => {
        cy.get('.StandardPage form > div > div:nth-child(3)')
            .within(() => {
                cy.get('div:nth-child(1) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Dataset name');
                    });
            });
    });
});
