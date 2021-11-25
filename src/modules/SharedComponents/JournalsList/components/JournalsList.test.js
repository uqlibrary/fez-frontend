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
    it('should show the correct information in the table, minimised', () => {
        const { getByTestId } = setup({
            ...testData,
        });

        mockData.data.map((dataItem, index) => {
            // Make sure the title of the Journal is in the document as per the data.
            const titlesElement = getByTestId(`${dataItem.jnl_jid}-${dataItem.jnl_title}-link`);
            expect(titlesElement).toBeInTheDocument();
            expect(titlesElement).toHaveTextContent(dataItem.jnl_title);

            const dataElement = getByTestId(`journal-list-data-col-2-min-${index}`);
            // Only using the first few items in the map for minified view.
            JournalFieldsMap.slice(0, 3).map(fieldMap => {
                switch (fieldMap.key) {
                    case 'highest_quartile':
                        // data appended with Q
                        expect(dataElement).toHaveTextContent(`Q${fieldMap.translateFn(dataItem)}`);
                        break;
                    case 'fez_journal_doaj':
                        // expect tooltip to match supplied data.
                        expect(dataElement.querySelector('p').title).toEqual(fieldMap.toolTipLabel(dataItem));
                        break;
                    default:
                        break;
                }
            });
        });
    });
    it('should show the correct information in the table, maximised', () => {
        Cookies.set('minimalView', false);
        const { getByTestId } = setup({
            ...testData,
        });
        mockData.data.map((dataItem, index) => {
            // Make sure the title of the Journal is in the document as per the data.
            const titlesElement = getByTestId(`${dataItem.jnl_jid}-${dataItem.jnl_title}-link`);
            expect(titlesElement).toBeInTheDocument();

            const dataElement = getByTestId(`journal-list-data-col-2-full-${index}`);
            JournalFieldsMap.slice(1).map(fieldMap => {
                switch (fieldMap.key) {
                    case 'highest_quartile':
                        // data appended with Q
                        expect(dataElement).toHaveTextContent(`Q${fieldMap.translateFn(dataItem)}`);
                        break;
                    case 'fez_journal_doaj':
                        // expect tooltip to match supplied data.
                        expect(dataElement.querySelector('p').title).toEqual(fieldMap.toolTipLabel(dataItem));
                        break;
                    case 'fez_journal_cite_score':
                        // Normalising spaces in this string, which appears to happen in the component.
                        expect(dataElement).toHaveTextContent(fieldMap.translateFn(dataItem).replace(/\s\s+/g, ' '));
                        break;
                    default:
                        // expect data to be as returned from function
                        expect(dataElement).toHaveTextContent(fieldMap.translateFn(dataItem));
                        break;
                }
            });
        });
    });
});
