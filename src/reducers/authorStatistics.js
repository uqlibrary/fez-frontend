import * as actions from 'actions/actionTypes';

export const initialState = {
    loadingAuthorStats: false,
    authorStatsByYear: null,
    authorStatsPerType: null,
    authorStats: null,
};

const handlers = {
    [actions.AUTHOR_STATS_LOADING]: () => ({ ...initialState, loadingAuthorStats: true }),
    [actions.AUTHOR_STATS_BY_YEAR_LOADED]: (state, action) => ({
        ...state,
        authorStatsByYear: action.payload,
    }),
    [actions.AUTHOR_STATS_PER_TYPE_LOADED]: (state, action) => ({
        ...state,
        authorStatsPerType: action.payload,
    }),
    [actions.AUTHOR_STATS_LOADED]: (state, action) => ({
        ...state,
        loadingAuthorStats: false,
        authorStats: action.payload,
    }),
    [actions.AUTHOR_STATS_FAILED]: () => ({
        ...initialState,
    }),
};

export default function authorStatisticsReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) return state;
    return handler(state, action);
}
