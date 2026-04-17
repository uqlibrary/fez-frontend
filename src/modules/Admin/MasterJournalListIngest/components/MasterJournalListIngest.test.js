import React from 'react';
import {
    fireEvent,
    render,
    WithReduxStore,
    WithRouter,
    waitForElementToBeRemoved,
    waitFor,
    userEvent,
} from 'test-utils';
import * as repositories from 'repositories';
import * as JournalActions from 'actions/journals';

import MasterJournalListIngest from './MasterJournalListIngest';

const mockUseNavigate = jest.fn();

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => mockUseNavigate,
}));

function setup(testProps = {}) {
    return render(
        <WithReduxStore>
            <WithRouter>
                <MasterJournalListIngest {...testProps} />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('MasterJournalListIngest Component', () => {
    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
        mockUseNavigate.mockClear();
    });

    it('should successfully submit form and display success message', async () => {
        const requestMJLIngest = jest.spyOn(JournalActions, 'requestMJLIngest');
        mockApi.onGet(repositories.routes.BATCH_IMPORT_DIRECTORIES_API().apiUrl).reply(200, {
            data: ['Test directory 1', 'Test directory 2'],
        });
        mockApi.onPost(repositories.routes.MASTER_JOURNAL_LIST_INGEST_API().apiUrl).replyOnce(200, {
            data: '',
        });

        const { getByTestId, getByText } = setup();

        await waitForElementToBeRemoved(() => getByText('Loading items...'));

        await userEvent.click(getByTestId('directory-select'));
        await userEvent.click(getByText('Test directory 1'));

        await userEvent.click(getByTestId('master-journal-list-ingest-submit'));

        expect(requestMJLIngest).toHaveBeenCalledWith({ directory: 'Test directory 1' });
        await waitFor(() => getByTestId('alert-done-mjl-ingest'));
    });

    it('should show submission failure in case of network error', async () => {
        const requestMJLIngest = jest.spyOn(JournalActions, 'requestMJLIngest');
        mockApi.onGet(repositories.routes.BATCH_IMPORT_DIRECTORIES_API().apiUrl).reply(200, {
            data: ['Test directory 1', 'Test directory 2'],
        });
        mockApi.onPost(repositories.routes.MASTER_JOURNAL_LIST_INGEST_API().apiUrl).networkErrorOnce();

        const { getByTestId, getByText } = setup();

        await waitForElementToBeRemoved(() => getByText('Loading items...'));

        fireEvent.mouseDown(getByTestId('directory-select'));
        fireEvent.click(getByText('Test directory 1'));

        await userEvent.click(getByTestId('master-journal-list-ingest-submit'));

        expect(requestMJLIngest).toHaveBeenCalledWith({ directory: 'Test directory 1' });
        await waitFor(() => getByTestId('alert-error-mjl-ingest'));
    });

    it('should redirect to index page on cancel', () => {
        const { getByTestId } = setup();
        fireEvent.click(getByTestId('master-journal-list-ingest-cancel'));
        expect(mockUseNavigate).toHaveBeenCalledWith('/');
    });
});
