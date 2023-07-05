import React from 'react';
import { act, fireEvent, render, WithReduxStore, waitForElementToBeRemoved, waitFor } from 'test-utils';
import * as repositories from 'repositories';
import * as JournalActions from 'actions/journals';

import MasterJournalListIngest from './MasterJournalListIngest';

function setup(testProps = {}) {
    return render(
        <WithReduxStore>
            <MasterJournalListIngest {...testProps} />
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
    });

    it('should successfully submit form and display success message', async () => {
        const requestMJLIngest = jest.spyOn(JournalActions, 'requestMJLIngest');
        mockApi.onGet(repositories.routes.BATCH_IMPORT_DIRECTORIES_API().apiUrl).replyOnce(200, {
            data: ['Test directory 1', 'Test directory 2'],
        });
        mockApi.onPost(repositories.routes.MASTER_JOURNAL_LIST_INGEST_API().apiUrl).replyOnce(200, {
            data: '',
        });

        const { getByTestId, getByText } = setup();

        await waitForElementToBeRemoved(() => getByText('Loading items...'));

        fireEvent.mouseDown(getByTestId('directory-select'));
        fireEvent.click(getByText('Test directory 1'));

        act(() => {
            fireEvent.click(getByTestId('master-journal-list-ingest-submit'));
        });

        expect(requestMJLIngest).toBeCalledWith({ directory: 'Test directory 1' });
        await waitFor(() => getByTestId('alert-done-mjl-ingest'));
    });

    it('should show submission failure in case of network error', async () => {
        const requestMJLIngest = jest.spyOn(JournalActions, 'requestMJLIngest');
        mockApi.onGet(repositories.routes.BATCH_IMPORT_DIRECTORIES_API().apiUrl).replyOnce(200, {
            data: ['Test directory 1', 'Test directory 2'],
        });
        mockApi.onPost(repositories.routes.MASTER_JOURNAL_LIST_INGEST_API().apiUrl).networkErrorOnce();

        const { getByTestId, getByText } = setup();

        await waitForElementToBeRemoved(() => getByText('Loading items...'));

        fireEvent.mouseDown(getByTestId('directory-select'));
        fireEvent.click(getByText('Test directory 1'));

        act(() => {
            fireEvent.click(getByTestId('master-journal-list-ingest-submit'));
        });

        expect(requestMJLIngest).toBeCalledWith({ directory: 'Test directory 1' });
        await waitFor(() => getByTestId('alert-error-mjl-ingest'));
    });

    it('should redirect to index page on cancel', () => {
        const testFn = jest.fn();
        const { getByTestId } = setup({ history: { push: testFn } });
        act(() => {
            fireEvent.click(getByTestId('master-journal-list-ingest-cancel'));
        });
        expect(testFn).toHaveBeenCalledWith('/');
    });
});
