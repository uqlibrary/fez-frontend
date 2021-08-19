import * as actions from 'actions/actionTypes';

export const initialState = {
    exportPublicationsLoading: false,
    loadingByPage: {},
    loadedByPage: {},
};

const exportConfigFromAction = action =>
    (action.payload && action.payload.page && `${action.payload.format}-page-${action.payload.page}`) || false;

const handlers = {
    [actions.EXPORT_PUBLICATIONS_LOADING]: (state, action) => {
        const exportConfig = exportConfigFromAction(action);
        return {
            ...state,
            exportPublicationsLoading: true,
            loadingByPage: {
                ...state.loadingByPage,
                ...(exportConfig ? { [exportConfig]: true } : {}),
            },
        };
    },

    [actions.EXPORT_PUBLICATIONS_LOADED]: (state, action) => {
        const exportConfig = exportConfigFromAction(action);
        const loadingByPage = { ...state.loadingByPage };
        if (exportConfig) {
            delete loadingByPage[exportConfig];
        }
        return {
            ...state,
            exportPublicationsLoading: false,
            loadingByPage,
            loadedByPage: {
                ...state.loadedByPage,
                ...(exportConfig ? { [exportConfig]: true } : {}),
            },
        };
    },

    [actions.EXPORT_PUBLICATIONS_FAILED]: (state, action) => {
        const exportConfig = exportConfigFromAction(action);
        return {
            ...state,
            exportPublicationsLoading: false,
            loadingByPage: {
                ...state.loadingByPage,
                ...(exportConfig ? { [exportConfig]: false } : {}),
            },
        };
    },

    [actions.EXPORT_PUBLICATIONS_RESET]: () => initialState,
};

export default function exportPublicationsReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
