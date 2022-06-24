import * as actions from 'actions/actionTypes';
import exportPublicationsReducer from './exportPublications';
import { EXPORT_FORMAT_TO_EXTENSION } from 'config/general';

export const initialState = {
    exportPublicationsLoading: false,
    loadingByPage: {},
    loadedByPage: {},
};

describe('export publications reducer', () => {
    const format = Object.keys(EXPORT_FORMAT_TO_EXTENSION)[0];

    it('returns the correct state while publications are being exported', () => {
        const testResult = exportPublicationsReducer(initialState, { type: actions.EXPORT_PUBLICATIONS_LOADING });
        expect(testResult.exportPublicationsLoading).toEqual(true);

        const testResult2 = exportPublicationsReducer(initialState, {
            type: actions.EXPORT_PUBLICATIONS_LOADING,
            payload: { page: 1, format },
        });
        expect(testResult2).toEqual({
            exportPublicationsLoading: true,
            loadingByPage: {
                [`${format}-page-1`]: true,
            },
            loadedByPage: {},
        });
    });

    it('returns the correct state when publications have been exported', () => {
        const testResult = exportPublicationsReducer(initialState, {
            type: actions.EXPORT_PUBLICATIONS_LOADED,
        });
        expect(testResult.exportPublicationsLoading).toEqual(false);

        const testResult2 = exportPublicationsReducer(
            {
                ...initialState,
                exportPublicationsLoading: true,
                loadingByPage: {
                    [`${format}-page-1`]: true,
                },
            },
            {
                type: actions.EXPORT_PUBLICATIONS_LOADED,
                payload: {
                    page: 1,
                    format,
                },
            },
        );
        expect(testResult2).toEqual({
            exportPublicationsLoading: false,
            loadingByPage: {},
            loadedByPage: {
                [`${format}-page-1`]: true,
            },
        });
    });

    it('returns the correct state when exporting publications fails to load data', () => {
        const testResult = exportPublicationsReducer(initialState, { type: actions.EXPORT_PUBLICATIONS_FAILED });
        expect(testResult.exportPublicationsLoading).toEqual(false);

        const testResult2 = exportPublicationsReducer(
            {
                ...initialState,
                exportPublicationsLoading: true,
                loadingByPage: {
                    [`${format}-page-1`]: true,
                },
            },
            {
                type: actions.EXPORT_PUBLICATIONS_FAILED,
                payload: {
                    page: 1,
                    format,
                },
            },
        );
        expect(testResult2).toEqual({
            exportPublicationsLoading: false,
            loadingByPage: {
                [`${format}-page-1`]: false,
            },
            loadedByPage: {},
        });
    });

    it('returns the initial state on reset', () => {
        const testResult = exportPublicationsReducer(
            {
                exportPublicationsLoading: false,
                loadingByPage: {},
                loadedByPage: {
                    [`${format}-page-1`]: true,
                },
            },
            { type: actions.EXPORT_PUBLICATIONS_RESET },
        );
        expect(testResult).toEqual(initialState);
    });
});

describe('General export publications reducer', () => {
    it('returns the state when an invalid action type is supplied', () => {
        const test = exportPublicationsReducer(initialState, { type: 'INVALID_ACTION_TYPE' });
        expect(test).toEqual(initialState);
    });
});
