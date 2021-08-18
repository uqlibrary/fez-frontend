import * as actions from 'actions/actionTypes';
import bulkUpdatesReducer, { initialState } from './bulkUpdates';

describe('bulk updates reducer', () => {
    it('returns the correct state while bulk updates are loading', () => {
        const test = bulkUpdatesReducer(initialState, { type: actions.BULK_UPDATES_LIST_LOADING });
        expect(test.bulkUpdatesListLoading).toEqual(true);
    });

    it('returns the correct state when bulk updates are loaded', () => {
        const test = bulkUpdatesReducer(initialState, {
            type: actions.BULK_UPDATES_LIST_LOADED,
            payload: [
                {
                    fbuj_id: 1,
                },
            ],
        });

        expect(test.bulkUpdatesListLoading).toEqual(false);
        expect(test.bulkUpdatesList).toEqual([{ fbuj_id: 1 }]);
        expect(test.bulkUpdatesListError).toEqual(null);
    });

    it('returns the correct state when bulk updates fails to load data', () => {
        const test = bulkUpdatesReducer(initialState, {
            type: actions.BULK_UPDATES_LIST_FAILED,
            payload: {
                status: 500,
                message: 'Test error',
            },
        });
        expect(test.bulkUpdatesListLoading).toEqual(false);
        expect(test.bulkUpdatesList).toEqual(null);
        expect(test.bulkUpdatesListError).toEqual({ status: 500, message: 'Test error' });
    });

    it('returns the state when an invalid action type is supplied', () => {
        const test = bulkUpdatesReducer(initialState, { type: 'INVALID_ACTION_TYPE' });
        expect(test).toEqual(initialState);
    });
});
