import {
    ISSN_SHERPA_LOADING,
    ISSN_SHERPA_LOADED,
    ISSN_SHERPA_LOAD_FAILED,
    ISSN_ULRICHS_LOADING,
    ISSN_ULRICHS_LOADED,
    ISSN_ULRICHS_LOAD_FAILED,
} from 'actions/actionTypes';

export const initialState = {
    sherpaLoadFromIssnError: {},
    sherpaRomeo: {},
    ulrichs: {},
    ulrichsLoadFromIssnError: {},
};

const handlers = {
    [ISSN_SHERPA_LOADING]: (state, action) => ({
        ...state,
        sherpaRomeo: {
            ...state.sherpaRomeo,
            [action.payload]: state.sherpaRomeo[action.payload] || {},
        },
    }),

    [ISSN_SHERPA_LOADED]: (state, action) => {
        const data = { ...state.sherpaRomeo };
        action.payload.map(item => {
            data[item.srm_issn] = item;
        });
        return {
            ...state,
            sherpaRomeo: data,
        };
    },

    [ISSN_SHERPA_LOAD_FAILED]: (state, action) => ({
        ...state,
        sherpaLoadFromIssnError: {
            [action.payload.issn]: action.payload.message,
        },
    }),

    [ISSN_ULRICHS_LOADING]: (state, action) => ({
        ...state,
        ulrichs: {
            ...state.ulrichs,
            [action.payload]: state.ulrichs[action.payload] || {},
        },
    }),

    [ISSN_ULRICHS_LOADED]: (state, action) => {
        const newData = {};
        action.payload.map(item => {
            newData[item.ulr_issn] = item;
        });
        return {
            ...state,
            ulrichs: {
                ...state.ulrichs,
                ...newData,
            },
        };
    },

    [ISSN_ULRICHS_LOAD_FAILED]: (state, action) => ({
        ...state,
        ulrichsLoadFromIssnError: {
            [action.payload.issn]: action.payload.message,
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
