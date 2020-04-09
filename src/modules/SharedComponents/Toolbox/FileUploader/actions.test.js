import {
    FILE_UPLOAD_STARTED,
    FILE_UPLOAD_PROGRESS,
    FILE_UPLOAD_CLEARED,
    FILE_UPLOADED_FAILED,
    notifyFileUploadProgress,
    clearFileUpload,
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
        expect(dispatchTestFn).toHaveBeenCalledWith({ type: `${FILE_UPLOAD_PROGRESS}@a.txt`, complete: 50 });
    });

    it('notifies on clearing file uploader', () => {
        expect(clearFileUpload()).toEqual({ type: FILE_UPLOAD_CLEARED });
    });

    it('notifies on failing file upload', () => {
        expect(notifyUploadFailed('a.txt')).toEqual({ type: `${FILE_UPLOADED_FAILED}@a.txt` });
    });

    it('notifies on starting file upload', () => {
        expect(startFileUpload()).toEqual({
            type: FILE_UPLOAD_STARTED,
        });
    });
});
