import React from 'react';
import { render, WithRouter, act, fireEvent } from 'test-utils';
import { createMemoryHistory } from 'history';
import BackToSearchButton from './BackToSearchButton';

const setup = ({ state = {}, testHistory = createMemoryHistory({ initialEntries: ['/'] }) } = {}) => {
    return render(
        <WithRouter history={testHistory}>
            <BackToSearchButton {...state} />
        </WithRouter>,
    );
};

describe('Back To Search button', () => {
    it('should render', () => {
        const { queryByTestId } = setup({});
        expect(queryByTestId('return-to-search-results-button')).toBeInTheDocument();
    });

    it('should return back to / when clicked', () => {
        const testHistory = createMemoryHistory({ initialEntries: ['/'] });
        const { queryByTestId } = setup({});
        expect(queryByTestId('return-to-search-results-button')).toBeInTheDocument();
        act(() => {
            fireEvent.click(queryByTestId('return-to-search-results-button'));
        });
        expect(testHistory.location.pathname).toEqual('/');
    });

    it('should return back to previous location if supplied', () => {
        const testHistory = createMemoryHistory({ initialEntries: ['/'] });
        const { queryByTestId } = setup({
            testHistory,
            state: {
                prevLocation: { pathname: '/test', search: '?query=abc', isActive: true },
            },
        });
        expect(queryByTestId('return-to-search-results-button')).toBeInTheDocument();
        act(() => {
            fireEvent.click(queryByTestId('return-to-search-results-button'));
        });
        expect(testHistory.location.pathname).toEqual('/test');
    });
});
