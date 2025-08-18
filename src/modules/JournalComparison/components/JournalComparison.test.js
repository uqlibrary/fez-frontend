import React from 'react';
import { render, WithReduxStore, WithRouter } from 'test-utils';
import { JournalComparison } from '../index';

import { useLocation } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn(() => ({ pathname: '/', search: '' })),
}));

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
    it('should render with journals', () => {
        useLocation.mockImplementationOnce(() => ({
            state: {
                journals: [],
            },
        }));
        const { queryByTestId } = setup();
        expect(queryByTestId('return-to-search-results-button')).toBeInTheDocument();
    });
});
