import * as actions from './actionTypes';
import * as batchImport from './batchImport';

const successfulCreationResponse = {
    data: 'Batch Import Job Created',
};

const successfulDirectoryRequest = {
    data: ['Archives', 'Audio_MA', 'Audio_OA'],
};

const validCreationRequest = {
    collection_pid: 'UQ:734356',
    directory: 'eSpace Security Testing',
    doc_type_id: 238,
};

describe('batch import creators', () => {
    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
    });

    it('should dispatch 2 actions on successful creation of batch request', async () => {
        mockApi.onAny().reply(201, successfulCreationResponse);

        const expectedActions = [actions.BATCH_IMPORT_REQUESTING, actions.BATCH_IMPORT_REQUESTED];

        await mockActionsStore.dispatch(batchImport.createBatchImport(validCreationRequest));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should dispatch 2 actions on error 422 on creation of batch request', async () => {
        const invalidResponse = {
            message: 'The given data was invalid.',
            errors: {
                collection_pid: ['validation.required'],
                doc_type_id: ['validation.required'],
                directory: ['validation.required'],
            },
        };
        mockApi.onAny().reply(422, invalidResponse);

        const expectedActions = [actions.BATCH_IMPORT_REQUESTING, actions.BATCH_IMPORT_REQUEST_FAILED];

        try {
            await mockActionsStore.dispatch(batchImport.createBatchImport({}));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        } catch (e) {
            // local/global.js converts 422 to 500
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        }
    });

    it('should dispatch 2 actions on error 500 on creation of batch request', async () => {
        mockApi.onAny().reply(500, { data: '' });

        const expectedActions = [
            actions.BATCH_IMPORT_REQUESTING,
            actions.APP_ALERT_SHOW,
            actions.BATCH_IMPORT_REQUEST_FAILED,
        ];

        try {
            await mockActionsStore.dispatch(batchImport.createBatchImport(validCreationRequest));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        } catch (e) {
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        }
    });
});

describe('batch import request directory', () => {
    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
    });

    it('should dispatch 2 actions on successful directory request', async () => {
        mockApi.onAny().reply(200, successfulDirectoryRequest);

        const expectedActions = [actions.DIRECTORY_LIST_LOADING, actions.DIRECTORY_LIST_LOADED];

        await mockActionsStore.dispatch(batchImport.getBatchImportDirectories());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should dispatch 2 actions on error 500 on directory request', async () => {
        mockApi.onAny().reply(500, { data: '' });

        const expectedActions = [actions.DIRECTORY_LIST_LOADING, actions.APP_ALERT_SHOW, actions.DIRECTORY_LIST_FAILED];

        try {
            await mockActionsStore.dispatch(batchImport.getBatchImportDirectories());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        } catch (e) {
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        }
    });
});
