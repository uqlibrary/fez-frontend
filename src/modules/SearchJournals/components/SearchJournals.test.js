import React from 'react';
import { fireEvent, render, WithReduxStore, WithRouter, createMatchMedia, within, waitFor } from 'test-utils';
import { pathConfig } from 'config';
import Immutable from 'immutable';
import * as actions from 'actions/journals.js';

import { initialJournalSearchKeywords, initialState } from 'reducers/journals';

import SearchJournals, { areKeywordsDifferent } from './SearchJournals';
import {
    mockData,
    mockDataWithFilterFacets,
    mockDataWithFilterFacetsAndPagination,
} from 'mock/data/testing/journals/journalSearchResults';

const mockUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockUseNavigate,
}));

window.dataLayer = { push: jest.fn() };

const setup = ({ state = {}, storeState = {}, route = '/', initialEntries = [route] } = {}) => {
    return render(
        <WithReduxStore
            initialState={Immutable.Map({
                searchJournalsReducer: state,
                journalReducer: {
                    ...initialState,
                    isInitialValues: false,
                    ...storeState,
                    journalSearchKeywords: { ...initialJournalSearchKeywords, ...storeState.journalSearchKeywords },
                },
            })}
        >
            <WithRouter route={route} initialEntries={initialEntries}>
                <SearchJournals {...state} />
            </WithRouter>
        </WithReduxStore>,
    );
};

