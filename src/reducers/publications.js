import * as actions from 'actions/actionTypes';

export const initialState = {
    publicationsList: [],
    publicationsListPagingData: {},
    publicationsListFacets: {},
    loadingPublicationsList: true,
};

const handlers = {

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
            publicationsListType: action.payload.type || null,
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
    // My Incomplete Records
    [actions.AUTHOR_INCOMPLETEPUBLICATIONS_LOADING]: (state) => {
        return {
            ...state,
            publicationsListPagingData: {},
            loadingPublicationsList: true
        };
    },

    [actions.AUTHOR_INCOMPLETEPUBLICATIONS_LOADED]: (state, action) => {
        return {
            ...state,
            publicationsList: action.payload.data,
            publicationsListType: action.payload.type || null,
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

    [actions.AUTHOR_INCOMPLETEPUBLICATIONS_FAILED]: (state) => {
        return {
            ...state,
            publicationsList: [],

            publicationsListPagingData: {},
            publicationsListFacets: {},
            loadingPublicationsList: false
        };
    },
};

export default function publicationsReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
