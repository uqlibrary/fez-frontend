import React from 'react';
import { render, WithReduxStore, WithRouter } from 'test-utils';
import { locale } from '../../../locale';
import * as mockData from 'mock/data/testing/journals/journalComparison';
import { JournalComparisonList } from './JournalComparisonList';

function setup(testProps = {}) {
    return render(
        <WithRouter>
            <WithReduxStore>
                <JournalComparisonList {...testProps} />
            </WithReduxStore>
        </WithRouter>,
    );
}

describe('JournalComparison', () => {
    it('should render when there are no journals to compare', () => {
        const { getByText } = setup();
        expect(getByText(locale.components.journalComparison.list.empty)).toBeInTheDocument();
    });
    it('should render when there are journals to compare', async () => {
        const { getByText } = setup({ journals: mockData.journals });
        mockData.journals.map(journal => expect(getByText(journal.jnl_title)).toBeInTheDocument());
    });
});
