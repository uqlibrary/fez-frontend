import * as actions from 'actions/actionTypes';

export const initialState = {
    authorListLoading: false,
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
    scopusIngestRequesting: false,
    scopusIngestRequestSuccess: false,
    scopusIngestRequestError: false,
};

const handlers = {
    [actions.AUTHOR_LIST_LOADING]: () => ({
        ...initialState,
        authorListLoading: true,
    }),

    [actions.AUTHOR_LIST_LOADED]: () => ({
        ...initialState,
        authorListLoading: false,
    }),

    [actions.AUTHOR_LIST_FAILED]: (state, action) => ({
        ...initialState,
        authorListLoading: false,
        authorListLoadingError: action.payload,
    }),

    [actions.AUTHOR_ITEM_UPDATING]: () => ({
        ...initialState,
        authorListItemUpdating: true,
    }),

    [actions.AUTHOR_ITEM_UPDATE_SUCCESS]: () => ({
        ...initialState,
        authorListItemUpdating: false,
        authorListItemUpdateSuccess: true,
    }),

    [actions.AUTHOR_ITEM_UPDATE_FAILED]: (state, action) => ({
        ...initialState,
        authorListItemUpdating: false,
        authorListItemUpdateError: action.payload,
    }),

    [actions.AUTHOR_ITEM_DELETING]: () => ({
        ...initialState,
        authorListItemDeleting: true,
    }),

    [actions.AUTHOR_ITEM_DELETE_SUCCESS]: () => ({
        ...initialState,
        authorListItemDeleting: false,
        authorListItemDeleteSuccess: true,
    }),

    [actions.AUTHOR_ITEM_DELETE_FAILED]: (state, action) => ({
        ...initialState,
        authorListItemDeleting: false,
        authorListItemDeleteError: action.payload,
    }),

    [actions.AUTHOR_ADDING]: () => ({
        ...initialState,
        authorAdding: true,
        authorAddSuccess: false,
    }),

    [actions.AUTHOR_ADD_SUCCESS]: () => ({
        ...initialState,
        authorAdding: false,
        authorAddSuccess: true,
    }),

    [actions.AUTHOR_ADD_FAILED]: (state, action) => ({
        ...initialState,
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
        existingAuthorFieldError: {
            ...state.existingAuthorFieldError,
            ...action.payload,
        },
    }),

    [actions.BULK_AUTHOR_ITEMS_DELETE_SUCCESS]: (state, action) => ({
        ...state,
        bulkAuthorDeleteMessages: action.payload,
    }),

    [actions.SCOPUS_INGEST_REQUESTING]: () => ({
        ...initialState,
        scopusIngestRequesting: true,
    }),

    [actions.SCOPUS_INGEST_REQUEST_SUCCESS]: (state, action) => ({
        ...initialState,
        scopusIngestRequestSuccess: action.payload,
    }),

    [actions.SCOPUS_INGEST_REQUEST_FAILED]: (state, action) => ({
        ...initialState,
        scopusIngestRequestError: action.payload,
    }),
};

export default function manageAuthorsReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
