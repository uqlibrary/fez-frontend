import Immutable from 'immutable';

import {PUBLICATION_SELECTED} from './actions';

// Immutable state
export const initialState = Immutable.fromJS({
    selectedPublication: {}
});

const publicationSubTypeReducer = (state = initialState, action) => {
    switch (action.type) {
        case PUBLICATION_SELECTED:
            return state.set('selectedPublication', Immutable.fromJS(action.payload));
        default:
            return state;
    }
};

export default publicationSubTypeReducer;
