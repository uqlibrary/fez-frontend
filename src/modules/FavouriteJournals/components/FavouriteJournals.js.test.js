import React from 'react';
import {
    fireEvent,
    userEvent,
    render,
    WithReduxStore,
    WithMemoryRouter,
    act,
    assertDisabled,
    assertEnabled,
} from 'test-utils';
import { Routes, Route } from 'react-router';
import { FavouriteJournals } from '../index';
import mockData from '../../../mock/data/testing/journals/journals';
import * as redux from 'react-redux';
import { loadLists, loadListItems, deleteListItems } from 'actions/journalUserLists';
import { useDispatchOnce } from 'hooks/useDispatchOnce';

jest.mock('actions/journalUserLists', () => ({
    loadLists: jest.fn(() => ({ type: 'LOAD_LISTS' })),
    loadListItems: jest.fn(() => ({ type: 'LOAD_LIST_ITEMS' })),
    deleteListItems: jest.fn(() => ({ type: 'DELETE_LIST_ITEMS' })),
}));

jest.mock('hooks/useDispatchOnce', () => ({
    useDispatchOnce: jest.fn(),
}));

jest.mock('modules/FavouriteJournals/components/ListSelect', () => ({
    __esModule: true,
    default: jest.fn(({ loading, lists, value, disabled, onChange }) => (
        <select
            data-testid="list-select"
            data-loading={String(!!loading)}
            data-lists-count={lists?.length || 0}
            value={value || ''}
            disabled={disabled}
            onChange={onChange}
        >
            <option value="">-</option>
            {(lists || []).map(l => (
                <option key={l.id} value={l.id}>
                    {l.name}
                </option>
            ))}
        </select>
    )),
}));

const setup = ({ state = {}, listsState = {}, listId = '123' } = {}) => {
    const route = listId ? `/favourites/${listId}` : '/favourites';
    return render(
        <WithMemoryRouter route={route}>
            <WithReduxStore
                initialState={{
                    favouriteJournalsReducer: state,
                    journalUserListsReducer: {
                        loading: false,
                        isDirty: false,
                        data: { data: [] },
                        ...listsState,
                    },
                }}
            >
                <Routes>
                    <Route path="/favourites/:id" element={<FavouriteJournals />} />
                    <Route path="/favourites" element={<FavouriteJournals />} />
                </Routes>
            </WithReduxStore>
        </WithMemoryRouter>,
    );
};

const mocks = {};
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn(),
}));

describe('FavouriteJournals', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mocks.useDispatch = redux.useDispatch;
        mocks.useDispatch.mockImplementation(() => () => Promise.resolve(true));
        useDispatchOnce.mockImplementation((condition, callback) => callback);
    });

    afterEach(() => {
        Object.keys(mocks).forEach(name => mocks[name].mockRestore());
    });

    it('should toggle selection of all favourite journals', () => {
        const selectAllCheckboxSelectorString = 'journal-list-header-col-1-select-all';
        const checkboxSelectorString = 'input[id^="journal-list-data-col-1-checkbox-"]:checked';
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
        const { queryByTestId, container } = setup({
            state: { loading: false, response: { total: 1, data: mockData } },
        });

        expect(queryByTestId(selectAllFavouritesCheckboxSelectorString)).toBeInTheDocument();
        expect(container.querySelectorAll(selectAllFavouritesCheckedCheckboxSelectorString).length).toBe(0);
        expect(container.querySelectorAll(checkboxCheckedSelectorString).length).toBe(0);

        container.querySelectorAll(checkboxUncheckedSelectorString).forEach(checkbox => {
            fireEvent.click(checkbox);
        });

        expect(container.querySelectorAll(checkboxCheckedSelectorString).length).toBe(2);
        expect(container.querySelectorAll(selectAllFavouritesCheckedCheckboxSelectorString).length).toBe(1);

        fireEvent.click(container.querySelectorAll(checkboxUncheckedSelectorString)[0]);

        expect(container.querySelectorAll(checkboxCheckedSelectorString).length).toBe(1);
        expect(container.querySelectorAll(selectAllFavouritesCheckedCheckboxSelectorString).length).toBe(0);
    });

    it('should remove journal', async () => {
        const { getByTestId, container } = setup({
            state: { loading: false, response: { total: 1, data: mockData } },
        });

        expect(getByTestId('remove-from-favourites-button')).toBeInTheDocument();
        assertDisabled(getByTestId('remove-from-favourites-button'));

        const firstCheckbox = container.querySelector('input[id^="journal-list-data-col-1-checkbox-"]');
        await userEvent.click(firstCheckbox);
        assertEnabled(getByTestId('remove-from-favourites-button'));

        await userEvent.click(getByTestId('remove-from-favourites-button'));

        expect(deleteListItems).toHaveBeenCalledWith(
            expect.objectContaining({ id: '123', ids: expect.arrayContaining([expect.any(String)]) }),
        );
        expect(deleteListItems.mock.calls[0][0].ids).toHaveLength(1);
    });

    it('should not load list items when no list is selected', () => {
        setup({ listId: '' });

        expect(loadListItems).not.toHaveBeenCalled();
    });

    it('should load list items for the selected list', () => {
        setup({ listId: '123', state: { loading: false, response: { total: 1, data: mockData } } });

        expect(loadListItems).toHaveBeenCalledWith(expect.objectContaining({ id: '123' }));
    });

    it('should fetch lists once favourites have loaded and are not dirty', () => {
        setup({
            state: { loading: false, response: { total: 1, data: mockData } },
            listsState: { isDirty: false },
        });

        expect(useDispatchOnce).toHaveBeenCalledWith(true, expect.any(Function));

        const [, callback] = useDispatchOnce.mock.calls[0];
        callback();
        expect(loadLists).toHaveBeenCalled();
    });

    it('should not fetch lists while dirty or before favourites have loaded', () => {
        setup({
            state: { loading: false, response: undefined },
            listsState: { isDirty: false },
        });

        expect(useDispatchOnce).toHaveBeenCalledWith(false, expect.any(Function));
    });

    it('should pass loading and lists data down to ListSelect', () => {
        const { getByTestId } = setup({
            listId: '123',
            listsState: { loading: true, data: { data: [{ id: '123', name: 'List A' }] } },
        });

        const select = getByTestId('list-select');
        expect(select.dataset.loading).toBe('true');
        expect(select.dataset.listsCount).toBe('1');
    });

    it('should switch the active list when a new one is selected', async () => {
        const { getByTestId } = setup({
            listId: '123',
            listsState: {
                data: {
                    data: [
                        { id: '123', name: 'List A' },
                        { id: '456', name: 'List B' },
                    ],
                },
            },
        });

        await userEvent.selectOptions(getByTestId('list-select'), '456');

        expect(loadListItems).toHaveBeenLastCalledWith(expect.objectContaining({ id: '456' }));
    });
});
