import * as actions from 'actions/actionTypes';
import manageUsersReducer, { initialState } from './manageUsers';

describe('manage users reducer', () => {
    it('returns the correct state while users are loading', () => {
        const test = manageUsersReducer(initialState, {
            type: actions.USER_LIST_LOADING,
        });
        expect(test.userListLoading).toEqual(true);
    });

    it('returns the correct state when users are loaded', () => {
        const test = manageUsersReducer(initialState, {
            type: actions.USER_LIST_LOADED,
        });

        expect(test.userListLoading).toEqual(false);
    });

    it('returns the correct state when user list fails to load data', () => {
        const test = manageUsersReducer(initialState, {
            type: actions.USER_LIST_FAILED,
            payload: {
                status: 500,
                message: 'Test error',
            },
        });
        expect(test.userListLoading).toEqual(false);
        expect(test.userListLoadingError).toEqual({ status: 500, message: 'Test error' });
    });

    it('returns the state when an invalid action type is supplied', () => {
        const test = manageUsersReducer(initialState, { type: 'INVALID_ACTION_TYPE' });
        expect(test).toEqual(initialState);
    });

    it('returns the correct state when user item is being updated', () => {
        const test = manageUsersReducer(initialState, {
            type: actions.USER_ITEM_UPDATING,
        });
        expect(test.userListItemUpdating).toEqual(true);
    });

    it('returns the correct state when user item is successfully updated', () => {
        const test = manageUsersReducer(
            {
                ...initialState,
            },
            {
                type: actions.USER_ITEM_UPDATE_SUCCESS,
            },
        );
        expect(test.userListItemUpdating).toEqual(false);
        expect(test.userListItemUpdateSuccess).toEqual(true);
    });

    it('returns the correct state when user item update failed', () => {
        const test = manageUsersReducer(initialState, {
            type: actions.USER_ITEM_UPDATE_FAILED,
            payload: { status: 403, message: 'Test error message' },
        });
        expect(test.userListItemUpdating).toEqual(false);
        expect(test.userListItemUpdateError).toEqual({ status: 403, message: 'Test error message' });
    });

    it('returns the correct state when user item is being deleted', () => {
        const test = manageUsersReducer(initialState, {
            type: actions.USER_ITEM_DELETING,
        });
        expect(test.userListItemDeleting).toEqual(true);
    });

    it('returns the correct state when user item is successfully deleted', () => {
        const test = manageUsersReducer(
            {
                ...initialState,
            },
            {
                type: actions.USER_ITEM_DELETE_SUCCESS,
            },
        );
        expect(test.userListItemDeleting).toEqual(false);
        expect(test.userListItemDeleteSuccess).toEqual(true);
    });

    it('returns the correct state when user item delete failed', () => {
        const test = manageUsersReducer(initialState, {
            type: actions.USER_ITEM_DELETE_FAILED,
            payload: { status: 403, message: 'Test error message' },
        });
        expect(test.userListItemDeleting).toEqual(false);
        expect(test.userListItemDeleteError).toEqual({ status: 403, message: 'Test error message' });
    });

    it('returns the correct state while adding user', () => {
        const test = manageUsersReducer(initialState, { type: actions.USER_ADDING });
        expect(test.userAdding).toEqual(true);
    });

    it('returns the correct state on user added successfully', () => {
        const test = manageUsersReducer(initialState, {
            type: actions.USER_ADD_SUCCESS,
        });
        expect(test.userAdding).toEqual(false);
        expect(test.userAddSuccess).toEqual(true);
    });

    it('returns the correct state when user item add failed', () => {
        const test = manageUsersReducer(initialState, {
            type: actions.USER_ADD_FAILED,
            payload: { status: 403, message: 'Test error message' },
        });
        expect(test.userAdding).toEqual(false);
        expect(test.userAddError).toEqual({ status: 403, message: 'Test error message' });
    });
});
