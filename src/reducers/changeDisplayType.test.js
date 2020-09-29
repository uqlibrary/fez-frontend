import * as actions from 'actions/actionTypes';
import changeDisplayTypeReducer from './changeDisplayType';

describe('changeDisplayType reducer', () => {
    const initialState = {
        saveRequesting: false,
        saveUpdated: false,
        saveFailed: false,
    };

    const publicationData = {
        rek_pid: 'UQ:12345',
        rek_title: 'This is a title',
        rek_description: 'This is a description.',
    };

    const mockRecord = {
        pid: 'UQ:12345',
        data: publicationData,
        total: 3,
        current_page: 1,
        from: 1,
        to: 3,
        per_page: 20,
    };

    it('returns that the change is saving', () => {
        const test = changeDisplayTypeReducer(initialState, { type: actions.CHANGE_DISPLAY_TYPE_INPROGRESS });
        expect(test).toEqual({
            ...initialState,
            saveRequesting: true,
            saveFailed: false,
        });
    });

    it('returns that the change failed', () => {
        const test = changeDisplayTypeReducer(initialState, { type: actions.CHANGE_DISPLAY_TYPE_FAILED });
        expect(test).toEqual({
            ...initialState,
            saveFailed: true,
            saveRequesting: false,
        });
    });

    it('returns that the change has saved', () => {
        const test = changeDisplayTypeReducer(initialState, {
            type: actions.CHANGE_DISPLAY_TYPE_SUCCESS,
            payload: mockRecord,
        });
        expect(test).toEqual({
            ...initialState,
            saveRequesting: false,
            saveUpdated: true,
        });
    });
});
