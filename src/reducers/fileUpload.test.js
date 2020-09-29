import * as actions from 'actions/actionTypes';
import fileUploadReducer, { initialState } from './fileUpload';

describe('fileUpload reducer', () => {
    it('updates completed state for specified file', () => {
        const test1 = fileUploadReducer(initialState, {
            type: `${actions.FILE_UPLOAD_COMPLETE}@file1.jpg`,
            payload: { form: 'TEST_FORM' },
        });
        expect(test1.TEST_FORM.completedUploads).toStrictEqual(['file1.jpg']);

        const test2 = fileUploadReducer(test1, {
            type: `${actions.FILE_UPLOAD_COMPLETE}@file2.jpg`,
            payload: { form: 'TEST_FORM' },
        });
        expect(test2.TEST_FORM.completedUploads).toStrictEqual(['file1.jpg', 'file2.jpg']);
    });
});
