import React from 'react';
import {
    fireEvent,
    render,
    WithRouter,
    WithReduxStore,
    waitForElementToBeRemoved,
    waitFor,
    screen,
    assertDisabled,
    assertEnabled,
} from 'test-utils';
import * as repositories from 'repositories';
import * as BatchImportActions from 'actions/batchImport';

import BatchImport from './BatchImport';

const mockUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockUseNavigate,
}));

function setup(testProps = {}) {
    return render(
        <WithReduxStore>
            <WithRouter>
                <BatchImport {...testProps} />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('BatchImport Component', () => {
    const assertValidationErrorSummary = async (fields, toBeInTheDocument = true) => {
        const expectedErrors = fields.map(field => `You must select a ${field}`);
        for await (const error of expectedErrors) {
            const assertion = () => screen.queryByText(error);
            if (toBeInTheDocument) {
                await waitFor(assertion);
                continue;
            }

            if (!assertion()) continue;
            await waitForElementToBeRemoved(assertion);
        }

        if (toBeInTheDocument && expectedErrors.length > 1) {
            const currentErrors = Array.from(screen.getByTestId('batch-import-validation').querySelectorAll('li')).map(
                element => element.innerHTML,
            );
            expect(currentErrors).toEqual(expectedErrors);
        }
    };

    afterEach(() => {
        mockUseNavigate.mockClear();
    });

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

        const { queryByText, getByTestId, getByText } = setup();

        await waitForElementToBeRemoved(() => getByText('Loading communities...'));
        assertDisabled('batch-import-submit');

        fireEvent.mouseDown(getByTestId('community-pid-select'));
        fireEvent.click(getByText('Testing community'));

        await waitForElementToBeRemoved(() => getByText('Loading collections...'));
        assertDisabled('batch-import-submit');

        fireEvent.mouseDown(getByTestId('collection-pid-select'));
        fireEvent.click(getByText('Tested collection (Administrators)'));
        assertDisabled('batch-import-submit');

        fireEvent.mouseDown(getByTestId('doc-type-id-select'));
        fireEvent.click(getByText('Design'));
        assertDisabled('batch-import-submit');

        fireEvent.mouseDown(getByTestId('directory-select'));
        fireEvent.click(getByText('Test directory 1'));
        assertEnabled('batch-import-submit');

        await waitForElementToBeRemoved(() => queryByText(/Form cannot/, { exact: false }));
        fireEvent.click(getByTestId('batch-import-submit'));

        await waitFor(() => getByTestId('action-button'));

        expect(getByText('The request to batch-import has been submitted successfully.')).toBeInTheDocument();
        assertDisabled('batch-import-submit');
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

        const { queryByText, getByTestId, getByText } = setup();

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

        await waitForElementToBeRemoved(() => queryByText(/Form cannot/, { exact: false }));
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
        await assertValidationErrorSummary(['community', 'document type', 'directory']);
        assertDisabled('batch-import-submit');

        fireEvent.mouseDown(getByTestId('community-pid-select'));
        fireEvent.click(getByText('Testing community'));

        await waitForElementToBeRemoved(() => getByText('Loading collections...'));
        await assertValidationErrorSummary(['collection', 'document type', 'directory']);

        fireEvent.click(getByTestId('is-bulk-file-ingest-input'));
        await assertValidationErrorSummary(['directory']);
        await assertValidationErrorSummary(['community', 'collection', 'document type'], false);
        assertEnabled('batch-import-submit');

        expect(queryByTestId('community-pid-select')).not.toBeInTheDocument();
        expect(queryByTestId('doc-type-id-select')).not.toBeInTheDocument();

        fireEvent.click(getByTestId('is-bulk-file-ingest-input'));
        await assertValidationErrorSummary(['collection', 'document type', 'directory']);
        assertDisabled('batch-import-submit');

        expect(getByTestId('community-pid-select')).toBeInTheDocument();
        expect(getByTestId('doc-type-id-select')).toBeInTheDocument();
    });

    it('navigates to homepage on cancel', async () => {
        const { getByTestId } = setup();
        fireEvent.click(getByTestId('batch-import-cancel'));
        expect(mockUseNavigate).toHaveBeenCalledWith('/');
    });
});
