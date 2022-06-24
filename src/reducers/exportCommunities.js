import * as actions from 'actions/actionTypes';

export const initialState = {
    exportCommunitiesLoading: false,
    loadingByPage: {},
    loadedByPage: {},
};

const exportConfigFromAction = action =>
    (action.payload && action.payload.page && `${action.payload.format}-page-${action.payload.page}`) || false;

const handlers = {
    [actions.EXPORT_COMMUNITIES_LOADING]: (state, action) => {
        const exportConfig = exportConfigFromAction(action);
        return {
            ...state,
            exportCommunitiesLoading: true,
            loadingByPage: {
                ...state.loadingByPage,
                ...(exportConfig ? { [exportConfig]: true } : {}),
            },
        };
    },

    [actions.EXPORT_COMMUNITIES_LOADED]: (state, action) => {
        const exportConfig = exportConfigFromAction(action);
        const loadingByPage = { ...state.loadingByPage };
        if (exportConfig) {
            delete loadingByPage[exportConfig];
        }
        return {
            ...state,
            exportCommunitiesLoading: false,
            loadingByPage,
            loadedByPage: {
                ...state.loadedByPage,
                ...(exportConfig ? { [exportConfig]: true } : {}),
            },
        };
    },

    [actions.EXPORT_COMMUNITIES_FAILED]: (state, action) => {
        const exportConfig = exportConfigFromAction(action);
        return {
            ...state,
            exportCommunitiesLoading: false,
            loadingByPage: {
                ...state.loadingByPage,
                ...(exportConfig ? { [exportConfig]: false } : {}),
            },
        };
    },

    [actions.EXPORT_COMMUNITIES_RESET]: () => initialState,
};

export default function exportCommunitiesReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
