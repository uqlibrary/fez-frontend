import * as actions from 'actions/actionTypes';

export const initialState = {
    exportingCollectionsPid: null,
    exportCollectionsLoading: false,
    loadingByPage: {},
    loadedByPage: {},
};

const exportConfigFromAction = action =>
    (action.payload && action.payload.page && `${action.payload.format}-page-${action.payload.page}`) || false;

const handlers = {
    [actions.EXPORT_COLLECTIONS_LOADING]: (state, action) => {
        const exportConfig = exportConfigFromAction(action);
        return {
            ...state,
            exportingCollectionsPid: action.payload.pid,
            exportCollectionsLoading: true,
            loadingByPage: {
                ...state.loadingByPage,
                ...(exportConfig ? { [exportConfig]: true } : {}),
            },
        };
    },

    [actions.EXPORT_COLLECTIONS_LOADED]: (state, action) => {
        const exportConfig = exportConfigFromAction(action);
        const loadingByPage = { ...state.loadingByPage };
        if (exportConfig) {
            delete loadingByPage[exportConfig];
        }
        return {
            ...state,
            exportingCollectionsPid: null,
            exportCollectionsLoading: false,
            loadingByPage,
            loadedByPage: {
                ...state.loadedByPage,
                ...(exportConfig ? { [exportConfig]: true } : {}),
            },
        };
    },

    [actions.EXPORT_COLLECTIONS_FAILED]: (state, action) => {
        const exportConfig = exportConfigFromAction(action);
        return {
            ...state,
            exportingCollectionsPid: null,
            exportCollectionsLoading: false,
            loadingByPage: {
                ...state.loadingByPage,
                ...(exportConfig ? { [exportConfig]: false } : {}),
            },
        };
    },

    [actions.EXPORT_COLLECTIONS_RESET]: () => initialState,
};

export default function exportCollectionsReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
