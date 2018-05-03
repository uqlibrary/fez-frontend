import * as actions from 'actions/actionTypes';

export const initialState = {
    trendingPublicationsList: [],
    loadingTrendingPublications: false,
    showTrendingPublicationsTab: true
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
            loadingTrendingPublications: false,
            showTrendingPublicationsTab: action.payload.length > 0
        };
    },

    [actions.TRENDING_PUBLICATIONS_FAILED]: (state) => {
        return {
            ...state,
            trendingPublicationsList: [],
            loadingTrendingPublications: false,
            showTrendingPublicationsTab: false
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
