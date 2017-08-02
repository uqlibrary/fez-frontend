import {PUBLICATION_SUBTYPES_LOADING, PUBLICATION_SUBTYPES_LOAD_FAILED, PUBLICATION_SUBTYPES_LOADED} from '../actions';

export const initialState = {
    subtypesLoading: false,
    subtypesLoadingError: false,
    subtypesList: []
};

const handlers = {
    [PUBLICATION_SUBTYPES_LOAD_FAILED]: () => ({
        subtypesList: [],
        subtypesLoading: false,
        subtypesLoadingError: true
    }),

    [PUBLICATION_SUBTYPES_LOADED]: (state, action) => ({
        subtypesList: action.payload,
        subtypesLoading: false,
        subtypesLoadingError: false
    }),

    [PUBLICATION_SUBTYPES_LOADING]: () => ({
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
