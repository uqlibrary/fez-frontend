import * as actions from 'actions/actionTypes';

export const initialState = {
    authorListLoading: true,
    authorList: null,
    authorListError: null,
    authorListItemUpdating: false,
    authorListItemUpdateError: null,
    authorListItemDeleting: false,
    authorListItemDeleteError: null,
    authorAdding: false,
    authorAddSuccess: false,
    authorAddError: null,
};

const handlers = {
    [actions.AUTHOR_LIST_LOADING]: state => ({
        ...state,
        authorListLoading: true,
    }),

    [actions.AUTHOR_LIST_LOADED]: (state, action) => ({
        ...state,
        authorListLoading: false,
        authorList: action.payload.data,
    }),

    [actions.AUTHOR_LIST_FAILED]: (state, action) => ({
        ...state,
        authorListLoading: false,
        authorList: null,
        authorListError: action.payload,
    }),

    [actions.AUTHOR_ITEM_UPDATING]: state => ({
        ...state,
        authorListItemUpdating: true,
    }),

    [actions.AUTHOR_ITEM_UPDATE_SUCCESS]: (state, action) => {
        const index = state.authorList.indexOf(action.oldData);
        return {
            ...state,
            authorListItemUpdating: false,
            authorList: [...state.authorList.slice(0, index), action.payload, ...state.authorList.slice(index + 1)],
        };
    },

    [actions.AUTHOR_ITEM_UPDATE_FAILED]: (state, action) => ({
        ...state,
        authorListItemUpdating: false,
        authorListItemUpdateError: action.payload,
    }),

    [actions.AUTHOR_ITEM_DELETING]: state => ({
        ...state,
        authorListItemDeleting: true,
    }),

    [actions.AUTHOR_ITEM_DELETE_SUCCESS]: (state, action) => {
        const index = state.authorList.indexOf(action.payload);
        return {
            ...state,
            authorListItemDeleting: false,
            authorList: [...state.authorList.slice(0, index), ...state.authorList.slice(index + 1)],
        };
    },

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
};

export default function authorsListReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
