import * as actions from 'actions/actionTypes';
import exportPublicationsReducer from './exportPublications';
import { EXPORT_FORMAT_TO_EXTENSION } from 'config/general';

export const initialState = {
    exportPublicationsLoading: false,
};

describe('export publications reducer', () => {
    it('returns the correct state while publications are being exported', () => {
        const test = exportPublicationsReducer(initialState, { type: actions.EXPORT_PUBLICATIONS_LOADING });
        expect(test.exportPublicationsLoading).toEqual(true);
    });

    it('returns the correct state when publications have been exported', () => {
        const format = Object.keys(EXPORT_FORMAT_TO_EXTENSION)[0];
        const test = exportPublicationsReducer(initialState, {
            type: actions.EXPORT_PUBLICATIONS_LOADED,
            payload: format,
        });

        expect(test.exportPublicationsLoading).toEqual(false);
    });

    it('returns the correct state when exporting publications fails to load data', () => {
        const test = exportPublicationsReducer(initialState, { type: actions.EXPORT_PUBLICATIONS_FAILED });
        expect(test.exportPublicationsLoading).toEqual(false);
    });
});

describe('General export publications reducer', () => {
    it('returns the state when an invalid action type is supplied', () => {
        const test = exportPublicationsReducer(initialState, { type: 'INVALID_ACTION_TYPE' });
        expect(test).toEqual(initialState);
    });
});
