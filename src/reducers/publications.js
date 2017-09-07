import * as actions from 'actions/publications';

export const initialState = {
    publicationsList: [],
    publicationsListPagingData: {},
    loadingPublicationsList: true,

    latestPublicationsList: [],
    loadingLatestPublications: true,
    totalPublicationsCount: null,

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
            loadingLatestPublications: false,
            publicationsList: action.payload.data,
            publicationsListPagingData: {
                total: action.payload.total,
                current_page: action.payload.current_page,
                from: action.payload.from,
                to: action.payload.to,
                per_page: action.payload.per_page
            },
            loadingPublicationsList: false
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

    [actions.AUTHOR_PUBLICATIONS_LOADING]: (state) => {
        return {
            ...state,
            publicationsList: [],
            publicationsListPagingData: {},
            loadingPublicationsList: true
        };
    },

    [actions.AUTHOR_PUBLICATIONS_COMPLETED]: (state, action) => {
        return {
            ...state,
            publicationsList: action.payload.data,
            publicationsListPagingData: {
                total: action.payload.total,
                current_page: action.payload.current_page,
                from: action.payload.from,
                to: action.payload.to,
                per_page: action.payload.per_page
            },
            loadingPublicationsList: false
        };
    },

    [actions.AUTHOR_PUBLICATIONS_FAILED]: (state) => {
        return {
            ...state,
            publicationsList: [],
            publicationsListPagingData: {},
            loadingPublicationsList: false
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
