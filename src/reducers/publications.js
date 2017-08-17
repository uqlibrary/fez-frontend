import * as actions from 'actions/publications';

export const initialState = {
    latestPublicationsList: [],
    totalPublicationsCount: null,
    loadingLatestPublications: true,
    trendingPublicationsList: [],
    loadingTrendingPublications: true
};

const handlers = {

    [actions.LATEST_PUBLICATIONS_LOADING]: (state) => {
        return {
            ...state,
            latestPublicationsList: [],
            totalPublicationsCount: null,
            loadingLatestPublications: true
        };
    },

    [actions.LATEST_PUBLICATIONS_COMPLETED]: (state, action) => {
        return {
            ...state,
            latestPublicationsList: action.payload.data,
            totalPublicationsCount: action.payload.total,
            loadingLatestPublications: false
        };
    },

    [actions.LATEST_PUBLICATIONS_FAILED]: (state) => {
        return {
            ...state,
            latestPublicationsList: [],
            totalPublicationsCount: null,
            loadingLatestPublications: false
        };
    },
    [actions.TRENDING_PUBLICATIONS_LOADING]: (state) => {
        return {
            ...state,
            trendingPublicationsList: [],
            loadingTrendingPublications: true
        };
    },

    [actions.TRENDING_PUBLICATIONS_COMPLETED]: (state, action) => {
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

export default function publicationsReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
