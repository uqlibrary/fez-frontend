/* eslint-disable react/prop-types */
import React from 'react';
import { render as defaultRender, userEvent, act } from 'test-utils';
import { useDispatch, useSelector } from 'react-redux';
import { addFavourites, createList, loadLists } from '../../../../../actions/journalUserLists';
import Button from './Button';

jest.mock('react-redux', () => ({
    useDispatch: jest.fn(),
    useSelector: jest.fn(),
}));

jest.mock('../../../../../actions/journalUserLists', () => ({
    addFavourites: jest.fn(),
    createList: jest.fn(),
    loadLists: jest.fn(),
}));

jest.mock(
    './AddNewDialog',
    () => props =>
        props.open ? (
            <div data-testid="add-dialog">
                <button
                    aria-label="create"
                    onClick={() =>
                        props.onCreate({
                            label: ' New list ',
                            isPublic: true,
                        })
                    }
                />
                <button aria-label="close-dialog" onClick={props.onClose} />
            </div>
        ) : null,
);

jest.mock('../../../../SharedComponents/Toolbox/ListSplitButtonMenu/ListSplitButtonMenu', () => props => (
    <div>
        <button aria-label="main" disabled={props.disabled} onClick={props.onClick}>
            {props.items[props.selectedIndex] ? props.label(props.items[props.selectedIndex]) : 'no list'}
        </button>
        <button aria-label="select" onClick={() => props.onItemSelect(1)} />
        <button aria-label="add" onClick={props.onAdd} />
        <div data-testid="loading">{String(props.loading)}</div>
        <div data-testid="menu-open">{String(props.open)}</div>
        <div data-testid="items">{props.items.map(item => item.label).join(',')}</div>
    </div>
));

jest.mock('../../../../SharedComponents/Toolbox/ConfirmDialogBox', () => ({
    ConfirmationBox: props =>
        props.isOpen ? (
            <button data-testid="confirmation" onClick={props.onClose}>
                {props.locale.confirmationMessage}
            </button>
        ) : null,
}));

const dispatch = jest.fn();
const clearSelectedJournals = jest.fn();
const onAdd = jest.fn();

const defaultListData = [
    {
        fjl_id: 'favourites',
        fjl_label: 'Favourites',
    },
    {
        fjl_id: 'reading',
        fjl_label: 'Reading',
    },
];

const setup = testProps => {
    const { loading = false, listLoading = false, listData = defaultListData, ...props } = testProps || {};
    useDispatch.mockReturnValue(dispatch);
    useSelector.mockImplementation(selector =>
        selector({
            get: key => {
                if (key === 'journalUserListsReducer') {
                    return {
                        loading: listLoading,
                        data: {
                            data: listData,
                        },
                    };
                }

                return {
                    add: {
                        loading,
                    },
                };
            },
        }),
    );
    loadLists.mockReturnValue({ type: 'LOAD_LISTS' });
    addFavourites.mockReturnValue({ type: 'ADD' });
    createList.mockReturnValue({ type: 'CREATE' });
    dispatch.mockImplementation(action => {
        if (action?.type === 'CREATE') {
            return Promise.resolve({
                data: {
                    fjl_id: 'new-id',
                    fjl_label: 'New list',
                },
            });
        }
        return Promise.resolve();
    });

    return {
        user: userEvent.setup({
            advanceTimers: jest.advanceTimersByTime,
        }),
        ...defaultRender(
            <Button
                selectedJournals={{
                    a: {},
                    b: {},
                }}
                clearSelectedJournals={clearSelectedJournals}
                onAdd={onAdd}
                {...props}
            />,
        ),
    };
};

