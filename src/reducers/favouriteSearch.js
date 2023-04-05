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
    existingAlias: null,
    existingAliasChecking: false,
    existingAliasCheckError: false,
    favouriteSearchAdding: false,
    favouriteSearchAddSuccess: false,
    favouriteSearchAddError: null,
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
        existingAliasCheckError: null,
    }),

    [actions.FAVOURITE_SEARCH_LIST_FAILED]: (state, action) => ({
        ...state,
        favouriteSearchListLoading: false,
        favouriteSearchList: null,
        favouriteSearchListError: action.payload,
        existingAliasCheckError: null,
    }),

    [actions.FAVOURITE_SEARCH_ITEM_UPDATING]: state => ({
        ...state,
        favouriteSearchListItemUpdating: true,
        existingAliasCheckError: null,
    }),

    [actions.FAVOURITE_SEARCH_ITEM_UPDATE_SUCCESS]: (state, action) => {
        console.log('action.oldData', action);
        const index = state.favouriteSearchList.indexOf(action.oldData);
        return {
            ...state,
            existingAliasCheckError: null,
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
        existingAliasCheckError: null,
        favouriteSearchListItemUpdating: false,
        favouriteSearchListItemUpdateError: action.payload,
    }),

    [actions.FAVOURITE_SEARCH_ITEM_DELETING]: state => ({
        ...state,
        existingAliasCheckError: null,
        favouriteSearchListItemDeleting: true,
    }),

    [actions.FAVOURITE_SEARCH_ITEM_DELETE_SUCCESS]: (state, action) => {
        const index = state.favouriteSearchList.indexOf(action.payload);
        return {
            ...state,
            existingAliasCheckError: null,
            favouriteSearchListItemDeleting: false,
            favouriteSearchList: [
                ...state.favouriteSearchList.slice(0, index),
                ...state.favouriteSearchList.slice(index + 1),
            ],
        };
    },

    [actions.FAVOURITE_SEARCH_ITEM_DELETE_FAILED]: (state, action) => ({
        ...state,
        existingAliasCheckError: null,
        favouriteSearchListItemDeleting: false,
        favouriteSearchListItemDeleteError: action.payload,
    }),

    [actions.EXISTING_ALIAS_CHECK_IN_PROGRESS]: state => ({
        ...state,
        existingAliasChecking: true,
    }),

    [actions.EXISTING_ALIAS_FOUND]: (state, action) => ({
        ...state,
        existingAlias: action.payload,
        existingAliasChecking: false,
        existingAliasCheckError: {
            ...locale.pages.favouriteSearch.aliasExistsAlert,
            message: locale.pages.favouriteSearch.aliasExistsAlert.message.replace('[alias]', action.payload.fvs_alias),
        },
    }),

    [actions.EXISTING_ALIAS_NOT_FOUND]: state => ({
        ...state,
        existingAlias: null,
        existingAliasChecking: false,
        existingAliasCheckError: null,
    }),

    [actions.FAVOURITE_SEARCH_ADDING]: state => ({
        ...state,
        favouriteSearchAdding: true,
    }),

    [actions.FAVOURITE_SEARCH_ADD_SUCCESS]: state => ({
        ...state,
        favouriteSearchAdding: false,
        favouriteSearchAddSuccess: true,
    }),

    [actions.FAVOURITE_SEARCH_ADD_FAILED]: (state, action) => ({
        ...state,
        favouriteSearchAdding: false,
        favouriteSearchAddSuccess: false,
        favouriteSearchAddError: action.payload,
    }),
};

export default function favouriteSearchReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
