import React from 'react';
import { render, WithReduxStore, WithRouter } from 'test-utils';
import { JournalComparison } from '../index';

const setup = () => {
    return render(
        <WithRouter>
            <WithReduxStore>
                <JournalComparison />
            </WithReduxStore>
        </WithRouter>,
    );
};

describe('JournalComparison', () => {
    it('should render', () => {
        const { queryByTestId } = setup();
        expect(queryByTestId('return-to-search-results-button')).toBeInTheDocument();
    });
});
