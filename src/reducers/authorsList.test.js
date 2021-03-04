import * as actions from 'actions/actionTypes';
import authorListReducer, { initialState } from './authorsList';

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
        const test = authorListReducer(initialState, {
            type: actions.AUTHOR_LIST_LOADING,
        });
        expect(test.authorListLoading).toEqual(true);
    });

    it('returns the correct state when author are loaded', () => {
        const test = authorListReducer(initialState, {
            type: actions.AUTHOR_LIST_LOADED,
            payload: [
                {
                    aut_id: 1,
                },
            ],
        });

        expect(test.authorListLoading).toEqual(false);
        expect(test.authorList).toEqual([{ aut_id: 1 }]);
        expect(test.authorListError).toEqual(null);
    });

    it('returns the correct state when author list fails to load data', () => {
        const test = authorListReducer(initialState, {
            type: actions.AUTHOR_LIST_FAILED,
            payload: {
                status: 500,
                message: 'Test error',
            },
        });
        expect(test.authorListLoading).toEqual(false);
        expect(test.authorList).toEqual(null);
        expect(test.authorListError).toEqual({ status: 500, message: 'Test error' });
    });

    it('returns the state when an invalid action type is supplied', () => {
        const test = authorListReducer(initialState, { type: 'INVALID_ACTION_TYPE' });
        expect(test).toEqual(initialState);
    });

    it('returns the correct state when author item is being updated', () => {
        const test = authorListReducer(initialState, {
            type: actions.AUTHOR_ITEM_UPDATING,
        });
        expect(test.authorListItemUpdating).toEqual(true);
    });

    it('returns the correct state when author item is successfully updated', () => {
        const oldData = {
            aut_id: 2,
            aut_display_name: 'test',
            aut_org_staff_id: 2134,
            aut_org_username: '454145',
            aut_student_username: 'Guest Editor',
            aut_fname: '2010',
            aut_lname: '2020',
            aut_mname: '2020',
            aut_title: '2020',
        };
        const test = authorListReducer(
            {
                ...initialState,
                authorList: [
                    {
                        aut_id: 1,
                        aut_display_name: 'test',
                        aut_org_staff_id: 'test',
                        aut_org_username: 'test',
                    },
                    oldData,
                ],
            },
            {
                type: actions.AUTHOR_ITEM_UPDATE_SUCCESS,
                payload: {
                    aut_id: 2,
                    aut_display_name: 'test',
                    aut_org_staff_id: 2134,
                    aut_org_username: '454144',
                    aut_student_username: 'Editorial Board Member',
                    aut_fname: '2010',
                    aut_lname: '2020',
                    aut_mname: '2020',
                    aut_title: '2020',
                },
                oldData,
            },
        );
        expect(test.authorListItemUpdating).toEqual(false);
        expect(test.authorList).toEqual([
            {
                aut_id: 1,
                aut_display_name: 'test',
                aut_org_staff_id: 'test',
                aut_org_username: 'test',
            },
            {
                aut_id: 2,
                aut_display_name: 'test',
                aut_org_staff_id: 2134,
                aut_org_username: '454144',
                aut_student_username: 'Editorial Board Member',
                aut_fname: '2010',
                aut_lname: '2020',
                aut_mname: '2020',
                aut_title: '2020',
            },
        ]);
    });

    it('returns the correct state when author item update failed', () => {
        const test = authorListReducer(initialState, {
            type: actions.AUTHOR_ITEM_UPDATE_FAILED,
            payload: { status: 403, message: 'Test error message' },
        });
        expect(test.authorListItemUpdating).toEqual(false);
        expect(test.authorListItemUpdateError).toEqual({ status: 403, message: 'Test error message' });
    });

    it('returns the correct state when author item is being deleted', () => {
        const test = authorListReducer(initialState, {
            type: actions.AUTHOR_ITEM_DELETING,
        });
        expect(test.authorListItemDeleting).toEqual(true);
    });

    it('returns the correct state when author item is successfully deleted', () => {
        const oldData = {
            aut_id: 2,
            aut_display_name: 'test',
            aut_org_staff_id: 'tests',
            aut_org_username: 'test',
        };
        const test = authorListReducer(
            {
                ...initialState,
                authorList: [
                    {
                        aut_id: 1,
                        aut_display_name: 'test',
                        aut_org_staff_id: 'test',
                        aut_org_username: 'test',
                    },
                    oldData,
                ],
            },
            {
                type: actions.AUTHOR_ITEM_DELETE_SUCCESS,
                payload: oldData,
            },
        );
        expect(test.authorListItemDeleting).toEqual(false);
        expect(test.authorList).toEqual([
            {
                aut_id: 1,
                aut_display_name: 'test',
                aut_org_staff_id: 'test',
                aut_org_username: 'test',
            },
        ]);
    });

    it('returns the correct state when author item delete failed', () => {
        const test = authorListReducer(initialState, {
            type: actions.AUTHOR_ITEM_DELETE_FAILED,
            payload: { status: 403, message: 'Test error message' },
        });
        expect(test.authorListItemDeleting).toEqual(false);
        expect(test.authorListItemDeleteError).toEqual({ status: 403, message: 'Test error message' });
    });

    it('returns the correct state while adding author', () => {
        const test = authorListReducer(initialState, { type: actions.AUTHOR_ADDING });
        expect(test.authorAdding).toEqual(true);
    });

    it('returns the correct state on author added successfully', () => {
        const test = authorListReducer(initialState, {
            type: actions.AUTHOR_ADD_SUCCESS,
        });
        expect(test.authorAdding).toEqual(false);
        expect(test.authorAddSuccess).toEqual(true);
    });

    it('returns the correct state when author item add failed', () => {
        const test = authorListReducer(initialState, {
            type: actions.AUTHOR_ADD_FAILED,
            payload: { status: 403, message: 'Test error message' },
        });
        expect(test.authorAdding).toEqual(false);
        expect(test.authorAddError).toEqual({ status: 403, message: 'Test error message' });
    });
});
