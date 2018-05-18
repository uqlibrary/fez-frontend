import * as actions from 'actions/actionTypes';

export const initialState = {
    topCitedPublicationsList: {
        scopus: [],
        thomson: []
    },
    loadingTopCitedPublications: {
        scopus: false,
        thomson: false
    }
};

const handlers = {
    [`${actions.TOP_CITED_PUBLICATIONS_LOADING}@`]: (state, action) => {
        state.topCitedPublicationsList[action.source] = [];
        state.loadingTopCitedPublications[action.source] = true;
        return {
            ...state
        };
    },

    [`${actions.TOP_CITED_PUBLICATIONS_LOADED}@`]: (state, action) => {
        state.topCitedPublicationsList[action.source] = action.payload.data;
        state.loadingTopCitedPublications[action.source] = false;
        return {
            ...state
        };
    },

    [`${actions.TOP_CITED_PUBLICATIONS_FAILED}@`]: (state, action) => {
        state.loadingTopCitedPublications[action.source] = false;
        return {
            ...state
        };
    }
};

export default function topCitedPublicationsReducer(state = initialState, action) {
    const handler = handlers[actions.getAction(action.type)];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
