import * as actions from 'actions/actionTypes';
import {transformTrendingPublicationsMetricsData} from '../actions/academicDataTransformers';

export const initialState = {
    publicationsList: [],
    publicationsListPagingData: {},
    publicationsListFacets: {},
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

    [actions.LATEST_PUBLICATIONS_LOADED]: (state, action) => {
        return {
            ...state,
            latestPublicationsList: action.payload.data,
            totalPublicationsCount: action.payload.total,
            loadingLatestPublications: false,
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
            publicationsListPagingData: {},
            loadingPublicationsList: true
        };
    },

    [actions.AUTHOR_PUBLICATIONS_LOADED]: (state, action) => {
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
            publicationsListFacets: action.payload.hasOwnProperty('filters') && action.payload.filters.hasOwnProperty('facets')
                && action.payload.filters.facets ? action.payload.filters.facets : {},
            loadingPublicationsList: false
        };
    },

    [actions.AUTHOR_PUBLICATIONS_FAILED]: (state) => {
        return {
            ...state,
            publicationsList: [],
            publicationsListPagingData: {},
            publicationsListFacets: {},
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

    [actions.TRENDING_PUBLICATIONS_LOADED]: (state, action) => {
        return {
            ...state,
            trendingPublicationsList: transformTrendingPublicationsMetricsData(action.payload),
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
