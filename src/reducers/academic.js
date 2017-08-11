import * as actions from 'actions/academic';

export const initialState = {
    loadingPublicationsByYear: true,
    publicationsByYear: null,
    publicationTypesCount: null
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
    })
};

export default function academicStatsReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
