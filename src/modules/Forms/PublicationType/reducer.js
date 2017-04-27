import Immutable from 'immutable';

import {PUBLICATION_TYPES_LOADED, SELECTED_PUBLICATION_TYPE} from './actions';

// Immutable state
export const initialState = Immutable.fromJS({
    publicationTypes: {},
    selectedPublicationType: {}
});

const publicationTypeReducer = (state = initialState, action) => {
    switch (action.type) {
        case PUBLICATION_TYPES_LOADED:
            return state.set('publicationTypes', Immutable.fromJS(action.payload));
        case SELECTED_PUBLICATION_TYPE:
            const selectedArticleType = state.get('publicationTypes').find(item => {
                return item.get('id') === action.payload;
            });

            return state.set('selectedPublicationType', selectedArticleType);
        default:
            return state;
    }
};

export default publicationTypeReducer;
