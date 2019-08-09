import * as actions from 'actions/actionTypes';

export const initialState = {
    newsFeedList: [],
    loadingNewsFeedList: true,
};

const handlers = {
    [actions.NEWS_LOADING]: state => {
        return {
            ...state,
            ...initialState,
        };
    },

    [actions.NEWS_LOADED]: (state, action) => {
        return {
            ...state,
            newsFeedList: action.payload,
            loadingNewsFeedList: false,
        };
    },

    [actions.NEWS_LOAD_FAILED]: state => {
        return {
            ...state,
            newsFeedList: [],
            loadingNewsFeedList: false,
        };
    },
};

export default function newsFeedReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
