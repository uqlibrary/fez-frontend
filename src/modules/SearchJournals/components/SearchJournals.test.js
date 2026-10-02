import React from 'react';
import {
    act,
    fireEvent,
    render as defaultRender,
    WithReduxStore,
    WithRouter,
    createMatchMedia,
    within,
    waitFor,
    userEvent,
    waitForText,
} from 'test-utils';
import { pathConfig } from 'config';
import * as actions from 'actions/journals.js';
import * as searchJournalHooks from '../hooks';

import { initialJournalSearchKeywords, initialState, keywordOnlySuffix } from 'reducers/journals';

import SearchJournals, { areKeywordsDifferent } from './SearchJournals';
import { mockData, mockDataWithFilterFacetsAndPagination } from 'mock/data/testing/journals/journalSearchResults';

const mockUseNavigate = jest.fn();
const mockUseLocation = jest.fn(jest.requireActual('react-router').useLocation);
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => mockUseNavigate,
    useLocation: () => mockUseLocation(),
}));

window.dataLayer = { push: jest.fn() };

const setup = ({ state = {}, storeState = {}, route = '/', initialEntries = [route] } = {}, render = defaultRender) => {
    return render(
        <WithReduxStore
            initialState={{
                searchJournalsReducer: state,
                journalReducer: {
                    ...initialState,
                    isInitialValues: false,
                    ...storeState,
                    journalSearchKeywords: { ...initialJournalSearchKeywords, ...storeState.journalSearchKeywords },
                },
            }}
        >
            <WithRouter route={route} initialEntries={initialEntries}>
                <SearchJournals {...state} />
            </WithRouter>
        </WithReduxStore>,
        render === defaultRender ? undefined : undefined,
    );
};

