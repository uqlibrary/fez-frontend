context('Strategic Publishing - Search', () => {
    beforeEach(() => {
        cy.visit('localhost:3000/journals/search/');
        cy.injectAxe();
    });

    it('Renders the search page as expected', () => {
        cy.get('h2[data-testid="page-title"]').should('contain', 'Journal search');
        cy.get('div[data-testid="journal-search-card"]').should('contain', 'Step 1.');
        cy.get('div[data-testid="journal-search-card"]').should(
            'contain',
            'Enter a journal title, keyword, subject or field of research code.',
        );
        cy.get('[data-testid="journal-search-card"]').should('exist');
        cy.get('button[data-testid="journal-search-keywords-voice-record-start-button"]').should('exist');
        cy.get('span[data-testid="clear-journal-search-keywords"]').should('exist');
        cy.get('button[data-testid="journal-search-button"]').should('have.attr', 'disabled');
        cy.get('button[data-testid="journal-search-browse-all-button"]').should('not.have.attr', 'disabled');
        cy.get('button[data-testid="journal-search-favourite-journals-button"]').should('not.have.attr', 'disabled');

        cy.checkA11y('div.StandardPage', {
            reportName: 'Search Journals',
            scopeName: 'Page render',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });

    it('Renders no search results', () => {
        cy.get('input[data-testid="journal-search-keywords-input"]').type('no result', 200);
        cy.get('[data-testid="journal-search-card"]').should('contain', 'Titles containing');
        cy.get('[data-testid="journal-search-card"]').should('contain', 'Keyword matches');
        cy.get('[data-testid="journal-search-card"]').should('contain', 'Subjects & Field of research');
        cy.get('[data-testid="journal-search-keyword-list-titles containing-no-matches"]').should('exist');
        cy.get('[data-testid="journal-search-keyword-list-keyword matches-no-matches"]').should('exist');
        cy.get('[data-testid="journal-search-keyword-list-subjects & field of research-no-matches"]').should('exist');

        cy.checkA11y('div.StandardPage', {
            reportName: 'Search Journals',
            scopeName: 'Keywords',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });

    it('Renders search input', () => {
        cy.get('[data-testid="clear-journal-search-keywords"]')
            .should('have.attr', 'aria-disabled')
            .should('eq', 'true');
        cy.get('input[data-testid="journal-search-keywords-input"]').type('t');
        cy.get('[data-testid="clear-journal-search-keywords"]')
            .should('have.attr', 'aria-disabled')
            .should('eq', 'false');
        cy.get('[data-testid="clear-journal-search-keywords"]').click();
        cy.get('input[data-testid="journal-search-keywords-input"]').should('have.value', '');

        cy.checkA11y('div.StandardPage', {
            reportName: 'Search Journals',
            scopeName: 'Keywords',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });

    it('Renders search results', () => {
        cy.get('input[data-testid="journal-search-keywords-input"]').type('tech', 200);
        cy.get('[data-testid="journal-search-card"]').should('contain', 'Titles containing');
        cy.get('[data-testid="journal-search-card"]').should('contain', 'Keyword matches');
        cy.get('[data-testid="journal-search-card"]').should('contain', 'Subjects & Field of research');
        cy.get('[data-testid="journal-search-card"]').should('not.contain', 'No matches found.');

        cy.get('div[data-testid="journal-search-keyword-list-titles containing"]')
            .find('span')
            .should('have.length', 4);

        cy.get('div[data-testid="journal-search-keyword-list-keyword matches"]')
            .find('span')
            .should('have.length', 6);

        cy.get('div[data-testid="journal-search-keyword-list-subjects & field of research"]')
            .find('span')
            .should('have.length', 22);

        cy.checkA11y('div.StandardPage', {
            reportName: 'Search Journals',
            scopeName: 'Keywords',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
        cy.get('[data-testid="clear-journal-search-keywords"]').click();
        cy.get('[data-testid="journal-search-card"]').should('not.contain', 'Titles containing');
        cy.get('[data-testid="journal-search-card"]').should('not.contain', 'Keyword matches');
        cy.get('[data-testid="journal-search-card"]').should('not.contain', 'Subjects & Field of research');
    });

    it('Renders search chips', () => {
        cy.get('input[data-testid="journal-search-keywords-input"]').type('bio', 200);
        cy.get('[data-testid="journal-search-card"]').should('contain', 'Titles containing');
        cy.get('[data-testid="journal-search-card"]').should('contain', 'Keyword matches');
        cy.get('[data-testid="journal-search-card"]').should('contain', 'Subjects & Field of research');
        cy.get('[data-testid="journal-search-card"]').should('not.contain', 'No matches found.');

        cy.get('div[data-testid="journal-search-keyword-list-titles containing"]')
            .find('span')
            .should('have.length', 6);

        cy.get('div[data-testid="journal-search-keyword-list-keyword matches"]')
            .find('span')
            .should('have.length', 28);

        cy.get('div[data-testid="journal-search-keyword-list-subjects & field of research"]')
            .find('span')
            .should('have.length', 23);

        cy.get('button[data-testid="journal-search-button"]').should('have.attr', 'disabled');

        cy.get('[data-testid="journal-search-item-addable-Microbiology-0"]').click();
        cy.get('[data-testid="journal-search-chip-Title-Microbiology"]').should('exist');

        cy.get('button[data-testid="journal-search-button"]').should('not.have.attr', 'disabled');

        cy.get('[data-testid="journal-search-chip-Title-Microbiology"]')
            .find('svg')
            .click();
        cy.get('button[data-testid="journal-search-button"]').should('have.attr', 'disabled');

        cy.checkA11y('div.StandardPage', {
            reportName: 'Search Journals',
            scopeName: 'Keywords chips',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });

    it('FAQ', () => {
        cy.get('input[data-testid="journal-search-keywords-input"]').type('bio', 200);
        cy.get('[data-testid="journal-search-item-addable-Microbiology-0"]').click();
        cy.get('[data-testid="journal-search-button"]').click();
        cy.get('[data-testid="search-journals-faq"]', { timeout: 1000 }).should('be.visible');
        cy.get('[data-testid="faq-summary-0"]').click();

        cy.checkA11y(
            '[data-testid="search-journals-faq"]',
            {
                rules: { 'color-contrast': { enabled: false } },
                reportName: 'Search Journals',
                scopeName: 'FAQ',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            },
            violations => console.log(violations),
        );
    });

    it('Renders journal search result facets', () => {
        cy.get('input[data-testid="journal-search-keywords-input"]').type('bio', 200);
        cy.get('[data-testid="journal-search-item-addable-Microbiology-0"]').click();
        cy.get('[data-testid="journal-search-button"]').click();
        cy.get('[data-testid="journal-search-facets"]').should('be.visible');
        cy.get('[data-testid="journal-search-facets"]')
            .find('[data-testid="facets-filter"] nav > div')
            .should('have.length', 9);
        cy.get('button[data-testid="help-icon-journal-search-facets"]').should('be.visible');

        cy.checkA11y(
            '[data-testid="journal-search-facets"]',
            {
                rules: { 'color-contrast': { enabled: false } },
                reportName: 'Search Journals',
                scopeName: 'Facets',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            },
            violations => console.log(violations),
        );
    });

    it('Renders journal search result sorting and pagination', () => {
        cy.get('input[data-testid="journal-search-keywords-input"]').type('bio', 200);
        cy.get('[data-testid="journal-search-item-addable-Microbiology-0"]').click();
        cy.get('[data-testid="journal-search-button"]').click();
        // pagination
        cy.get('[data-testid="search-journals-paging-top"]').should('be.visible');
        cy.get('[data-testid="search-journals-paging-bottom"]').should('be.visible');
        // sort by
        cy.get('[data-testid="publication-list-sorting-sort-by"]').should('be.visible');
        cy.get('[data-testid="publication-list-sorting-sort-by"]').should('contain', 'Highest quartile');
        cy.get('[data-testid="publication-list-sorting-sort-by"]').click();
        cy.get('[role="listbox"]')
            .should('contain', 'CiteScore')
            .should('contain', 'Impact factor')
            .click();
        // sort order
        cy.get('[data-testid="publication-list-sorting-sort-order"]').should('be.visible');
        cy.get('[data-testid="publication-list-sorting-sort-order"]').should('contain', 'Asc');
        cy.get('[data-testid="publication-list-sorting-sort-order"]').click();
        cy.get('[role="listbox"]')
            .should('contain', 'Desc')
            .click();
        // page size
        cy.get('[data-testid="publication-list-sorting-page-size"]').should('be.visible');
        cy.get('[data-testid="publication-list-sorting-page-size"]').should('contain', '10');
        cy.get('[data-testid="publication-list-sorting-page-size"]').click();
        cy.get('[role="listbox"]')
            .should('contain', '20')
            .click();
        // export format
        cy.get('[data-testid="export-publications-format"]').should('be.visible');
        cy.get('[data-testid="export-publications-format"]').click();
        cy.get('[role="listbox"]').should('contain', 'Excel File');
    });

    it('Renders journal search result table in less view by default', () => {
        cy.get('input[data-testid="journal-search-keywords-input"]').type('bio', 200);
        cy.get('[data-testid="journal-search-item-addable-Microbiology-0"]').click();
        cy.get('[data-testid="journal-search-button"]').click();
        cy.get('[data-testid="journal-list"]').should('be.visible');

        cy.get('[data-testid="journal-list"]')
            .find('[data-testid="journal-list-header"] [data-testid="journal-list-header-col-1"]')
            .should('be.visible')
            .should('contain', 'Journal title');

        // expect to see open access and highest quartile in less view
        cy.get('[data-testid="journal-list"]')
            .find('[data-testid="journal-list-header-min-fez_journal_doaj"]')
            .should('be.visible')
            .should('contain', 'Open access');

        cy.get('[data-testid="journal-list"]')
            .find('[data-testid="journal-list-header-min-highest_quartile"]')
            .should('be.visible')
            .should('contain', 'Highest quartile');

        cy.get('[data-testid="journal-list"]')
            .find('[data-testid="journal-list-header-view-toggle"] button[title="Show more data"]')
            .should('exist')
            .should('contain', 'more');

        cy.get('[data-testid="journal-list"]')
            .find('[data-testid="journal-list-header-view-toggle"] button[title="Show less data"]')
            .should('not.exist');

        cy.checkA11y(
            '[data-testid="journal-list"]',
            {
                rules: { 'color-contrast': { enabled: false } },
                reportName: 'Search Journals',
                scopeName: 'Journal list less view',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            },
            violations => console.log(violations),
        );
    });

    it('Renders journal search result table in more view', () => {
        cy.get('input[data-testid="journal-search-keywords-input"]').type('bio', 200);
        cy.get('[data-testid="journal-search-item-addable-Microbiology-0"]').click();
        cy.get('[data-testid="journal-search-button"]').click();
        cy.get('[data-testid="journal-list"]').should('be.visible');
        // switch to move view
        cy.get('[data-testid="journal-list-header-view-toggle"] button[title="Show more data"]').click();

        cy.get('[data-testid="journal-list"]')
            .find('[data-testid="journal-list-header"] [data-testid="journal-list-header-col-1"]')
            .should('be.visible')
            .should('contain', 'Journal title');

        cy.get('[data-testid="journal-list"]')
            .find('[data-testid="journal-list-header-full-fez_journal_doaj"]')
            .should('be.visible')
            .should('contain', 'Open access');

        cy.get('[data-testid="journal-list"]')
            .find('[data-testid="journal-list-header-full-highest_quartile"]')
            .should('be.visible')
            .should('contain', 'Highest quartile');

        cy.get('[data-testid="journal-list"]')
            .find('[data-testid="journal-list-header-full-jnl_cite_score"]')
            .should('be.visible')
            .should('contain', 'CiteScore');

        cy.get('[data-testid="journal-list"]')
            .find('[data-testid="journal-list-header-full-fez_journal_cite_score"]')
            .should('be.visible')
            .should('contain', 'CiteScore percentile');

        cy.get('[data-testid="journal-list"]')
            .find('[data-testid="journal-list-header-full-highest_quartile"]')
            .should('be.visible')
            .should('contain', 'Highest quartile');

        cy.get('[data-testid="journal-list"]')
            .find('[data-testid="journal-list-header-full-jnl_jcr_scie_impact_factor"]')
            .should('be.visible')
            .should('contain', 'Impact factor');

        cy.get('[data-testid="journal-list"]')
            .find('[data-testid="journal-list-header-full-jnl_jcr_scie_category_jif_percentile"]')
            .should('be.visible')
            .should('contain', 'Impact factor percentile');

        cy.get('[data-testid="journal-list"]')
            .find('[data-testid="journal-list-header-full-jnl_cite_score_snip"]')
            .should('be.visible')
            .should('contain', 'SNIP');

        cy.get('[data-testid="journal-list"]')
            .find('[data-testid="journal-list-header-full-jnl_cite_score_sjr"]')
            .should('be.visible')
            .should('contain', 'SJR');

        cy.get('[data-testid="journal-list"]')
            .find('[data-testid="journal-list-header-view-toggle"] button')
            .should('contain', 'less');

        cy.checkA11y(
            '[data-testid="journal-list"]',
            {
                rules: { 'color-contrast': { enabled: false } },
                reportName: 'Search Journals',
                scopeName: 'Journal list more view',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            },
            violations => console.log(violations),
        );
    });

    context('Handling when the back button is clicked', () => {
        beforeEach(() => {
            cy.get('input[data-testid="journal-search-keywords-input"]').type('bio', 200);
            cy.get('[data-testid="journal-search-item-addable-Glycobiology-3"]').click();
            cy.get('[data-testid="journal-search-item-addable-Biological-4"]').click();
            cy.get('[data-testid="journal-search-button"]').click();
            cy.get('[data-testid="journal-list"]').should('be.visible');

            cy.get('[data-testid="journal-search-chip-Title-Glycobiology"]').should('exist');
            cy.get('[data-testid="journal-search-chip-Title-Biological"]').should('exist');
        });

        it('restores results and keyword state after a keyword has been deleted', () => {
            const resultsLengthWithOneKeyword = 8;
            const resultsLengthWithTwoKeywords = 4;
            cy.location().should(location => {
                expect(location.search).to.contain('keywords%5BTitle-Glycobiology');
                expect(location.search).to.contain('keywords%5BTitle-Biological');
            });

            // check we have expected number of mock results
            cy.get('[id^="journal-list-data-col-1-title"]')
                .as('ResultTitles')
                .should('have.length', resultsLengthWithTwoKeywords); // /mock/index.js

            cy.get('[data-testid="journal-search-chip-Title-Glycobiology"]')
                .find('svg')
                .click();

            cy.get('[data-testid="journal-search-chip-Title-Glycobiology"]').should('not.exist');
            cy.location().should(location => {
                expect(location.search).not.to.contain('keywords%5BTitle-Glycobiology');
            });

            // check we have new expected number of results
            cy.get('@ResultTitles').should('have.length', resultsLengthWithOneKeyword);

            /* maybe check api call is re-made for data */
            cy.go('back');

            cy.location().should(location => {
                expect(location.search).to.contain('keywords%5BTitle-Glycobiology');
                expect(location.search).to.contain('keywords%5BTitle-Biological');
            });

            cy.get('[data-testid="journal-search-chip-Title-Glycobiology"]').should('exist');
            cy.get('[data-testid="journal-search-chip-Title-Biological"]').should('exist');

            // check initial number of results are shown again
            cy.get('@ResultTitles').should('have.length', resultsLengthWithTwoKeywords);

            cy.checkA11y(
                'div.StandardPage',
                {
                    reportName: 'Search Journals',
                    scopeName: 'Keyword history restoration',
                    includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                },
                violations => console.log(violations),
            );
        });

        it('restores results and facet state after a keyword has been deleted', () => {
            const resultsLengthWithKeywordOnly = 8;
            const resultsLengthWithKeywordAndFacets = 4;

            cy.get('[data-testid="journal-search-facets"]')
                .find('[data-testid="facets-filter"] nav > div')
                .should('have.length', 9);

            // select facets
            cy.get('[id="clickable-facet-category-listed-in"]').click();
            cy.get('[id="facet-filter-nested-item-cwts"]')
                .as('facetItemCwts')
                .click()
                .find('svg#clear-facet-filter-nested-item-cwts')
                .should('exist');
            cy.get('[id="clickable-facet-category-indexed-in"]').click();
            cy.get('[id="facet-filter-nested-item-scopus"]')
                .as('facetItemScopus')
                .click()
                .find('svg#clear-facet-filter-nested-item-scopus')
                .should('exist');

            cy.location().should(location => {
                expect(location.search).to.contain('CWTS');
                expect(location.search).to.contain('Scopus');
            });

            // check we have expected number of mock results
            cy.get('[id^="journal-list-data-col-1-title"]')
                .as('ResultTitles')
                .should('have.length', resultsLengthWithKeywordAndFacets); // /mock/index.js

            // remove a keyword - this should unselect the active facets and update the URL
            cy.get('[data-testid="journal-search-chip-Title-Glycobiology"]')
                .find('svg')
                .click();

            cy.location().should(location => {
                expect(location.search).not.to.contain('CWTS');
                expect(location.search).not.to.contain('Scopus');
            });

            cy.get('@facetItemCwts')
                .find('svg#clear-facet-filter-nested-item-cwts')
                .should('not.exist');

            cy.get('@facetItemScopus')
                .find('svg#clear-facet-filter-nested-item-scopus')
                .should('not.exist');

            // check the number of mock results is now showing the new number of expected results (should be different)
            cy.get('@ResultTitles').should('have.length', resultsLengthWithKeywordOnly);

            cy.go('back');

            cy.location().should(location => {
                expect(location.search).to.contain('CWTS');
                expect(location.search).to.contain('Scopus');
            });

            cy.get('@facetItemCwts')
                .find('svg#clear-facet-filter-nested-item-cwts')
                .should('exist');

            cy.get('@facetItemScopus')
                .find('svg#clear-facet-filter-nested-item-scopus')
                .should('exist');

            // check the set of mock results is the same as when we first checked
            cy.get('@ResultTitles').should('have.length', resultsLengthWithKeywordAndFacets);

            cy.checkA11y(
                'div.StandardPage',
                {
                    reportName: 'Search Journals',
                    scopeName: 'Facet history restoration',
                    includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                },
                violations => console.log(violations),
            );
        });
    });
});
