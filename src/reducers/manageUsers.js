import * as actions from 'actions/actionTypes';

export const initialState = {
    userListLoading: false,
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
    [actions.USER_LIST_LOADING]: () => ({
        ...initialState,
        userListLoading: true,
    }),

    [actions.USER_LIST_LOADED]: () => ({
        ...initialState,
        userListLoading: false,
    }),

    [actions.USER_LIST_FAILED]: (state, action) => ({
        ...initialState,
        userListLoading: false,
        userListLoadingError: action.payload,
    }),

    [actions.USER_ITEM_UPDATING]: () => ({
        ...initialState,
        userListItemUpdating: true,
    }),

    [actions.USER_ITEM_UPDATE_SUCCESS]: () => ({
        ...initialState,
        userListItemUpdating: false,
        userListItemUpdateSuccess: true,
    }),

    [actions.USER_ITEM_UPDATE_FAILED]: (state, action) => ({
        ...initialState,
        userListItemUpdating: false,
        userListItemUpdateError: action.payload,
    }),

    [actions.USER_ITEM_DELETING]: () => ({
        ...initialState,
        userListItemDeleting: true,
    }),

    [actions.USER_ITEM_DELETE_SUCCESS]: () => ({
        ...initialState,
        userListItemDeleting: false,
        userListItemDeleteSuccess: true,
    }),

    [actions.USER_ITEM_DELETE_FAILED]: (state, action) => ({
        ...initialState,
        userListItemDeleting: false,
        userListItemDeleteError: action.payload,
    }),

    [actions.USER_ADDING]: () => ({
        ...initialState,
        userAdding: true,
        userAddSuccess: false,
    }),

    [actions.USER_ADD_SUCCESS]: () => ({
        ...initialState,
        userAdding: false,
        userAddSuccess: true,
    }),

    [actions.USER_ADD_FAILED]: (state, action) => ({
        ...initialState,
        userAdding: false,
        userAddSuccess: false,
        userAddError: action.payload,
    }),

    [actions.BULK_USER_ITEMS_DELETE_SUCCESS]: (state, action) => ({
        ...state,
        bulkUserDeleteMessages: action.payload,
    }),

    [actions.USER_CLEAR_ALERTS]: state => ({
        ...state,
        userAddSuccess: false,
        userAddError: null,
        userListItemUpdateSuccess: false,
        userListItemUpdateError: null,
        userListItemDeleteSuccess: false,
        userListItemDeleteError: null,
        bulkUserDeleteMessages: null,
    }),
};

export default function manageUsersReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