describe('SearchJournals', () => {
    const keywordSearch = (...names) =>
        `?${names
            .map(
                n =>
                    `keywords%5BKeyword-${n}%5D%5Btype%5D=Keyword&keywords%5BKeyword-${n}%5D%5Btext%5D=${n}&keywords%5BKeyword-${n}%5D%5Bid%5D=Keyword-${n}&keywords%5BKeyword-${n}%5D%5Boperand%5D=AND`,
            )
            .join('&')}`;

    afterEach(() => {
        jest.clearAllMocks();
        jest.useRealTimers();
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

    it('should show all journals if appropriate keyword detected in URL on page load', () => {
        const initialEntries = [
            '/?keywords%5BKeyword-all-journals%5D%5Btype%5D=Keyword&keywords%5BKeyword-all-journals%5D%5Btext%5D=all+journals&keywords%5BKeyword-all-journals%5D%5Bid%5D=Keyword-all-journals&keywords%5BKeyword-all-journals%5D%5Boperand%5D=AND',
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
            'keywords%5BKeyword-all-journals%5D%5Btype%5D=Keyword&keywords%5BKeyword-all-journals%5D%5Btext%5D=all+journals&keywords%5BKeyword-all-journals%5D%5Bid%5D=Keyword-all-journals&keywords%5BKeyword-all-journals%5D%5Boperand%5D=AND';

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

    it('should cover updater branches when URL has no keywords', () => {
        const setSelectedKeywordsMock = jest.fn(updater => {
            if (typeof updater === 'function') {
                // Cover fallback branch for `prevSelectedKeywords || {}`
                updater(undefined);
                // Cover true branch returning `{}` when previous keywords exist
                updater({ 'Keyword-existing': { id: 'Keyword-existing' } });
            }
        });

        const useSelectedKeywordsSpy = jest.spyOn(searchJournalHooks, 'useSelectedKeywords');

        try {
            useSelectedKeywordsSpy.mockImplementation(() => ({
                selectedKeywords: {},
                setSelectedKeywords: setSelectedKeywordsMock,
                handleKeywordAdd: jest.fn(),
                handleKeywordUpdate: jest.fn(),
                handleKeywordDelete: jest.fn(),
                hasAnySelectedKeywords: false,
            }));

            setup({ route: '/' });

            expect(setSelectedKeywordsMock).toHaveBeenCalled();
        } finally {
            useSelectedKeywordsSpy.mockRestore();
        }
    });

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

    it('should remove "all journals" keyword when adding a subject to the search criteria', async () => {
        jest.spyOn(actions, 'searchJournals').mockReturnValue(() => Promise.resolve({ ...mockData }));
        const { queryByTestId, getByText } = setup({
            state: {
                journalsListLoaded: true,
                journalsList: { ...mockData },
            },
            storeState: {
                [keywordOnlySuffix]: {
                    journalSearchKeywords: {
                        subjectFuzzyMatch: [
                            {
                                jnl_subject_cvo_id: 41000,
                                jnl_subject_sources: 'ERA',
                                jnl_subject_title: '1000 General',
                            },
                        ],
                    },
                },
            },
            initialEntries: [
                '/?keywords%5BKeyword-all-journals%5D%5Btype%5D=Keyword&keywords%5BKeyword-all-journals%5D%5Btext%5D=all+journals&keywords%5BKeyword-all-journals%5D%5Bid%5D=Keyword-all-journals',
            ],
        });

        await userEvent.click(queryByTestId('add-to-subject-selection-button'));
        await waitFor(() => expect(queryByTestId('for-code-autocomplete-field-input')).toBeInTheDocument());
        await userEvent.type(queryByTestId('for-code-autocomplete-field-input'), 'Gene');
        await waitForText('1000 General');
        await userEvent.click(getByText('1000 General'));
        await waitFor(() => expect(queryByTestId('journal-search-chip-subject-1000-general')).toBeInTheDocument());
        expect(queryByTestId('journal-search-chip-keyword-all-journals')).not.toBeInTheDocument();
    });

    it('should update querystring when operands are changed', () => {
        const queryStringPartial =
            'keywords%5BTitle-microbiology%5D%5Btype%5D=Title&keywords%5BTitle-microbiology%5D%5Btext%5D=microbiology&keywords%5BTitle-microbiology%5D%5Bid%5D=Title-microbiology&keywords%5BTitle-microbiology%5D%5Boperand%5D=OR&keywords%5BKeyword-biochemistry%5D%5Btype%5D=Keyword&keywords%5BKeyword-biochemistry%5D%5Btext%5D=biochemistry&keywords%5BKeyword-biochemistry%5D%5Bid%5D=Keyword-biochemistry&keywords%5BKeyword-biochemistry%5D%5Boperand%5D=';
        const initialEntries = [`/?${queryStringPartial}AND`];
        const path = pathConfig.journals.search;

        const { getByRole, getByTestId } = setup({
            state: { journalsListLoaded: true, journalsList: mockDataWithFilterFacetsAndPagination },
            initialEntries,
        });

        expect(getByTestId('operand-chip-keyword-biochemistry')).toHaveTextContent('AND');
        fireEvent.click(getByTestId('operand-chip-keyword-biochemistry'));
        fireEvent.click(within(getByRole('menu')).getByText('OR'));
        expect(getByTestId('operand-chip-keyword-biochemistry')).toHaveTextContent('OR');

        expect(mockUseNavigate).toHaveBeenCalledWith(
            {
                pathname: path,
                search: `${queryStringPartial}OR`,
            },
            { state: { scrollToTop: false } },
        );
    });

    it('should update querystring when filters are changed', () => {
        // Note: test here to gain 100% coverage in src/modules/SearchJournals/hooks.js
        window.matchMedia = createMatchMedia(1024);

        const queryString =
            'keywords%5BKeyword-all-journals%5D%5Btype%5D=Keyword&keywords%5BKeyword-all-journals%5D%5Btext%5D=all+journals&keywords%5BKeyword-all-journals%5D%5Bid%5D=Keyword-all-journals&keywords%5BKeyword-all-journals%5D%5Boperand%5D=AND';
        const initialEntries = [`/?${queryString}`];
        const path = pathConfig.journals.search;

        const { getByRole, queryByTestId } = setup({
            state: { journalsListLoaded: true, journalsList: mockDataWithFilterFacetsAndPagination },
            initialEntries,
        });

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

    describe('unmount', () => {
        it('should not dispatch clearJournalSearchKeywords on unmount', () => {
            const clearSpy = jest.spyOn(actions, 'clearJournalSearchKeywords');
            mockUseLocation.mockReturnValue({ pathname: '/', search: '' });
            const { unmount } = setup();

            clearSpy.mockClear();
            unmount();

            expect(clearSpy).not.toHaveBeenCalled();
        });

        it('should cancel a pending delayed search on unmount', () => {
            jest.useFakeTimers();
            const searchJournalsSpy = jest.spyOn(actions, 'searchJournals');
            mockUseLocation.mockReturnValue({ pathname: '/', search: keywordSearch('bioscience', 'biochemistry') });

            const { getByTestId, rerender, unmount } = setup({
                state: { journalsListLoaded: true, journalsList: mockData },
            });

            act(() => {
                jest.advanceTimersByTime(0);
            });
            expect(searchJournalsSpy).toHaveBeenCalled();
            searchJournalsSpy.mockClear();

            // deleting a schedules a search delayed by 1200ms
            fireEvent.click(getByTestId('journal-search-chip-keyword-biochemistry').querySelector('svg'));
            mockUseLocation.mockReturnValue({ pathname: '/', search: keywordSearch('bioscience') });
            setup({ state: { journalsListLoaded: true, journalsList: mockData } }, rerender);
            unmount();
            act(() => {
                jest.advanceTimersByTime(1500);
            });

            expect(searchJournalsSpy).not.toHaveBeenCalled();
        });
    });

    describe('on navigation', () => {
        it('should return to the keyword search after Browse All Journals then browser back', async () => {
            const searchJournalsSpy = jest.spyOn(actions, 'searchJournals');
            const bioscienceSearch =
                '?keywords%5BKeyword-bioscience%5D%5Btype%5D=Keyword&keywords%5BKeyword-bioscience%5D%5Btext%5D=bioscience&keywords%5BKeyword-bioscience%5D%5Bid%5D=Keyword-bioscience&keywords%5BKeyword-bioscience%5D%5Boperand%5D=AND';
            const allJournalsSearch =
                '?keywords%5BKeyword-all-journals%5D%5Btype%5D=Keyword&keywords%5BKeyword-all-journals%5D%5Btext%5D=all+journals&keywords%5BKeyword-all-journals%5D%5Bid%5D=Keyword-all-journals&keywords%5BKeyword-all-journals%5D%5Boperand%5D=AND';

            mockUseLocation.mockReturnValue({ pathname: '/', search: bioscienceSearch });
            const { rerender } = setup({ state: { journalsListLoaded: true, journalsList: mockData } });

            await waitFor(() =>
                expect(searchJournalsSpy).toHaveBeenCalledWith(
                    expect.objectContaining({
                        keywords: expect.objectContaining({ 'Keyword-bioscience': expect.anything() }),
                    }),
                ),
            );
            searchJournalsSpy.mockClear();

            // Browse All Journals clicked - app navigates, URL becomes the all-journals URL
            mockUseLocation.mockReturnValue({ pathname: '/', search: allJournalsSearch });
            setup({ state: { journalsListLoaded: true, journalsList: mockData } }, rerender);

            await waitFor(() =>
                expect(searchJournalsSpy).toHaveBeenCalledWith(
                    expect.not.objectContaining({ keywords: expect.anything() }),
                ),
            );
            searchJournalsSpy.mockClear();

            // browser Back - URL reverts to the bioscience search
            mockUseLocation.mockReturnValue({ pathname: '/', search: bioscienceSearch });
            setup({ state: { journalsListLoaded: true, journalsList: mockData } }, rerender);

            await waitFor(() =>
                expect(searchJournalsSpy).toHaveBeenCalledWith(
                    expect.objectContaining({
                        keywords: expect.objectContaining({ 'Keyword-bioscience': expect.anything() }),
                    }),
                ),
            );
        });

        it('should sync selected keywords from a URL change (e.g. browser back/forward) without calling navigate', () => {
            mockUseLocation.mockReturnValue({ pathname: '/', search: keywordSearch('bioscience') });
            const { rerender } = setup({ state: { journalsListLoaded: true, journalsList: mockData } });
            mockUseNavigate.mockClear();

            // e.g. browser back/forward
            mockUseLocation.mockReturnValue({ pathname: '/', search: keywordSearch('biochemistry') });
            setup({ state: { journalsListLoaded: true, journalsList: mockData } }, rerender);

            expect(mockUseNavigate).not.toHaveBeenCalled();
        });

        it('should keep the 1200ms debounce and not mutate query params after deleting a keyword with paging/sorting', () => {
            jest.useFakeTimers();
            // simulate a hook returning a stable params reference per query
            const hooks = require('../hooks');
            const originalUseJournalSearch = hooks.useJournalSearch;
            const stableParams = {};
            jest.spyOn(hooks, 'useJournalSearch').mockImplementation(() => {
                const real = originalUseJournalSearch();
                const key = JSON.stringify(real.journalSearchQueryParams);
                stableParams[key] = stableParams[key] || real.journalSearchQueryParams;
                return { ...real, journalSearchQueryParams: stableParams[key] };
            });
            const searchJournalsSpy = jest.spyOn(actions, 'searchJournals');
            const paging = '&page=2&pageSize=50&sortBy=title&sortDirection=Asc';
            const state = { journalsListLoaded: true, journalsList: mockData };

            mockUseLocation.mockReturnValue({
                pathname: '/',
                search: `${keywordSearch('bioscience', 'biochemistry')}${paging}`,
            });
            const { getByTestId, rerender } = setup({ state });
            act(() => {
                jest.advanceTimersByTime(0);
            });
            searchJournalsSpy.mockClear();

            fireEvent.click(getByTestId('journal-search-chip-keyword-biochemistry').querySelector('svg'));
            mockUseLocation.mockReturnValue({ pathname: '/', search: `${keywordSearch('bioscience')}${paging}` });
            setup({ state }, rerender);
            // extra render, same URL
            setup({ state }, rerender);

            act(() => {
                jest.advanceTimersByTime(1100);
            });
            expect(searchJournalsSpy).not.toHaveBeenCalled();

            act(() => {
                jest.advanceTimersByTime(200);
            });
            expect(searchJournalsSpy).toHaveBeenCalledTimes(1);
            expect(searchJournalsSpy).toHaveBeenCalledWith(expect.not.objectContaining({ page: expect.anything() }));
            // the hook's params object must not be mutated
            Object.values(stableParams).forEach(params => expect(params).toHaveProperty('page', '2'));
        });
    });
});
