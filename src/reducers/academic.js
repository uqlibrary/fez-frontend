import * as actions from 'actions/actionTypes';

export const initialState = {
    loadingPublicationsByYear: true,
    publicationsByYear: null,
    publicationTypesCount: null,
    loadingPublicationsStats: true,
    publicationsStats: null
};

const handlers = {
    [actions.ACADEMIC_PUBLICATIONS_BY_YEAR_LOADING]: () => ({
        ...initialState
    }),

    [actions.ACADEMIC_PUBLICATIONS_BY_YEAR_LOADED]: (state, action) => ({
        ...state,
        loadingPublicationsByYear: false,
        publicationsByYear: action.payload
    }),

    [actions.ACADEMIC_PUBLICATIONS_COUNT_LOADED]: (state, action) => ({
        ...state,
        publicationTypesCount: action.payload
    }),

    [actions.ACADEMIC_PUBLICATIONS_BY_YEAR_FAILED]: (state) => ({
        ...state,
        loadingPublicationsByYear: false,
        publicationsByYear: null
    }),

    [actions.ACADEMIC_PUBLICATIONS_STATS_LOADING]: (state) => ({
        ...state,
        loadingPublicationsStats: true,
        publicationsStats: null
    }),

    [actions.ACADEMIC_PUBLICATIONS_STATS_LOADED]: (state, action) => ({
        ...state,
        loadingPublicationsStats: false,
        publicationsStats: action.payload
    }),

    [actions.ACADEMIC_PUBLICATIONS_STATS_FAILED]: (state) => ({
        ...state,
        loadingPublicationsStats: false,
        publicationsStats: null
    })
};

export default function academicStatsReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
