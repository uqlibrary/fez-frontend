/* eslint-disable react/prop-types */
import React from 'react';
import { render as defaultRender, userEvent, act } from 'test-utils';
import { useDispatch, useSelector } from 'react-redux';
import { addToFavourites } from 'actions/journals';
import AddToListButton from './AddToListButton';

jest.mock('react-redux', () => ({
    useDispatch: jest.fn(),
    useSelector: jest.fn(),
}));

jest.mock('actions/journals', () => ({
    addToFavourites: jest.fn(),
}));

jest.mock('modules/SharedComponents/Toolbox/SplitButtonMenu/SplitButtonMenu', () => props => (
    <div>
        <button aria-label="main" disabled={props.disabled} onClick={props.onClick}>
            {props.label(props.items[props.selectedIndex])}
        </button>
        <button aria-label="select" onClick={() => props.onItemSelect(0)} />
        <button aria-label="settings" onClick={props.onSettings} />
        <div data-testid="loading">{String(props.loading)}</div>
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

const setup = (testProps = {}, render = defaultRender) => {
    const { loading = false, ...props } = testProps;

    useDispatch.mockReturnValue(dispatch);
    useSelector.mockImplementation(selector =>
        selector({
            get: () => ({
                add: {
                    loading,
                },
            }),
        }),
    );

    dispatch.mockReturnValue(Promise.resolve());
    addToFavourites.mockReturnValue({ type: 'ADD' });

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

    it('should dispatch addToFavourites', async () => {
        const { getByLabelText, user } = setup();
        await user.click(getByLabelText('main'));

        expect(addToFavourites).toHaveBeenCalledWith(['a', 'b']);
        expect(dispatch).toHaveBeenCalled();
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

    it('should clear the selection when the dialog is closed', async () => {
        const { getByLabelText, findByTestId, user } = setup();

        await user.click(getByLabelText('main'));
        await user.click(await findByTestId('confirmation'));

        expect(clearSelectedJournals).toHaveBeenCalledWith({});
    });
});
