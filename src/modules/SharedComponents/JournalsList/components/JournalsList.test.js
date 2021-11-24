import React from 'react';
import { render, WithReduxStore, act, fireEvent } from 'test-utils';

import Immutable from 'immutable';
import { mockData } from '../../../../mock/data/testing/journals/journalSearchResults';
import { JournalsList } from '..';
import Cookies from 'js-cookie';

import { JournalFieldsMap } from '../components/partials/JournalFieldsMap';

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
        JournalFieldsMap.map(item => {
            !!item.compactView
                ? expect(getByText(item.label)).toBeInTheDocument()
                : expect(queryByText(item.label)).not.toBeInTheDocument();
        });
    });
    it('should show more columns when more is selected', () => {
        Cookies.set('minimalView', false);
        const { queryByText, getByText, getByRole } = setup({
            ...testData,
        });
        // All columns should be showing
        JournalFieldsMap.map(item => {
            expect(getByText(item.label)).toBeInTheDocument();
        });

        // Expanded - Click the button to show less data
        act(() => {
            fireEvent.click(getByRole('button', { name: 'Show less data' }));
        });
        JournalFieldsMap.map(item => {
            !!item.compactView
                ? expect(getByText(item.label)).toBeInTheDocument()
                : expect(queryByText(item.label)).not.toBeInTheDocument();
        });
    });

    it('should expand / contract the columns when more / less is clicked', () => {
        const { queryByText, getByText, getByRole } = setup({
            ...testData,
        });

        // Default at less data.
        JournalFieldsMap.map(item => {
            !!item.compactView
                ? expect(getByText(item.label)).toBeInTheDocument()
                : expect(queryByText(item.label)).not.toBeInTheDocument();
        });
        act(() => {
            fireEvent.click(getByRole('button', { name: 'Show more data' }));
        });

        // Expanded for more data.
        JournalFieldsMap.map(item => {
            expect(getByText(item.label)).toBeInTheDocument();
        });

        // contracted to less data
        act(() => {
            fireEvent.click(getByRole('button', { name: 'Show less data' }));
        });
        JournalFieldsMap.map(item => {
            !!item.compactView
                ? expect(getByText(item.label)).toBeInTheDocument()
                : expect(queryByText(item.label)).not.toBeInTheDocument();
        });
    });
});
