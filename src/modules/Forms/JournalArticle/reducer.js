import Immutable from 'immutable';

import {AUTHORS_LOADED, PUBLICATION_SUB_TYPES_LOADED} from './actions';

// Immutable state
export const initialState = Immutable.fromJS({
    authorList: {},
    publicationSubTypeList: {}
});

const journalArticleReducer = (state = initialState, action) => {
    switch (action.type) {
        case AUTHORS_LOADED:
            return state.set('authorList', Immutable.fromJS(action.payload));
        case PUBLICATION_SUB_TYPES_LOADED:
            return state.set('publicationSubTypeList', Immutable.fromJS(action.payload));
        default:
            return state;
    }
};

export default journalArticleReducer;
