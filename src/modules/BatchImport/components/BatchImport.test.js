import React from 'react';
import { fireEvent, render, WithReduxStore, waitForElementToBeRemoved, waitFor } from 'test-utils';
import * as repositories from 'repositories';
import * as BatchImportActions from 'actions/batchImport';

import BatchImport from './BatchImport';

function setup(testProps = {}) {
    return render(
        <WithReduxStore>
            <BatchImport {...testProps} />
        </WithReduxStore>,
    );
}

describe('BatchImport Component', () => {
    it('should successfully submit form and display success message', async () => {
        const createBatchImport = jest.spyOn(BatchImportActions, 'createBatchImport');

        mockApi
            .onGet(repositories.routes.SEARCH_INTERNAL_RECORDS_API({ searchQueryParams: '.*' }).apiUrl)
            .replyOnce(200, {
                data: [
                    { rek_pid: 'UQ:111', rek_title: 'Testing community' },
                    { rek_pid: 'UQ:123', rek_title: '<b>Tested community</b>' },
                ],
            });

        mockApi
            .onGet(repositories.routes.COLLECTIONS_BY_COMMUNITY_LOOKUP_API({ communityPid: 'UQ:111' }).apiUrl)
            .replyOnce(200, {
                data: [
                    { rek_pid: 'UQ:222', rek_title: 'Testing collection', rek_security_policy: 5 },
                    { rek_pid: 'UQ:333', rek_title: 'Tested collection', rek_security_policy: 1 },
                ],
            });

        mockApi.onGet(repositories.routes.BATCH_IMPORT_DIRECTORIES_API({}).apiUrl).replyOnce(200, {
            data: ['Test directory 1', 'Test directory 2'],
        });

        mockApi.onPost(repositories.routes.BATCH_IMPORT_API().apiUrl).replyOnce(200, { data: {} });

        const { getByTestId, getByText } = setup();

        await waitForElementToBeRemoved(() => getByText('Loading communities...'));

        fireEvent.mouseDown(getByTestId('community-pid-select'));
        fireEvent.click(getByText('Testing community'));

        await waitForElementToBeRemoved(() => getByText('Loading collections...'));

        fireEvent.mouseDown(getByTestId('collection-pid-select'));
        fireEvent.click(getByText('Tested collection (Administrators)'));

        fireEvent.mouseDown(getByTestId('doc-type-id-select'));
        fireEvent.click(getByText('Design'));

        fireEvent.mouseDown(getByTestId('directory-select'));
        fireEvent.click(getByText('Test directory 1'));

        fireEvent.click(getByTestId('batch-import-submit'));

        await waitFor(() => getByTestId('action-button'));

        expect(getByText('The request to batch-import has been submitted successfully.')).toBeInTheDocument();
        expect(getByTestId('batch-import-submit')).toHaveAttribute('disabled');
        expect(createBatchImport).toBeCalled();
    });

    it('should submit batch import and display submission error', async () => {
        const createBatchImport = jest.spyOn(BatchImportActions, 'createBatchImport');

        mockApi
            .onGet(repositories.routes.SEARCH_INTERNAL_RECORDS_API({ searchQueryParams: '.*' }).apiUrl)
            .replyOnce(200, {
                data: [
                    { rek_pid: 'UQ:111', rek_title: 'Testing community' },
                    { rek_pid: 'UQ:123', rek_title: '<b>Tested community</b>' },
                ],
            });

        mockApi
            .onGet(repositories.routes.COLLECTIONS_BY_COMMUNITY_LOOKUP_API({ communityPid: 'UQ:111' }).apiUrl)
            .replyOnce(200, {
                data: [
                    { rek_pid: 'UQ:222', rek_title: 'Testing collection', rek_security_policy: 5 },
                    { rek_pid: 'UQ:333', rek_title: 'Tested collection', rek_security_policy: 1 },
                ],
            });

        mockApi.onGet(repositories.routes.BATCH_IMPORT_DIRECTORIES_API({}).apiUrl).replyOnce(200, {
            data: ['Test directory 1', 'Test directory 2'],
        });

        mockApi.onPost(repositories.routes.BATCH_IMPORT_API().apiUrl).replyOnce(500, { data: {} });

        const { getByTestId, getByText } = setup();

        await waitForElementToBeRemoved(() => getByText('Loading communities...'));

        fireEvent.mouseDown(getByTestId('community-pid-select'));
        fireEvent.click(getByText('Testing community'));

        await waitForElementToBeRemoved(() => getByText('Loading collections...'));

        fireEvent.mouseDown(getByTestId('collection-pid-select'));
        fireEvent.click(getByText('Tested collection (Administrators)'));

        fireEvent.mouseDown(getByTestId('doc-type-id-select'));
        fireEvent.click(getByText('Design'));

        fireEvent.mouseDown(getByTestId('directory-select'));
        fireEvent.click(getByText('Test directory 1'));

        fireEvent.click(getByTestId('batch-import-submit'));

        await waitFor(() => getByTestId('alert-error-batch-import'));

        expect(createBatchImport).toBeCalled();
    });

    it('should hide all other fields except directory selector', async () => {
        mockApi
            .onGet(repositories.routes.SEARCH_INTERNAL_RECORDS_API({ searchQueryParams: '.*' }).apiUrl)
            .replyOnce(200, {
                data: [
                    { rek_pid: 'UQ:111', rek_title: 'Testing community' },
                    { rek_pid: 'UQ:123', rek_title: '<b>Tested community</b>' },
                ],
            });

        mockApi
            .onGet(repositories.routes.COLLECTIONS_BY_COMMUNITY_LOOKUP_API({ communityPid: 'UQ:111' }).apiUrl)
            .replyOnce(200, {
                data: [
                    { rek_pid: 'UQ:222', rek_title: 'Testing collection', rek_security_policy: 5 },
                    { rek_pid: 'UQ:333', rek_title: 'Tested collection', rek_security_policy: 1 },
                ],
            });

        mockApi.onGet(repositories.routes.BATCH_IMPORT_DIRECTORIES_API({}).apiUrl).replyOnce(200, {
            data: ['Test directory 1', 'Test directory 2'],
        });

        const { getByTestId, getByText, queryByTestId } = setup();

        await waitForElementToBeRemoved(() => getByText('Loading communities...'));

        fireEvent.click(getByTestId('is-bulk-file-ingest-input'));

        expect(queryByTestId('community-pid-select')).not.toBeInTheDocument();
        expect(queryByTestId('doc-type-id-select')).not.toBeInTheDocument();

        fireEvent.click(getByTestId('is-bulk-file-ingest-input'));

        expect(getByTestId('community-pid-select')).toBeInTheDocument();
        expect(getByTestId('doc-type-id-select')).toBeInTheDocument();
    });

    it('navigates to homepage on cancel', async () => {
        const pushFn = jest.fn();
        const history = { push: pushFn };
        const { getByTestId } = setup({ history: history });
        fireEvent.click(getByTestId('batch-import-cancel'));
        expect(pushFn).toHaveBeenCalledWith('/');
    });
});
