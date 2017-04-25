import Immutable from 'immutable';

import {PUBLICATION_SUB_TYPES_LOADED, AUTHORS_LOADED} from './actions';

// Immutable state
export const initialState = Immutable.fromJS({
    listOfAuthors: {},
    publicationSubTypes: {}
});

const publicationSubTypeReducer = (state = initialState, action) => {
    switch (action.type) {
        case PUBLICATION_SUB_TYPES_LOADED:
            return state.set('publicationSubTypes', Immutable.fromJS(action.payload));
        case AUTHORS_LOADED:
            return state.set('listOfAuthors', Immutable.fromJS(action.payload));
        default:
            return state;
    }
};

export default publicationSubTypeReducer;
