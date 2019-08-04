import { default as fileUploadReducer } from './reducer';
import { FILE_UPLOAD_PROGRESS, FILE_UPLOADED_FAILED, FILE_UPLOAD_CLEARED, FILE_UPLOAD_STARTED } from './actions';

describe('fileUploadReducer', () => {
    it('sets state correctly for file in progress', () => {
        const state = fileUploadReducer({}, { type: `${FILE_UPLOAD_PROGRESS}@a.txt`, complete: 20 });
        const expected = {
            'a.txt': 20,
            isUploadInProgress: true,
        };

        expect(state).toEqual(expected);
    });

    it('sets state correctly for multiple files in progress', () => {
        const state = fileUploadReducer({ 'a.txt': 40 }, { type: `${FILE_UPLOAD_PROGRESS}@b.txt`, complete: 60 });
        const expected = {
            'a.txt': 40,
            'b.txt': 60,
            isUploadInProgress: true,
        };

        expect(state).toEqual(expected);
    });

    it('sets state correctly for file upload failed', () => {
        const state = fileUploadReducer({ 'a.txt': 100, 'c.txt': 100 }, { type: `${FILE_UPLOADED_FAILED}@b.txt` });
        const expected = {
            'a.txt': 100,
            'b.txt': 0,
            'c.txt': 100,
            isUploadInProgress: false,
        };

        expect(state).toEqual(expected);
    });

    it('sets state correctly for file upload failed', () => {
        const state = fileUploadReducer({ 'a.txt': 100, 'c.txt': 100 }, { type: FILE_UPLOAD_CLEARED });
        const expected = {
            isUploadInProgress: false,
        };

        expect(state).toEqual(expected);
    });

    it('sets state correctly for file upload started', () => {
        const state = fileUploadReducer({ isUploadInProgress: false }, { type: FILE_UPLOAD_STARTED });
        const expected = {
            isUploadInProgress: true,
        };

        expect(state).toEqual(expected);
    });
});
