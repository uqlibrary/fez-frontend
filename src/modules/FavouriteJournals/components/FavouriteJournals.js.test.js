import React from 'react';
import { fireEvent, render, WithReduxStore, WithRouter } from 'test-utils';
import { FavouriteJournals } from '../index';
import Immutable from 'immutable';
import * as mockData from '../../../mock/data/testing/journals/journalComparison';

const setup = ({ state = {} } = {}) => {
    return render(
        <WithRouter>
            <WithReduxStore initialState={Immutable.Map({ favouriteJournalsReducer: state })}>
                <FavouriteJournals />
            </WithReduxStore>
        </WithRouter>,
    );
};

const mocks = {};
describe('FavouriteJournals', () => {
    afterEach(() => {
        Object.keys(mocks).map(name => mocks[name].mockRestore());
    });
    it('should render when there no are fav journals ', () => {
        mocks.useState = jest.spyOn(React, 'useState');
        mocks.useState.mockImplementation(() => [{ [mockData.journals[0].jnl_jid]: true }, jest.fn()]);
        const { getByTestId, queryByTestId } = setup({
            state: { loading: false, response: { total: 1, data: mockData.journals } },
        });
        expect(queryByTestId('remove-from-favourites')).toBeInTheDocument();
        fireEvent.click(getByTestId('remove-from-favourites'));
    });
    it('should render when there are fav journals', () => {
        const { queryByTestId } = setup();
        expect(queryByTestId('remove-from-favourites')).not.toBeInTheDocument();
        expect(queryByTestId('return-to-search-results-button')).toBeInTheDocument();
    });
});
