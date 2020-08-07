import * as actions from 'actions/actionTypes';
import locale from 'locale/pages';

export const initialState = {
    favouriteSearchListLoading: true,
    favouriteSearchList: null,
    favouriteSearchListError: null,
    favouriteSearchListItemUpdating: false,
    favouriteSearchListItemUpdateError: null,
    favouriteSearchListItemDeleting: false,
    favouriteSearchListItemDeleteError: null,
    existingAliasCheckError: false,
};

const handlers = {
    [actions.FAVOURITE_SEARCH_LIST_LOADING]: state => ({
        ...state,
        favouriteSearchListLoading: true,
    }),

    [actions.FAVOURITE_SEARCH_LIST_LOADED]: (state, action) => ({
        ...state,
        favouriteSearchListLoading: false,
        favouriteSearchList: action.payload,
    }),

    [actions.FAVOURITE_SEARCH_LIST_FAILED]: (state, action) => ({
        ...state,
        favouriteSearchListLoading: false,
        favouriteSearchList: null,
        favouriteSearchListError: action.payload,
    }),

    [actions.FAVOURITE_SEARCH_ITEM_UPDATING]: state => ({
        ...state,
        favouriteSearchListItemUpdating: true,
    }),

    [actions.FAVOURITE_SEARCH_ITEM_UPDATE_SUCCESS]: (state, action) => {
        const index = state.favouriteSearchList.indexOf(action.oldData);
        return {
            ...state,
            favouriteSearchListItemUpdating: false,
            favouriteSearchList: [
                ...state.favouriteSearchList.slice(0, index),
                action.payload,
                ...state.favouriteSearchList.slice(index + 1),
            ],
        };
    },

    [actions.FAVOURITE_SEARCH_ITEM_UPDATE_FAILED]: (state, action) => ({
        ...state,
        favouriteSearchListItemUpdating: false,
        favouriteSearchListItemUpdateError: action.payload,
    }),

    [actions.FAVOURITE_SEARCH_ITEM_DELETING]: state => ({
        ...state,
        favouriteSearchListItemDeleting: true,
    }),

    [actions.FAVOURITE_SEARCH_ITEM_DELETE_SUCCESS]: (state, action) => {
        const index = state.favouriteSearchList.indexOf(action.payload);
        return {
            ...state,
            favouriteSearchListItemDeleting: false,
            favouriteSearchList: [
                ...state.favouriteSearchList.slice(0, index),
                ...state.favouriteSearchList.slice(index + 1),
            ],
        };
    },

    [actions.FAVOURITE_SEARCH_ITEM_DELETE_FAILED]: (state, action) => ({
        ...state,
        favouriteSearchListItemDeleting: false,
        favouriteSearchListItemDeleteError: action.payload,
    }),

    [actions.EXISTING_ALIAS_FOUND]: (state, action) => ({
        ...state,
        existingAliasCheckError: {
            ...locale.pages.favouriteSearch.aliasExistsAlert,
            message: locale.pages.favouriteSearch.aliasExistsAlert.message.replace('[alias]', action.payload),
        },
    }),

    [actions.EXISTING_ALIAS_NOT_FOUND]: state => ({
        ...state,
        existingAliasCheckError: null,
    }),
};

export default function exportPublicationsReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
