import React from 'react';
import CollectionForm from './CollectionForm';
import Immutable from 'immutable';
import {
    render,
    WithReduxStore,
    WithRouter,
    fireEvent,
    act,
    waitForElementToBeRemoved,
    waitFor,
    userEvent,
} from 'test-utils';
import * as repositories from 'repositories';
import * as SearchActions from 'actions/search';
import { preview } from 'test-utils';
import { screen } from '@testing-library/react';
import { collectionRecord, communityRecord, record } from 'mock/data';

async function setup(testProps, testState) {
    const props = {
        disableSubmit: false,
        ...testProps,
    };

    let renderResult;
    await act(async () => {
        renderResult = render(
            <WithReduxStore>
                <WithRouter>
                    <CollectionForm {...props} />
                </WithRouter>
            </WithReduxStore>,
        );
    });
    return renderResult;
}

describe('Collection form - autofill', () => {
    it('should render without dropdown if params exist', async () => {
        window.history.pushState({}, 'Test Title', '?pid=10&name=test');
        const { queryByTestId, getByTestId } = await setup({});
        // expect(queryByTestId('community-selector')).not.toBeInTheDocument();
        await waitFor(() => {
            expect(queryByTestId('community-selector')).not.toBeInTheDocument();
        });
        preview.debug();
    });
});

describe('Collection form', () => {
    beforeAll(() => {
        // Mock console.error to suppress the warning
        jest.spyOn(console, 'warn').mockImplementation(message => {
            if (
                message.includes(
                    'Selector unknown returned a different result when called with the same parameters. This can lead to unnecessary rerenders',
                )
            )
                return; // Ignore the specific warning message
            console.error(message); // Otherwise, log the message
        });

        delete window.location;
        window.location = { reload: jest.fn(), assign: jest.fn() }; // Mock reload function
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    it('should render form with only the community dropdown', async () => {
        const { container, getAllByRole, getByTestId } = await setup({});
        expect(container).toMatchSnapshot();
        expect(getByTestId('rek-ismemberof-input')).toBeInTheDocument();
        expect(getAllByRole('button').length).toEqual(2);
    });

    it('should render the full form', async () => {
        mockApi.onGet(repositories.routes.SEARCH_INTERNAL_RECORDS_API({ searchQueryParams: '.*' }).apiUrl).reply(200, {
            data: [
                { rek_pid: 'UQ:111', rek_title: 'Testing community' },
                { rek_pid: 'UQ:123', rek_title: '<b>Tested community</b>' },
            ],
        });
        mockApi.onPost(repositories.routes.NEW_COLLECTION_API().apiUrl).reply(200, { data: { ...record } });

        const { getByText, getByTestId } = await setup({ newRecord: {} });
        await waitForElementToBeRemoved(() => getByText('Loading communities...'));

        fireEvent.mouseDown(getByTestId('rek-ismemberof-select'));
        fireEvent.click(getByText('Testing community'));

        expect(getByTestId('rek-title-input')).toBeInTheDocument();
        expect(getByTestId('rek-description-input')).toBeInTheDocument();
        expect(getByTestId('rek-keywords-input')).toBeInTheDocument();
        expect(getByTestId('internalNotes')).toBeInTheDocument();
        expect(getByTestId('cancel-collection')).toBeInTheDocument();
        expect(getByTestId('submit-collection')).toBeInTheDocument();
        await userEvent.type(getByTestId('rek-title-input'), 'test');
        await userEvent.type(getByTestId('rek-description-input'), 'test');
        fireEvent.click(getByTestId('submit-collection'));
        await waitForElementToBeRemoved(() => getByTestId('rek-title-input'));

        fireEvent.click(getByTestId('add-another-collection'));
        expect(window.location.reload).toHaveBeenCalled();

        fireEvent.click(getByTestId('return-home'));
        expect(window.location.assign).toHaveBeenCalledWith('/');
    });

    it('should render success panel', async () => {
        const { container } = await setup({ submitSucceeded: true, newRecord: { rek_pid: 'UQ:12345' } });
        expect(container).toMatchSnapshot();
    });

    it('should not disable submit button if form submit has failed', async () => {
        const { getByRole } = await setup({ submitFailed: true });
        expect(getByRole('button', { name: 'Add collection' })).not.toBeDisabled();
    });
});
