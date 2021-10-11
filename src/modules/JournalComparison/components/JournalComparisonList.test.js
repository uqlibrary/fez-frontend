import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render } from 'test-utils';
import { locale } from '../../../locale';
import * as mockData from 'mock/data/testing/journals/journalComparison';
import { JournalComparisonList } from './JournalComparisonList';

function setup(testProps = {}) {
    const mockStore = configureStore();
    return render(
        <Provider store={mockStore({})}>
            <JournalComparisonList {...testProps} />
        </Provider>,
    );
}

describe('JournalComparisonList', () => {
    it('should render when there are no journals to compare', () => {
        const { getByText } = setup();
        expect(getByText(locale.components.journalComparison.list.empty)).toBeInTheDocument();
    });
    it('should render when there are journals to compare', async () => {
        const { getByText } = setup({ journals: mockData.journals });
        mockData.journals.map(journal => expect(getByText(journal.jnl_title)).toBeInTheDocument());
    });
});
