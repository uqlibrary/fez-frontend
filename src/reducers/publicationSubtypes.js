import {PUBLICATION_SUBTYPES_LOADING, PUBLICATION_SUBTYPES_LOAD_FAILED, PUBLICATION_SUBTYPES_LOADED} from '../actions';

export const initialState = {
    subtypesLoading: false,
    subtypesLoadingError: false,
    subtypes: []
};

const handlers = {
    [PUBLICATION_SUBTYPES_LOAD_FAILED]: () => ({
        subtypes: [],
        subtypesLoading: false,
        subtypesLoadingError: true
    }),

    [PUBLICATION_SUBTYPES_LOADED]: (state, action) => ({
        subtypes: action.payload,
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
    console.log(action);
    return handler(state, action);
}
