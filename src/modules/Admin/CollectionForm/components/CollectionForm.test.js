import React from 'react';
import CollectionForm from './CollectionForm';
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
import { record } from 'mock/data';

async function setup(testProps) {
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
        mockApi.onPost(repositories.routes.NEW_COLLECTION_API().apiUrl).reply(200, { data: { ...record } });

        window.history.pushState({}, 'Test Title', '?pid=10&name=test');
        const { queryByTestId, getByTestId } = await setup({});
        await waitFor(() => {
            expect(queryByTestId('community-selector')).not.toBeInTheDocument();
        });

        await userEvent.type(getByTestId('rek-title-input'), 'test');
        await userEvent.type(getByTestId('rek-description-input'), 'test');
        fireEvent.click(getByTestId('submit-collection'));
        expect(getByTestId('add-collection-progress-bar')).toBeInTheDocument();
        await waitForElementToBeRemoved(() => getByTestId('add-collection-progress-bar'));
        expect(queryByTestId('add-collection-progress-bar')).not.toBeInTheDocument();
    });
    it('should render without dropdown if params hash exist', async () => {
        mockApi.onPost(repositories.routes.NEW_COLLECTION_API().apiUrl).reply(200, { data: { ...record } });

        window.history.pushState({}, 'Test Title', '#pid=10&name=test');
        const { queryByTestId, getByTestId } = await setup({});
        await waitFor(() => {
            expect(queryByTestId('community-selector')).not.toBeInTheDocument();
        });

        await userEvent.type(getByTestId('rek-title-input'), 'test');
        await userEvent.type(getByTestId('rek-description-input'), 'test');
        fireEvent.click(getByTestId('submit-collection'));
        expect(getByTestId('add-collection-progress-bar')).toBeInTheDocument();
        await waitForElementToBeRemoved(() => getByTestId('add-collection-progress-bar'));
        expect(queryByTestId('add-collection-progress-bar')).not.toBeInTheDocument();
    });
});

describe('Collection form', () => {
    beforeAll(() => {
        delete window.location;
        window.location = { reload: jest.fn(), assign: jest.fn() }; // Mock reload function
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    it('should render form with only the community dropdown', async () => {
        const { getAllByRole, getByTestId } = await setup({});
        expect(getByTestId('rek-ismemberof-input')).toBeInTheDocument();
        expect(getAllByRole('button').length).toEqual(2);
    });

    it('should render the full form and allow to add another and return home', async () => {
        mockApi.onGet(repositories.routes.SEARCH_INTERNAL_RECORDS_API({ searchQueryParams: '.*' }).apiUrl).reply(200, {
            data: [
                { rek_pid: 'UQ:111', rek_title: 'Testing community' },
                { rek_pid: 'UQ:123', rek_title: '<b>Tested community</b>' },
            ],
        });
        mockApi.onPost(repositories.routes.NEW_COLLECTION_API().apiUrl).reply(200, { data: { ...record } });

        const { getByText, getByTestId } = await setup({ newRecord: {} });
        try {
            await waitForElementToBeRemoved(() => getByText('Loading communities...'));
        } catch (error) {
            console.error(
                'Timeout error: Element with text of "Loading communities..." was not found within the default timeout.',
            );
            console.error(error);
        }

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

    it('should show server error', async () => {
        mockApi.onGet(repositories.routes.SEARCH_INTERNAL_RECORDS_API({ searchQueryParams: '.*' }).apiUrl).reply(200, {
            data: [
                { rek_pid: 'UQ:111', rek_title: 'Testing community' },
                { rek_pid: 'UQ:123', rek_title: '<b>Tested community</b>' },
            ],
        });
        mockApi.onPost(repositories.routes.NEW_COLLECTION_API().apiUrl).reply(config => {
            console.log('Mock API called: ', config.url);
            return [401, { error: { message: 'Server Error' } }];
        });

        const { getByText, getByTestId } = await setup({ newRecord: {} });
        await waitForElementToBeRemoved(() => getByText('Loading communities...'));

        fireEvent.mouseDown(getByTestId('rek-ismemberof-select'));
        fireEvent.click(getByText('Testing community'));

        expect(getByTestId('rek-title-input')).toBeInTheDocument();
        expect(getByTestId('submit-collection')).toBeInTheDocument();
        await userEvent.type(getByTestId('rek-title-input'), 'test');
        await userEvent.type(getByTestId('rek-description-input'), 'test');

        fireEvent.click(getByTestId('submit-collection'));
        expect(getByTestId('add-collection-progress-bar')).toBeInTheDocument();
        await waitForElementToBeRemoved(() => getByTestId('add-collection-progress-bar'));
        expect(getByTestId('api_error_alert')).toBeInTheDocument();
    });

    it('should render success panel', async () => {
        const { getByTestId } = await setup({ submitSucceeded: true, newRecord: { rek_pid: 'UQ:12345' } });
        await waitFor(() => {
            expect(getByTestId('rek-ismemberof-input')).toBeInTheDocument();
        });
    });
});
