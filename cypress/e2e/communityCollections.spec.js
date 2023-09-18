context('Communities and Collections', () => {
    beforeEach(() => {
        cy.visit('/communities');
    });
    const dismissPopover = () => cy.get('body').click(0, 0);

    it('Renders the default community and collections screen', () => {
        cy.get('[data-testid="page-title"]').should('contain', 'Communities');
        cy.get('[data-testid="total-communities"]').should(
            'contain',
            'Displaying communities 1 to 10 of 20 total communities',
        );
        cy.get('[data-testid="community-title-UQ:12096"]').should(
            'contain',
            'Aboriginal and Torres Strait Islander Studies Unit',
        );
        cy.get('[data-testid="community-collections-paging-top-select-page-1"]').should('exist');
        cy.get('[data-testid="community-collections-paging-top-select-page-2"]').should('exist');
        cy.get('[data-testid="community-collections-paging-top-select-page-3"]').should('not.exist');

        // export format
        cy.get('[data-testid="export-publications-format"]').should('be.visible');
        cy.get('[data-testid="export-publications-format"]').click();
        cy.get('[role="listbox"]').should('contain', 'Excel File');
        dismissPopover();
    });
    it('correctly expands and contracts collections within community', () => {
        cy.viewport(1200, 1000);
        cy.get('[data-testid="expand-row-UQ:12096"]').click();
        cy.get('[data-testid="total-collections-UQ:12096"]').should('be.visible');
        cy.get('[data-testid="total-collections-UQ:12096"]').should(
            'contain',
            "Displaying 1 to 3 of 3 collections for 'Aboriginal and Torres Strait Islander Studies Unit'",
        );
        // export format
        cy.get('[data-testid="export-publications-format"]')
            .as('exportCollection1')
            .should('have.length', 2);

        cy.get('@exportCollection1')
            .eq(1)
            .click();
        cy.get('[role="listbox"]').should('contain', 'Excel File');
        dismissPopover();

        cy.get('[data-testid="expand-row-UQ:7556"]').click();
        cy.get('[data-testid="total-collections-UQ:7556"]').should('be.visible');
        cy.get('[data-testid="total-collections-UQ:7556"]').should(
            'contain',
            "Displaying 1 to 3 of 3 collections for 'Advanced Computational Modelling Centre'",
        );
        // export format
        cy.get('[data-testid="export-publications-format"]')
            .as('exportCollection2')
            .should('have.length', 3);

        cy.get('@exportCollection2')
            .eq(2)
            .click();
        cy.get('[role="listbox"]').should('contain', 'Excel File');
        dismissPopover();

        cy.get('[data-testid="expand-row-UQ:12096"]').click();
        cy.get('[data-testid="total-collections-UQ:12096"]').should('not.exist');
        cy.get('[data-testid="expand-row-UQ:7556"]').click();
        cy.get('[data-testid="total-collections-UQ:7556"]').should('not.exist');
    });
    it('correctly links to relevant community record', () => {
        cy.get('[data-testid="community-title-UQ:12096"]').click();
        cy.url().should('include', '/view/UQ:12096');
        cy.get('[data-testid="page-title"]').should('contain', 'Aboriginal and Torres Strait Islander Studies Unit');
        cy.go('back');
        cy.get('[data-testid="community-title-UQ:7556"]').click();
        cy.url().should('include', '/view/UQ:7556');
        cy.get('[data-testid="page-title"]').should('contain', 'Advanced Computational Modelling Centre');
    });
    it('correctly links to relevant collection record', () => {
        cy.get('[data-testid="expand-row-UQ:12096"]').click();
        cy.get('[data-testid="total-collections-UQ:12096"]').should('be.visible');
        cy.get('[data-testid="collection-title-UQ:3586"]').click();
        cy.url().should('include', '/view/UQ:3586');
        cy.get('[data-testid="page-title"]').should('contain', 'Mill Point Archaeological Project');
        cy.go('back');
        cy.get('[data-testid="total-collections-UQ:12096"]').should('be.visible');
        cy.get('[data-testid="collection-title-UQ:3585"]').click();
        cy.url().should('include', '/view/UQ:3585');
        cy.get('[data-testid="page-title"]').should('contain', 'Gooreng Gooreng Cultural Heritage Project');
        UQ: 3585;
    });
    it('correctly opens collections in advanced search view', () => {
        cy.get('[data-testid="expand-row-UQ:12096"]').click();
        cy.get('[data-testid="total-collections-UQ:12096"]').should('be.visible');
        cy.get('[data-testid="row-UQ:11398"] > :nth-child(2) > a').click();
        cy.get('[data-testid="rek-ismemberof-0"] > span').should(
            'contain',
            'Aboriginal and Torres Strait Islander Studies Unit Publications',
        );
        cy.go('back');
        cy.get('[data-testid="row-UQ:3586"] > :nth-child(2) > a').click();
        cy.get('[data-testid="rek-ismemberof-0"] > span').should('contain', 'Mill Point Archaeological Project');
    });
});
context('Responsiveness (coverage)', () => {
    beforeEach(() => {
        cy.visit('/communities');
    });
    it('shows reduced pagination controls at mobile breakpoints', () => {
        cy.viewport(320, 580);
        cy.get('[data-testid="community-collections-paging-top-mobile-controls"]').should('be.visible');
        cy.get('[data-testid="community-collections-paging-top-desktop-controls"]').should('not.be.visible');
    });
    it('shows expanded pagination controls at desktop breakpoints', () => {
        cy.viewport(1024, 768);
        cy.get('[data-testid="community-collections-paging-top-mobile-controls"]').should('not.be.visible');
        cy.get('[data-testid="community-collections-paging-top-desktop-controls"]').should('be.visible');
    });
});
context('Communities and Collections - Admin', () => {
    beforeEach(() => {
        cy.visit('/communities?user=uqstaff');
    });

    it('Renders the default community and collections screen', () => {
        cy.get('[data-testid="page-title"]').should('contain', 'Communities');
        cy.get('[data-testid="total-communities"]').should(
            'contain',
            'Displaying communities 1 to 10 of 20 total communities',
        );
        cy.get('[data-testid="community-title-UQ:12096"]').should(
            'contain',
            'Aboriginal and Torres Strait Islander Studies Unit',
        );
        cy.get('[data-testid="community-collections-paging-top-select-page-1"]').should('exist');
        cy.get('[data-testid="community-collections-paging-top-select-page-2"]').should('exist');
        cy.get('[data-testid="community-collections-paging-top-select-page-3"]').should('not.exist');
        cy.get('[data-testid="admin-actions-button-UQ:12096"]').should('exist');
        cy.get('[data-testid="admin-actions-button-UQ:12096"]').click();
        cy.get('[data-testid="admin-actions-menu-UQ:12096"]').should('exist');
        cy.get('[data-testid="admin-actions-menu-UQ:12096"] ul li[tabindex="0"]').should('exist');
    });
    it('Renders result rows correctly at smaller screen resolutions', () => {
        cy.viewport(320, 480);
        cy.get('[data-testid="row-UQ:12096"] > div')
            .children()
            .filter(':visible')
            .should('have.length', 2);
        cy.viewport(640, 480);
        cy.get('[data-testid="row-UQ:12096"] > div')
            .children()
            .filter(':visible')
            .should('have.length', 2);
        cy.viewport(800, 600);
        cy.get('[data-testid="row-UQ:12096"] > div')
            .children()
            .filter(':visible')
            .should('have.length', 2);
        cy.viewport(1024, 768);
        cy.get('[data-testid="row-UQ:12096"] > div')
            .children()
            .filter(':visible')
            .should('have.length', 4);
    });
});
