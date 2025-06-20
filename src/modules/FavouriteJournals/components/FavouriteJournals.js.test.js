import React from 'react';
import { fireEvent, render, WithReduxStore, WithRouter, act } from 'test-utils';
import { FavouriteJournals } from '../index';
import mockData from '../../../mock/data/testing/journals/journals';
import * as redux from 'react-redux';

const setup = ({ state = {} } = {}) => {
    return render(
        <WithRouter>
            <WithReduxStore initialState={{ favouriteJournalsReducer: state }}>
                <FavouriteJournals />
            </WithReduxStore>
        </WithRouter>,
    );
};

const mocks = {};
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn(),
}));
describe('FavouriteJournals', () => {
    afterEach(() => {
        Object.keys(mocks).map(name => mocks[name].mockRestore());
    });

    it('should toggle selection of all favourite journals', () => {
        const selectAllCheckboxSelectorString = 'journal-list-header-col-1-select-all';
        const checkboxSelectorString = 'input[id^="journal-list-data-col-1-checkbox-"]:checked';
        mocks.useDispatch = redux.useDispatch;
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

    it('should toggle on/off all favourite journals checkbox if each available journal is manually selected', () => {
        const selectAllFavouritesCheckboxSelectorString = 'journal-list-header-col-1-select-all';
        const selectAllFavouritesCheckedCheckboxSelectorString =
            'input[id="journal-list-header-col-1-select-all"]:checked';
        const checkboxUncheckedSelectorString = 'input[id^="journal-list-data-col-1-checkbox-"]';
        const checkboxCheckedSelectorString = 'input[id^="journal-list-data-col-1-checkbox-"]:checked';
        mocks.useDispatch = redux.useDispatch;
        mocks.useDispatch.mockImplementation(() => () => Promise.resolve(true));
        const { queryByTestId, container } = setup({
            state: { loading: false, response: { total: 1, data: mockData } },
        });

        expect(queryByTestId(selectAllFavouritesCheckboxSelectorString)).toBeInTheDocument();
        expect(container.querySelectorAll(selectAllFavouritesCheckedCheckboxSelectorString).length).toBe(0);

        expect(container.querySelectorAll(checkboxCheckedSelectorString).length).toBe(0);

        container.querySelectorAll(checkboxUncheckedSelectorString).forEach(checkbox => {
            // don't wrap these calls in act(), as this actually prevents the "all" checkbox updating
            fireEvent.click(checkbox);
        });

        expect(container.querySelectorAll(checkboxCheckedSelectorString).length).toBe(2);
        expect(container.querySelectorAll(selectAllFavouritesCheckedCheckboxSelectorString).length).toBe(1);

        fireEvent.click(container.querySelectorAll(checkboxUncheckedSelectorString)[0]);

        expect(container.querySelectorAll(checkboxCheckedSelectorString).length).toBe(1);
        expect(container.querySelectorAll(selectAllFavouritesCheckedCheckboxSelectorString).length).toBe(0);
    });

    it('should remove journal ', () => {
        mocks.useState = jest.spyOn(React, 'useState');
        mocks.useState
            .mockImplementationOnce(() => [{ [mockData[0].jnl_jid]: true }, jest.fn()])
            .mockImplementationOnce(() => [false, jest.fn()]);
        mocks.useDispatch = redux.useDispatch;
        mocks.useDispatch.mockImplementation(() => () => Promise.resolve(true));
        const { getByTestId, queryByTestId } = setup({
            state: { loading: false, response: { total: 1, data: mockData } },
        });
        expect(queryByTestId('remove-from-favourites-button')).toBeInTheDocument();
        fireEvent.click(getByTestId('remove-from-favourites-button'));
    });

    it('should render when there are no favs', () => {
        mocks.useDispatch = redux.useDispatch;
        mocks.useDispatch.mockImplementation(() => () => Promise.resolve(true));
        const { queryByTestId } = setup();
        expect(queryByTestId('remove-from-favourites-button')).not.toBeInTheDocument();
        expect(queryByTestId('return-to-search-results-button')).toBeInTheDocument();
    });
});
