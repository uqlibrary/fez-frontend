import React from 'react';
import { render, WithReduxStore, act, fireEvent } from 'test-utils';

import Immutable from 'immutable';
import { mockData } from 'mock/data/testing/journals/journalSearchResults';
import { default as JournalsListLegacy } from './JournalsListLegacy';
import Cookies from 'js-cookie';

import { JournalFieldsMap as fieldMappings } from './partials/JournalFieldsMap';
import { sanitiseId } from 'helpers/general';

const testData = {
    journals: mockData.data,
    minimalView: true,
};

const setup = ({ state = {} }) => {
    return render(
        <WithReduxStore initialState={Immutable.Map({ searchJournalsReducer: state })}>
            <JournalsListLegacy {...testData} />
        </WithReduxStore>,
    );
};

describe('Journal Search Results list', () => {
    const journalFieldsMap = fieldMappings();
    it('should show less columns in the default view', () => {
        const { queryByText, getByText } = setup({
            ...testData,
        });
        // Should default to minimal view
        // First three columns should be in the document
        journalFieldsMap.map(item => {
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
        journalFieldsMap.map(item => {
            expect(getByText(item.label)).toBeInTheDocument();
        });

        // Expanded - Click the button to show less data
        act(() => {
            fireEvent.click(getByRole('button', { name: 'Show less data' }));
        });
        journalFieldsMap.map(item => {
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
        journalFieldsMap.map(item => {
            !!item.compactView
                ? expect(getByText(item.label)).toBeInTheDocument()
                : expect(queryByText(item.label)).not.toBeInTheDocument();
        });
        act(() => {
            fireEvent.click(getByRole('button', { name: 'Show more data' }));
        });

        // Expanded for more data.
        journalFieldsMap.map(item => {
            expect(getByText(item.label)).toBeInTheDocument();
        });

        // contracted to less data
        act(() => {
            fireEvent.click(getByRole('button', { name: 'Show less data' }));
        });
        journalFieldsMap.map(item => {
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
            dataItem.fez_journal_jcr_ssci = {
                fez_journal_jcr_ssci_category: [
                    {
                        jnl_jcr_ssci_category_quartile: 'Q2',
                    },
                ],
            };

            // Make sure the title of the Journal is in the document as per the data.
            const titlesElement = getByTestId(sanitiseId(`${dataItem.jnl_jid}-${dataItem.jnl_title}-link`));
            expect(titlesElement).toBeInTheDocument();
            expect(titlesElement).toHaveTextContent(dataItem.jnl_title);
            const dataElement = getByTestId(`journal-list-data-col-2-min-${index}`);
            // Only using the first few items in the map for minified view.
            journalFieldsMap.slice(0, 3).map(fieldMap => {
                switch (fieldMap.label) {
                    case 'Highest quartile':
                        // data appended with Q
                        break;
                    case 'Open Access':
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
            const titlesElement = getByTestId(sanitiseId(`${dataItem.jnl_jid}-${dataItem.jnl_title}-link`));
            expect(titlesElement).toBeInTheDocument();
            expect(titlesElement).toHaveTextContent(journalFieldsMap[0].translateFn(dataItem));

            const dataElement = getByTestId(`journal-list-data-col-2-full-${index}`);
            journalFieldsMap.slice(1).map(fieldMap => {
                switch (fieldMap.label) {
                    case 'Highest quartile':
                        // data appended with Q
                        expect(dataElement).toHaveTextContent(`Q${fieldMap.translateFn(dataItem)}`);
                        break;
                    case 'Open access':
                        // expect tooltip to match supplied data.
                        expect(dataElement.querySelector('p')).toHaveAttribute(
                            'aria-label',
                            fieldMap.toolTipLabel(dataItem),
                        );
                        break;
                    case 'CiteScore percentile':
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

    // coverage
    it('should not show quartile information if not in dataset', () => {
        mockData.data.map(dataItem => {
            dataItem.fez_journal_cite_score = null;
            dataItem.fez_journal_jcr_scie = null;
            dataItem.fez_journal_jcr_ssci = null;

            journalFieldsMap.slice(1).map(fieldMap => {
                switch (fieldMap.label) {
                    case 'Highest quartile':
                    case 'Impact factor':
                    case 'SNIP':
                    case 'SJR':
                        expect(fieldMap.translateFn(dataItem)).toEqual(null);
                        break;
                    case 'CiteScore':
                        expect(fieldMap.translateFn(dataItem)).toEqual('');
                        break;
                    case 'CiteScore percentile':
                    case 'Impact factor percentile':
                        expect(fieldMap.translateFn(dataItem)).toEqual(undefined);
                        expect(fieldMap.toolTipLabel(dataItem)).toEqual(undefined);
                        break;
                    default:
                        break;
                }
            });
        });
        mockData.data.map(dataItem => {
            dataItem.fez_journal_jcr_scie = null;
            dataItem.fez_journal_jcr_ssci = {
                fez_journal_jcr_ssci_category: [
                    {
                        jnl_jcr_ssci_category_jif_percentile: 10,
                        jnl_jcr_ssci_category_description_lookup: 'test',
                    },
                ],
            };
            journalFieldsMap.slice(1).map(fieldMap => {
                switch (fieldMap.label) {
                    case 'Impact factor percentile':
                        expect(fieldMap.toolTipLabel(dataItem)).toEqual('10 - test');
                        expect(fieldMap.translateFn(dataItem)).toEqual('10 - test');
                        break;
                    case 'Impact factor':
                        expect(fieldMap.translateFn(dataItem)).toEqual(null);
                        break;
                    default:
                        break;
                }
            });
        });
    });
});
