import React from 'react';
import { render, WithRouter, WithReduxStore, fireEvent, within } from 'test-utils';

import { pathConfig } from 'config';
import { createMemoryHistory } from 'history';
import Immutable from 'immutable';
import locale from 'locale/components';
import deparam from 'can-deparam';

import JournalSearchResult, { getSearchResultSortingParams } from './JournalSearchResult';
import { mockDataEmpty, mockData } from 'mock/data/testing/journals/journalSearchResults';

const setup = ({
    state = {},
    testHistory = createMemoryHistory({ initialEntries: ['/'] }),
    onSearchFn = jest.fn(),
}) => {
    return render(
        <WithRouter history={testHistory}>
            <WithReduxStore initialState={Immutable.Map({ searchJournalsReducer: state })}>
                <JournalSearchResult onSearch={onSearchFn} />
            </WithReduxStore>
        </WithRouter>,
    );
};

describe('Search Journals Results component', () => {
    it("should show 'No journals found' when no results are present", () => {
        const testQueryPart =
            'keywords%5BTitle-Astrobiology%5D%5Btype%5D=Title&keywords%5BTitle-Astrobiology%5D%5Btext%5D=Astrobiology&keywords%5BTitle-Astrobiology%5D%5Bid%5D=Title-Astrobiology';
        const path = `/espace/feature-strategic-publishing/#${pathConfig.journals.search}`;
        const testHistory = createMemoryHistory({ initialEntries: [path] });
        testHistory.push({
            path,
            search: testQueryPart,
            state: {
                source: 'code',
            },
        });

        const journalsList = mockDataEmpty;

        const { getByText } = setup({
            state: { journalsListLoaded: true, journalsList },
            testHistory,
        });

        expect(getByText('No journals found')).toBeInTheDocument();
    });
    it("should show 'No journals found' when result object is missing", () => {
        const testQueryPart =
            'keywords%5BTitle-Astrobiology%5D%5Btype%5D=Title&keywords%5BTitle-Astrobiology%5D%5Btext%5D=Astrobiology&keywords%5BTitle-Astrobiology%5D%5Bid%5D=Title-Astrobiology';
        const path = `/espace/feature-strategic-publishing/#${pathConfig.journals.search}`;
        const testHistory = createMemoryHistory({ initialEntries: [path] });
        testHistory.push({
            path,
            search: testQueryPart,
            state: {
                source: 'code',
            },
        });

        const { getByText } = setup({
            state: { journalsListLoaded: true, undefined },
            testHistory,
        });

        expect(getByText('No journals found')).toBeInTheDocument();
    });
    it('should show an empty document when no keywords are present', () => {
        const testQueryPart = '';
        const path = `/espace/feature-strategic-publishing/#${pathConfig.journals.search}`;
        const testHistory = createMemoryHistory({ initialEntries: [path] });
        testHistory.push({
            path,
            search: testQueryPart,
            state: {
                source: 'code',
            },
        });

        const journalsList = mockDataEmpty;

        const { queryByTestId } = setup({
            state: { journalsListLoaded: true, journalsList },
            testHistory,
        });

        expect(queryByTestId('journal-search-results-no-keywords')).toBeInTheDocument();
    });
    it('should show an empty document when an empty keyword is present', () => {
        const testQueryPart = '?keywords%5B';
        const path = `/espace/feature-strategic-publishing/#${pathConfig.journals.search}`;
        const testHistory = createMemoryHistory({ initialEntries: [path] });
        testHistory.push({
            path,
            search: testQueryPart,
            state: {
                source: 'code',
            },
        });

        const journalsList = mockDataEmpty;

        const { queryByTestId } = setup({
            state: { journalsListLoaded: true, journalsList },
            testHistory,
        });

        expect(queryByTestId('journal-search-results-no-keywords')).toBeInTheDocument();
    });

    it('should show an empty document when results are not loaded', () => {
        const testQueryPart = '';
        const path = `/espace/feature-strategic-publishing/#${pathConfig.journals.search}`;
        const testHistory = createMemoryHistory({ initialEntries: [path] });
        testHistory.push({
            path,
            search: testQueryPart,
            state: {
                source: 'code',
            },
        });

        const journalsList = mockDataEmpty;

        const { queryByTestId } = setup({
            state: { journalsListLoaded: false, journalsList },
            testHistory,
        });

        expect(queryByTestId('journal-search-results-no-keywords')).toBeInTheDocument();
    });
    it('should show a message when results are loading for the first time', () => {
        const testQueryPart =
            'keywords%5BTitle-Astrobiology%5D%5Btype%5D=Title&keywords%5BTitle-Astrobiology%5D%5Btext%5D=Astrobiology&keywords%5BTitle-Astrobiology%5D%5Bid%5D=Title-Astrobiology';
        const path = `/espace/feature-strategic-publishing/#${pathConfig.journals.search}`;
        const testHistory = createMemoryHistory({ initialEntries: [path] });
        testHistory.push({
            path,
            search: testQueryPart,
            state: {
                source: 'code',
            },
        });

        const { getByText, queryByTestId } = setup({
            state: {
                journalsListLoaded: false,
                journalsListLoading: true,
            },
            testHistory,
        });

        expect(getByText('Loading journals list')).toBeInTheDocument();
        expect(queryByTestId('publication-list-sorting-sort-by')).not.toBeInTheDocument();
    });
    it('should show an error message when a loading error occurs', () => {
        const testQueryPart =
            'keywords%5BTitle-Astrobiology%5D%5Btype%5D=Title&keywords%5BTitle-Astrobiology%5D%5Btext%5D=Astrobiology&keywords%5BTitle-Astrobiology%5D%5Bid%5D=Title-Astrobiology';
        const path = `/espace/feature-strategic-publishing/#${pathConfig.journals.search}`;
        const testHistory = createMemoryHistory({ initialEntries: [path] });
        testHistory.push({
            path,
            search: testQueryPart,
            state: {
                source: 'code',
            },
        });

        const journalsList = mockData;
        const { getByText } = setup({
            state: {
                journalsListLoaded: true,
                journalsListLoading: false,
                journalsList,
                journalsListError: { message: 'Test error message' },
            },
            testHistory,
        });

        expect(getByText('Test error message')).toBeInTheDocument();
    });
    it('should use defined default sorting values when none are explicitly provided', () => {
        const testQueryPart =
            'keywords%5BTitle-Astrobiology%5D%5Btype%5D=Title&keywords%5BTitle-Astrobiology%5D%5Btext%5D=Astrobiology&keywords%5BTitle-Astrobiology%5D%5Bid%5D=Title-Astrobiology';
        const journalSearchQueryParams = deparam(testQueryPart);
        const journalsList = mockDataEmpty;
        const { sortBy, sortDirection, pageSize } = getSearchResultSortingParams(
            journalSearchQueryParams,
            journalsList.per_page,
            locale.components.searchJournals.sortingDefaults,
        );
        expect(sortDirection).toEqual('Asc');
        expect(sortBy).toEqual('highest_quartile');
        expect(pageSize).toEqual(10);
    });
    it('should use hardcoded default sorting values when no other defaults are provided', () => {
        const { sortBy, sortDirection, pageSize } = getSearchResultSortingParams({}, undefined, {});
        expect(sortDirection).toEqual('Desc');
        expect(sortBy).toEqual('score');
        expect(pageSize).toEqual(20);
    });
    it('should use provided sorting values instead of defaults', () => {
        const testQueryPart =
            'keywords%5BTitle-Astrobiology%5D%5Btype%5D=Title&keywords%5BTitle-Astrobiology%5D%5Btext%5D=Astrobiology&keywords%5BTitle-Astrobiology%5D%5Bid%5D=Title-Astrobiology&sortBy=cite_score&sortDirection=Desc&pageSize=50&page=1';
        const journalSearchQueryParams = deparam(testQueryPart);
        const journalsList = mockDataEmpty;
        const { sortBy, sortDirection, pageSize } = getSearchResultSortingParams(
            journalSearchQueryParams,
            journalsList.per_page,
            locale.components.searchJournals.sortingDefaults ?? {},
        );
        expect(sortDirection).toEqual('Desc');
        expect(sortBy).toEqual('cite_score');
        expect(pageSize).toEqual(50);
    });

    it('should update the URL when the Journal comparison button is clicked', () => {
        const testQueryPart =
            'keywords%5BTitle-Astrobiology%5D%5Btype%5D=Title&keywords%5BTitle-Astrobiology%5D%5Btext%5D=Astrobiology&keywords%5BTitle-Astrobiology%5D%5Bid%5D=Title-Astrobiology';
        const path = `/espace/feature-strategic-publishing/#${pathConfig.journals.search}`;
        const testHistory = createMemoryHistory({ initialEntries: [path] });
        testHistory.push({
            path,
            search: testQueryPart,
            state: {
                source: 'code',
            },
        });
        const journalsList = mockData;

        const { queryByTestId, getByRole } = setup({
            state: { journalsListLoaded: true, journalsList },
            testHistory,
        });

        expect(queryByTestId('journal-comparison-button')).toBeInTheDocument();
        expect(queryByTestId('journal-comparison-button')).toBeDisabled();

        // should be at least two journals to select for comparison
        expect(getByRole('checkbox', { name: 'Select International Journal of Astrobiology' })).toBeInTheDocument();
        expect(getByRole('checkbox', { name: 'Select Astrobiology' })).toBeInTheDocument();

        fireEvent.click(getByRole('checkbox', { name: 'Select International Journal of Astrobiology' }));
        fireEvent.click(getByRole('checkbox', { name: 'Select Astrobiology' }));

        expect(queryByTestId('journal-comparison-button')).not.toBeDisabled();

        fireEvent.click(queryByTestId('journal-comparison-button'));

        // compare button should update the URL path
        expect(testHistory.location.pathname).toEqual(pathConfig.journals.compare);
    });
    it('should show dropdown values as specified in the locale configuration', () => {
        const testQueryPart =
            'keywords%5BTitle-Astrobiology%5D%5Btype%5D=Title&keywords%5BTitle-Astrobiology%5D%5Btext%5D=Astrobiology&keywords%5BTitle-Astrobiology%5D%5Bid%5D=Title-Astrobiology';
        const path = `/espace/feature-strategic-publishing/#${pathConfig.journals.search}`;
        const testHistory = createMemoryHistory({ initialEntries: [path] });
        testHistory.push({
            path,
            search: testQueryPart,
            state: {
                source: 'code',
            },
        });
        const journalsList = mockData;

        const sortBy = locale.components.searchJournals.sorting.sortBy;

        const { getByTestId, getByRole } = setup({
            state: { journalsListLoaded: true, journalsList },
            testHistory,
        });

        fireEvent.mouseDown(within(getByTestId('publication-list-sorting-sort-by')).getByRole('combobox'));

        const listItem = getByRole('listbox');

        sortBy.map(sortItem => {
            expect(listItem).toHaveTextContent(sortItem.label);
        });
    });
});
