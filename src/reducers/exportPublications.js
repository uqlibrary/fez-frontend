import * as actions from 'actions/actionTypes';

export const initialState = {
    exportPublicationsLoading: false,
};

const handlers = {
    [actions.EXPORT_PUBLICATIONS_LOADING]: state => {
        return {
            ...state,
            exportPublicationsLoading: true,
        };
    },

    [actions.EXPORT_PUBLICATIONS_LOADED]: state => {
        return {
            ...state,
            exportPublicationsLoading: false,
        };
    },

    [actions.EXPORT_PUBLICATIONS_FAILED]: state => {
        return {
            ...state,
            exportPublicationsLoading: false,
        };
    },
};

export default function exportPublicationsReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
