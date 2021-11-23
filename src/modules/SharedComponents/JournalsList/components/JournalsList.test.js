import React from 'react';
import { render, WithReduxStore, act, fireEvent } from 'test-utils';

import Immutable from 'immutable';
import { mockData } from '../../../../mock/data/testing/journals/journalSearchResults';
import { JournalsList } from '..';
import Cookies from 'js-cookie';
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
    it('should show less columns in the default view', () => {
        const { queryByText, getByText } = setup({
            ...testData,
        });
        // Should default to minimal view
        // First three columns should be in the document
        expect(getByText('Journal title')).toBeInTheDocument();
        expect(getByText('Open access')).toBeInTheDocument();
        expect(getByText('Highest quartile')).toBeInTheDocument();
        // These columns should not be in the document
        expect(queryByText('CiteScore')).not.toBeInTheDocument();
        expect(queryByText('CiteScore percentile')).not.toBeInTheDocument();
        expect(queryByText('Impact factor')).not.toBeInTheDocument();
        expect(queryByText('Impact factor percentile')).not.toBeInTheDocument();
        expect(queryByText('SNIP')).not.toBeInTheDocument();
        expect(queryByText('SJR')).not.toBeInTheDocument();
    });
    it('should show more columns when more is selected', () => {
        Cookies.set('minimalView', false);
        const { queryByText, getByText, getByRole } = setup({
            ...testData,
        });
        // All columns should be showing
        expect(getByText('Journal title')).toBeInTheDocument();
        expect(getByText('Open access')).toBeInTheDocument();
        expect(getByText('Highest quartile')).toBeInTheDocument();
        expect(queryByText('CiteScore')).toBeInTheDocument();
        expect(queryByText('CiteScore percentile')).toBeInTheDocument();
        expect(queryByText('Impact factor')).toBeInTheDocument();
        expect(queryByText('Impact factor percentile')).toBeInTheDocument();
        expect(queryByText('SNIP')).toBeInTheDocument();
        expect(queryByText('SJR')).toBeInTheDocument();

        // Expanded - Click the button to show less data
        act(() => {
            fireEvent.click(getByRole('button', { name: 'Show less data' }));
        });
        expect(queryByText('CiteScore')).not.toBeInTheDocument();
        expect(queryByText('Impact factor percentile')).not.toBeInTheDocument();
    });

    it('should expand / contract the columns when more / less is clicked', () => {
        const { queryByText, getByText, getByRole } = setup({
            ...testData,
        });

        // Default at less data.
        expect(getByText('Highest quartile')).toBeInTheDocument();
        expect(queryByText('CiteScore')).not.toBeInTheDocument();
        act(() => {
            fireEvent.click(getByRole('button', { name: 'Show more data' }));
        });

        // Expanded for more data.
        expect(getByText('Highest quartile')).toBeInTheDocument();
        expect(queryByText('CiteScore')).toBeInTheDocument();

        // contracted to less data
        act(() => {
            fireEvent.click(getByRole('button', { name: 'Show less data' }));
        });
        expect(getByText('Highest quartile')).toBeInTheDocument();
        expect(queryByText('CiteScore')).not.toBeInTheDocument();
    });
});
