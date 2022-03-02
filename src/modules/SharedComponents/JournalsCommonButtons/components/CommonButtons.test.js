import React from 'react';
import { render, WithRouter, act, fireEvent } from 'test-utils';
import { createMemoryHistory } from 'history';
import { CommonButtons } from '../index';

const setup = ({ state = {}, testHistory = createMemoryHistory({ initialEntries: ['/'] }) } = {}) => {
    return render(
        <WithRouter history={testHistory}>
            <CommonButtons {...state} />
        </WithRouter>,
    );
};

describe('CommonButtons', () => {
    it('should render', () => {
        const { queryByTestId } = setup();
        expect(queryByTestId('journal-search-favourite-journals-button')).toBeInTheDocument();
        expect(queryByTestId('journal-search-browse-all-button')).toBeInTheDocument();
    });

    it('should not render Search All Journals button with prop "browseAllJournals:true"', () => {
        const { queryByTestId } = setup({ state: { browseAllJournals: true } });
        expect(queryByTestId('journal-search-favourite-journals-button')).toBeInTheDocument();
        expect(queryByTestId('journal-search-browse-all-button')).not.toBeInTheDocument();
    });

    it('should change URL when Favourite Journals button pressed', () => {
        const testHistory = createMemoryHistory({ initialEntries: ['/'] });

        const { queryByTestId } = setup({ testHistory });
        expect(queryByTestId('journal-search-favourite-journals-button')).toBeInTheDocument();

        act(() => {
            fireEvent.click(queryByTestId('journal-search-favourite-journals-button'));
        });

        expect(testHistory.location.pathname).toContain('journals/favourites/');
    });

    it('should call supplied function when Search All Journals button pressed', () => {
        const mockHandleSearchAllJournalsFn = jest.fn();
        const { queryByTestId } = setup({ state: { onSearchAll: mockHandleSearchAllJournalsFn } });
        expect(queryByTestId('journal-search-browse-all-button')).toBeInTheDocument();

        act(() => {
            fireEvent.click(queryByTestId('journal-search-browse-all-button'));
        });

        expect(mockHandleSearchAllJournalsFn).toHaveBeenCalled();
    });
});
