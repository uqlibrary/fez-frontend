import React from 'react';
import { render, WithReduxStore, WithRouter, act, fireEvent } from 'test-utils';
import { pathConfig } from 'config';
import { createMemoryHistory } from 'history';
import Immutable from 'immutable';
import * as repositories from 'repositories';

import SearchJournals, { areKeywordsDifferent } from './SearchJournals';
// import { mockData } from '../../../mock/data/testing/journals/journalSearchResults';

const setup = ({ state = {}, testHistory = createMemoryHistory({ initialEntries: ['/'] }) } = {}) => {
    return render(
        <WithRouter history={testHistory}>
            <WithReduxStore initialState={Immutable.Map({ searchJournalsReducer: state })}>
                <SearchJournals {...state} />
            </WithReduxStore>
        </WithRouter>,
    );
};

describe('SearchJournals', () => {
    it('should render', async () => {
        const { queryByTestId } = setup();
        expect(queryByTestId('journal-search-page')).toBeInTheDocument();
        expect(queryByTestId('journal-search-card')).toBeInTheDocument();
        expect(queryByTestId('journal-search-results-container')).not.toBeInTheDocument();
    });

    it('should return false when keywords are the same', async () => {
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

    it('should return false when keywords are both empty', async () => {
        const testResult = areKeywordsDifferent();

        expect(testResult).toEqual(false);
    });

    it('should return true when keywords are the different', async () => {
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

    // it('should show all journals if appropriate keyword detected in URL on page load', async () => {
    //     const testQuerySearchAllJournals =
    // eslint-disable-next-line max-len
    //         'keywords%5BKeyword-all-journals%5D%5Btype%5D=Keyword&keywords%5BKeyword-all-journals%5D%5Btext%5D=all+journals&keywords%5BKeyword-all-journals%5D%5Bid%5D=Keyword-all-journals';
    //     const path = `/espace/feature-strategic-publishing/#${pathConfig.journals.search}`;
    //     const testHistory = createMemoryHistory({ initialEntries: [path] });
    //     testHistory.push({
    //         path,
    //         search: testQuerySearchAllJournals,
    //         state: {
    //             source: 'code',
    //         },
    //     });

    //     const journalsList = mockData;

    //     const { queryByTestId } = setup({
    //         state: { journalsListLoaded: true, journalsList },
    //         testHistory,
    //     });

    //     expect(queryByTestId('journal-search-chip-Keyword-all-journals')).toBeInTheDocument();
    //     expect(queryByTestId('13251-International Journal of Astrobiology-link')).toBeInTheDocument();
    //     expect(queryByTestId('641-Astrobiology-link')).toBeInTheDocument();
    // });

    it('should correctly update the URL with "all journals" keywords and show "all journals" keyword button on screen', async () => {
        const testQuerySearchBioKeywords = '';
        const testQuerySearchAllJournals =
            '?keywords%5BKeyword-all-journals%5D%5Btype%5D=Keyword&keywords%5BKeyword-all-journals%5D%5Btext%5D=all+journals&keywords%5BKeyword-all-journals%5D%5Bid%5D=Keyword-all-journals';
        const path = `/espace/feature-strategic-publishing/#${pathConfig.journals.search}`;
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

        expect(testHistory.location.pathname).toEqual(`/${repositories.routes.JOURNAL_SEARCH_API().apiUrl}/`);
        expect(testHistory.location.search).toEqual(testQuerySearchAllJournals);
        expect(queryByTestId('journal-search-browse-all-button')).not.toBeInTheDocument();
        expect(queryByTestId('journal-search-chip-Keyword-all-journals')).toBeInTheDocument();
    });
});
