import * as actions from 'actions/actionTypes';

export const initialState = {
    loadingPublicationsByYear: true,
    publicationsByYear: null,
    publicationTypesCount: null,
    loadingPublicationsStats: true,
    publicationsStats: null,
    publicationTotalCount: null,
};

const handlers = {
    [actions.AUTHOR_PUBLICATIONS_STATS_LOADING]: () => ({
        ...initialState,
    }),

    [actions.AUTHOR_PUBLICATIONS_BY_YEAR_LOADED]: (state, action) => ({
        ...state,
        loadingPublicationsByYear: false,
        publicationsByYear: action.payload,
    }),

    [actions.AUTHOR_PUBLICATIONS_COUNT_PER_TYPE_LOADED]: (state, action) => ({
        ...state,
        publicationTypesCount: action.payload,
    }),

    [actions.AUTHOR_PUBLICATIONS_COUNT_TOTAL_LOADED]: (state, action) => ({
        ...state,
        publicationTotalCount: action.payload,
    }),

    [actions.AUTHOR_PUBLICATIONS_STATS_FAILED]: () => ({
        ...initialState,
        loadingPublicationsByYear: false,
        loadingPublicationsStats: false,
    }),

    [actions.AUTHOR_PUBLICATIONS_STATS_LOADED]: (state, action) => ({
        ...state,
        loadingPublicationsStats: false,
        publicationsStats: action.payload,
    }),
};

export default function academicStatsReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
