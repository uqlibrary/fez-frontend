import * as actions from 'actions/actionTypes';

export const initialState = {
    topCitedPublicationsList: [],
    loadingTopCitedPublications: false
};

const handlers = {
    [actions.TOP_ALTMETRIC_CITED_PUBLICATIONS_LOADING]: (state) => {
        state.loadingTopCitedPublications = true;
        return {
            ...state
        };
    },

    [actions.TOP_ALTMETRIC_CITED_PUBLICATIONS_LOADED]: (state, action) => {
        state.topCitedPublicationsList = action.payload.data;
        state.loadingTopCitedPublications = false;
        return {
            ...state
        };
    },

    [actions.TOP_ALTMETRIC_CITED_PUBLICATIONS_FAILED]: (state) => {
        state.loadingTopCitedPublications = true;
        return {
            ...state
        };
    }
};

export default function topAltmetricCitedPublicationsReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
