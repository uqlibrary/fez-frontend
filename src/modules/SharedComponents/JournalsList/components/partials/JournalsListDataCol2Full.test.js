import React from 'react';
import { render } from 'test-utils';
import JournalsListDataCol2Full from './JournalsListDataCol2Full';
import JournalFieldsMap from './JournalFieldsMap';
import mockData from 'mock/data/testing/journals/journals';
const setup = (state = {}) => {
    return render(<JournalsListDataCol2Full {...{ index: 0, journal: mockData[0], ...state }} />);
};
describe('JournalsListDataCol2 Full', () => {
    it('should render baseline element', () => {
        const { getByTestId } = setup();
        expect(getByTestId('journal-list-data-col-2-full-0')).toBeInTheDocument();
    });
    it('should render correct content in fields', () => {
        // Adjust mock data with required elements for test coverage.
        mockData[1].fez_journal_cite_score = {
            fez_journal_cite_score_asjc_code: [],
        };
        mockData[1].fez_journal_doaj = true;
        mockData.map(mockItem => {
            // Adjust mock data with required elements for test coverage.
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
                        expect(getByText(`Q${fieldMap.translateFn(mockItem)}`)).toBeInTheDocument();
                        break;
                    case 'CiteScore percentile':
                        if (fieldMap.toolTipLabel(mockItem)) {
                            expect(
                                document.querySelector(`p[aria-label='${fieldMap.toolTipLabel(mockItem)}']`),
                            ).toBeInTheDocument();
                        }
                        break;
                    case 'Impact factor':
                    case 'SJR':
                        if (fieldMap.translateFn(mockItem)) {
                            expect(getByText(`${fieldMap.translateFn(mockItem)}`)).toBeInTheDocument();
                        }
                        break;
                    default:
                        break;
                }
            });
        });
    });
});
