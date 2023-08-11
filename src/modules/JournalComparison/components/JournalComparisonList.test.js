import React from 'react';
import mockData from 'mock/data/testing/journals/journals';
import { JournalComparisonList } from './JournalComparisonList';
import { JournalsListLegacy } from 'modules/SharedComponents/JournalsList';
import locale from 'locale/components';
import { render, WithReduxStore } from 'test-utils';

const setup = (testProps = {}) => {
    return render(
        <WithReduxStore>
            <JournalComparisonList {...testProps} />
        </WithReduxStore>,
    );
};

describe('JournalComparisonList', () => {
    it('should render when there are no journals to compare', () => {
        const { getByText, queryByTestId } = setup();
        expect(queryByTestId('journal-list')).not.toBeInTheDocument();
        expect(getByText(locale.components.journalComparison.journalComparisonList.empty)).toBeInTheDocument();
    });
    it('should render when there are journals to compare', () => {
        const { getByTestId, getByText } = setup({ journals: mockData });
        expect(getByTestId('journal-list')).toBeInTheDocument();
        expect(getByText(mockData[0].jnl_title)).toBeInTheDocument();
        expect(getByText(mockData[1].jnl_title)).toBeInTheDocument();
    });
});
