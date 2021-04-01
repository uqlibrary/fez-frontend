import * as actions from 'actions/actionTypes';
import manageAuthorsReducer, { initialState } from './manageAuthors';

/*
    "aut_id"
    "aut_org_staff_id"
    "aut_display_name"
    "aut_org_username"
    "aut_student_username"
    "aut_fname"
    "aut_lname"
    "aut_mname"
    "aut_title"
*/

describe('author reducer', () => {
    it('returns the correct state while author are loading', () => {
        const test = manageAuthorsReducer(initialState, {
            type: actions.AUTHOR_LIST_LOADING,
        });
        expect(test.authorListLoading).toEqual(true);
    });

    it('returns the correct state when author are loaded', () => {
        const test = manageAuthorsReducer(initialState, {
            type: actions.AUTHOR_LIST_LOADED,
        });

        expect(test.authorListLoading).toEqual(false);
    });

    it('returns the correct state when author list fails to load data', () => {
        const test = manageAuthorsReducer(initialState, {
            type: actions.AUTHOR_LIST_FAILED,
            payload: {
                status: 500,
                message: 'Test error',
            },
        });
        expect(test.authorListLoading).toEqual(false);
        expect(test.authorListLoadingError).toEqual({ status: 500, message: 'Test error' });
    });

    it('returns the state when an invalid action type is supplied', () => {
        const test = manageAuthorsReducer(initialState, { type: 'INVALID_ACTION_TYPE' });
        expect(test).toEqual(initialState);
    });

    it('returns the correct state when author item is being updated', () => {
        const test = manageAuthorsReducer(initialState, {
            type: actions.AUTHOR_ITEM_UPDATING,
        });
        expect(test.authorListItemUpdating).toEqual(true);
    });

    it('returns the correct state when author item is successfully updated', () => {
        const test = manageAuthorsReducer(
            {
                ...initialState,
            },
            {
                type: actions.AUTHOR_ITEM_UPDATE_SUCCESS,
            },
        );
        expect(test.authorListItemUpdating).toEqual(false);
        expect(test.authorListItemUpdateSuccess).toEqual(true);
    });

    it('returns the correct state when author item update failed', () => {
        const test = manageAuthorsReducer(initialState, {
            type: actions.AUTHOR_ITEM_UPDATE_FAILED,
            payload: { status: 403, message: 'Test error message' },
        });
        expect(test.authorListItemUpdating).toEqual(false);
        expect(test.authorListItemUpdateError).toEqual({ status: 403, message: 'Test error message' });
    });

    it('returns the correct state when author item is being deleted', () => {
        const test = manageAuthorsReducer(initialState, {
            type: actions.AUTHOR_ITEM_DELETING,
        });
        expect(test.authorListItemDeleting).toEqual(true);
    });

    it('returns the correct state when author item is successfully deleted', () => {
        const test = manageAuthorsReducer(
            {
                ...initialState,
            },
            {
                type: actions.AUTHOR_ITEM_DELETE_SUCCESS,
            },
        );
        expect(test.authorListItemDeleting).toEqual(false);
        expect(test.authorListItemDeleteSuccess).toEqual(true);
    });

    it('returns the correct state when author item delete failed', () => {
        const test = manageAuthorsReducer(initialState, {
            type: actions.AUTHOR_ITEM_DELETE_FAILED,
            payload: { status: 403, message: 'Test error message' },
        });
        expect(test.authorListItemDeleting).toEqual(false);
        expect(test.authorListItemDeleteError).toEqual({ status: 403, message: 'Test error message' });
    });

    it('returns the correct state while adding author', () => {
        const test = manageAuthorsReducer(initialState, { type: actions.AUTHOR_ADDING });
        expect(test.authorAdding).toEqual(true);
    });

    it('returns the correct state on author added successfully', () => {
        const test = manageAuthorsReducer(initialState, {
            type: actions.AUTHOR_ADD_SUCCESS,
        });
        expect(test.authorAdding).toEqual(false);
        expect(test.authorAddSuccess).toEqual(true);
    });

    it('returns the correct state when author item add failed', () => {
        const test = manageAuthorsReducer(initialState, {
            type: actions.AUTHOR_ADD_FAILED,
            payload: { status: 403, message: 'Test error message' },
        });
        expect(test.authorAdding).toEqual(false);
        expect(test.authorAddError).toEqual({ status: 403, message: 'Test error message' });
    });
});
