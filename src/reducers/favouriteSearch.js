import * as actions from 'actions/actionTypes';

export const initialState = {
    favouriteSearchListLoading: true,
    favouriteSearchList: null,
    favouriteSearchListError: null,
};

const handlers = {
    [actions.FAVOURITE_SEARCH_LIST_LOADING]: state => {
        return {
            ...state,
            favouriteSearchListLoading: true,
        };
    },

    [actions.FAVOURITE_SEARCH_LIST_LOADED]: (state, action) => {
        return {
            ...state,
            favouriteSearchListLoading: false,
            favouriteSearchList: action.payload,
        };
    },

    [actions.FAVOURITE_SEARCH_LIST_FAILED]: (state, action) => {
        return {
            ...state,
            favouriteSearchListLoading: false,
            favouriteSearchList: null,
            favouriteSearchListError: action.payload,
        };
    },
};

export default function exportPublicationsReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
