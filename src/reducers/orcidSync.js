import * as actions from 'actions/actionTypes';

export const initialState = {
    orcidSyncStatus: {},
    loadingOrcidSyncStatus: false,
    orcidSyncResponse: {},
    requestingOrcidSync: false,
};

const handlers = {
    [actions.ORCID_SYNC_STATUS_LOADING]: state => {
        return {
            ...initialState,
            ...state,
            loadingOrcidSyncStatus: true,
        };
    },

    [actions.ORCID_SYNC_STATUS_LOADED]: (state, action) => {
        return {
            ...state,
            orcidSyncStatus: action.payload,
            loadingOrcidSyncStatus: false,
        };
    },

    [actions.ORCID_SYNC_STATUS_LOAD_FAILED]: state => {
        return {
            ...state,
            orcidSyncStatus: {},
            loadingOrcidSyncStatus: false,
        };
    },

    [actions.ORCID_SYNC_REQUESTING]: state => {
        return {
            ...initialState,
            ...state,
            requestingOrcidSync: true,
        };
    },

    [actions.ORCID_SYNC_SUCCESS]: (state, action) => {
        return {
            ...state,
            orcidSyncResponse: action.payload,
            requestingOrcidSync: false,
        };
    },

    [actions.ORCID_SYNC_FAILED]: state => {
        return {
            ...state,
            orcidSyncResponse: null,
            requestingOrcidSync: false,
        };
    },
};

export default function orcidSyncReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
