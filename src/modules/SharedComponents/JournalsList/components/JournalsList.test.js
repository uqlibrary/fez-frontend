import React from 'react';
import { render, WithReduxStore } from 'test-utils';
import { mockData } from 'mock/data/testing/journals/journalSearchResults';
import { default as JournalsList } from './JournalsList';

import JournalFieldsMap from './partials/JournalFieldsMap';

const defaultTestData = {
    journals: mockData.data,
};

const setup = ({ testData = { ...defaultTestData }, state = {} }) => {
    return render(
        <WithReduxStore initialState={{ searchJournalsReducer: state }}>
            <JournalsList {...testData} />
        </WithReduxStore>,
    );
};

describe('Journal Search Results list', () => {
    // coverage
    it('should show compactView labels by default', () => {
        // This test just tests for elements in the page. See search.spec.js for breakpoint tests
        const { queryAllByText, getAllByText } = setup({});
        // Should default show items with compact view flags
        JournalFieldsMap.map(item => {
            !!item.compactView
                ? expect(getAllByText(item.label).length).toBeGreaterThan(0)
                : expect(queryAllByText(item.label).length).toBe(0);
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
