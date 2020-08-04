import * as actions from 'actions/actionTypes';
import favouriteSearchReducer from './favouriteSearch';

export const initialState = {
    favouriteSearchListLoading: true,
    favouriteSearchList: null,
    favouriteSearchListError: null,
    favouriteSearchListItemUpdating: false,
    favouriteSearchListItemUpdateFailed: null,
    favouriteSearchListItemUpdateError: null,
    favouriteSearchListItemDeleting: false,
    favouriteSearchListItemDeleteFailed: null,
    favouriteSearchListItemDeleteError: null,
};

describe('favourite search reducer', () => {
    it('returns the correct state while favourite search are loading', () => {
        const test = favouriteSearchReducer(initialState, { type: actions.FAVOURITE_SEARCH_LIST_LOADING });
        expect(test.favouriteSearchListLoading).toEqual(true);
    });

    it('returns the correct state when favourite search are loaded', () => {
        const test = favouriteSearchReducer(initialState, {
            type: actions.FAVOURITE_SEARCH_LIST_LOADED,
            payload: [
                {
                    fvs_id: 1,
                },
            ],
        });

        expect(test.favouriteSearchListLoading).toEqual(false);
        expect(test.favouriteSearchList).toEqual([{ fvs_id: 1 }]);
        expect(test.favouriteSearchListError).toEqual(null);
    });

    it('returns the correct state when favourite search fails to load data', () => {
        const test = favouriteSearchReducer(initialState, {
            type: actions.FAVOURITE_SEARCH_LIST_FAILED,
            payload: {
                status: 500,
                message: 'Test error',
            },
        });
        expect(test.favouriteSearchListLoading).toEqual(false);
        expect(test.favouriteSearchList).toEqual(null);
        expect(test.favouriteSearchListError).toEqual({ status: 500, message: 'Test error' });
    });

    it('returns the state when an invalid action type is supplied', () => {
        const test = favouriteSearchReducer(initialState, { type: 'INVALID_ACTION_TYPE' });
        expect(test).toEqual(initialState);
    });

    it('returns the correct state when favourite search item is being updated', () => {
        const test = favouriteSearchReducer(initialState, { type: actions.FAVOURITE_SEARCH_ITEM_UPDATING });
        expect(test.favouriteSearchListItemUpdating).toEqual(true);
    });

    it('returns the correct state when favourite search item is successfully updated', () => {
        const oldData = {
            fvs_id: 2,
            fvs_description: 'test',
            fvs_alias: 'tests',
            fvs_search_parameters: 'test',
        };
        const test = favouriteSearchReducer(
            {
                ...initialState,
                favouriteSearchList: [
                    {
                        fvs_id: 1,
                        fvs_description: 'test',
                        fvs_alias: 'test',
                        fvs_search_parameters: 'test',
                    },
                    oldData,
                ],
            },
            {
                type: actions.FAVOURITE_SEARCH_ITEM_UPDATE_SUCCESS,
                payload: { fvs_id: 2, fvs_description: 'testing', fvs_alias: 'tests', fvs_search_parameters: 'test' },
                oldData,
            },
        );
        expect(test.favouriteSearchListItemUpdating).toEqual(false);
        expect(test.favouriteSearchList).toEqual([
            {
                fvs_id: 1,
                fvs_description: 'test',
                fvs_alias: 'test',
                fvs_search_parameters: 'test',
            },
            {
                fvs_id: 2,
                fvs_description: 'testing',
                fvs_alias: 'tests',
                fvs_search_parameters: 'test',
            },
        ]);
    });

    it('returns the correct state when favourite search item update failed', () => {
        const test = favouriteSearchReducer(initialState, {
            type: actions.FAVOURITE_SEARCH_ITEM_UPDATE_FAILED,
            payload: { status: 403, message: 'Test error message' },
        });
        expect(test.favouriteSearchListItemUpdating).toEqual(false);
        expect(test.favouriteSearchListItemUpdateError).toEqual({ status: 403, message: 'Test error message' });
    });

    it('returns the correct state when favourite search item is being deleted', () => {
        const test = favouriteSearchReducer(initialState, { type: actions.FAVOURITE_SEARCH_ITEM_DELETING });
        expect(test.favouriteSearchListItemDeleting).toEqual(true);
    });

    it('returns the correct state when favourite search item is successfully deleted', () => {
        const oldData = {
            fvs_id: 2,
            fvs_description: 'test',
            fvs_alias: 'tests',
            fvs_search_parameters: 'test',
        };
        const test = favouriteSearchReducer(
            {
                ...initialState,
                favouriteSearchList: [
                    {
                        fvs_id: 1,
                        fvs_description: 'test',
                        fvs_alias: 'test',
                        fvs_search_parameters: 'test',
                    },
                    oldData,
                ],
            },
            {
                type: actions.FAVOURITE_SEARCH_ITEM_DELETE_SUCCESS,
                payload: oldData,
            },
        );
        expect(test.favouriteSearchListItemDeleting).toEqual(false);
        expect(test.favouriteSearchList).toEqual([
            {
                fvs_id: 1,
                fvs_description: 'test',
                fvs_alias: 'test',
                fvs_search_parameters: 'test',
            },
        ]);
    });

    it('returns the correct state when favourite search item delete failed', () => {
        const test = favouriteSearchReducer(initialState, {
            type: actions.FAVOURITE_SEARCH_ITEM_DELETE_FAILED,
            payload: { status: 403, message: 'Test error message' },
        });
        expect(test.favouriteSearchListItemDeleting).toEqual(false);
        expect(test.favouriteSearchListItemDeleteError).toEqual({ status: 403, message: 'Test error message' });
    });
});
