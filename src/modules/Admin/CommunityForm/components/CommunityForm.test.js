import CommunityForm from './CommunityForm';
import React from 'react';
import {
    render,
    WithReduxStore,
    WithRouter,
    fireEvent,
    userEvent,
    waitFor,
    spyOnWindowLocationMethod,
} from 'test-utils';
import * as actions from 'actions';

jest.mock('actions', () => ({
    ...jest.requireActual('actions'), // Retain the actual implementations of other functions
    createCommunity: jest.fn(),
}));

function setup(testProps = {}, state = {}, rerender = render) {
    return rerender(
        <WithReduxStore initialState={state}>
            <WithRouter>
                <CommunityForm {...testProps} />
            </WithRouter>
        </WithReduxStore>,
    );
}
async function inputText(getByTestId, settings) {
    for (const [testId, value] of settings) {
        const input = getByTestId(testId);
        await userEvent.click(input);
        await userEvent.type(input, value);
        await userEvent.tab();
        expect(input).toHaveValue(value);
    }
}

describe('Community form', () => {
    let assignMock;
    let reloadMock;

    beforeEach(() => {
        assignMock = spyOnWindowLocationMethod('assign');
        reloadMock = spyOnWindowLocationMethod('reload');
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should render form', async () => {
        actions.createCommunity
            .mockImplementationOnce(() => {
                return () => Promise.reject(new Error('test'));
            })
            .mockImplementationOnce(() => {
                return () => Promise.resolve();
            });

        const { getByTestId, rerender } = setup();
        await inputText(getByTestId, [
            ['rek-title-input', 'test'],
            ['rek-description-input', 'test'],
        ]);
        const submitButton = getByTestId('submit-community');
        await waitFor(() => expect(submitButton).toBeEnabled());

        await userEvent.click(submitButton);
        await waitFor(() => expect(getByTestId('alert-error-community')).toBeInTheDocument());

        setup(
            {},
            {
                createCommunityReducer: {
                    newRecord: true,
                },
            },
            rerender,
        );

        await userEvent.click(submitButton);
        await waitFor(() => expect(getByTestId('after-submit-community')).toBeInTheDocument());
        await userEvent.click(getByTestId('after-submit-community'));
        expect(assignMock).toHaveBeenCalledWith('/');

        await userEvent.click(getByTestId('reload-community'));
        expect(reloadMock).toHaveBeenCalled();
    });

    it('should redirect to cancel page', () => {
        const { getByTestId } = setup({});
        fireEvent.click(getByTestId('cancel-community'));
        expect(assignMock).toHaveBeenCalledWith('/');
    });
});
