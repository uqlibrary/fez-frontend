const scrollToBottom = () =>
    cy
        .get('#content-container')
        .scrollTo('bottom')
        .then($el => {
            // make sure it has been scrolled to the bottom
            expect($el.get(0).scrollTop).to.be.greaterThan(0);
            return $el.get(0).scrollTop;
        });

const assertScrollIsNotOnTop = () =>
    cy.get('#content-container').should($el => {
        expect($el.get(0).scrollTop).to.be.greaterThan(0);
    });

const assertScrollIsOnTop = () =>
    cy.get('#content-container').should($el => {
        expect($el.get(0).scrollTop).to.be.equals(0);
    });
const captureBeforeContent = element => {
    const win = element[0].ownerDocument.defaultView;
    const before = win.getComputedStyle(element[0], 'before');
    return before.getPropertyValue('content');
};

const assertCollapsiblePanel = index => {
    cy.get(`[data-testid="journal-list-collapse-panel-${index}"]`).should('not.exist');

    // expand item data for  row
    cy.get(`[data-testid="journal-list-expander-btn-${index}"]`).click();

    cy.get(`[data-testid="journal-list-collapse-panel-${index}"]`).should('exist');

    cy.get(`[data-testid="journal-list-header-jnl-cite-score-${index}"]`)
        .should('be.visible')
        .should('contain', 'CiteScore');

    cy.get(`[data-testid="journal-list-header-fez-journal-cite-score-${index}"]`)
        .should('be.visible')
        .should('contain', 'CiteScore percentile');

    cy.get(`[data-testid="journal-list-header-jnl-jcr-scie-impact-factor-${index}"]`)
        .should('be.visible')
        .should('contain', 'Impact factor');

    cy.get(`[data-testid="journal-list-header-jnl-jcr-scie-category-jif-percentile-${index}"]`)
        .should('be.visible')
        .should('contain', 'Impact factor percentile');

    cy.get(`[data-testid="journal-list-header-jnl-cite-score-snip-${index}"]`)
        .should('be.visible')
        .should('contain', 'SNIP');

    cy.get(`[data-testid="journal-list-header-jnl-cite-score-sjr-${index}"]`)
        .should('be.visible')
        .should('contain', 'SJR');

    cy.checkA11y(
        `[data-testid=journal-list-collapse-panel-${index}]`,
        {
            rules: { 'color-contrast': { enabled: false } },
            reportName: 'Search Journals',
            scopeName: 'Journal list more view',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        },
        violations => console.log(violations),
    );

    // collapse item data for first row
    cy.get(`[data-testid="journal-list-expander-btn-${index}"]`).click();

    cy.get(`[data-testid="journal-list-collapse-panel-${index}"]`).should('not.exist');
};

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
            'Enter a journal title, ISSN, keyword, subject or field of research code',
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
        cy.get('[data-testid="journal-search-keyword-list-titles-containing-no-matches"]').should('exist');
        cy.get('[data-testid="journal-search-keyword-list-keyword-matches-no-matches"]').should('exist');
        cy.get('[data-testid="journal-search-keyword-list-subjects-field-of-research-no-matches"]').should('exist');

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
        cy.get('[data-testid="clear-journal-search-keywords"]').should('not.have.attr', 'aria-disabled');
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

        cy.get('div[data-testid="journal-search-keyword-list-titles-containing"]')
            .find('span')
            .should('have.length', 3);

        cy.get('div[data-testid="journal-search-keyword-list-keyword-matches"]')
            .find('span')
            .should('have.length', 6);

        cy.get('div[data-testid="journal-search-keyword-list-subjects-field-of-research"]')
            .find('span')
            .should('have.length', 31);

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

        cy.get('div[data-testid="journal-search-keyword-list-titles-containing"]')
            .find('span')
            .should('have.length', 6);

        cy.get('div[data-testid="journal-search-keyword-list-keyword-matches"]')
            .find('span')
            .should('have.length', 28);

        cy.get('div[data-testid="journal-search-keyword-list-subjects-field-of-research"]')
            .find('span')
            .should('have.length', 33);

        cy.get('button[data-testid="journal-search-button"]').should('have.attr', 'disabled');

        cy.get('[data-testid="journal-search-item-addable-title-microbiology-0"]').click();
        cy.get('[data-testid="journal-search-chip-title-microbiology"]').should('exist');

        cy.get('button[data-testid="journal-search-button"]').should('not.have.attr', 'disabled');

        cy.get('[data-testid="journal-search-chip-title-microbiology"]')
            .find('svg')
            .click();
        cy.get('button[data-testid="journal-search-button"]').should('have.attr', 'disabled');

        cy.checkA11y('div.StandardPage', {
            reportName: 'Search Journals',
            scopeName: 'Keywords chips',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });

    it('Selecting keyword should not change scroll position', () => {
        cy.get('input[data-testid="journal-search-keywords-input"]').type('bio', 200);
        scrollToBottom().then(() => {
            // select a keyword
            cy.get('[data-testid="journal-search-item-addable-keyword-bioe-27"]').click();
            cy.get('[data-testid="journal-search-chip-keyword-bioe"]').should('exist');
            // make sure the scroll hasn't changed
            assertScrollIsNotOnTop();
        });
    });

    it('Removing keyword should not change scroll position', () => {
        cy.get('input[data-testid="journal-search-keywords-input"]').type('bio', 200);
        scrollToBottom().then(() => {
            // select a keyword
            cy.get('[data-testid="journal-search-item-addable-keyword-bioe-27"]').click();
            // and remove it
            cy.get('[data-testid="journal-search-chip-keyword-bioe"]')
                .find('svg')
                .click()
                .then(() => {
                    cy.get('[data-testid="journal-search-chip-keyword-bioe"]').should('not.exist');
                    // make sure the scroll hasn't changed
                    assertScrollIsNotOnTop();
                });
        });
    });

    it('Selecting keyword should indicate change on keyword icon when added', () => {
        cy.get('input[data-testid="journal-search-keywords-input"]').type('bio', 200);
        cy.get('[data-testid="journal-search-item-addable-keyword-bioe-27"]').click();
        cy.get('[data-testid="journal-search-chip-keyword-bioe"]').should('exist');
        cy.get('[data-testid="journal-search-item-addable-keyword-bioe-27"]').then($element => {
            expect(captureBeforeContent($element)).to.eq('"‒"');
        });
        cy.get('[data-testid="journal-search-item-addable-keyword-bioe-27"]').click();
        cy.get('[data-testid="journal-search-chip-keyword-bioe"]').should('not.exist');
        cy.get('[data-testid="journal-search-item-addable-keyword-bioe-27"]').then($element => {
            expect(captureBeforeContent($element)).to.eq('"+"');
        });

        cy.get('[data-testid="journal-search-item-addable-title-biomedicine-5"]').click();
        cy.get('[data-testid="journal-search-chip-title-biomedicine"]').should('exist');
        cy.get('[data-testid="journal-search-item-addable-title-biomedicine-5"]').then($element => {
            expect(captureBeforeContent($element)).to.eq('"‒"');
        });
        cy.get('[data-testid="journal-search-item-addable-title-biomedicine-5"]').click();
        cy.get('[data-testid="journal-search-chip-title-biomedicine"]').should('not.exist');
        cy.get('[data-testid="journal-search-item-addable-title-biomedicine-5"]').then($element => {
            expect(captureBeforeContent($element)).to.eq('"+"');
        });
    });

    it('FAQ', () => {
        cy.get('input[data-testid="journal-search-keywords-input"]').type('bio', 200);
        cy.get('[data-testid="journal-search-item-addable-title-microbiology-0"]').click();
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
        cy.get('[data-testid="journal-search-item-addable-title-microbiology-0"]').click();
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
        cy.get('[data-testid="journal-search-item-addable-title-microbiology-0"]').click();
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

    it('Renders journal search result table in collapsed view by default for desktop', () => {
        cy.get('input[data-testid="journal-search-keywords-input"]').type('bio', 200);
        cy.get('[data-testid="journal-search-item-addable-title-microbiology-0"]').click();
        cy.get('[data-testid="journal-search-button"]').click();
        cy.get('[data-testid="journal-list"]').should('be.visible');

        // desktop check of expected header cell count
        cy.get('[data-testid="journal-list"] table > thead > tr > th:last-child > div > div').each($el => {
            cy.wrap($el).should('not.have.css', 'display', 'none');
        });

        cy.get('[data-testid="journal-list"]')
            .find('[data-testid="journal-list-header-jnl-title"]')
            .should('be.visible')
            .should('contain', 'Journal title');

        // expect to see open access and highest quartile in less view
        cy.get('[data-testid="journal-list"]')
            .find('[data-testid="journal-list-header-fez-journal-doaj"]')
            .should('be.visible')
            .should('contain', 'Open access');

        cy.get('[data-testid="journal-list"]')
            .find('[data-testid="journal-list-header-highest-quartile"]')
            .should('be.visible')
            .should('contain', 'Highest quartile');

        cy.checkA11y(
            '[data-testid="journal-list"]',
            {
                rules: { 'color-contrast': { enabled: false } },
                reportName: 'Search Journals',
                scopeName: 'Journal list default view',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            },
            violations => console.log(violations),
        );
    });
    it('Renders journal search result table in collapsed view by default for mobile', () => {
        cy.viewport(599, 1000);
        cy.get('input[data-testid="journal-search-keywords-input"]').type('bio', 200);
        cy.get('[data-testid="journal-search-item-addable-title-microbiology-0"]').click();
        cy.get('[data-testid="journal-search-button"]').click();
        cy.get('[data-testid="journal-list"]').should('be.visible');

        // mobile check of expected header cell count
        cy.get('[data-testid="journal-list"] table > thead > tr > th:last-child > div > div').each(($el, index) => {
            if (index === 0) cy.wrap($el).should('not.have.css', 'display', 'none');
            else cy.wrap($el).should('have.css', 'display', 'none');
        });

        cy.get('[data-testid="journal-list"]')
            .find('[data-testid="journal-list-header-jnl-title"]')
            .should('be.visible')
            .should('contain', 'Journal title');

        // expect to see open access and highest quartile in less view for first item
        cy.get('[data-testid="journal-list"]')
            .find('[data-testid="journal-list-header-fez-journal-doaj-0"]')
            .should('be.visible')
            .should('contain', 'Open access');

        cy.get('[data-testid="journal-list"]')
            .find('[data-testid="journal-list-header-highest-quartile-0"]')
            .should('be.visible')
            .should('contain', 'Highest quartile');

        // expect to see open access and highest quartile in less view for last item (10 items per page)
        cy.get('[data-testid="journal-list"]')
            .find('[data-testid="journal-list-header-fez-journal-doaj-9"]')
            .should('be.visible')
            .should('contain', 'Open access');

        cy.get('[data-testid="journal-list"]')
            .find('[data-testid="journal-list-header-highest-quartile-9"]')
            .should('be.visible')
            .should('contain', 'Highest quartile');

        cy.checkA11y(
            '[data-testid="journal-list"]',
            {
                rules: { 'color-contrast': { enabled: false } },
                reportName: 'Search Journals',
                scopeName: 'Journal list default view',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            },
            violations => console.log(violations),
        );
    });

    it('Should not keep any previous search history when navigating from another page', () => {
        cy.get('input[data-testid="journal-search-keywords-input"]').type('bio', 200);
        cy.get('[data-testid="journal-search-item-addable-title-microbiology-0"]').click();
        cy.get('[data-testid="journal-search-button"]').click();
        cy.get('[id=main-menu-button]').click();
        cy.contains('Home').click();
        cy.get('[id=main-menu-button]').click();
        cy.contains('Journal search').click();

        cy.contains('Step 2').should('not.exist');
        cy.get('div[data-testid="journal-search-keyword-list-titles-containing"]').should('not.exist');
        cy.get('div[data-testid="journal-search-keyword-list-keyword-matches"]').should('not.exist');
        cy.get('div[data-testid="journal-search-keyword-list-subjects-field-of-research"]').should('not.exist');
        cy.get('Searching for journals containing').should('not.exist');
        cy.get('[id=journal-search-results-container]').should('not.exist');
    });

    it('Renders journal search result table in expanded desktop view', () => {
        cy.get('input[data-testid="journal-search-keywords-input"]').type('bio', 200);
        cy.get('[data-testid="journal-search-item-addable-title-microbiology-0"]').click();
        cy.get('[data-testid="journal-search-button"]').click();
        cy.get('[data-testid="journal-list"]').should('be.visible');

        assertCollapsiblePanel(0);
        assertCollapsiblePanel(9);
    });

    it('Renders journal search result table in expanded mobile view', () => {
        cy.viewport(599, 1000);
        cy.get('input[data-testid="journal-search-keywords-input"]').type('bio', 200);
        cy.get('[data-testid="journal-search-item-addable-title-microbiology-0"]').click();
        cy.get('[data-testid="journal-search-button"]').click();
        cy.get('[data-testid="journal-list"]').should('be.visible');

        assertCollapsiblePanel(0);
        assertCollapsiblePanel(9);
    });

    const setupInitialSearchAndAssert = () => {
        cy.get('input[data-testid="journal-search-keywords-input"]').type('bio', 200);
        cy.get('[data-testid="journal-search-item-addable-title-glycobiology-3"]').click();
        cy.get('[data-testid="journal-search-item-addable-title-biological-4"]').click();
        cy.get('[data-testid="journal-search-button"]').click();
        cy.get('[data-testid="journal-list"]').should('be.visible');

        cy.get('[data-testid="journal-search-chip-title-glycobiology"]').should('exist');
        cy.get('[data-testid="journal-search-chip-title-biological"]').should('exist');

        cy.location().should(location => {
            expect(location.search).to.contain('keywords%5BTitle-glycobiology');
            expect(location.search).to.contain('keywords%5BTitle-biological');
        });
    };

    const assertInitialViewVisible = () => {
        cy.get('button[data-testid="journal-search-button"]').should('have.attr', 'disabled');
        cy.get('button[data-testid="journal-search-browse-all-button"]').should('not.have.attr', 'disabled');
        cy.get('button[data-testid="journal-search-favourite-journals-button"]').should('not.have.attr', 'disabled');

        cy.get('[data-testid="journal-search-keywords-input"]')
            .invoke('val')
            .should('eq', '');
    };

    context('Handling when the back button is clicked', () => {
        beforeEach(() => {
            setupInitialSearchAndAssert();
        });

        it('restores results and keyword state after a keyword has been deleted', () => {
            const resultsLengthWithOneKeyword = 8;
            const resultsLengthWithTwoKeywords = 4;

            // check we have expected number of mock results
            cy.get('[id^="journal-list-data-col-1-title"]')
                .as('ResultTitles')
                .should('have.length', resultsLengthWithTwoKeywords); // /mock/index.js

            cy.get('[data-testid="journal-search-chip-title-glycobiology"]')
                .find('svg')
                .click();

            cy.get('[data-testid="journal-search-chip-title-glycobiology"]').should('not.exist');
            cy.location().should(location => {
                expect(location.search).not.to.contain('keywords%5BTitle-glycobiology');
            });

            // check we have new expected number of results
            cy.get('@ResultTitles').should('have.length', resultsLengthWithOneKeyword);

            /* maybe check api call is re-made for data */
            cy.go('back');

            cy.location().should(location => {
                expect(location.search).to.contain('keywords%5BTitle-glycobiology');
                expect(location.search).to.contain('keywords%5BTitle-biological');
            });

            cy.get('[data-testid="journal-search-chip-title-glycobiology"]').should('exist');
            cy.get('[data-testid="journal-search-chip-title-biological"]').should('exist');

            // check initial number of results are shown again
            cy.get('@ResultTitles').should('have.length', resultsLengthWithTwoKeywords);

            cy.checkA11y(
                'div.StandardPage',
                {
                    rules: { 'color-contrast': { enabled: false } },
                    reportName: 'Search Journals',
                    scopeName: 'Keyword history restoration after keyword deleted',
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
            cy.get('[id="facet-filter-nested-item-listed-in-cwts"]')
                .as('facetItemCwts')
                .click()
                .find('svg#clear-facet-filter-nested-item-listed-in-cwts')
                .should('exist');
            cy.get('[id="clickable-facet-category-indexed-in"]').click();
            cy.get('[id="facet-filter-nested-item-indexed-in-scopus"]')
                .as('facetItemScopus')
                .click()
                .find('svg#clear-facet-filter-nested-item-indexed-in-scopus')
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
            cy.get('[data-testid="journal-search-chip-title-glycobiology"]')
                .find('svg')
                .click();

            cy.location().should(location => {
                expect(location.search).not.to.contain('CWTS');
                expect(location.search).not.to.contain('Scopus');
            });

            cy.get('@facetItemCwts')
                .find('svg#clear-facet-filter-nested-item-listed-in-cwts')
                .should('not.exist');

            cy.get('@facetItemScopus')
                .find('svg#clear-facet-filter-nested-item-indexed-in-scopus')
                .should('not.exist');

            // check the number of mock results is now showing the new number of expected results (should be different)
            cy.get('@ResultTitles').should('have.length', resultsLengthWithKeywordOnly);

            cy.go('back');

            cy.location().should(location => {
                expect(location.search).to.contain('CWTS');
                expect(location.search).to.contain('Scopus');
            });

            cy.get('@facetItemCwts')
                .find('svg#clear-facet-filter-nested-item-listed-in-cwts')
                .should('exist');

            cy.get('@facetItemScopus')
                .find('svg#clear-facet-filter-nested-item-indexed-in-scopus')
                .should('exist');

            // check the set of mock results is the same as when we first checked
            cy.get('@ResultTitles').should('have.length', resultsLengthWithKeywordAndFacets);

            cy.checkA11y(
                'div.StandardPage',
                {
                    rules: { 'color-contrast': { enabled: false } },
                    reportName: 'Search Journals',
                    scopeName: 'Facet history restoration after keyword removed',
                    includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                },
                violations => console.log(violations),
            );
        });
    });
    context('Handling the Clear functionality', () => {
        beforeEach(() => {
            setupInitialSearchAndAssert();
        });
        it('resets the search functionality and clears results when the clear button is clicked', () => {
            const resultsLengthWithKeywordAndFacets = 4;
            const resultsLengthFullDefaultPage = 10;

            cy.get('[data-testid="journal-search-clear-keywords-button"]').should('exist');

            cy.get('[data-testid="journal-search-facets"]')
                .find('[data-testid="facets-filter"] nav > div')
                .should('have.length', 9);

            // select facets
            cy.get('[id="clickable-facet-category-listed-in"]').click();
            cy.get('[id="facet-filter-nested-item-listed-in-cwts"]')
                .as('facetItemCwts')
                .click()
                .find('svg#clear-facet-filter-nested-item-listed-in-cwts')
                .should('exist');
            cy.get('[id="clickable-facet-category-indexed-in"]').click();
            cy.get('[id="facet-filter-nested-item-indexed-in-scopus"]')
                .as('facetItemScopus')
                .click()
                .find('svg#clear-facet-filter-nested-item-indexed-in-scopus')
                .should('exist');

            // confirm two facets visible selected in the UI
            cy.get('[id^="clear-facet-filter-nested-item').should('have.length', 2);

            // check we have expected number of mock results
            cy.get('[id^="journal-list-data-col-1-title"]')
                .as('ResultTitles')
                .should('have.length', resultsLengthWithKeywordAndFacets); // /mock/index.js

            // update sorting
            scrollToBottom();
            cy.get('[data-testid="publication-list-sorting-sort-by"]').click();
            cy.get('[role="listbox"] > li[data-value="score"]').click();
            cy.get('[data-testid="publication-list-sorting-sort-by"]').should('contain', 'Search relevance');
            assertScrollIsOnTop();

            // update order
            scrollToBottom();
            cy.get('[data-testid="publication-list-sorting-sort-order"]').click();
            cy.get('[role="listbox"] > li[data-value="Desc"]').click();
            cy.get('[data-testid="publication-list-sorting-sort-order"]').should('contain', 'Desc');
            assertScrollIsOnTop();

            // update page size
            scrollToBottom();
            cy.get('[data-testid="publication-list-sorting-page-size"]').click();
            cy.get('[role="listbox"] > li[data-value="20"]').click();
            cy.get('[data-testid="publication-list-sorting-page-size"]').should('contain', '20');
            assertScrollIsOnTop();

            // assert everything selected is in the URL
            cy.location().should(location => {
                expect(location.search).to.contain('keywords%5BTitle-glycobiology');
                expect(location.search).to.contain('keywords%5BTitle-biological');
                expect(location.search).to.contain('CWTS');
                expect(location.search).to.contain('Scopus');
                expect(location.search).to.contain('sortBy=score');
                expect(location.search).to.contain('sortDirection=Desc');
                expect(location.search).to.contain('pageSize=20');
            });

            // clear the search
            cy.get('[data-testid="journal-search-clear-keywords-button"]').click();
            cy.get('[data-testid="journal-search-card"]').should('be.visible');

            // assert nothing previously selected is in the URL
            cy.location().should(location => {
                expect(location.search).to.eq('');
            });

            // assert broadly that step 1 is visible and in default state
            assertInitialViewVisible();

            // as a final check, perform a new search and confirm previous search terms/facets/sorting are not present
            cy.get('input[data-testid="journal-search-keywords-input"]').type('bio', 200);
            cy.get('[data-testid="journal-search-item-addable-title-biology-1"]').click();
            cy.get('[data-testid="journal-search-button"]').click();
            cy.get('[data-testid="journal-list"]').should('be.visible');

            cy.get('[data-testid="journal-search-chip-title-biology"]').should('exist');
            cy.get('@ResultTitles').should('have.length', resultsLengthFullDefaultPage);

            // default sorting
            cy.get('[data-testid="publication-list-sorting-sort-by"]').should('contain', 'Highest quartile');
            cy.get('[data-testid="publication-list-sorting-sort-order"]').should('contain', 'Asc');
            cy.get('[data-testid="publication-list-sorting-page-size"]').should('contain', '10');

            // no facets visible selected in the UI (here we check for any svg 'delete' button next to a selected facet)
            cy.get('[id^="clear-facet-filter-nested-item').should('have.length', 0);

            // nothing in the URL from the previous search
            cy.location().should(location => {
                expect(location.search).not.to.contain('keywords%5BTitle-glycobiology');
                expect(location.search).not.to.contain('keywords%5BTitle-biological');
                expect(location.search).not.to.contain('CWTS');
                expect(location.search).not.to.contain('Scopus');
                expect(location.search).not.to.contain('sortBy=score');
                expect(location.search).not.to.contain('sortDirection=Desc');
                expect(location.search).not.to.contain('pageSize=20');
            });

            cy.checkA11y(
                'div.StandardPage',
                {
                    rules: { 'color-contrast': { enabled: false } },
                    reportName: 'Search Journals',
                    scopeName: 'Clear search results when Clear button clicked',
                    includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                },
                violations => console.log(violations),
            );
        });

        it('resets the search functionality and clears results when the last keyword is deleted', () => {
            const resultsLengthWithOneKeyword = 8;
            const resultsLengthWithTwoKeywords = 4;

            // check we have expected number of mock results
            cy.get('[id^="journal-list-data-col-1-title"]')
                .as('ResultTitles')
                .should('have.length', resultsLengthWithTwoKeywords); // /mock/index.js

            cy.get('[data-testid="journal-search-chip-title-glycobiology"]')
                .find('svg')
                .click();

            cy.get('[data-testid="journal-search-chip-title-glycobiology"]').should('not.exist');
            cy.location().should(location => {
                expect(location.search).not.to.contain('keywords%5BTitle-glycobiology');
            });

            // check we have new expected number of results
            cy.get('@ResultTitles').should('have.length', resultsLengthWithOneKeyword);

            cy.get('[data-testid="journal-search-chip-title-biological"]')
                .find('svg')
                .click();

            cy.get('[data-testid="journal-search-card"]').should('be.visible');

            // assert nothing previously selected is in the URL
            cy.location().should(location => {
                expect(location.search).to.eq('');
            });

            // assert broadly that step 1 is visible and in default state
            assertInitialViewVisible();

            cy.checkA11y(
                'div.StandardPage',
                {
                    rules: { 'color-contrast': { enabled: false } },
                    reportName: 'Search Journals',
                    scopeName: 'Clears results when the last keyword is deleted',
                    includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                },
                violations => console.log(violations),
            );
        });
    });

    context('Handles Browse All Journals functionality', () => {
        it('shows All Journals when the Browse All Journals button is clicked in Search Results', () => {
            const resultsLengthWithAllResults = 10;
            const resultsLengthWithTwoKeywords = 4;

            setupInitialSearchAndAssert();

            // check we have expected number of mock results
            cy.get('[id^="journal-list-data-col-1-title"]')
                .as('ResultTitles')
                .should('have.length', resultsLengthWithTwoKeywords); // /mock/index.js

            cy.get('[data-testid="journal-search-chip-title-glycobiology"]').should('exist');
            cy.get('[data-testid="journal-search-chip-title-biological"]').should('exist');

            cy.location().should(location => {
                expect(location.search).to.contain('keywords%5BTitle-glycobiology');
                expect(location.search).to.contain('keywords%5BTitle-biological');
                expect(location.search).not.to.contain('keywords%5BKeyword-all-journals');
            });

            cy.get('[data-testid="journal-search-browse-all-button"]')
                .should('exist')
                .click();

            cy.get('[data-testid="journal-search-chip-title-glycobiology"]').should('not.exist');
            cy.get('[data-testid="journal-search-chip-title-biological"]').should('not.exist');

            cy.location().should(location => {
                expect(location.search).not.to.contain('keywords%5BTitle-glycobiology');
                expect(location.search).not.to.contain('keywords%5BTitle-biological');
                expect(location.search).to.contain('keywords%5BKeyword-all-journals');
            });

            cy.get('[data-testid="journal-search-browse-all-button"]').should('not.exist');

            cy.get('[data-testid="journal-search-chip-keyword-all-journals"]').should('exist');

            // check we have new expected number of results
            cy.get('@ResultTitles').should('have.length', resultsLengthWithAllResults);

            cy.checkA11y(
                'div.StandardPage',
                {
                    rules: { 'color-contrast': { enabled: false } },
                    reportName: 'Search Journals',
                    scopeName: 'Browse All Journals from search results page',
                    includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                },
                violations => console.log(violations),
            );
        });

        it('shows All Journals when the Browse All Journals button is clicked from the initial Journal Search page', () => {
            const resultsLengthWithAllResults = 10;
            const resultsLengthWithOneKeyword = 8;

            // assert broadly that step 1 is visible and in default state
            assertInitialViewVisible();

            cy.get('[data-testid="journal-search-browse-all-button"]')
                .should('exist')
                .click();

            cy.location().should(location => {
                expect(location.search).to.contain('keywords%5BKeyword-all-journals');
            });

            cy.get('[data-testid="journal-search-browse-all-button"]').should('not.exist');

            cy.get('[data-testid="journal-search-chip-keyword-all-journals"]').should('exist');

            // check we have expected number of mock results
            cy.get('[id^="journal-list-data-col-1-title"]')
                .as('ResultTitles')
                .should('have.length', resultsLengthWithAllResults); // /mock/index.js

            // clear the search
            cy.get('[data-testid="journal-search-clear-keywords-button"]').click();

            cy.get('[data-testid="journal-search-card"]').should('be.visible');

            // assert nothing previously selected is in the URL
            cy.location().should(location => {
                expect(location.search).to.eq('');
            });

            // perform a normal search
            cy.get('input[data-testid="journal-search-keywords-input"]').type('bio', 200);
            cy.get('[data-testid="journal-search-item-addable-title-biological-4"]').click();
            cy.get('[data-testid="journal-search-button"]').click();
            cy.get('[data-testid="journal-list"]').should('be.visible');

            cy.get('[data-testid="journal-search-chip-title-biological"]').should('exist');
            cy.get('[data-testid="journal-search-chip-keyword-all-journals"]').should('not.exist');

            cy.location().should(location => {
                expect(location.search).to.contain('keywords%5BTitle-biological');
                expect(location.search).not.to.contain('keywords%5BKeyword-all-journals');
            });

            // check we have new expected number of results
            cy.get('@ResultTitles').should('have.length', resultsLengthWithOneKeyword);

            cy.get('[data-testid="journal-search-browse-all-button"]')
                .should('exist')
                .click();

            cy.get('[data-testid="journal-search-chip-title-biological"]').should('not.exist');
            cy.get('[data-testid="journal-search-chip-keyword-all-journals"]').should('exist');

            cy.location().should(location => {
                expect(location.search).not.to.contain('keywords%5BTitle-biological');
                expect(location.search).to.contain('keywords%5BKeyword-all-journals');
            });

            cy.get('[data-testid="journal-search-browse-all-button"]').should('not.exist');

            // check we have new expected number of results
            cy.get('@ResultTitles').should('have.length', resultsLengthWithAllResults);

            cy.checkA11y(
                'div.StandardPage',
                {
                    rules: { 'color-contrast': { enabled: false } },
                    reportName: 'Search Journals',
                    scopeName: 'Browse All Journals from the initial search view',
                    includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                },
                violations => console.log(violations),
            );
        });

        it('should clear error alert from a previous api error', () => {
            // make a search that will yield a mocked 500 error
            cy.get('input[data-testid="journal-search-keywords-input"]').type('api-500-error', 200);
            cy.get('[data-testid="alert"]').should('exist');
            cy.get('[data-testid="alert"]').should('be.visible');
            cy.get('[data-testid="alert"]').should('contain.text', 'Unexpected error');

            cy.get('[data-testid="clear-journal-search-keywords"]').click();
            cy.get('input[data-testid="journal-search-keywords-input"]').type('tech', 200);
            // make sure the error alert raise for the previous search is dismissed
            cy.get('[data-testid="alert"]').should('not.exist');
        });
    });
});
