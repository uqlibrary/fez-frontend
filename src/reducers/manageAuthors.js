import * as actions from 'actions/actionTypes';

export const initialState = {
    authorListLoading: true,
    authorListLoadingError: null,
    authorListItemUpdating: false,
    authorListItemUpdateSuccess: false,
    authorListItemUpdateError: null,
    authorListItemDeleting: false,
    authorListItemDeleteSuccess: false,
    authorListItemDeleteError: null,
    authorAdding: false,
    authorAddSuccess: false,
    authorAddError: null,
    existingAuthorFieldError: null,
    bulkAuthorDeleteMessages: null,
};

const handlers = {
    [actions.AUTHOR_LIST_LOADING]: state => ({
        ...state,
        authorListLoading: true,
    }),

    [actions.AUTHOR_LIST_LOADED]: state => ({
        ...state,
        authorListLoading: false,
    }),

    [actions.AUTHOR_LIST_FAILED]: (state, action) => ({
        ...state,
        authorListLoading: false,
        authorListLoadingError: action.payload,
    }),

    [actions.AUTHOR_ITEM_UPDATING]: state => ({
        ...state,
        authorListItemUpdating: true,
    }),

    [actions.AUTHOR_ITEM_UPDATE_SUCCESS]: state => ({
        ...state,
        authorListItemUpdating: false,
        authorListItemUpdateSuccess: true,
    }),

    [actions.AUTHOR_ITEM_UPDATE_FAILED]: (state, action) => ({
        ...state,
        authorListItemUpdating: false,
        authorListItemUpdateError: action.payload,
    }),

    [actions.AUTHOR_ITEM_DELETING]: state => ({
        ...state,
        authorListItemDeleting: true,
    }),

    [actions.AUTHOR_ITEM_DELETE_SUCCESS]: state => ({
        ...state,
        authorListItemDeleting: false,
        authorListItemDeleteSuccess: true,
    }),

    [actions.AUTHOR_ITEM_DELETE_FAILED]: (state, action) => ({
        ...state,
        authorListItemDeleting: false,
        authorListItemDeleteError: action.payload,
    }),

    [actions.AUTHOR_ADDING]: state => ({
        ...state,
        authorAdding: true,
        authorAddSuccess: false,
    }),

    [actions.AUTHOR_ADD_SUCCESS]: state => ({
        ...state,
        authorAdding: false,
        authorAddSuccess: true,
    }),

    [actions.AUTHOR_ADD_FAILED]: (state, action) => ({
        ...state,
        authorAdding: false,
        authorAddSuccess: false,
        authorAddError: action.payload,
    }),

    [actions.EXISTING_AUTHOR_FOUND]: (state, action) => ({
        ...state,
        existingAuthorFieldError: action.payload,
    }),

    [actions.EXISTING_AUTHOR_NOT_FOUND]: (state, action) => ({
        ...state,
        existingAuthorFieldError: action.payload,
    }),

    [actions.BULK_AUTHOR_ITEMS_DELETE_SUCCESS]: (state, action) => ({
        ...state,
        bulkAuthorDeleteMessages: action.payload,
    }),
};

export default function manageAuthorsReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
