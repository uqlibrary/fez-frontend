import * as actions from 'actions/actionTypes';

export const initialState = {
    latestPublicationsList: [],
    loadingLatestPublications: false,
    totalPublicationsCount: null,
    showLatestPublicationsTab: true
};

const handlers = {
    [actions.LATEST_PUBLICATIONS_LOADING]: (state) => {
        return {
            ...state,
            latestPublicationsList: [],
            totalPublicationsCount: null,
            loadingLatestPublications: true
        };
    },

    [actions.LATEST_PUBLICATIONS_LOADED]: (state, action) => {
        return {
            ...state,
            latestPublicationsList: action.payload.data,
            totalPublicationsCount: action.payload.total,
            loadingLatestPublications: false,
            showLatestPublicationsTab: action.payload.total > 0
        };
    },

    [actions.LATEST_PUBLICATIONS_FAILED]: (state) => {
        return {
            ...state,
            latestPublicationsList: [],
            totalPublicationsCount: null,
            loadingLatestPublications: false,
            showLatestPublicationsTab: false
        };
    }
};

export default function myLatestPublicationsReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
