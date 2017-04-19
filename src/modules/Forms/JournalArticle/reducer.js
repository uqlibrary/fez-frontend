import Immutable from 'immutable';

import {PUBLICATION_SUB_TYPES_LOADED} from './actions';

// Immutable state
const initialState = Immutable.fromJS({
    publicationSubTypes: {}
});

const publicationSubTypeReducer = (state = initialState, action) => {
    switch (action.type) {
        case PUBLICATION_SUB_TYPES_LOADED:
            return state.set('publicationSubTypes', Immutable.fromJS(action.payload));
        default:
            return state;
    }
};

export default publicationSubTypeReducer;
