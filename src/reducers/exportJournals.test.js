import * as actions from 'actions/actionTypes';
import exportJournalsReducer from './exportJournals';
import { EXPORT_FORMAT_TO_EXTENSION } from 'config/general';

export const initialState = {
    exportJournalsLoading: false,
    loadingByPage: {},
    loadedByPage: {},
};

describe('export journals reducer', () => {
    const format = Object.keys(EXPORT_FORMAT_TO_EXTENSION)[0];

    it('returns the correct state while journals are being exported', () => {
        const testResult = exportJournalsReducer(initialState, { type: actions.EXPORT_JOURNALS_LOADING });
        expect(testResult.exportJournalsLoading).toEqual(true);

        const testResult2 = exportJournalsReducer(initialState, {
            type: actions.EXPORT_JOURNALS_LOADING,
            payload: { page: 1, format },
        });
        expect(testResult2).toEqual({
            exportJournalsLoading: true,
            loadingByPage: {
                [`${format}-page-1`]: true,
            },
            loadedByPage: {},
        });
    });

    it('returns the correct state when journals have been exported', () => {
        const testResult = exportJournalsReducer(initialState, {
            type: actions.EXPORT_JOURNALS_LOADED,
        });
        expect(testResult.exportJournalsLoading).toEqual(false);

        const testResult2 = exportJournalsReducer(
            {
                ...initialState,
                exportJournalsLoading: true,
                loadingByPage: {
                    [`${format}-page-1`]: true,
                },
            },
            {
                type: actions.EXPORT_JOURNALS_LOADED,
                payload: {
                    page: 1,
                    format,
                },
            },
        );
        expect(testResult2).toEqual({
            exportJournalsLoading: false,
            loadingByPage: {},
            loadedByPage: {
                [`${format}-page-1`]: true,
            },
        });
    });

    it('returns the correct state when exporting journals fails to load data', () => {
        const testResult = exportJournalsReducer(initialState, { type: actions.EXPORT_JOURNALS_FAILED });
        expect(testResult.exportJournalsLoading).toEqual(false);

        const testResult2 = exportJournalsReducer(
            {
                ...initialState,
                exportJournalsLoading: true,
                loadingByPage: {
                    [`${format}-page-1`]: true,
                },
            },
            {
                type: actions.EXPORT_JOURNALS_FAILED,
                payload: {
                    page: 1,
                    format,
                },
            },
        );
        expect(testResult2).toEqual({
            exportJournalsLoading: false,
            loadingByPage: {
                [`${format}-page-1`]: false,
            },
            loadedByPage: {},
        });
    });

    it('returns the initial state on reset', () => {
        const testResult = exportJournalsReducer(
            {
                exportJournalsLoading: false,
                loadingByPage: {},
                loadedByPage: {
                    [`${format}-page-1`]: true,
                },
            },
            { type: actions.EXPORT_JOURNALS_RESET },
        );
        expect(testResult).toEqual(initialState);
    });
});

describe('General export journals reducer', () => {
    it('returns the state when an invalid action type is supplied', () => {
        const test = exportJournalsReducer(initialState, { type: 'INVALID_ACTION_TYPE' });
        expect(test).toEqual(initialState);
    });
});
