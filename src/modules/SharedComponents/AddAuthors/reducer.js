import Immutable from 'immutable';

import {
    AUTHORS_LIST_UPDATED,
    AUTHORS_LIST_RESET,
    AUTHORS_SEARCH_COMPLETED,
    AUTHORS_SEARCH_RESULTS_RESET,
    IDENTIFIERS_SEARCH_COMPLETED,
    IDENTIFIERS_SEARCH_RESULTS_RESET
} from './actions';

// Immutable state
export const initialState = Immutable.fromJS({
    authorsList: [],
    authorsSearchResults: [],
    identifiersSearchResults: []
});

const authorsReducer = (state = initialState, action) => {
    switch (action.type) {
        case AUTHORS_LIST_UPDATED:
            return state.set('authorsList', Immutable.fromJS(action.payload));
        case AUTHORS_LIST_RESET:
            return state.set('authorsList', initialState.get('authorsList'));
        case AUTHORS_SEARCH_RESULTS_RESET:
            return state.set('authorsSearchResults', initialState.get('authorsSearchResults'));
        case AUTHORS_SEARCH_COMPLETED:
            return state.set('authorsSearchResults', Immutable.fromJS(action.payload));
        case IDENTIFIERS_SEARCH_COMPLETED:
            return state.set('identifiersSearchResults', Immutable.fromJS(action.payload));
        case IDENTIFIERS_SEARCH_RESULTS_RESET:
            return state.set('identifiersSearchResults', initialState.get('identifiersSearchResults'));
        default:
            return state;
    }
};

export default authorsReducer;
