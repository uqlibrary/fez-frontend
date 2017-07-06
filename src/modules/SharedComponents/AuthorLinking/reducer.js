import Immutable from 'immutable';

import {
    AUTHOR_SELECTED,
    AUTHOR_SELECTED_RESET
} from './actions';

// Immutable state
export const initialState = Immutable.fromJS({
    selectedAuthor: null
});

const authorsLinkingReducer = (state = initialState, action) => {
    switch (action.type) {
        case AUTHOR_SELECTED:
            return state.set('selectedAuthor', Immutable.fromJS(action.payload));
        case AUTHOR_SELECTED_RESET:
            return state.set('selectedAuthor', null);
        default:
            return state;
    }
};

export default authorsLinkingReducer;
