import {
    ISSN_SHERPA_LOADING,
    ISSN_SHERPA_LOADED,
    ISSN_SHERPA_LOAD_FAILED,
    ISSN_ULRICHS_LOADING,
    ISSN_ULRICHS_LOADED,
    ISSN_ULRICHS_LOAD_FAILED,
} from 'actions/actionTypes';

export const initialState = {
    loadingSherpaFromIssn: false,
    loadingUlrichsFromIssn: false,
    sherpaLoadFromIssnError: {},
    sherpaRomeo: {},
    ulrichs: {},
    ulrichsLoadFromIssnError: {},
};

const handlers = {
    [ISSN_SHERPA_LOADING]: state => ({
        ...state,
        loadingSherpaFromIssn: true,
    }),

    [ISSN_SHERPA_LOADED]: (state, action) => {
        return {
            ...state,
            loadingSherpaFromIssn: false,
            sherpaRomeo: {
                ...state.sherpaRomeo,
                ...action.payload,
            },
        };
    },

    [ISSN_SHERPA_LOAD_FAILED]: (state, action) => ({
        ...state,
        loadingSherpaFromIssn: false,
        sherpaLoadFromIssnError: { ...action.payload },
    }),

    [ISSN_ULRICHS_LOADING]: state => ({
        ...state,
        loadingUlrichsFromIssn: true,
    }),

    [ISSN_ULRICHS_LOADED]: (state, action) => {
        return {
            ...state,
            loadingUlrichsFromIssn: false,
            ulrichs: {
                ...state.ulrichs,
                ...action.payload,
            },
        };
    },

    [ISSN_ULRICHS_LOAD_FAILED]: (state, action) => ({
        ...state,
        loadingUlrichsFromIssn: false,
        ulrichsLoadFromIssnError: {
            ...action.payload,
        },
    }),
};

export default function issnLinksReducer(state = { ...initialState }, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
