import * as actions from 'actions/actionTypes';

export const initialState = {
    publicationsList: [],
    publicationsListPagingData: {},
    publicationsListFacets: {},
    loadingPublicationsList: true,
};

export const getInitialState = () => ({
    mine: initialState,
    incomplete: initialState,
    datasets: initialState,
    noncompliantoa: initialState,
});

const handlers = {
    [`${actions.AUTHOR_PUBLICATIONS_LOADING}@`]: (state, action, type) => {
        return {
            ...state,
            [type]: {
                ...state[type],
                publicationsListPagingData: {},
                loadingPublicationsList: true,
            },
        };
    },

    [`${actions.AUTHOR_PUBLICATIONS_LOADED}@`]: (state, action, type) => {
        return {
            ...state,
            [type]: {
                ...state[type],
                publicationsList: action.payload.data,
                publicationsListType: action.payload.type || null,
                publicationsListPagingData: {
                    total: action.payload.total,
                    current_page: action.payload.current_page,
                    from: action.payload.from,
                    to: action.payload.to,
                    per_page: action.payload.per_page,
                },
                publicationsListFacets:
                    action.payload.hasOwnProperty('filters') &&
                    action.payload.filters.hasOwnProperty('facets') &&
                    action.payload.filters.facets
                        ? action.payload.filters.facets
                        : {},
                loadingPublicationsList: false,
            },
        };
    },

    [`${actions.AUTHOR_PUBLICATIONS_FAILED}@`]: (state, action, type) => {
        return {
            ...state,
            [type]: {
                ...state[type],
                publicationsList: [],

                publicationsListPagingData: {},
                publicationsListFacets: {},
                loadingPublicationsList: false,
            },
        };
    },
};

export default function publicationsReducer(state = getInitialState(), action) {
    const type = actions.getActionSuffix(action.type);
    const actionType = actions.getAction(action.type);

    const handler = action.type.indexOf('@') >= 0 ? handlers[actionType] : false;
    if (!handler) {
        return state;
    }
    return handler(state, action, type);
}
