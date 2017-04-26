import Immutable from 'immutable';

import {PUBLICATION_TYPES_LOADED} from './actions';

// Immutable state
export const initialState = Immutable.fromJS({
    publicationTypes: {}
});

const publicationTypeReducer = (state = initialState, action) => {
    switch (action.type) {
        case PUBLICATION_TYPES_LOADED:
            return state.set('publicationTypes', Immutable.fromJS(action.payload));
        default:
            return state;
    }
};

export default publicationTypeReducer;