describe('SearchJournals', () => {
    afterEach(() => {
        mockUseNavigate.mockClear();
    });

    it('should render', () => {
        const { queryByTestId } = setup();
        expect(queryByTestId('journal-search-page')).toBeInTheDocument();
        expect(queryByTestId('journal-search-intro-card')).toBeInTheDocument();
        expect(queryByTestId('journal-search-card')).toBeInTheDocument();
        expect(queryByTestId('journal-search-results-container')).not.toBeInTheDocument();
    });

    it('should return false when keywords are the same', () => {
        const testKeywordsSet1 = {
            'Keyword-biochemistry': {
                type: 'Keyword',
                text: 'biochemistry',
                id: 'Keyword-biochemistry',
            },
        };
        const testKeywordsSet2 = { ...testKeywordsSet1 };

        const testResult = areKeywordsDifferent(testKeywordsSet1, testKeywordsSet2);

        expect(testResult).toEqual(false);
    });

    it('should return false when keywords are both empty', () => {
        const testResult = areKeywordsDifferent();

        expect(testResult).toEqual(false);
    });

    it('should return true when keywords are the different', () => {
        const testKeywordsSet1 = {
            'Keyword-biochemistry': {
                type: 'Keyword',
                text: 'biochemistry',
                id: 'Keyword-biochemistry',
            },
        };
        const testKeywordsSet2 = {
            'Keyword-biohazards': {
                type: 'Keyword',
                text: 'biohazards',
                id: 'Keyword-biohazards',
            },
        };

        const testResult = areKeywordsDifferent(testKeywordsSet1, testKeywordsSet2);

        expect(testResult).toEqual(true);
    });

    it('should render set of results via selecting a keyword and clicking the "Step 3: Search" button', async () => {
        const testQuerySearchAstrobiology =
            'keywords%5BKeyword-astrobiology%5D%5Btype%5D=Keyword&keywords%5BKeyword-astrobiology%5D%5Btext%5D=astrobiology&keywords%5BKeyword-astrobiology%5D%5Bid%5D=Keyword-astrobiology' +
            '&keywords%5BSubject-451926%5D%5Btype%5D=Subject&keywords%5BSubject-451926%5D%5Btext%5D=0304+Medicinal+and+Biomolecular+Chemistry&keywords%5BSubject-451926%5D%5BcvoId%5D=451926&keywords%5BSubject-451926%5D%5Bid%5D=Subject-451926';

        const journalsList = mockData;

        const { queryByTestId } = setup({
            state: { journalsListLoaded: true, journalsList },
            storeState: {
                journalSearchKeywords: {
                    exactMatch: [{ keyword: 'Astrobiology', title: 'Astrobiology', href: '/journal/view/undefined' }],
                    keywordMatch: [{ keyword: 'astrobiology' }],
                    subjectMatch: [
                        {
                            keyword: '0304 Medicinal and Biomolecular Chemistry',
                            cvoId: 451926,
                            sources: [{ name: 'ERA', index: 'ERA' }],
                        },
                    ],
                },
            },
        });

        expect(queryByTestId('journal-search-item-addable-keyword-astrobiology-0')).toBeInTheDocument();
        expect(
            queryByTestId('journal-search-item-addable-subject-0304-medicinal-and-biomolecular-chemistry-0'),
        ).toBeInTheDocument();

        fireEvent.click(queryByTestId('journal-search-item-addable-keyword-astrobiology-0'));
        fireEvent.click(
            queryByTestId('journal-search-item-addable-subject-0304-medicinal-and-biomolecular-chemistry-0'),
        );

        expect(mockUseNavigate).toHaveBeenLastCalledWith(
            {
                pathname: pathConfig.journals.search,
                search: testQuerySearchAstrobiology,
            },
            { state: { scrollToTop: false } },
        );

        expect(queryByTestId('journal-search-button')).not.toHaveAttribute('disabled');

        fireEvent.click(queryByTestId('journal-search-button'));

        expect(queryByTestId('journal-search-chip-keyword-astrobiology')).toBeInTheDocument();
        expect(
            queryByTestId('journal-search-chip-subject-0304-medicinal-and-biomolecular-chemistry'),
        ).toBeInTheDocument();

        await waitFor(() => queryByTestId('641-astrobiology-link'));
        expect(queryByTestId('641-astrobiology-link')).toBeInTheDocument();
    });

    it('should clear a set of results via the clear all "X" button', async () => {
        const testQuerySearchAstrobiology =
            'keywords%5BKeyword-astrobiology%5D%5Btype%5D=Keyword&keywords%5BKeyword-astrobiology%5D%5Btext%5D=astrobiology&keywords%5BKeyword-astrobiology%5D%5Bid%5D=Keyword-astrobiology';

        const path = pathConfig.journals.search;

        const journalsList = mockData;

        const { queryByTestId, getByText, queryByText } = setup({
            state: { journalsListLoaded: true, journalsList },
            storeState: {
                journalSearchKeywords: {
                    exactMatch: [{ keyword: 'Astrobiology', title: 'Astrobiology', href: '/journal/view/undefined' }],
                    keywordMatch: [{ keyword: 'astrobiology' }],
                },
            },
        });

        expect(queryByTestId('journal-search-item-addable-keyword-astrobiology-0')).toBeInTheDocument();
        fireEvent.click(queryByTestId('journal-search-item-addable-keyword-astrobiology-0'));

        expect(mockUseNavigate).toHaveBeenLastCalledWith(
            {
                pathname: path,
                search: testQuerySearchAstrobiology,
            },
            { state: { scrollToTop: false } },
        );

        expect(queryByTestId('journal-search-button')).not.toHaveAttribute('disabled');

        fireEvent.click(queryByTestId('journal-search-button'));

        expect(queryByTestId('journal-search-chip-keyword-astrobiology')).toBeInTheDocument();

        await waitFor(() => queryByTestId('641-astrobiology-link'));

        expect(queryByTestId('641-astrobiology-link')).toBeInTheDocument();

        expect(queryByTestId('journal-search-clear-keywords-button')).toBeInTheDocument();

        fireEvent.click(queryByTestId('journal-search-clear-keywords-button'));

        expect(mockUseNavigate).toHaveBeenLastCalledWith(
            {
                pathname: path,
                search: '',
            },
            { state: { scrollToTop: false } },
        );

        expect(queryByTestId('journal-search-chip-keyword-astrobiology')).not.toBeInTheDocument();
        expect(queryByTestId('641-astrobiology-link')).not.toBeInTheDocument();
        expect(
            getByText('Enter a journal title, ISSN, keyword, subject or field of research code'),
        ).toBeInTheDocument();

        expect(queryByText('Step 2.')).not.toBeInTheDocument();
    });

    it('should show all journals if appropriate keyword detected in URL on page load', () => {
        const initialEntries = [
            // eslint-disable-next-line max-len
            '/?keywords%5BKeyword-all-journals%5D%5Btype%5D=Keyword&keywords%5BKeyword-all-journals%5D%5Btext%5D=all+journals&keywords%5BKeyword-all-journals%5D%5Bid%5D=Keyword-all-journals',
        ];

        const journalsList = mockData;

        const { queryByTestId } = setup({
            state: { journalsListLoaded: true, journalsList },
            initialEntries,
        });

        expect(queryByTestId('journal-search-chip-keyword-all-journals')).toBeInTheDocument();
        expect(queryByTestId('13251-international-journal-of-astrobiology-link')).toBeInTheDocument();
        expect(queryByTestId('641-astrobiology-link')).toBeInTheDocument();
    });

    it('should correctly update the URL with "all journals" keywords and show "all journals" keyword button on screen', () => {
        const testQuerySearchAllJournals =
            'keywords%5BKeyword-all-journals%5D%5Btype%5D=Keyword&keywords%5BKeyword-all-journals%5D%5Btext%5D=all+journals&keywords%5BKeyword-all-journals%5D%5Bid%5D=Keyword-all-journals';

        const { queryByTestId } = setup({});

        expect(queryByTestId('journal-search-browse-all-button')).toBeInTheDocument();

        fireEvent.click(queryByTestId('journal-search-browse-all-button'));

        expect(mockUseNavigate).toHaveBeenCalledWith(
            {
                pathname: pathConfig.journals.search,
                search: testQuerySearchAllJournals,
            },
            { state: { scrollToTop: false } },
        );

        expect(queryByTestId('journal-search-browse-all-button')).not.toBeInTheDocument();
        expect(queryByTestId('journal-search-chip-keyword-all-journals')).toBeInTheDocument();
    });

    /* Commented out test due bug in test cases causing 404 page not found error */

    it('should handle "all journals" keyword deletion', () => {
        const initialEntries = [
            '/?keywords%5BKeyword-all-journals%5D%5Btype%5D=Keyword&keywords%5BKeyword-all-journals%5D%5Btext%5D=all+journals&keywords%5BKeyword-all-journals%5D%5Bid%5D=Keyword-all-journals',
        ];
        const path = pathConfig.journals.search;

        const journalsList = mockData;

        const { container, queryByTestId, queryByText } = setup({
            state: { journalsListLoaded: true, journalsList },
            initialEntries,
        });

        expect(queryByTestId('journal-search-chip-keyword-all-journals')).toBeInTheDocument();

        fireEvent.click(container.querySelector('#journal-search-chip-keyword-all-journals > svg'));

        expect(mockUseNavigate).toHaveBeenCalledWith({ pathname: path, search: '' }, { state: { scrollToTop: false } });

        expect(queryByText('Step 2.')).not.toBeInTheDocument();
    });

    it('should update results when Favourite Journals facet clicked', () => {
        // Note: test here to gain 100% coverage in src/modules/SearchJournals/hooks.js
        window.matchMedia = createMatchMedia(1024);

        const queryString =
            'keywords%5BKeyword-all-journals%5D%5Btype%5D=Keyword&keywords%5BKeyword-all-journals%5D%5Btext%5D=all+journals&keywords%5BKeyword-all-journals%5D%5Bid%5D=Keyword-all-journals';

        const initialEntries = [`/?${queryString}`];
        const path = pathConfig.journals.search;

        const { getByTestId, queryByTestId } = setup({
            state: { journalsListLoaded: true, journalsList: mockDataWithFilterFacets },
            initialEntries,
        });
        const facetItemTestId = 'facet-filter-nested-item-showfavouritedonly-show-journals-favourited';
        const clearFacetItemTestId = 'clear-facet-filter-nested-item-showfavouritedonly-show-journals-favourited';

        // expand Favourite catageory
        fireEvent.click(getByTestId('clickable-facet-category-showfavouritedonly'));

        expect(getByTestId(facetItemTestId)).toBeVisible();
        expect(queryByTestId(clearFacetItemTestId)).not.toBeInTheDocument();

        fireEvent.click(getByTestId(facetItemTestId));

        expect(getByTestId(clearFacetItemTestId)).toBeVisible();

        expect(mockUseNavigate).toHaveBeenCalledWith(
            { pathname: path, search: `${queryString}&activeFacets%5Bfilters%5D%5BShowFavouritedOnly%5D=true&page=1` },
            { state: {} },
        );
    });

    it('should update querystring when filters are changed', () => {
        // Note: test here to gain 100% coverage in src/modules/SearchJournals/hooks.js
        window.matchMedia = createMatchMedia(1024);

        const queryString =
            'keywords%5BKeyword-all-journals%5D%5Btype%5D=Keyword&keywords%5BKeyword-all-journals%5D%5Btext%5D=all+journals&keywords%5BKeyword-all-journals%5D%5Bid%5D=Keyword-all-journals';
        const initialEntries = [`/?${queryString}`];
        const path = pathConfig.journals.search;

        const { getByRole, queryByTestId } = setup({
            state: { journalsListLoaded: true, journalsList: mockDataWithFilterFacetsAndPagination },
            initialEntries,
        });

        // expect(container).toMatchSnapshot();
        // sortBy
        expect(queryByTestId('publication-list-sorting-sort-by')).toBeInTheDocument();
        fireEvent.mouseDown(within(queryByTestId('publication-list-sorting-sort-by')).getByRole('combobox'));

        expect(getByRole('listbox')).toBeInTheDocument();
        fireEvent.click(queryByTestId('publication-list-sorting-sort-by-option-0'));
        expect(mockUseNavigate).toHaveBeenCalledWith(
            {
                pathname: path,
                search: `${queryString}&sortBy=title&sortDirection=Asc`,
            },
            { state: {} },
        );

        // sortOrder
        expect(queryByTestId('publication-list-sorting-sort-order')).toBeInTheDocument();
        fireEvent.mouseDown(within(queryByTestId('publication-list-sorting-sort-order')).getByRole('combobox'));
        expect(getByRole('listbox')).toBeInTheDocument();
        fireEvent.click(queryByTestId('publication-list-sorting-sort-order-option-0'));
        expect(mockUseNavigate).toHaveBeenCalledWith(
            {
                pathname: path,
                search: `${queryString}&sortBy=title&sortDirection=Desc`,
            },
            { state: {} },
        );

        // pageSize
        expect(queryByTestId('publication-list-sorting-page-size')).toBeInTheDocument();
        fireEvent.mouseDown(within(queryByTestId('publication-list-sorting-page-size')).getByRole('combobox'));
        expect(getByRole('listbox')).toBeInTheDocument();
        fireEvent.click(queryByTestId('publication-list-sorting-page-size-option-100'));
        expect(mockUseNavigate).toHaveBeenCalledWith(
            {
                pathname: path,
                search: `${queryString}&pageSize=100&page=1`,
            },
            { state: {} },
        );

        // export
        const exportJournals = jest.spyOn(actions, 'exportJournals');
        expect(queryByTestId('export-publications-format')).toBeInTheDocument();
        fireEvent.mouseDown(within(queryByTestId('export-publications-format')).getByRole('combobox'));
        expect(getByRole('listbox')).toBeInTheDocument();
        fireEvent.click(queryByTestId('export-publication-option-0'));
        expect(exportJournals).toHaveBeenCalled();

        // change page
        expect(queryByTestId('search-journals-paging-top-select-page-2')).toBeInTheDocument();

        fireEvent.click(queryByTestId('search-journals-paging-top-select-page-2'));

        expect(mockUseNavigate).toHaveBeenCalledWith(
            {
                pathname: path,
                search: `${queryString}&page=2`,
            },
            { state: {} },
        );
    });

    it('should clear state on dismount', () => {
        const spy = jest.spyOn(actions, 'clearJournalSearchKeywords');
        const { unmount, queryByText } = setup({
            state: { journalsListLoaded: true, mockData },
            storeState: {
                journalSearchKeywords: {
                    exactMatch: [{ keyword: 'Astrobiology', title: 'Astrobiology', href: '/journal/view/undefined' }],
                },
            },
        });
        expect(queryByText('Astrobiology')).toBeInTheDocument();
        // change page
        unmount();
        expect(spy).toHaveBeenCalledTimes(1);
    });
});