describe('Button', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should dispatch loadLists on mount', () => {
        setup();

        expect(loadLists).toHaveBeenCalled();
        expect(dispatch).toHaveBeenCalledWith({
            type: 'LOAD_LISTS',
        });
    });

    it('should render parsed list items', () => {
        const { getByTestId } = setup();

        expect(getByTestId('items')).toHaveTextContent('Favourites,Reading');
    });

    it('should render no items when list data is empty', () => {
        const { getByTestId, getByLabelText } = setup({
            listData: [],
        });

        expect(getByTestId('items')).toHaveTextContent('');
        expect(getByLabelText('main')).toHaveTextContent('no list');
    });

    it('should dispatch addFavourites with the selected list id', async () => {
        const { user, getByLabelText } = setup();

        await user.click(getByLabelText('main'));

        expect(addFavourites).toHaveBeenCalledWith({
            id: 'favourites',
            ids: ['a', 'b'],
        });
    });

    it('should dispatch addFavourites with the selected list after switching', async () => {
        const { user, getByLabelText } = setup();

        await user.click(getByLabelText('select'));
        await user.click(getByLabelText('main'));

        expect(addFavourites).toHaveBeenCalledWith({
            id: 'reading',
            ids: ['a', 'b'],
        });
    });

    it('should open the confirmation dialog after adding', async () => {
        const { user, getByLabelText, findByTestId } = setup();

        await user.click(getByLabelText('main'));

        expect(await findByTestId('confirmation')).toHaveTextContent('2');
    });

    it('should close the confirmation dialog after one second', async () => {
        const { user, getByLabelText, queryByTestId } = setup();

        await user.click(getByLabelText('main'));

        await act(async () => {
            await jest.advanceTimersByTimeAsync(1000);
        });

        expect(queryByTestId('confirmation')).not.toBeInTheDocument();
        expect(clearSelectedJournals).toHaveBeenCalledWith({});
    });

    it('should clear the selection when the dialog is manually closed', async () => {
        const { user, getByLabelText, findByTestId } = setup();

        await user.click(getByLabelText('main'));
        await user.click(await findByTestId('confirmation'));

        expect(clearSelectedJournals).toHaveBeenCalledWith({});
    });

    it('should disable the button when there are no selected journals', () => {
        const { getByLabelText } = setup({
            selectedJournals: {},
        });

        expect(getByLabelText('main')).toBeDisabled();
    });

    it('should disable the button while adding', () => {
        const { getByLabelText, getByTestId } = setup({
            loading: true,
        });

        expect(getByLabelText('main')).toBeDisabled();
        expect(getByTestId('loading')).toHaveTextContent('true');
    });

    it('should disable the button while loading lists', () => {
        const { getByLabelText, getByTestId } = setup({
            listLoading: true,
        });

        expect(getByLabelText('main')).toBeDisabled();
        expect(getByTestId('loading')).toHaveTextContent('true');
    });

    it('should open the create list dialog', async () => {
        const { user, getByLabelText, getByTestId } = setup();

        await user.click(getByLabelText('add'));

        expect(getByTestId('add-dialog')).toBeInTheDocument();
        expect(getByTestId('menu-open')).toHaveTextContent('true');
    });

    it('should close the create list dialog', async () => {
        const { user, getByLabelText, queryByTestId, getByTestId } = setup();

        await user.click(getByLabelText('add'));
        await user.click(getByLabelText('close-dialog'));

        expect(queryByTestId('add-dialog')).not.toBeInTheDocument();
        expect(getByTestId('menu-open')).toHaveTextContent('true');
    });

    it('should dispatch createList', async () => {
        const { user, getByLabelText } = setup();

        await user.click(getByLabelText('add'));
        await user.click(getByLabelText('create'));

        expect(createList).toHaveBeenCalledWith({
            fjl_label: 'New list',
            fjl_is_public: true,
        });
    });

    it('should prepend the created list and select it', async () => {
        const { user, getByLabelText, getByTestId } = setup();

        await user.click(getByLabelText('add'));
        await user.click(getByLabelText('create'));

        expect(getByTestId('items')).toHaveTextContent('New list,Favourites,Reading');
        expect(getByLabelText('main')).toHaveTextContent('Add to New list');
    });

    it('should call onAdd after creating a list', async () => {
        const { user, getByLabelText } = setup();

        await user.click(getByLabelText('add'));
        await user.click(getByLabelText('create'));

        expect(onAdd).toHaveBeenCalled();
    });

    it('should add favourites to the newly created list', async () => {
        const { user, getByLabelText } = setup();

        await user.click(getByLabelText('add'));
        await user.click(getByLabelText('create'));
        await user.click(getByLabelText('main'));

        expect(addFavourites).toHaveBeenLastCalledWith({
            id: 'new-id',
            ids: ['a', 'b'],
        });
    });
});
