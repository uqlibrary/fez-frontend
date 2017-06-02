import Immutable from 'immutable';

import {ADD_AUTHOR, REMOVE_AUTHOR, CLEAR_AUTHORS} from './actions';

// Immutable state
const initialState = Immutable.fromJS({
    selectedAuthors: {}
});

const authorsReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_AUTHOR:
            let updatedAuthorsList = Immutable.Set(state.get('selectedAuthors'));
            const foundAuthor = action.payload;

            if (!updatedAuthorsList.has(foundAuthor.get('id'))) {
                updatedAuthorsList = updatedAuthorsList.union([Immutable.Map(foundAuthor)]);
            }

            return state.set('selectedAuthors', Immutable.fromJS(updatedAuthorsList));
        case REMOVE_AUTHOR:
            const removeFromAuthorList = state.get('selectedAuthors').filter(author => {
                return author.get('id') !== action.payload;
            });
            return state.set('selectedAuthors', Immutable.fromJS(removeFromAuthorList));
        case CLEAR_AUTHORS:
            return state.set('selectedAuthors', Immutable.fromJS(action.payload));
        default:
            return state;
    }
};

export default authorsReducer;
