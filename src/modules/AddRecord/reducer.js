import {
    SEARCH_LOADING,
    SEARCH_COMPLETED,
    SEARCH_FAILED,
    SEARCH_SOURCE_COUNT
} from 'actions';

const initialSearchSources = {
    loadingPublicationSources: {
        totalSearchedCount: 0,
        totalSourcesCount: 0
    }
};

export const initialState = {
    publicationsList: [],
    loadingSearch: false,
    ...initialSearchSources
};

const handlers = {

    [SEARCH_SOURCE_COUNT]: (state, action) => {
        // set search completed for a specific source
        const loadingPublicationSources = {
            loadingPublicationSources: {
                ...state.loadingPublicationSources,
                totalSourcesCount: action.payload
            }
        };

        return {
            ...state,
            ...loadingPublicationSources
        };
    },

    [SEARCH_LOADING]: (state) => {
        return {
            ...state,
            loadingSearch: true,
            publicationsList: [],
            ...initialSearchSources
        };
    },

    [SEARCH_COMPLETED]: (state, action) => {
        return {
            ...state,
            loadingSearch: false,
            publicationsList: action.payload
        };
    },

    [SEARCH_FAILED]: (state) => {
        return {
            ...state,
            loadingSearch: false,
            publicationsList: [],
            ...initialSearchSources
        };
    },

    [`${SEARCH_FAILED}@`]: (state, action) => {
        // get search source, eg wos/pubmed/etc
        const source = action.type.substring(action.type.indexOf('@') + 1, action.type.length);

        // set search completed for a specific source
        const loadingPublicationSources = {
            loadingPublicationSources: {
                ...state.loadingPublicationSources,
                totalSearchedCount: state.loadingPublicationSources.totalSearchedCount + 1,
                [source]: true,
                [`${source}Count`]: 0
            }
        };

        return {
            ...state,
            ...loadingPublicationSources
        };
    },

    [`${SEARCH_COMPLETED}@`]: (state, action) => {
        // get search source, eg wos/pubmed/etc
        const source = action.type.substring(action.type.indexOf('@') + 1, action.type.length);

        // set search completed for a specific source
        const loadingPublicationSources = {
            loadingPublicationSources: {
                ...state.loadingPublicationSources,
                totalSearchedCount: state.loadingPublicationSources.totalSearchedCount + 1,
                [source]: true,
                [`${source}Count`]: action.payload.length
            }
        };

        return {
            ...state,
            loadingSearch: true,
            publicationsList: [...state.publicationsList, ...action.payload],
            ...loadingPublicationSources
        };
    }
};

export default function addRecordReducer(state = initialState, action) {
    const handler = action.type.indexOf('SEARCH_COMPLETED@') < 0 && action.type.indexOf('SEARCH_FAILED@') < 0 ?
        handlers[action.type] : handlers[action.type.substring(0, action.type.indexOf('@') + 1)];

    if (!handler) {
        return state;
    }
    return handler(state, action);
}
