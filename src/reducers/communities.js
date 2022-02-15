import * as actions from 'actions/actionTypes';

export const initialState = {
    communityList: [],
    loadingcommunities: false,
    loadingCommunitiesError: null,
    totalPages: 0,
    startPage: 0,
    endPage: 0,
    currentPage: 0,
    perPage: 0,
};

const handlers = {
    [actions.VIEW_COMMUNITIES_LOADING]: () => ({
        ...initialState,
        loadingcommunities: true,
    }),

    [actions.VIEW_COMMUNITIES_LOADED]: (state, action) => ({
        ...initialState,
        loadingcommunities: false,
        communityList: action.payload,
        // totalPages: action.payload.totalPages,
        // startPage: action.payload.startPage,
        // endPage: action.payload.endPage,
        // currentPage: action.payload.currentPage,
        // perPage: action.payload.perPage,
    }),

    [actions.VIEW_COMMUNITIES_LOAD_FAILED]: (state, action) => ({
        ...initialState,
        loadingcommunities: false,
        loadingCommunitiesError: action.payload,
    }),
};

export default function viewCommunitiesReducer(state = { ...initialState }, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
