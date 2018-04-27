import * as actions from 'actions/actionTypes';

export const initialState = {
    trendingPublicationsList: [],
    loadingTrendingPublications: true
};

const handlers = {
    [actions.TRENDING_PUBLICATIONS_LOADING]: (state) => {
        return {
            ...state,
            trendingPublicationsList: [],
            loadingTrendingPublications: true
        };
    },

    [actions.TRENDING_PUBLICATIONS_LOADED]: (state, action) => {
        return {
            ...state,
            trendingPublicationsList: action.payload,
            loadingTrendingPublications: false
        };
    },

    [actions.TRENDING_PUBLICATIONS_FAILED]: (state) => {
        return {
            ...state,
            trendingPublicationsList: [],
            loadingTrendingPublications: false
        };
    }
};

export default function myTrendingPublicationsReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
