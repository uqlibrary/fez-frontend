import React from 'react';
import { render, WithReduxStore /* ,act, fireEvent, screen*/ } from 'test-utils';

import Immutable from 'immutable';
import { mockData } from 'mock/data/testing/journals/journalSearchResults';
import { default as JournalsList } from './JournalsList';

import { JournalFieldsMap } from './partials/JournalFieldsMap';
// import { sanitiseId } from 'helpers/general';
import mediaQuery from 'css-mediaquery';

function createMatchMedia(width) {
    return query => ({
        matches: mediaQuery.match(query, { width }),
        addListener: () => {},
        removeListener: () => {},
    });
}

const testData = {
    journals: mockData.data,
    minimalView: true,
};

const setup = ({ state = {} }) => {
    return render(
        <WithReduxStore initialState={Immutable.Map({ searchJournalsReducer: state })}>
            <JournalsList {...testData} />
        </WithReduxStore>,
    );
};

describe('Journal Search Results list', () => {
    it('should show compactView labels by default on desktop', () => {
        window.matchMedia = createMatchMedia(1024);
        const { queryByText, getByText } = setup({
            ...testData,
        });
        // Should default show items with compact view flags
        JournalFieldsMap.map(item => {
            !!item.compactView
                ? expect(getByText(item.label)).toBeInTheDocument()
                : expect(queryByText(item.label)).not.toBeInTheDocument();
        });
    });
    it('should only show two compactView labels by default on mobile', () => {
        window.matchMedia = createMatchMedia(600);
        const { queryByText, getByText } = setup({
            ...testData,
        });
        // Should default show items with compact view flags
        JournalFieldsMap.slice(1).map(item => {
            !!item.compactView
                ? expect(getByText(item.label)).toBeInTheDocument()
                : expect(queryByText(item.label)).not.toBeInTheDocument();
        });
    });

    // coverage
    it('should not show quartile information if not in dataset', () => {
        mockData.data.map(dataItem => {
            dataItem.fez_journal_cite_score = null;
            dataItem.fez_journal_jcr_scie = null;
            dataItem.fez_journal_jcr_ssci = null;

            JournalFieldsMap.slice(1).map(fieldMap => {
                switch (fieldMap.label) {
                    case 'Highest quartile':
                        expect(fieldMap.translateFn(dataItem)).toEqual(null);
                        break;
                    case 'CiteScore':
                        expect(fieldMap.translateFn(dataItem)).toEqual('');
                        break;
                    default:
                        break;
                }
            });
        });
    });
});
