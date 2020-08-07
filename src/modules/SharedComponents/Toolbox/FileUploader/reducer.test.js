import { default as fileUploadReducer } from './reducer';
import * as actions from 'actions/actionTypes';

describe('fileUploadReducer', () => {
    it('sets state correctly for file in progress', () => {
        const state = fileUploadReducer({}, { type: `${actions.FILE_UPLOAD_PROGRESS}@a.txt`, complete: 20 });
        const expected = {
            'a.txt': 20,
            isUploadInProgress: true,
        };

        expect(state).toEqual(expected);
    });

    it('sets state correctly for multiple files in progress', () => {
        const state = fileUploadReducer(
            { 'a.txt': 40 },
            { type: `${actions.FILE_UPLOAD_PROGRESS}@b.txt`, complete: 60 },
        );
        const expected = {
            'a.txt': 40,
            'b.txt': 60,
            isUploadInProgress: true,
        };

        expect(state).toEqual(expected);
    });

    it('sets state correctly for file upload failed', () => {
        const state = fileUploadReducer(
            { 'a.txt': 100, 'c.txt': 100 },
            { type: `${actions.FILE_UPLOAD_FAILED}@b.txt` },
        );
        const expected = {
            'a.txt': 100,
            'b.txt': 0,
            'c.txt': 100,
            isUploadInProgress: false,
        };

        expect(state).toEqual(expected);
    });

    it('sets state correctly for file upload failed', () => {
        const state = fileUploadReducer({ 'a.txt': 100, 'c.txt': 100 }, { type: actions.FILE_UPLOAD_CLEARED });
        const expected = {
            isUploadInProgress: false,
        };

        expect(state).toEqual(expected);
    });

    it('sets state correctly for file upload started', () => {
        const state = fileUploadReducer({ isUploadInProgress: false }, { type: actions.FILE_UPLOAD_STARTED });
        const expected = {
            isUploadInProgress: true,
        };

        expect(state).toEqual(expected);
    });
});
