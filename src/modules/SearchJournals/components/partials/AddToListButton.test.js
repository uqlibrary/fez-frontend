/* eslint-disable react/prop-types */
import React from 'react';
import { render as defaultRender, userEvent, act } from 'test-utils';
import { useDispatch, useSelector } from 'react-redux';
import { addFavourites, loadLists } from 'actions/journalUserLists';
import AddToListButton from './AddToListButton';

jest.mock('react-redux', () => ({
    useDispatch: jest.fn(),
    useSelector: jest.fn(),
}));

jest.mock('actions/journalUserLists', () => ({
    addFavourites: jest.fn(),
    loadLists: jest.fn(),
}));

jest.mock('modules/SharedComponents/Toolbox/SplitButtonMenu/SplitButtonMenu', () => props => (
    <div>
        <button aria-label="main" disabled={props.disabled} onClick={props.onClick}>
            {props.items[props.selectedIndex] ? props.label(props.items[props.selectedIndex]) : 'no list'}
        </button>
        <button aria-label="select" onClick={() => props.onItemSelect(1)} />
        <button aria-label="settings" onClick={props.onSettings} />
        <div data-testid="loading">{String(props.loading)}</div>
        <div data-testid="items">{props.items.map(item => item.label).join(',')}</div>
    </div>
));

jest.mock('modules/SharedComponents/Toolbox/ConfirmDialogBox', () => ({
    ConfirmationBox: props =>
        props.isOpen ? (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events
            <div data-testid="confirmation" onClick={props.onClose}>
                {props.locale.confirmationMessage}
            </div>
        ) : null,
}));

const dispatch = jest.fn();
const clearSelectedJournals = jest.fn();
const onSettings = jest.fn();

const defaultListData = [
    { fjl_id: 'favourites', fjl_label: 'Favourites' },
    { fjl_id: 'reading', fjl_label: 'Reading' },
];

const setup = (testProps = {}, render = defaultRender) => {
    const { loading = false, listLoading = false, listData = defaultListData, ...props } = testProps;

    useDispatch.mockReturnValue(dispatch);
    useSelector.mockImplementation(selector =>
        selector({
            get: key => {
                if (key === 'journalUserListsReducer') {
                    return {
                        loading: listLoading,
                        data: { data: listData },
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

    dispatch.mockReturnValue(Promise.resolve());
    addFavourites.mockReturnValue({ type: 'ADD' });
    loadLists.mockReturnValue({ type: 'LOAD_LISTS' });

    return {
        user: userEvent.setup({
            advanceTimers: jest.advanceTimersByTime,
        }),
        ...render(
            <AddToListButton
                selectedJournals={{
                    a: {},
                    b: {},
                }}
                clearSelectedJournals={clearSelectedJournals}
                onSettings={onSettings}
                {...props}
            />,
        ),
    };
};

describe('AddToListButton', () => {
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
        expect(dispatch).toHaveBeenCalledWith({ type: 'LOAD_LISTS' });
    });

    it('should render parsed list items', () => {
        const { getByTestId } = setup();
        expect(getByTestId('items')).toHaveTextContent('Favourites,Reading');
    });

    it('should render no items when list data is empty', () => {
        const { getByTestId, getByLabelText } = setup({ listData: [] });
        expect(getByTestId('items')).toHaveTextContent('');
        expect(getByLabelText('main')).toHaveTextContent('no list');
    });

    it('should dispatch addFavourites with the selected list id', async () => {
        const { getByLabelText, user } = setup();
        await user.click(getByLabelText('main'));

        expect(addFavourites).toHaveBeenCalledWith({ id: 'favourites', ids: ['a', 'b'] });
        expect(dispatch).toHaveBeenCalled();
    });

    it('should dispatch addFavourites with the newly selected list id after switching', async () => {
        const { getByLabelText, user } = setup();

        await user.click(getByLabelText('select'));
        await user.click(getByLabelText('main'));

        expect(addFavourites).toHaveBeenCalledWith({ id: 'reading', ids: ['a', 'b'] });
    });

    it('should open the confirmation dialog after adding', async () => {
        const { getByLabelText, findByTestId, user } = setup();
        await user.click(getByLabelText('main'));

        expect(await findByTestId('confirmation')).toHaveTextContent('2');
    });

    it('should close the dialog after one second', async () => {
        const { getByLabelText, queryByTestId, user } = setup();
        await user.click(getByLabelText('main'));

        await act(async () => {
            await jest.advanceTimersByTimeAsync(1000);
        });

        expect(queryByTestId('confirmation')).not.toBeInTheDocument();
        expect(clearSelectedJournals).toHaveBeenCalledWith({});
    });

    it('should disable the button when there is no selection', () => {
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

    it('should disable the button while the list is loading', () => {
        const { getByLabelText, getByTestId } = setup({
            listLoading: true,
        });

        expect(getByLabelText('main')).toBeDisabled();
        expect(getByTestId('loading')).toHaveTextContent('true');
    });

    it('should clear the selection when the dialog is closed', async () => {
        const { getByLabelText, findByTestId, user } = setup();

        await user.click(getByLabelText('main'));
        await user.click(await findByTestId('confirmation'));

        expect(clearSelectedJournals).toHaveBeenCalledWith({});
    });

    it('should call onSettings when the settings button is clicked', async () => {
        const { getByLabelText, user } = setup();

        await user.click(getByLabelText('settings'));

        expect(onSettings).toHaveBeenCalled();
    });
});
