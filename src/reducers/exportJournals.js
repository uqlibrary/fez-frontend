import { EXPORT_JOURNALS_LOADING, EXPORT_JOURNALS_LOADED, EXPORT_JOURNALS_FAILED } from 'actions/actionTypes';

export const initialState = {
    exportJournalsLoading: false,
    payload: {},
};

const handlers = {
    [EXPORT_JOURNALS_LOADING]: (state, action) => {
        return {
            exportJournalsLoading: true,
            payload: action.payload,
        };
    },

    [EXPORT_JOURNALS_LOADED]: (state, action) => {
        return {
            exportJournalsLoading: false,
            payload: action.payload,
        };
    },

    [EXPORT_JOURNALS_FAILED]: (state, action) => {
        return {
            exportJournalsLoading: false,
            payload: action.payload,
        };
    },
};

export default function exportJournalsReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
