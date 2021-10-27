import React from 'react';
import { fireEvent, render, WithReduxStore, WithRouter } from 'test-utils';
import { FavouriteJournals } from '../index';
import Immutable from 'immutable';
import * as mockData from '../../../mock/data/testing/journals/journalComparison';
import * as redux from 'react-redux';

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
    it('should remove journal ', () => {
        mocks.useState = jest.spyOn(React, 'useState');
        mocks.useState.mockImplementation(() => [{ [mockData.journals[0].jnl_jid]: true }, jest.fn()]);
        mocks.useDispatch = jest.spyOn(redux, 'useDispatch');
        mocks.useDispatch.mockImplementation(() => () => Promise.resolve(true));
        const { getByTestId, queryByTestId } = setup({
            state: { loading: false, response: { total: 1, data: mockData.journals } },
        });
        expect(queryByTestId('remove-from-favourites-button')).toBeInTheDocument();
        fireEvent.click(getByTestId('remove-from-favourites-button'));
    });
    it('should render when there are favs', () => {
        const { queryByTestId } = setup();
        expect(queryByTestId('remove-from-favourites-button')).not.toBeInTheDocument();
        expect(queryByTestId('return-to-search-results-button')).toBeInTheDocument();
    });
});
