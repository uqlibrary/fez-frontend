import React from 'react';
import { render, WithRouter, WithReduxStore, act, fireEvent } from 'test-utils';
import { MuiThemeProvider } from '@material-ui/core';
import { pathConfig } from 'config';
import { createMemoryHistory } from 'history';
import Immutable from 'immutable';
import locale from 'locale/components';
import JournalSearchResult, { getSearchResultSortingParams } from './JournalSearchResult';
import { mockData, mockDataEmpty } from '../../../mock/data/testing/journals/journalSearchResults';
import { createMuiTheme } from '@material-ui/core';
import deparam from 'can-deparam';

const setup = ({
    state = {},
    testHistory = createMemoryHistory({ initialEntries: ['/'] }),
    onSearchFn = jest.fn(),
    theme = createMuiTheme({ props: { MuiWithWidth: { initialWidth: 'sm' } } }),
}) => {
    return render(
        <WithRouter history={testHistory}>
            <WithReduxStore initialState={Immutable.Map({ searchJournalsReducer: state })}>
                <MuiThemeProvider theme={theme}>
                    <JournalSearchResult onSearch={onSearchFn} />
                </MuiThemeProvider>
            </WithReduxStore>
        </WithRouter>,
    );
};
const mockDataPaged = {
    ...mockData,
    total: 20,
    took: 10,
    per_page: 10,
    current_page: 1,
    from: 1,
    to: 10,
};
const testQueryPart = 'keywords%5BTitle-Medicine';

const path = `/espace/feature-strategic-publishing/#${pathConfig.journals.search}`;
const testHistory = createMemoryHistory({ initialEntries: [path] });
describe('Search Journals Paging', () => {
    testHistory.push({
        path,
        search: testQueryPart,
        state: {
            source: 'code',
        },
    });

    it('should have previous and next paging areas where paging occurs', () => {
        const journalsList = mockDataPaged;

        const { getByTestId } = setup({
            state: { journalsListLoaded: true, journalsList },
            testHistory,
        });

        expect(getByTestId('search-journals-paging-top')).toBeInTheDocument();
        expect(getByTestId('search-journals-paging-bottom')).toBeInTheDocument();
    });
    it('should have page buttons when results span multiple pages', () => {
        const journalsList = mockDataPaged;

        const { getByTestId } = setup({
            state: { journalsListLoaded: true, journalsList },
            testHistory,
        });

        expect(getByTestId('search-journals-paging-top-select-page-1')).toBeInTheDocument();
        expect(getByTestId('search-journals-paging-top-select-page-2')).toBeInTheDocument();
    });

    it('should not have paging data when results span multiple pages', () => {
        const journalsList = mockData;

        const { queryByTestId } = setup({
            state: { journalsListLoaded: true, journalsList },
            testHistory,
        });

        expect(queryByTestId('search-journals-paging-top-select-page-1')).not.toBeInTheDocument();
        expect(queryByTestId('search-journals-paging-top-select-page-2')).not.toBeInTheDocument();
    });

    it('should not have paging buttons on xs and below screens if paging present', () => {
        const journalsList = mockDataPaged;

        const { queryByTestId } = setup({
            state: { journalsListLoaded: true, journalsList },
            testHistory,
            theme: createMuiTheme({ props: { MuiWithWidth: { initialWidth: 'xs' } } }),
        });

        expect(queryByTestId('search-journals-paging-top-select-page-1')).not.toBeInTheDocument();
        expect(queryByTestId('search-journals-paging-top-select-page-2')).not.toBeInTheDocument();
    });
    it('should have paging buttons on sm and above screens if paging present', () => {
        const journalsList = mockDataPaged;

        const { queryByTestId } = setup({
            state: { journalsListLoaded: true, journalsList },
            testHistory,
            theme: createMuiTheme({ props: { MuiWithWidth: { initialWidth: 'sm' } } }),
        });

        expect(queryByTestId('search-journals-paging-top-select-page-1')).toBeInTheDocument();
        expect(queryByTestId('search-journals-paging-top-select-page-2')).toBeInTheDocument();
    });

    testHistory.push({
        path,
        search: testQueryPart,
        state: {
            source: 'code',
        },
    });
    it('should use defined default sort order when explicitly provided', () => {
        const testQueryPart = 'keywords%5BTitle-Medicine&sortDirection=Desc&sortBy=cite_score&pageSize=10&page=1';
        const journalSearchQueryParams = deparam(testQueryPart);
        const journalsList = mockData;
        const { sortDirection, sortBy, pageSize } = getSearchResultSortingParams(
            journalSearchQueryParams,
            journalsList.per_page,
            locale.components.searchJournals.sortingDefaults,
        );
        expect(sortDirection).toEqual('Desc');
        expect(sortBy).toEqual('cite_score');
        expect(pageSize).toEqual(10);
    });

    it('should use hardcoded default sorting values when no other defaults are provided', () => {
        const { sortBy, sortDirection, pageSize } = getSearchResultSortingParams({}, undefined, {});
        expect(sortDirection).toEqual('Desc');
        expect(sortBy).toEqual('score');
        expect(pageSize).toEqual(20);
    });
});

describe('Search Sort Journals UI', () => {
    testHistory.push({
        path,
        search: testQueryPart,
        state: {
            source: 'code',
        },
    });

    it('should update the URL when the Journal comparsion button is clicked', () => {
        const testHistory = createMemoryHistory({ initialEntries: [path] });
        testHistory.push({
            path,
            search: testQueryPart,
            state: {
                source: 'code',
            },
        });
        const journalsList = mockData;

        const { queryByTestId } = setup({
            state: { journalsListLoaded: true, journalsList },
            testHistory,
        });

        expect(queryByTestId('journal-comparison-button')).toBeInTheDocument();
        expect(queryByTestId('journal-comparison-button')).toBeDisabled();

        expect(queryByTestId('journal-list-data-col-1-checkbox-0')).toBeInTheDocument();
        expect(queryByTestId('journal-list-data-col-1-checkbox-1')).toBeInTheDocument();

        act(() => {
            fireEvent.click(queryByTestId('journal-list-data-col-1-checkbox-0'));
            fireEvent.click(queryByTestId('journal-list-data-col-1-checkbox-1'));
        });

        expect(queryByTestId('journal-comparison-button')).not.toBeDisabled();

        act(() => {
            fireEvent.click(queryByTestId('journal-comparison-button'));
        });

        expect(testHistory.location.pathname).toEqual(pathConfig.journals.compare);
    });

    it("should show 'No journals found' when no results are present", () => {
        const journalsList = mockDataEmpty;

        const { getByText } = setup({
            state: { journalsListLoaded: true, journalsList },
            testHistory,
        });

        expect(getByText('No journals found')).toBeInTheDocument();
    });

    it('should show a message when results are loading', () => {
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
                journalsListLoading: true,
                journalsList,
            },
            testHistory,
        });

        expect(getByText('Loading journals list')).toBeInTheDocument();
    });

    it('should show an error message when a loading error occurs', () => {
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

        const journalsList = mockData;
        const { getByText } = setup({
            state: {
                journalsListLoaded: true,
                journalsListLoading: false,
                journalsList,
                journalsListError: { message: 'Unable to load Journals' },
            },
            testHistory,
        });

        expect(getByText('Unable to load Journals')).toBeInTheDocument();
    });
});
