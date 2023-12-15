import React from 'react';
import { render } from 'test-utils';
import JournalsListDataCol2Min from './JournalsListDataCol2Min';
import JournalFieldsMap from './JournalFieldsMap';
import mockData from 'mock/data/testing/journals/journals';

const setup = (testProps = {}) => {
    return render(<JournalsListDataCol2Min {...{ index: 0, journal: mockData[0], ...testProps }} />);
};

describe('JournalsListDataCol2 Min', () => {
    it('should render baseline element', () => {
        const { getByTestId } = setup();
        expect(getByTestId('journal-list-data-col-2-min-0')).toBeInTheDocument();
    });
    it('should include a tooltip', () => {
        const mockMapping = JournalFieldsMap.filter(map => map.key === 'highest_quartile')[0];
        mockMapping.showTooltip = true;
        mockMapping.toolTipLabel = () => 'Test tooltip';
        const { getByText } = setup({ journal: mockData[0] });

        expect(getByText('Q1')).toBeInTheDocument();
        expect(document.querySelector('.MuiGrid2-root:not(.MuiGrid2-container):last-of-type p')).toHaveAttribute(
            'title',
            'Test tooltip',
        );
    });
    it('should include a tooltip (coverage)', () => {
        const mockMapping = JournalFieldsMap.filter(map => map.key === 'highest_quartile')[0];
        mockMapping.showTooltip = true;
        mockMapping.toolTipLabel = null;
        const oldFn = mockMapping.translateFn;
        mockMapping.translateFn = () => 'Test tooltip 2';
        const { getByText } = setup({ journal: mockData[0] });

        expect(getByText('QTest tooltip 2')).toBeInTheDocument();
        expect(document.querySelector('.MuiGrid2-root:not(.MuiGrid2-container):last-of-type p')).toHaveAttribute(
            'title',
            'Test tooltip 2',
        );
        mockMapping.translateFn = oldFn;
    });
    it('should render correct content in fields', () => {
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
            JournalFieldsMap.slice(1).map(fieldMap => {
                switch (fieldMap.label) {
                    case 'Highest quartile':
                        // data appended with Q
                        expect(getByText(`Q${fieldMap.translateFn(mockItem)}`)).toBeInTheDocument();
                        break;
                    case 'Open Access':
                        // expect tooltip to match supplied data.
                        expect(document.querySelector('p')).toHaveAttribute(
                            'aria-label',
                            fieldMap.toolTipLabel(mockItem),
                        );
                        break;
                    default:
                        break;
                }
            });
        });
    });

    it('should not render content or label if no valid data returned from translateFn', () => {
        // set default blank data for test coverage for one of the journal items.
        const mockMapping = JournalFieldsMap.filter(map => map.key === 'highest_quartile')[0];
        mockMapping.showTooltip = false;
        mockMapping.toolTipLabel = () => null;

        mockData[0].fez_journal_cite_score = {
            fez_journal_cite_score_asjc_code: [{}],
        };
        const { queryByText } = setup({ journal: mockData[0] });
        expect(queryByText('Q')).not.toBeInTheDocument();

        expect(document.querySelector('.MuiGrid2-root:not(.MuiGrid2-container):last-of-type p')).not.toHaveAttribute(
            'title',
        );
    });
});
