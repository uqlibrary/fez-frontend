import Immutable from 'immutable';

import {PUBLICATION_SELECTED, PUBLICATION_SELECTED_CLEARED, PUBLICATION_RESULTS_CLEARED, USERS_PUBLICATIONS_LOADED} from './actions';
import {DOI_SEARCH_COMPLETED, PUBMED_SEARCH_COMPLETED, TITLE_SEARCH_COMPLETED} from '../PublicationSearch/actions';

// Immutable state
export const initialState = Immutable.fromJS({
    claimPublicationResults: {},
    selectedPublication: {}
});

const claimPublicationsReducer = (state = initialState, action) => {
    switch (action.type) {
        case PUBLICATION_SELECTED:
            const entry = state.get('claimPublicationResults').find(entry => {
                return entry.get('rek_pid') === action.payload;
            });

            return state.set('selectedPublication', Immutable.fromJS(entry));
        case USERS_PUBLICATIONS_LOADED:
        case DOI_SEARCH_COMPLETED:
        case PUBMED_SEARCH_COMPLETED:
        case TITLE_SEARCH_COMPLETED:
        case PUBLICATION_RESULTS_CLEARED:
            return state.set('claimPublicationResults', Immutable.fromJS(action.payload));
        case PUBLICATION_SELECTED_CLEARED:
            return state.set('selectedPublication', Immutable.fromJS(action.payload));
        default:
            return state;
    }
};

export default claimPublicationsReducer;
