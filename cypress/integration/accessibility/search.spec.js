context('WCAG', () => {
    it('Search', () => {
        cy.visit('/records/search');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('input#simpleSearchField');

        cy.log('Search');
        cy.checkA11y('div#content-container', {
            reportName: 'Search',
            scopeName: 'Content',
            includedImpacts: ['moderate', 'serious', 'critical'],
        });

        cy.get('input#simpleSearchField').type('cats and dogs', 100);
        cy.get('button#simpleSearchButton').click();
        cy.get('div').contains('Displaying works 1 to 7 of 7 total works.');

        cy.log('Search results');
        cy.checkA11y('div#content-container', {
            reportName: 'Search results',
            scopeName: 'Content',
            includedImpacts: ['moderate', 'serious', 'critical'],
        });
    });

    it('Advanced Search', () => {
        cy.visit('/records/search');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('input#simpleSearchField');

        cy.get('button#showAdvancedSearchButton').click();
        cy.log('Advanced search interface');

        // Any field
        cy.get('div#field-type-selector')
            .eq(0)
            .click();
        cy.get('li[data-value=all]').click({ force: true });
        cy.get('input#any-field-input').type('test', 100);
        cy.get('button#add-another-search-row').click();

        // Title
        cy.get('div#field-type-selector')
            .eq(1)
            .click();
        cy.get('li[data-value=rek_title]').click({ force: true });
        cy.get('input#rek-title-input').type('test', 100);
        cy.get('button#add-another-search-row').click();

        // Book title
        cy.get('div#field-type-selector')
            .eq(2)
            .click();
        cy.get('li[data-value=rek_book_title]').click({ force: true });
        cy.get('input#undefined-input').type('test', 100);
        cy.get('button#add-another-search-row').click();

        // Author name
        cy.get('div#field-type-selector')
            .eq(3)
            .click();
        cy.get('li[data-value=rek_author]').click({ force: true });
        cy.get('input#rek-author-input').type('test', 100);
        cy.get('button#add-another-search-row').click();

        // Author ID
        cy.get('div#field-type-selector')
            .eq(4)
            .click();
        cy.get('li[data-value=rek_author_id]').click({ force: true });
        cy.get('input#rek-author-id-input').type('test', 100);
        cy.get('li#rek-author-id-option-0').click();
        cy.get('button#add-another-search-row').click();

        // Editor/Contributor
        cy.get('div#field-type-selector')
            .eq(5)
            .click();
        cy.get('li[data-value="rek_contributor"]').click({ force: true });
        cy.get('input#rek-contributor-input').type('test', 100);
        cy.get('button#add-another-search-row').click();

        // Contributor ID
        cy.get('div#field-type-selector')
            .eq(6)
            .click();
        cy.get('li[data-value="rek_contributor_id"]').click({ force: true });
        cy.get('input#rek-author-id-input')
            .eq(1)
            .type('test', 100);
        cy.get('li#rek-author-id-option-0').click();
        cy.get('button#add-another-search-row').click();

        // Collection
        cy.get('div#field-type-selector')
            .eq(7)
            .click();
        cy.get('li[data-value=rek_ismemberof]').click({ force: true });
        cy.get('input#rek-ismemberof-input').type('test', 100);
        cy.get('li#rek-ismemberof-option-0').click();
        cy.get('button#add-another-search-row').click();

        // DOI
        cy.get('div#field-type-selector')
            .eq(8)
            .click();
        cy.get('li[data-value="rek_doi"]').click({ force: true });
        cy.get('input#rek-doi-input').type('10.0000/0000', 100);
        cy.get('button#add-another-search-row').click();

        // PID
        cy.get('div#field-type-selector')
            .eq(9)
            .click();
        cy.get('li[data-value="rek_pid"]').click({ force: true });
        cy.get('input#rek-pid-input').type('UQ:123456', 100);
        cy.get('button#add-another-search-row').click();

        // Series
        cy.get('div#field-type-selector')
            .eq(10)
            .click();
        cy.get('li[data-value="rek_series"]').click({ force: true });
        cy.get('input#rek-series-input').type('test', 100);
        cy.get('button#add-another-search-row').click();

        // Journal name
        cy.get('div#field-type-selector')
            .eq(11)
            .click();
        cy.get('li[data-value="rek_journal_name"]').click({ force: true });
        cy.get('input#rek-journal-name-input').type('test', 100);
        cy.get('button#add-another-search-row').click();

        // Conference name
        cy.get('div#field-type-selector')
            .eq(12)
            .click();
        cy.get('li[data-value="rek_conference_name"]').click({ force: true });
        cy.get('input#rek-conference-name-input').type('test', 100);
        cy.get('button#add-another-search-row').click();

        // Publisher
        cy.get('div#field-type-selector')
            .eq(13)
            .click();
        cy.get('li[data-value="rek_publisher"]').click({ force: true });
        cy.get('input#rek-publisher-input').type('test', 100);
        cy.get('button#add-another-search-row').click();

        // Thesis type
        cy.get('div#field-type-selector')
            .eq(14)
            .click();
        cy.get('li[data-value="rek_genre_type"]').click({ force: true });
        cy.get('div#rek-genre-type-select').click();
        cy.get('li[data-testid="rek-genre-type-option-0"]').click();
        cy.get('html').type('{esc}');
        cy.get('button#add-another-search-row').click();

        // School
        cy.get('div#field-type-selector')
            .eq(15)
            .click();
        cy.get('li[data-value="rek_org_unit_name"]').click({ force: true });
        cy.get('input#rek-org-unit-name-input').type('test', 100);
        cy.get('li#rek-org-unit-name-option-0').click();

        cy.checkA11y('div#content-container', {
            reportName: 'Advanced search interface',
            scopeName: 'Content',
            includedImpacts: ['moderate', 'serious', 'critical'],
        });
        cy.get('button#advancedSearchButton').click();
        cy.get('div').contains('Displaying works 1 to 7 of 7 total works.');
        cy.checkA11y('div#content-container', {
            reportName: 'Advanced search list',
            scopeName: 'Content',
            includedImpacts: ['moderate', 'serious', 'critical'],
        });
    });
});
