import React from 'react';
import { fireEvent, render, WithReduxStore, WithRouter, act } from 'test-utils';
import { FavouriteJournals } from '../index';
import Immutable from 'immutable';
import mockData from '../../../mock/data/testing/journals/journals';
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

    it('should toggle selection of all favourite journals', () => {
        const selectAllCheckboxSelectorString = 'journal-list-header-col-1-select-all';
        const checkboxSelectorString = 'input[id^="journal-list-data-col-1-checkbox-"]:checked';
        mocks.useDispatch = jest.spyOn(redux, 'useDispatch');
        mocks.useDispatch.mockImplementation(() => () => Promise.resolve(true));
        const { queryByTestId, container } = setup({
            state: { loading: false, response: { total: 1, data: mockData } },
        });

        expect(queryByTestId(selectAllCheckboxSelectorString)).toBeInTheDocument();

        expect(container.querySelectorAll(checkboxSelectorString).length).toBe(0);

        act(() => {
            fireEvent.click(queryByTestId(selectAllCheckboxSelectorString));
        });

        expect(container.querySelectorAll(checkboxSelectorString).length).toBe(2);

        act(() => {
            fireEvent.click(queryByTestId(selectAllCheckboxSelectorString));
        });

        expect(container.querySelectorAll(checkboxSelectorString).length).toBe(0);
    });

    it('should remove journal ', () => {
        mocks.useState = jest.spyOn(React, 'useState');
        mocks.useState
            .mockImplementationOnce(() => [{ [mockData[0].jnl_jid]: true }, jest.fn()])
            .mockImplementationOnce(() => [false, jest.fn()]);
        mocks.useDispatch = jest.spyOn(redux, 'useDispatch');
        mocks.useDispatch.mockImplementation(() => () => Promise.resolve(true));
        const { getByTestId, queryByTestId } = setup({
            state: { loading: false, response: { total: 1, data: mockData } },
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
