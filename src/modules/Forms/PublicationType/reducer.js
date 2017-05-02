import Immutable from 'immutable';

import {PUBLICATION_TYPES_LOADED, PUBLICATION_TYPE_SELECTED} from './actions';

// Immutable state
export const initialState = Immutable.fromJS({
    publicationTypeList: {},
    selectedPublicationType: {}
});

const publicationTypeReducer = (state = initialState, action) => {
    switch (action.type) {
        case PUBLICATION_TYPES_LOADED:
            return state.set('publicationTypeList', Immutable.fromJS(action.payload));
        case PUBLICATION_TYPE_SELECTED:
            const selectedArticleType = state.get('publicationTypeList').find(item => {
                return item.get('id') === action.payload;
            });

            return state.set('selectedPublicationType', selectedArticleType);
        default:
            return state;
    }
};

export default publicationTypeReducer;
