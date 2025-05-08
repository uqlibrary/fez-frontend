import React from 'react';
import { render, WithReduxStore } from 'test-utils';
import { mockData } from 'mock/data/testing/journals/journalSearchResults';
import { default as JournalsListLegacy } from './JournalsListLegacy';
import JournalFieldsMap from './partials/JournalFieldsMap';
import { sanitiseId } from 'helpers/general';
import locale from 'locale/components';
import { types, status, getIndicatorProps } from './partials/utils';

const testData = {
    journals: mockData.data,
    minimalView: true,
};

const setup = ({ state = {} }) => {
    return render(
        <WithReduxStore initialState={{ searchJournalsReducer: state }}>
            <JournalsListLegacy {...testData} />
        </WithReduxStore>,
    );
};

const checkOaTooltips = (dataElement, dataItem) => {
    const tooltipLocale = locale.components.searchJournals.openAccessIndicators.tooltips;
    const publishedIndicatorProps = getIndicatorProps({ type: types.published, data: dataItem });
    const acceptedIndicatorProps = getIndicatorProps({ type: types.accepted, data: dataItem });

    // expect tooltip to match supplied data.
    if (publishedIndicatorProps) {
        expect(dataElement.querySelector('.openAccessIndicator')).toHaveAttribute(
            'aria-label',
            tooltipLocale[publishedIndicatorProps.type][publishedIndicatorProps.status],
        );
    }
    if (publishedIndicatorProps && publishedIndicatorProps.status !== status.open && acceptedIndicatorProps) {
        expect(dataElement.querySelector('.openAccessIndicator')).toHaveAttribute(
            'aria-label',
            tooltipLocale[acceptedIndicatorProps.type][acceptedIndicatorProps.status],
        );
    }
    if (!!!publishedIndicatorProps && !!!acceptedIndicatorProps) {
        expect(dataElement.querySelector('.openAccessIndicator')).not.toHaveAttribute('aria-label');
    }
};

describe('Journal Search Results list', () => {
    it('should show all columns in the default view', () => {
        const { getByText } = setup({
            ...testData,
        });
        JournalFieldsMap.map(item => {
            expect(getByText(item.label)).toBeInTheDocument();
        });
    });

    it('should show the correct information in the table, maximised', () => {
        const { getByTestId } = setup({
            ...testData,
        });

        mockData.data.map((dataItem, index) => {
            // Make sure the title of the Journal is in the document as per the data.
            const titlesElement = getByTestId(sanitiseId(`${dataItem.jnl_jid}-${dataItem.jnl_title}-link`));
            expect(titlesElement).toBeInTheDocument();
            expect(titlesElement).toHaveTextContent(JournalFieldsMap[0].translateFn(dataItem));

            const dataElement = getByTestId(`journal-list-data-col-2-full-${index}`);
            JournalFieldsMap.slice(1).map(fieldMap => {
                switch (fieldMap.label) {
                    case 'Highest quartile':
                        // data appended with Q
                        expect(dataElement).toHaveTextContent(`Q${fieldMap.translateFn(dataItem)}`);
                        break;
                    case 'Open access':
                        checkOaTooltips(dataElement, dataItem);
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

            JournalFieldsMap.slice(1).map(fieldMap => {
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
            JournalFieldsMap.slice(1).map(fieldMap => {
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
