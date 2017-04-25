import Immutable from 'immutable';

import { DOI_SEARCH_COMPLETE, PUBMED_SEARCH_COMPLETE, TITLE_SEARCH_COMPLETE } from './actions';

// Immutable state
export const initialState = Immutable.fromJS({
    searchResults: {}
});

const publicationSearchReducer = (state = initialState, action) => {
    switch (action.type) {
        case DOI_SEARCH_COMPLETE:
        case PUBMED_SEARCH_COMPLETE:
        case TITLE_SEARCH_COMPLETE:
            return state.set('searchResults', Immutable.fromJS(action.payload));
        default:
            return state;
    }
};

export default publicationSearchReducer;
