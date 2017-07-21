import Immutable from 'immutable';
import {
    SEARCH_LOADING,
    SEARCH_COMPLETED,
    SEARCH_FAILED
} from 'actions';

export const initialState = Immutable.fromJS({
    publicationsList: [],
    loadingSearch: false,
    loadingSearchSources: 0
});

const handlers = {

    [SEARCH_LOADING]: (state) => {
        return state
            .set('loadingSearch', true)
            .set('publicationsList', [])
            .set('loadingSearchSources', 0);
    },

    [SEARCH_COMPLETED]: (state, action) => {
        console.log(action.payload);
        return state
            .set('loadingSearch', false)
            .set('publicationsList', action.payload);
    },

    [SEARCH_FAILED]: (state) => {
        return state
            .set('loadingSearch', false)
            .set('publicationsList', [])
            .set('loadingSearchSources', 0);
    },

    [`${SEARCH_COMPLETED}@`]: (state, action) => {
        console.log(action.payload);
        return state
            .set('publicationsList', [...state.get('publicationsList'), ...action.payload])
            .set('loadingSearchSources', state.get('loadingSearchSources') + 1);
    }
};


export default function addRecordReducer(state = initialState, action) {
    if (action.type.indexOf('SEARCH_COMPLETED@') >= 0) console.log(action.type.substring(0, action.type.indexOf('@') + 1));
    const handler = action.type.indexOf('SEARCH_COMPLETED@') < 0 ?
        handlers[action.type] : handlers[action.type.substring(0, action.type.indexOf('@') + 1)];

    if (!handler) {
        return state;
    }
    return handler(state, action);
}
