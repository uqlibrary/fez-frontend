import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import JournalsListDataRow from './JournalsListDataRow';
import { JournalFieldsMap as fieldMappings } from './JournalFieldsMap';
import mockData from 'mock/data/testing/journals/journals';
import { WithReduxStore, fireEvent, render, act } from 'test-utils';
import Immutable from 'immutable';
import { sanitiseId } from 'helpers/general';
const defaultTestData = {
    row: mockData[0],
    index: 0,
};

const setup = ({ testData = { ...defaultTestData }, ...state }) => {
    const onChange = state.onChange ?? jest.fn();
    return render(
        <WithReduxStore initialState={Immutable.Map({ searchJournalsReducer: state })}>
            <Table>
                <TableBody>
                    <JournalsListDataRow {...testData} {...state} onChange={onChange} />
                </TableBody>
            </Table>
        </WithReduxStore>,
    );
};

describe('JournalsListDataRow', () => {
    const journalFieldsMap = fieldMappings();

    it('should render a row', () => {
        const { getByTestId } = setup({ isSelectable: true, checked: false });
        expect(getByTestId('journal-list-data-col-1-checkbox-0')).toBeInTheDocument();
        expect(getByTestId('journal-list-data-col-1-checkbox-0')).not.toHaveAttribute('disabled');
        expect(getByTestId('journal-list-data-col-1-checkbox-0')).not.toHaveAttribute('checked');

        expect(getByTestId('journal-list-expander-btn-0')).toBeInTheDocument();

        // title link
        const linkId = sanitiseId(`${defaultTestData.row.jnl_jid}-${defaultTestData.row.jnl_title}-link`);
        expect(getByTestId(linkId)).toBeInTheDocument();
        expect(getByTestId(linkId)).toHaveTextContent(defaultTestData.row.jnl_title);
    });

    it('should render correct content in fields on desktop', () => {
        // set default blank data for test coverage for one of the journal items.
        mockData[1].fez_journal_cite_score = {
            fez_journal_cite_score_asjc_code: [],
        };
        mockData.map(mockItem => {
            // set default data in journal needed for test - not supplied.
            mockItem.fez_journal_jcr_ssci = {
                jnl_jcr_ssci_impact_factor: 5,
                fez_journal_jcr_ssci_category: {
                    fez_journal_jcr_ssci_category_quartile: 3,
                },
            };
            document.body.innerHTML = '';
            const { getByText } = setup({ journal: mockItem });
            journalFieldsMap.slice(1).map(fieldMap => {
                switch (fieldMap.label) {
                    case 'Highest quartile':
                        // data appended with Q
                        expect(getByText(`Q${fieldMap.translateFn(mockItem)}`)).toBeInTheDocument();
                        break;
                    case 'Open Access':
                        // expect tooltip to match supplied data.
                        expect(document.querySelector('p').title).toEqual(fieldMap.toolTipLabel(mockItem));
                        break;
                    default:
                        break;
                }
            });
        });
    });

    it('should render correct content in fields on mobile', () => {
        // set default blank data for test coverage for one of the journal items.
        mockData[1].fez_journal_cite_score = {
            fez_journal_cite_score_asjc_code: [],
        };
        mockData.map(mockItem => {
            // set default data in journal needed for test - not supplied.
            mockItem.fez_journal_jcr_ssci = {
                jnl_jcr_ssci_impact_factor: 5,
                fez_journal_jcr_ssci_category: {
                    fez_journal_jcr_ssci_category_quartile: 3,
                },
            };
            document.body.innerHTML = '';
            const { getByText } = setup({ journal: mockItem });
            journalFieldsMap
                .filter(item => item.compactView)
                .slice(1)
                .map(fieldMap => {
                    expect(getByText(fieldMap.label)).toBeInTheDocument();
                    switch (fieldMap.label) {
                        case 'Highest quartile':
                            // data appended with Q
                            expect(getByText(`Q${fieldMap.translateFn(mockItem)}`)).toBeInTheDocument();
                            break;
                        case 'Open Access':
                            // expect tooltip to match supplied data.
                            expect(document.querySelector('p').title).toEqual(fieldMap.toolTipLabel(mockItem));
                            break;
                        default:
                            break;
                    }
                });
        });
    });

    it('should render nothing if no data provided', () => {
        const testData = {
            row: undefined,
            index: 0,
        };
        const { queryByText } = setup({ testData });
        journalFieldsMap
            .filter(item => item.compactView)
            .map(item => {
                expect(queryByText(item.label)).not.toBeInTheDocument();
            });
    });

    // it('should render tooltip', () => {
    //     setup({ isSelectable: true, checked: false });
    //     expect(document.querySelector('p[title="Use filters to find alternate pathways"]')).toBeInTheDocument();
    // });

    it('should expand to show item details when button clicked on desktop', () => {
        const { getByTestId } = setup({ isSelectable: true, checked: false });

        expect(getByTestId('journal-list-expander-btn-0')).toBeInTheDocument();
        act(() => {
            fireEvent.click(getByTestId('journal-list-expander-btn-0'));
        });
        expect(getByTestId('journal-list-collapse-panel-0')).toBeInTheDocument();
    });
});
