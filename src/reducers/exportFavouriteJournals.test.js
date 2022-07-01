import * as actions from 'actions/actionTypes';
import exportFavouriteJournalsReducer from './exportFavouriteJournals';
import { EXPORT_FORMAT_TO_EXTENSION } from 'config/general';

export const initialState = {
    exportJournalsLoading: false,
    payload: {},
};

describe('export favourite journals reducer', () => {
    const format = Object.keys(EXPORT_FORMAT_TO_EXTENSION)[0];

    it('returns the correct state while journals are being exported', () => {
        const testResult = exportFavouriteJournalsReducer(initialState, {
            type: actions.EXPORT_FAVOURITE_JOURNALS_LOADING,
        });
        expect(testResult.exportJournalsLoading).toEqual(true);

        const testResult2 = exportFavouriteJournalsReducer(initialState, {
            type: actions.EXPORT_FAVOURITE_JOURNALS_LOADING,
            payload: { page: 1, format },
        });
        expect(testResult2).toEqual({
            exportJournalsLoading: true,
            payload: { page: 1, format },
        });
    });

    it('returns the correct state when journals have been exported', () => {
        const testResult = exportFavouriteJournalsReducer(initialState, {
            type: actions.EXPORT_FAVOURITE_JOURNALS_LOADED,
        });
        expect(testResult.exportJournalsLoading).toEqual(false);

        const testResult2 = exportFavouriteJournalsReducer(
            {
                ...initialState,
                exportJournalsLoading: true,
            },
            {
                type: actions.EXPORT_FAVOURITE_JOURNALS_LOADED,
                payload: { page: 1, format },
            },
        );
        expect(testResult2).toEqual({
            exportJournalsLoading: false,
            payload: { page: 1, format },
        });
    });

    it('returns the correct state when exporting journals fails to load data', () => {
        const testResult = exportFavouriteJournalsReducer(initialState, {
            type: actions.EXPORT_FAVOURITE_JOURNALS_FAILED,
        });
        expect(testResult.exportJournalsLoading).toEqual(false);

        const testResult2 = exportFavouriteJournalsReducer(
            {
                ...initialState,
                exportJournalsLoading: true,
            },
            {
                type: actions.EXPORT_FAVOURITE_JOURNALS_FAILED,
                payload: { page: 1, format },
            },
        );
        expect(testResult2).toEqual({
            exportJournalsLoading: false,
            payload: { page: 1, format },
        });
    });
});

describe('General export favourite journals reducer', () => {
    it('returns the state when an invalid action type is supplied', () => {
        const test = exportFavouriteJournalsReducer(initialState, { type: 'INVALID_ACTION_TYPE' });
        expect(test).toEqual(initialState);
    });
});
