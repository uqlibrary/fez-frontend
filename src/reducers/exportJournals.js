import * as actions from 'actions/actionTypes';

export const initialState = {
    exportJournalsLoading: false,
    loadingByPage: {},
    loadedByPage: {},
};

const exportConfigFromAction = action =>
    (action.payload && action.payload.page && `${action.payload.format}-page-${action.payload.page}`) || false;

const handlers = {
    [actions.EXPORT_JOURNALS_LOADING]: (state, action) => {
        const exportConfig = exportConfigFromAction(action);
        return {
            ...state,
            exportJournalsLoading: true,
            loadingByPage: {
                ...state.loadingByPage,
                ...(exportConfig ? { [exportConfig]: true } : {}),
            },
        };
    },

    [actions.EXPORT_JOURNALS_LOADED]: (state, action) => {
        const exportConfig = exportConfigFromAction(action);
        const loadingByPage = { ...state.loadingByPage };
        if (exportConfig) {
            delete loadingByPage[exportConfig];
        }
        return {
            ...state,
            exportJournalsLoading: false,
            loadingByPage,
            loadedByPage: {
                ...state.loadedByPage,
                ...(exportConfig ? { [exportConfig]: true } : {}),
            },
        };
    },

    [actions.EXPORT_JOURNALS_FAILED]: (state, action) => {
        const exportConfig = exportConfigFromAction(action);
        return {
            ...state,
            exportJournalsLoading: false,
            loadingByPage: {
                ...state.loadingByPage,
                ...(exportConfig ? { [exportConfig]: false } : {}),
            },
        };
    },

    [actions.EXPORT_JOURNALS_RESET]: () => initialState,
};

export default function exportJournalsReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
