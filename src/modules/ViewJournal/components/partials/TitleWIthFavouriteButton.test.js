import React from 'react';
import { act, fireEvent, render, WithReduxStore, WithRouter } from 'test-utils';
import TitleWithFavouriteButton from './TitleWithFavouriteButton';

import { journalDetails } from 'mock/data';

function setup(testProps = {}) {
    const props = {
        journal: journalDetails.data,
        tooltips: {
            favourite: 'Test favourite tooltip',
            notFavourite: 'Test not favourite tooltip',
        },
        handlers: {
            errorUpdatingFavourite: jest.fn(),
        },
        ...testProps,
    };
    return render(
        <WithRouter>
            <WithReduxStore>
                <TitleWithFavouriteButton {...props} />
            </WithReduxStore>
        </WithRouter>,
    );
}

describe('TitleWithFavouriteButton', () => {
    beforeEach(() => {
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
    });

    it('should contain a title with a favourite button', () => {
        const { getByTestId, getByText } = setup();
        expect(getByText(journalDetails.data.jnl_title)).toBeInTheDocument();
        expect(getByTestId('favourite-journal-notsaved')).toBeInTheDocument();
    });

    it('should contain a title with an unfavourite button', () => {
        const journal = { ...journalDetails.data, jnl_favourite: true };
        const { getByTestId, getByText } = setup({ journal });
        expect(getByText(journalDetails.data.jnl_title)).toBeInTheDocument();
        expect(getByTestId('favourite-journal-saved')).toBeInTheDocument();
    });

    it('should change favourite icon appearance from unset to set and back when favourite button is clicked', async () => {
        mockApi.onAny().reply(200, { data: '' });
        const { getByTestId, queryByTestId } = setup();
        expect(getByTestId('favourite-journal-notsaved')).toBeInTheDocument();

        await act(async () => {
            fireEvent.click(getByTestId('favourite-journal-notsaved'));

            // need some time to pass for the api call to return
            await new Promise(r => setTimeout(r, 500));
        });

        expect(queryByTestId('favourite-journal-notsaved')).not.toBeInTheDocument();
        expect(getByTestId('favourite-journal-saved')).toBeInTheDocument();

        await act(async () => {
            fireEvent.click(getByTestId('favourite-journal-saved'));

            // need some time to pass for the api call to return
            await new Promise(r => setTimeout(r, 500));
        });

        expect(queryByTestId('favourite-journal-saved')).not.toBeInTheDocument();
        expect(getByTestId('favourite-journal-notsaved')).toBeInTheDocument();
    });

    it('should call supplied error function if the favourite API call fails', async () => {
        const errorFn = jest.fn();
        mockApi.onAny().reply(500, { data: '' });
        const { getByTestId } = setup({ handlers: { errorUpdatingFavourite: errorFn } });
        expect(getByTestId('favourite-journal-notsaved')).toBeInTheDocument();

        await act(async () => {
            fireEvent.click(getByTestId('favourite-journal-notsaved'));

            // need some time to pass for the api call to return
            await new Promise(r => setTimeout(r, 500));
        });

        // button should still be in view
        expect(getByTestId('favourite-journal-notsaved')).toBeInTheDocument();

        expect(errorFn).toHaveBeenCalled();
    });
});
