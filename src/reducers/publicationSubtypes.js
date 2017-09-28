import * as actions from 'actions/actionTypes';

export const initialState = {
    subtypesLoading: false,
    subtypesLoadingError: false,
    subtypesList: []
};

const handlers = {
    [actions.PUBLICATION_SUBTYPES_LOAD_FAILED]: () => ({
        subtypesList: [],
        subtypesLoading: false,
        subtypesLoadingError: true
    }),

    [actions.PUBLICATION_SUBTYPES_LOADED]: (state, action) => ({
        subtypesList: action.payload,
        subtypesLoading: false,
        subtypesLoadingError: false
    }),

    [actions.PUBLICATION_SUBTYPES_LOADING]: () => ({
        subtypesLoading: true,
        subtypesLoadingError: false
    })
};

export default function publicationSubtypesReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
