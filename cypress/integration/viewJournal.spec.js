context('view Journal', () => {
    function tabVisibleInWindow(tabId, visibility, buttonType = 'ssci') {
        cy.get(`button[data-testid="journal-details-tab-fez-journal-jcr-${buttonType}-category-${tabId}-heading"]`)
            .should('exist')
            .should(visibility);
    }

    it('should have appropriate scroll buttons', () => {
        cy.visit('/journal/view/8508?user=uqresearcher');
        cy.get('div[data-testid="journal-details-jscie"]').scrollIntoView();
        tabVisibleInWindow('0', 'be.visible', 'scie');
        tabVisibleInWindow('1', 'be.visible', 'scie');
        cy.get('div[data-testid="journal-details-jscie"]')
            .find('div.MuiTabs-scrollButtons')
            .should('not.exist');

        cy.get('div[data-testid="journal-details-jssci"]').scrollIntoView();
        tabVisibleInWindow('0', 'be.visible');
        tabVisibleInWindow('3', 'not.be.visible');
        tabVisibleInWindow('4', 'not.be.visible');
        cy.get('div[data-testid="journal-details-jssci"]')
            .find('div.MuiTabs-scrollButtons')
            .eq(1) // right hand scroll button
            .should('exist')
            .click();
        tabVisibleInWindow('0', 'not.be.visible');
        tabVisibleInWindow('3', 'be.visible');
        tabVisibleInWindow('4', 'be.visible');
    });

    it('should have an advisory statement', () => {
        cy.visit('/journal/view/12');
        cy.get('[data-testid=alert]').should('contain.text', 'Advisory statement');
    });
});
