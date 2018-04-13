import {putUploadFile} from './file';
import * as repositories from 'repositories';
import {locale} from 'locale';
// import * as mockData from 'mock/data';

describe('File repository tests ', () => {
    // extend expect to check actions
    expect.extend({toHaveDispatchedActions});

    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
        mockActionsStore.clearActions();
    });

    it('uploading a file', async () => {
        mockApi
            .onGet(repositories.routes.FILE_UPLOAD_API({pid: 'PID:111111', fileName: 'a.txt'}).apiUrl)
            .reply(200, ['s3-ap-southeast-2.amazonaws.com'])
            .onPut(/(s3-ap-southeast-2.amazonaws.com)/)
            .reply(200, 'File has been uploaded');

        await expect(putUploadFile('PID:111111', {name: 'a.txt'}, mockActionsStore.dispatch)).resolves.toEqual('File has been uploaded');
    });

    it('dispatches an upload failed action for uploading a file', async () => {
        mockApi
            .onGet(repositories.routes.FILE_UPLOAD_API({pid: 'PID:111111', fileName: 'a.txt'}).apiUrl)
            .reply(200, ['s3-ap-southeast-2.amazonaws.com'])
            .onPut(/(s3-ap-southeast-2.amazonaws.com)/)
            .reply(500);

        const expectedActions = [
            'FILE_UPLOADED_FAILED@a.txt'
        ];

        await expect(putUploadFile('PID:111111', {name: 'a.txt'}, mockActionsStore.dispatch)).rejects.toEqual(new Error(locale.global.errorMessages.generic));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });
});
