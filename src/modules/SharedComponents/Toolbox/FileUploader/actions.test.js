import * as actions from 'actions/actionTypes';
import {
    clearFileUpload,
    markCompletedUpload,
    notifyFileUploadProgress,
    notifyUploadFailed,
    startFileUpload,
} from './actions';

describe('FileUploader actions ', () => {
    it('notifies progress for uploading file from an event data', () => {
        const dispatchTestFn = jest.fn();
        const uploadProgressCallback = notifyFileUploadProgress('a.txt', dispatchTestFn);
        const fileUploadProgressEvent = {
            loaded: 50,
            total: 100,
        };
        uploadProgressCallback(fileUploadProgressEvent);
        expect(dispatchTestFn).toHaveBeenCalledWith({ type: `${actions.FILE_UPLOAD_PROGRESS}@a.txt`, complete: 50 });
    });

    it('notifies on clearing file uploader', () => {
        expect(clearFileUpload()).toEqual({ type: actions.FILE_UPLOAD_CLEARED });
    });

    it('notifies on failing file upload', () => {
        expect(notifyUploadFailed('a.txt')).toEqual({ type: `${actions.FILE_UPLOAD_FAILED}@a.txt` });
    });

    it('notifies on starting file upload', () => {
        expect(startFileUpload()).toEqual({
            type: actions.FILE_UPLOAD_STARTED,
        });
    });

    it('should dispatch expected actions', () => {
        mockActionsStore = setupStoreForActions();
        const expectedActions = [`${actions.FILE_UPLOAD_COMPLETE}@test.txt`];
        mockActionsStore.dispatch(markCompletedUpload('form', 'test.txt'));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });
});
