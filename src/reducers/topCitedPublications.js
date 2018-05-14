import * as actions from 'actions/actionTypes';

export const initialState = {
    topCitedPublicationsList: [],
    loadingTopCitedPublications: false
};

const handlers = {
    [actions.TOP_CITED_PUBLICATIONS_LOADING]: (state) => {
        return {
            ...state,
            topCitedPublicationsList: [],
            loadingTopCitedPublications: true
        };
    },

    [actions.TOP_CITED_PUBLICATIONS_LOADED]: (state, action) => {
        return {
            ...state,
            topCitedPublicationsList: action.payload.data,
            loadingTopCitedPublications: false
        };
    },

    [actions.TOP_CITED_PUBLICATIONS_FAILED]: (state) => {
        return {
            ...state,
            topCitedPublicationsList: [],
            loadingTopCitedPublications: false
        };
    }
};

export default function topCitedPublicationsReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
