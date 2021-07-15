import * as actions from 'actions/actionTypes';

export const initialState = {
    journalsListLoading: false,
    journalsList: null,
    journalsListLoaded: false,
    journalsListError: false,
};

const handlers = {
    [actions.SEARCH_JOURNALS_LOADING]: state => ({
        ...state,
        journalsListLoading: true,
    }),
    [actions.SEARCH_JOURNALS_LOADED]: (state, action) => ({
        ...state,
        journalsListLoading: false,
        journalsListLoaded: true,
        journalsList: action.payload,
    }),
    [actions.SEARCH_JOURNALS_FAILED]: (state, action) => ({
        ...state,
        journalsListLoading: false,
        journalsListLoaded: true,
        journalsListError: action.payload,
        journalsList: null,
    }),
};

export default function searchjournalsReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
