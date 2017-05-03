import Immutable from 'immutable';

import {DOI_SEARCH_COMPLETED, PUBMED_SEARCH_COMPLETED, TITLE_SEARCH_COMPLETED} from './actions';

// Immutable state
export const initialState = Immutable.fromJS({
    searchResultsList: {}
});

const publicationSearchReducer = (state = initialState, action) => {
    switch (action.type) {
        case DOI_SEARCH_COMPLETED:
        case PUBMED_SEARCH_COMPLETED:
        case TITLE_SEARCH_COMPLETED:
            return state.set('searchResultsList', Immutable.fromJS(action.payload));
        default:
            return state;
    }
};

export default publicationSearchReducer;
