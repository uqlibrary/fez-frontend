import * as actions from 'actions/actionTypes';

export const initialState = {
    userListLoading: true,
    userListLoadingError: null,
    userListItemUpdating: false,
    userListItemUpdateSuccess: false,
    userListItemUpdateError: null,
    userListItemDeleting: false,
    userListItemDeleteSuccess: false,
    userListItemDeleteError: null,
    userAdding: false,
    userAddSuccess: false,
    userAddError: null,
    bulkUserDeleteMessages: null,
};

const handlers = {
    [actions.USER_LIST_LOADING]: state => ({
        ...state,
        userListLoading: true,
    }),

    [actions.USER_LIST_LOADED]: state => ({
        ...state,
        userListLoading: false,
    }),

    [actions.USER_LIST_FAILED]: (state, action) => ({
        ...state,
        userListLoading: false,
        userListLoadingError: action.payload,
    }),

    [actions.USER_ITEM_UPDATING]: state => ({
        ...state,
        userListItemUpdating: true,
    }),

    [actions.USER_ITEM_UPDATE_SUCCESS]: state => ({
        ...state,
        userListItemUpdating: false,
        userListItemUpdateSuccess: true,
    }),

    [actions.USER_ITEM_UPDATE_FAILED]: (state, action) => ({
        ...state,
        userListItemUpdating: false,
        userListItemUpdateError: action.payload,
    }),

    [actions.USER_ITEM_DELETING]: state => ({
        ...state,
        userListItemDeleting: true,
    }),

    [actions.USER_ITEM_DELETE_SUCCESS]: state => ({
        ...state,
        userListItemDeleting: false,
        userListItemDeleteSuccess: true,
    }),

    [actions.USER_ITEM_DELETE_FAILED]: (state, action) => ({
        ...state,
        userListItemDeleting: false,
        userListItemDeleteError: action.payload,
    }),

    [actions.USER_ADDING]: state => ({
        ...state,
        userAdding: true,
        userAddSuccess: false,
    }),

    [actions.USER_ADD_SUCCESS]: state => ({
        ...state,
        userAdding: false,
        userAddSuccess: true,
    }),

    [actions.USER_ADD_FAILED]: (state, action) => ({
        ...state,
        userAdding: false,
        userAddSuccess: false,
        userAddError: action.payload,
    }),

    [actions.BULK_USER_ITEMS_DELETE_SUCCESS]: (state, action) => ({
        ...state,
        bulkUserDeleteMessages: action.payload,
    }),
};

export default function manageUsersReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
