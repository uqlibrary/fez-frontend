import * as actions from 'actions/actionTypes';
import exportCommunitiesReducer from './exportCommunities';
import { EXPORT_FORMAT_TO_EXTENSION } from 'config/general';

export const initialState = {
    exportCommunitiesLoading: false,
    loadingByPage: {},
    loadedByPage: {},
};

describe('export communities reducer', () => {
    const format = Object.keys(EXPORT_FORMAT_TO_EXTENSION)[0];

    it('returns the correct state while communities are being exported', () => {
        const testResult = exportCommunitiesReducer(initialState, { type: actions.EXPORT_COMMUNITIES_LOADING });
        expect(testResult.exportCommunitiesLoading).toEqual(true);

        const testResult2 = exportCommunitiesReducer(initialState, {
            type: actions.EXPORT_COMMUNITIES_LOADING,
            payload: { page: 1, format },
        });
        expect(testResult2).toEqual({
            exportCommunitiesLoading: true,
            loadingByPage: {
                [`${format}-page-1`]: true,
            },
            loadedByPage: {},
        });
    });

    it('returns the correct state when communities have been exported', () => {
        const testResult = exportCommunitiesReducer(initialState, {
            type: actions.EXPORT_COMMUNITIES_LOADED,
        });
        expect(testResult.exportCommunitiesLoading).toEqual(false);

        const testResult2 = exportCommunitiesReducer(
            {
                ...initialState,
                exportCommunitiesLoading: true,
                loadingByPage: {
                    [`${format}-page-1`]: true,
                },
            },
            {
                type: actions.EXPORT_COMMUNITIES_LOADED,
                payload: {
                    page: 1,
                    format,
                },
            },
        );
        expect(testResult2).toEqual({
            exportCommunitiesLoading: false,
            loadingByPage: {},
            loadedByPage: {
                [`${format}-page-1`]: true,
            },
        });
    });

    it('returns the correct state when exporting communities fails to load data', () => {
        const testResult = exportCommunitiesReducer(initialState, { type: actions.EXPORT_COMMUNITIES_FAILED });
        expect(testResult.exportCommunitiesLoading).toEqual(false);

        const testResult2 = exportCommunitiesReducer(
            {
                ...initialState,
                exportCommunitiesLoading: true,
                loadingByPage: {
                    [`${format}-page-1`]: true,
                },
            },
            {
                type: actions.EXPORT_COMMUNITIES_FAILED,
                payload: {
                    page: 1,
                    format,
                },
            },
        );
        expect(testResult2).toEqual({
            exportCommunitiesLoading: false,
            loadingByPage: {
                [`${format}-page-1`]: false,
            },
            loadedByPage: {},
        });
    });
});

describe('General export communities reducer', () => {
    it('returns the state when an invalid action type is supplied', () => {
        const test = exportCommunitiesReducer(initialState, { type: 'INVALID_ACTION_TYPE' });
        expect(test).toEqual(initialState);
    });
});
