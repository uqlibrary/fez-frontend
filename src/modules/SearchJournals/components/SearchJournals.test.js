import React from 'react';
import { act, fireEvent, render, WithReduxStore, WithRouter } from 'test-utils';
import { pathConfig } from 'config';
import { createMemoryHistory } from 'history';
import Immutable from 'immutable';

import { initialJournalSearchKeywords, initialState } from '../../../reducers/journals';

import SearchJournals, { areKeywordsDifferent } from './SearchJournals';
import { mockData } from '../../../mock/data/testing/journals/journalSearchResults';

const setup = ({ state = {}, storeState = {}, testHistory = createMemoryHistory({ initialEntries: ['/'] }) } = {}) => {
    return render(
        <WithRouter history={testHistory}>
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
                <SearchJournals {...state} />
            </WithReduxStore>
        </WithRouter>,
    );
};

describe('SearchJournals', () => {
    it('should render', () => {
        const { queryByTestId } = setup();
        expect(queryByTestId('journal-search-page')).toBeInTheDocument();
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

    it('should render set of results via selecting a keyword and clicking the "Step 3: Search" button', () => {
        const testQuerySearchAstrobiology =
            '?keywords%5BKeyword-astrobiology%5D%5Btype%5D=Keyword&keywords%5BKeyword-astrobiology%5D%5Btext%5D=astrobiology&keywords%5BKeyword-astrobiology%5D%5Bid%5D=Keyword-astrobiology';

        const path = pathConfig.journals.search;
        const testHistory = createMemoryHistory({ initialEntries: [path] });
        testHistory.push({
            path,
        });

        const journalsList = mockData;

        const { queryByTestId } = setup({
            testHistory,
            state: { journalsListLoaded: true, journalsList },
            storeState: {
                journalSearchKeywords: {
                    exactMatch: [{ keyword: 'Astrobiology', title: 'Astrobiology', href: '/journal/view/undefined' }],
                    keywordMatch: [{ keyword: 'astrobiology' }],
                },
            },
        });

        expect(queryByTestId('journal-search-item-addable-astrobiology-0')).toBeInTheDocument();
        act(() => {
            fireEvent.click(queryByTestId('journal-search-item-addable-astrobiology-0'));
        });

        expect(testHistory.location.search).toEqual(testQuerySearchAstrobiology);

        expect(queryByTestId('journal-search-button')).not.toHaveAttribute('disabled');

        act(() => {
            fireEvent.click(queryByTestId('journal-search-button'));
        });

        expect(queryByTestId('journal-search-chip-Keyword-astrobiology')).toBeInTheDocument();

        expect(queryByTestId('641-Astrobiology-link')).toBeInTheDocument();
    });

    it('should clear a set of results via the clear all "X" button', () => {
        const testQuerySearchAstrobiology =
            '?keywords%5BKeyword-astrobiology%5D%5Btype%5D=Keyword&keywords%5BKeyword-astrobiology%5D%5Btext%5D=astrobiology&keywords%5BKeyword-astrobiology%5D%5Bid%5D=Keyword-astrobiology';

        const path = pathConfig.journals.search;
        const testHistory = createMemoryHistory({ initialEntries: [path] });
        testHistory.push({
            path,
        });

        const journalsList = mockData;

        const { queryByTestId, getByText } = setup({
            testHistory,
            state: { journalsListLoaded: true, journalsList },
            storeState: {
                journalSearchKeywords: {
                    exactMatch: [{ keyword: 'Astrobiology', title: 'Astrobiology', href: '/journal/view/undefined' }],
                    keywordMatch: [{ keyword: 'astrobiology' }],
                },
            },
        });

        expect(queryByTestId('journal-search-item-addable-astrobiology-0')).toBeInTheDocument();
        act(() => {
            fireEvent.click(queryByTestId('journal-search-item-addable-astrobiology-0'));
        });

        expect(testHistory.location.search).toEqual(testQuerySearchAstrobiology);

        expect(queryByTestId('journal-search-button')).not.toHaveAttribute('disabled');

        act(() => {
            fireEvent.click(queryByTestId('journal-search-button'));
        });

        expect(queryByTestId('journal-search-chip-Keyword-astrobiology')).toBeInTheDocument();

        expect(queryByTestId('641-Astrobiology-link')).toBeInTheDocument();

        expect(queryByTestId('journal-search-clear-keywords-button')).toBeInTheDocument();

        act(() => {
            fireEvent.click(queryByTestId('journal-search-clear-keywords-button'));
        });

        expect(testHistory.location.pathname).toEqual(path);
        expect(testHistory.location.search).toEqual('');
        expect(queryByTestId('journal-search-chip-Keyword-astrobiology')).not.toBeInTheDocument();
        expect(queryByTestId('641-Astrobiology-link')).not.toBeInTheDocument();
        expect(getByText('Enter a journal title, keyword, subject or field of research code.')).toBeInTheDocument();
    });

    it('should restore displayed search results if back button pressed', () => {
        const testQuerySearchAstrobiology =
            '?keywords%5BKeyword-astrobiology%5D%5Btype%5D=Keyword&keywords%5BKeyword-astrobiology%5D%5Btext%5D=astrobiology&keywords%5BKeyword-astrobiology%5D%5Bid%5D=Keyword-astrobiology';

        const path = pathConfig.journals.search;
        const testHistory = createMemoryHistory({ initialEntries: [path] });
        testHistory.push({
            path,
        });

        const journalsList = mockData;

        const { queryByTestId, getByText, queryByText } = setup({
            testHistory,
            state: { journalsListLoaded: true, journalsList },
            storeState: {
                journalSearchKeywords: {
                    exactMatch: [{ keyword: 'Astrobiology', title: 'Astrobiology', href: '/journal/view/undefined' }],
                    keywordMatch: [{ keyword: 'astrobiology' }],
                },
            },
        });

        expect(queryByTestId('journal-search-item-addable-astrobiology-0')).toBeInTheDocument();
        act(() => {
            fireEvent.click(queryByTestId('journal-search-item-addable-astrobiology-0'));
        });

        expect(testHistory.location.search).toEqual(testQuerySearchAstrobiology);

        expect(queryByTestId('journal-search-button')).not.toHaveAttribute('disabled');

        act(() => {
            fireEvent.click(queryByTestId('journal-search-button'));
        });

        expect(queryByTestId('journal-search-chip-Keyword-astrobiology')).toBeInTheDocument();

        expect(queryByTestId('641-Astrobiology-link')).toBeInTheDocument();

        expect(queryByTestId('journal-search-clear-keywords-button')).toBeInTheDocument();

        act(() => {
            fireEvent.click(queryByTestId('journal-search-clear-keywords-button'));
        });

        expect(testHistory.location.pathname).toEqual(path);
        expect(testHistory.location.search).toEqual('');
        expect(queryByTestId('journal-search-chip-Keyword-astrobiology')).not.toBeInTheDocument();
        expect(queryByTestId('641-Astrobiology-link')).not.toBeInTheDocument();
        expect(getByText('Enter a journal title, keyword, subject or field of research code.')).toBeInTheDocument();

        act(() => {
            testHistory.goBack();
        });

        expect(testHistory.location.search).toEqual(testQuerySearchAstrobiology);
        expect(
            queryByText('Enter a journal title, keyword, subject or field of research code.'),
        ).not.toBeInTheDocument();
        expect(queryByTestId('journal-search-chip-Keyword-astrobiology')).toBeInTheDocument();
        expect(queryByTestId('641-Astrobiology-link')).toBeInTheDocument();
    });

    /* Commented out test due to bug in test cases causing 404 page not found error */

    it('should show all journals if appropriate keyword detected in URL on page load', () => {
        const testQuerySearchAllJournals =
            // eslint-disable-next-line max-len
            'keywords%5BKeyword-all-journals%5D%5Btype%5D=Keyword&keywords%5BKeyword-all-journals%5D%5Btext%5D=all+journals&keywords%5BKeyword-all-journals%5D%5Bid%5D=Keyword-all-journals';
        const path = pathConfig.journals.search;
        const testHistory = createMemoryHistory({ initialEntries: [path] });
        testHistory.push({
            path,
            search: testQuerySearchAllJournals,
            state: {
                source: 'code',
            },
        });

        const journalsList = mockData;

        const { queryByTestId } = setup({
            state: { journalsListLoaded: true, journalsList },
            testHistory,
        });

        expect(queryByTestId('journal-search-chip-Keyword-all-journals')).toBeInTheDocument();
        expect(queryByTestId('13251-International Journal of Astrobiology-link')).toBeInTheDocument();
        expect(queryByTestId('641-Astrobiology-link')).toBeInTheDocument();
    });

    it('should correctly update the URL with "all journals" keywords and show "all journals" keyword button on screen', () => {
        const testQuerySearchBioKeywords = '';
        const testQuerySearchAllJournals =
            '?keywords%5BKeyword-all-journals%5D%5Btype%5D=Keyword&keywords%5BKeyword-all-journals%5D%5Btext%5D=all+journals&keywords%5BKeyword-all-journals%5D%5Bid%5D=Keyword-all-journals';
        const path = pathConfig.journals.search;
        const testHistory = createMemoryHistory({ initialEntries: [path] });

        testHistory.push({
            path,
            search: testQuerySearchBioKeywords,
            state: {
                source: 'code',
            },
        });

        const { queryByTestId } = setup({
            testHistory,
        });

        expect(queryByTestId('journal-search-browse-all-button')).toBeInTheDocument();

        act(() => {
            fireEvent.click(queryByTestId('journal-search-browse-all-button'));
        });

        expect(testHistory.location.pathname).toEqual(path);
        expect(testHistory.location.search).toEqual(testQuerySearchAllJournals);
        expect(queryByTestId('journal-search-browse-all-button')).not.toBeInTheDocument();
        expect(queryByTestId('journal-search-chip-Keyword-all-journals')).toBeInTheDocument();
    });

    it('should handle regular keyword deletion', () => {
        const testQuerySearchBioKeywords =
            'keywords%5BKeyword-astrobiology%5D%5Btype%5D=Keyword&keywords%5BKeyword-astrobiology%5D%5Btext%5D=astrobiology&keywords%5BKeyword-astrobiology%5D%5Bid%5D=Keyword-astrobiology';
        const path = pathConfig.journals.search;
        const testHistory = createMemoryHistory({ initialEntries: [path] });

        testHistory.push({
            path,
            search: testQuerySearchBioKeywords,
            state: {
                source: 'code',
            },
        });

        const journalsList = mockData;

        const { container, queryByTestId } = setup({
            state: { journalsListLoaded: true, journalsList },
            testHistory,
        });

        expect(queryByTestId('journal-search-chip-Keyword-astrobiology')).toBeInTheDocument();

        act(() => {
            fireEvent.click(container.querySelector('#journal-search-chip-Keyword-astrobiology > svg'));
        });

        expect(testHistory.location.pathname).toEqual(path);
        expect(testHistory.location.search).toEqual('');
    });

    it('should handle invalid keywords when browser history changes', () => {
        const testQuerySearchBioKeywords =
            '?keywords%5BKeyword-astrobiology%5D%5Btype%5D=Keyword&keywords%5BKeyword-astrobiology%5D%5Btext%5D=astrobiology&keywords%5BKeyword-astrobiology%5D%5Bid%5D=Keyword-astrobiology';

        const testInvalidQuerySearchKeywords = '?keywords=invalid-keyword';
        const path = pathConfig.journals.search;
        const testHistory = createMemoryHistory({ initialEntries: [path] });

        testHistory.push({
            path,
            search: testInvalidQuerySearchKeywords,
        });

        testHistory.push({
            path,
            search: testQuerySearchBioKeywords,
        });
        const journalsList = mockData;
        const { queryByTestId } = setup({
            state: { journalsListLoaded: true, journalsList },
            testHistory,
        });

        expect(testHistory.location.search).toEqual(testQuerySearchBioKeywords);
        expect(queryByTestId('journal-search-chip-Keyword-astrobiology')).toBeInTheDocument();

        // move back twice as react will insert adiditonal history when the component renders
        act(() => {
            testHistory.goBack();
            testHistory.goBack();
        });

        // should expect to see the invalid keyword parameter in the URL
        expect(testHistory.location.search).toEqual(testInvalidQuerySearchKeywords);

        // should expect same keywords as before,
        // as the code will ignore invalid keywords when browser history is being navigated
        expect(queryByTestId('journal-search-chip-Keyword-astrobiology')).toBeInTheDocument();
    });

    it('should handle regular multiple keyword deletion', () => {
        const testQuerySearchKeywordsBoth =
            'keywords%5BTitle-Microbiology%5D%5Btype%5D=Title&keywords%5BTitle-Microbiology%5D%5Btext%5D=Microbiology&keywords%5BTitle-Microbiology%5D%5Bid%5D=Title-Microbiology&keywords%5BTitle-Biology%5D%5Btype%5D=Title&keywords%5BTitle-Biology%5D%5Btext%5D=Biology&keywords%5BTitle-Biology%5D%5Bid%5D=Title-Biology';
        const testQuerySearchKeywordsSingle =
            '?keywords%5BTitle-Microbiology%5D%5Btype%5D=Title&keywords%5BTitle-Microbiology%5D%5Btext%5D=Microbiology&keywords%5BTitle-Microbiology%5D%5Bid%5D=Title-Microbiology';
        const path = pathConfig.journals.search;
        const testHistory = createMemoryHistory({ initialEntries: [path] });

        testHistory.push({
            path,
            search: testQuerySearchKeywordsBoth,
            state: {
                source: 'code',
            },
        });

        const journalsList = mockData;

        const { container, queryByTestId } = setup({
            state: { journalsListLoaded: true, journalsList },
            testHistory,
        });

        expect(queryByTestId('journal-search-chip-Title-Microbiology')).toBeInTheDocument();
        expect(queryByTestId('journal-search-chip-Title-Biology')).toBeInTheDocument();

        act(() => {
            fireEvent.click(container.querySelector('#journal-search-chip-Title-Biology > svg'));
        });

        expect(testHistory.location.search).toEqual(testQuerySearchKeywordsSingle);

        act(() => {
            fireEvent.click(container.querySelector('#journal-search-chip-Title-Microbiology > svg'));
        });

        expect(testHistory.location.pathname).toEqual(path);
        expect(testHistory.location.search).toEqual('');
    });
    it('should handle "all journals" keyword deletion', () => {
        const testQuerySearchAllJournals =
            '?keywords%5BKeyword-all-journals%5D%5Btype%5D=Keyword&keywords%5BKeyword-all-journals%5D%5Btext%5D=all+journals&keywords%5BKeyword-all-journals%5D%5Bid%5D=Keyword-all-journals';
        const path = pathConfig.journals.search;
        const testHistory = createMemoryHistory({ initialEntries: [path] });

        testHistory.push({
            path,
            search: testQuerySearchAllJournals,
            state: {
                source: 'code',
            },
        });

        const journalsList = mockData;

        const { container, queryByTestId } = setup({
            state: { journalsListLoaded: true, journalsList },
            testHistory,
        });

        expect(queryByTestId('journal-search-chip-Keyword-all-journals')).toBeInTheDocument();

        act(() => {
            fireEvent.click(container.querySelector('#journal-search-chip-Keyword-all-journals > svg'));
        });

        expect(testHistory.location.pathname).toEqual(path);
        expect(testHistory.location.search).toEqual('');
    });
});
