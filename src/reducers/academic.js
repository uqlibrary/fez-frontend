import * as actions from 'actions/academic';

export const initialState = {
    loadingPublicationsPerYear: true,
    publicationsPerYear: null
};

const handlers = {
    [actions.ACADEMIC_PUBLICATIONS_BY_YEAR_LOADING]: () => ({
        ...initialState
    }),

    [actions.ACADEMIC_PUBLICATIONS_BY_YEAR_LOADED]: (state, action) => ({
        ...state,
        loadingPublicationsPerYear: false,
        publicationsPerYear: action.payload
    }),

    [actions.ACADEMIC_PUBLICATIONS_BY_YEAR_FAILED]: (state) => ({
        ...state,
        loadingPublicationsPerYear: false,
        publicationsPerYear: null
    })
};

export default function academicStatsReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    console.log(action);
    return handler(state, action);
}
