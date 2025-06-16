import React from 'react';
import { fireEvent, render, WithReduxStore, waitFor, waitForElementToBeRemoved } from 'test-utils';
import { AddToFavouritesButton } from './AddToFavouritesButton';
import * as redux from 'react-redux';
import { act } from '@testing-library/react';

const setup = ({ state = {}, props = {} } = {}) => {
    return render(
        <WithReduxStore initialState={{ favouriteJournalsReducer: state }}>
            <AddToFavouritesButton {...props} />
        </WithReduxStore>,
    );
};

const mocks = {};
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn(),
}));
describe('AddToFavouritesButton', () => {
    afterEach(() => {
        Object.keys(mocks).map(name => mocks[name].mockRestore());
    });
    it('should render without selected journals', () => {
        const { getByTestId } = setup();
        expect(getByTestId('add-to-favourites-button')).not.toBeDisabled();
    });
    it('should display confirmation after adding a fav', async () => {
        jest.useFakeTimers();
        mocks.useDispatch = redux.useDispatch;
        mocks.useDispatch.mockImplementation(() => () => Promise.resolve(true));
        const { queryByTestId, getByTestId } = setup({
            props: { selectedJournals: { 1: true }, clearSelectedJournals: jest.fn() },
        });

        fireEvent.click(getByTestId('add-to-favourites-button'));
        await waitFor(() => getByTestId('add-to-favourites-confirmation-box'));
        expect(getByTestId('add-to-favourites-confirmation-box')).toBeInTheDocument();
        await act(() => jest.advanceTimersByTime(2000));
        await waitForElementToBeRemoved(getByTestId('add-to-favourites-confirmation-box')).then(() =>
            expect(queryByTestId('add-to-favourites-confirmation-box')).not.toBeInTheDocument(),
        );
    });
});
