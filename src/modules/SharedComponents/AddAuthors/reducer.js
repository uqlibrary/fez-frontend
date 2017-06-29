import Immutable from 'immutable';

import {AUTHORS_LIST_UPDATED} from './actions';

// Immutable state
export const initialState = Immutable.fromJS({
    authorsList: []
});

const authorsReducer = (state = initialState, action) => {
    switch (action.type) {
        case AUTHORS_LIST_UPDATED:
            return state.set('authorsList', Immutable.fromJS(action.payload));
        default:
            return state;
    }
};

export default authorsReducer;
