import * as actions from 'actions/actionTypes';
import exportCollectionsReducer from './exportCollections';
import { EXPORT_FORMAT_TO_EXTENSION } from 'config/general';

export const initialState = {
    exportCollectionsLoading: false,
    loadingByPage: {},
    loadedByPage: {},
};

describe('export collections reducer', () => {
    const format = Object.keys(EXPORT_FORMAT_TO_EXTENSION)[0];

    it('returns the correct state while collections are being exported', () => {
        const testResult = exportCollectionsReducer(initialState, {
            type: actions.EXPORT_COLLECTIONS_LOADING,
            payload: { pid: 'UQ:123456' },
        });
        expect(testResult.exportCollectionsLoading).toEqual(true);

        const testResult2 = exportCollectionsReducer(initialState, {
            type: actions.EXPORT_COLLECTIONS_LOADING,
            payload: { pid: 'UQ:123456', page: 1, format },
        });
        expect(testResult2).toEqual({
            exportingCollectionsPid: 'UQ:123456',
            exportCollectionsLoading: true,
            loadingByPage: {
                [`${format}-page-1`]: true,
            },
            loadedByPage: {},
        });
    });

    it('returns the correct state when collections have been exported', () => {
        const testResult = exportCollectionsReducer(initialState, {
            type: actions.EXPORT_COLLECTIONS_LOADED,
        });
        expect(testResult.exportCollectionsLoading).toEqual(false);

        const testResult2 = exportCollectionsReducer(
            {
                ...initialState,
                exportCollectionsLoading: true,
                loadingByPage: {
                    [`${format}-page-1`]: true,
                },
            },
            {
                type: actions.EXPORT_COLLECTIONS_LOADED,
                payload: {
                    page: 1,
                    format,
                },
            },
        );
        expect(testResult2).toEqual({
            exportingCollectionsPid: null,
            exportCollectionsLoading: false,
            loadingByPage: {},
            loadedByPage: {
                [`${format}-page-1`]: true,
            },
        });
    });

    it('returns the correct state when exporting collections fails to load data', () => {
        const testResult = exportCollectionsReducer(initialState, { type: actions.EXPORT_COLLECTIONS_FAILED });
        expect(testResult.exportCollectionsLoading).toEqual(false);

        const testResult2 = exportCollectionsReducer(
            {
                ...initialState,
                exportCollectionsLoading: true,
                loadingByPage: {
                    [`${format}-page-1`]: true,
                },
            },
            {
                type: actions.EXPORT_COLLECTIONS_FAILED,
                payload: {
                    page: 1,
                    format,
                },
            },
        );
        expect(testResult2).toEqual({
            exportingCollectionsPid: null,
            exportCollectionsLoading: false,
            loadingByPage: {
                [`${format}-page-1`]: false,
            },
            loadedByPage: {},
        });
    });
});

describe('General export collections reducer', () => {
    it('returns the state when an invalid action type is supplied', () => {
        const test = exportCollectionsReducer(initialState, { type: 'INVALID_ACTION_TYPE' });
        expect(test).toEqual(initialState);
    });
});
