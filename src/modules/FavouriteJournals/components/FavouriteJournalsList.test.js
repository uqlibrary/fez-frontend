import React from 'react';
import mockData from 'mock/data/testing/journals/journals';
import { FavouriteJournalsList } from './FavouriteJournalsList';
import { render, WithReduxStore, WithRouter } from 'test-utils';
import locale from 'locale/components';

function setup(testProps = {}) {
    return render(
        <WithReduxStore>
            <WithRouter>
                <FavouriteJournalsList {...testProps} />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('FavouriteJournalsList', () => {
    it('should render', () => {
        const { queryByTestId } = setup();
        expect(queryByTestId('favourite-journals-list-nothing')).toBeInTheDocument();
        expect(queryByTestId('favourite-journals-list-loading')).not.toBeInTheDocument();
        expect(queryByTestId('favourite-journals-list-empty')).not.toBeInTheDocument();
        expect(queryByTestId('favourite-journals-list-error')).not.toBeInTheDocument();
    });
    it('should display loading message', () => {
        const { getByText, queryByTestId } = setup({ loading: true });
        expect(queryByTestId('favourite-journals-list-nothing')).not.toBeInTheDocument();
        expect(queryByTestId('favourite-journals-list-loading')).toBeInTheDocument();
        expect(queryByTestId('favourite-journals-list-empty')).not.toBeInTheDocument();
        expect(queryByTestId('favourite-journals-list-error')).not.toBeInTheDocument();
        expect(getByText(locale.components.favouriteJournals.favouriteJournalsList.loading)).toBeInTheDocument();
    });
    it('should render when there are no fav journals', () => {
        const { getByText, queryByTestId } = setup({ loaded: true, journalsList: { total: 0 } });
        expect(queryByTestId('favourite-journals-list-nothing')).not.toBeInTheDocument();
        expect(queryByTestId('favourite-journals-list-loading')).not.toBeInTheDocument();
        expect(queryByTestId('favourite-journals-list-empty')).toBeInTheDocument();
        expect(queryByTestId('favourite-journals-list-error')).not.toBeInTheDocument();
        expect(getByText(locale.components.favouriteJournals.favouriteJournalsList.empty)).toBeInTheDocument();
    });
    it('should display loading error', () => {
        const { queryByTestId } = setup({ loaded: true, error: {} });
        expect(queryByTestId('favourite-journals-list-nothing')).not.toBeInTheDocument();
        expect(queryByTestId('favourite-journals-list-loading')).not.toBeInTheDocument();
        expect(queryByTestId('favourite-journals-list-empty')).not.toBeInTheDocument();
        expect(queryByTestId('favourite-journals-list-error')).toBeInTheDocument();
    });
    it('should render when there are fav journals', () => {
        const { getByTestId } = setup({
            loaded: true,
            journalsList: { total: mockData.length, data: mockData },
        });

        expect(getByTestId('publication-list-sorting-sort-by')).toBeInTheDocument();
        expect(getByTestId('journal-list')).toBeInTheDocument();
    });
    it('should render when there are fav journals with pagination', () => {
        const { getByTestId } = setup({
            loaded: true,
            journalsList: { total: mockData.length, data: mockData },
            journalSearchQueryParams: {
                sortBy: 'title',
                sortDirection: 'Asc',
            },
        });

        expect(getByTestId('search-journals-paging-top')).toBeInTheDocument();
        expect(getByTestId('search-journals-paging-bottom')).toBeInTheDocument();
        expect(getByTestId('publication-list-sorting-sort-by')).toBeInTheDocument();
        expect(getByTestId('journal-list')).toBeInTheDocument();
    });
});
