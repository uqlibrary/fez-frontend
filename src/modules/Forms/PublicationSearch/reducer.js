import Immutable from 'immutable';

import {DOI_SEARCH_COMPLETED, PUBMED_SEARCH_COMPLETED, TITLE_SEARCH_COMPLETED} from './actions';
import {TITLE_SEARCH_LOADING, PUBMED_SEARCH_LOADING, DOI_SEARCH_LOADING} from './actions';

// Immutable state
export const initialState = Immutable.fromJS({
    searchResultsList: {},
    loadingSearch: false
});

const publicationSearchReducer = (state = initialState, action) => {
    switch (action.type) {
        case DOI_SEARCH_LOADING:
        case PUBMED_SEARCH_LOADING:
        case TITLE_SEARCH_LOADING:
            return state.set('loadingSearch', true);
        case DOI_SEARCH_COMPLETED:
        case PUBMED_SEARCH_COMPLETED:
        case TITLE_SEARCH_COMPLETED:
            return state.set('searchResultsList', Immutable.fromJS(action.payload)).set('loadingSearch', false);
        default:
            return state;
    }
};

export default publicationSearchReducer;
